import React, { createContext, useContext, useState, useEffect } from "react";
import { message } from "antd";
import { useAuthContext } from "./AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWishlistQueryFn, addToWishlistMutationFn, removeFromWishlistMutationFn } from "../lib/api";

const WishlistContext = createContext();

export const useWishlist = () => {
    return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
    const { user } = useAuthContext();
    const queryClient = useQueryClient();

    // Local state for guest users
    const [localWishlist, setLocalWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem("wishlist");
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    // Server state for logged-in users
    const { data: serverWishlistData } = useQuery({
        queryKey: ['wishlist'],
        queryFn: getWishlistQueryFn,
        enabled: !!user,
    });

    // Derived state
    const wishlist = user ? (serverWishlistData?.data?.products || []) : localWishlist;

    // Sync local wishlist to localStorage
    useEffect(() => {
        if (!user) {
            localStorage.setItem("wishlist", JSON.stringify(localWishlist));
        }
    }, [localWishlist, user]);

    // Mutations
    const addMutation = useMutation({
        mutationFn: addToWishlistMutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries(['wishlist']);
            message.success("Added to wishlist");
        },
        onError: (error) => {
            // Handle duplicate item error gracefully if API returns 200 for duplicates (controller logic check needed)
            // The controller returns 200 with "Product already in wishlist", so this onError might not trigger for duplicates unless 400/500
            // But if it fails:
            message.error("Failed to add to wishlist");
        }
    });

    const removeMutation = useMutation({
        mutationFn: removeFromWishlistMutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries(['wishlist']);
            message.success("Removed from wishlist");
        },
        onError: () => message.error("Failed to remove from wishlist")
    });


    const addToWishlist = (product) => {
        if (user) {
            // Optimistic check or rely on server? 
            // Server handles duplicate check.
            addMutation.mutate({ productId: product._id });
        } else {
            if (localWishlist.find((item) => item._id === product._id)) {
                message.warning("Item already in wishlist");
                return;
            }
            setLocalWishlist((prev) => [...prev, product]);
            message.success("Added to wishlist");
        }
    };

    const removeFromWishlist = (productId) => {
        if (user) {
            removeMutation.mutate(productId);
        } else {
            setLocalWishlist((prev) => prev.filter((item) => item._id !== productId));
            message.success("Removed from wishlist");
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some((item) => item._id === productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};
