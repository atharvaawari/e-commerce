import React, { createContext, useContext, useState, useEffect } from "react";
import { message } from "antd";

const WishlistContext = createContext();

export const useWishlist = () => {
    return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem("wishlist");
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product) => {
        if (wishlist.find((item) => item._id === product._id)) {
            message.warning("Item already in wishlist");
            return;
        }

        setWishlist((prev) => [...prev, product]);
        message.success("Added to wishlist");
    };

    const removeFromWishlist = (productId) => {
        setWishlist((prev) => prev.filter((item) => item._id !== productId));
        message.success("Removed from wishlist");
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
