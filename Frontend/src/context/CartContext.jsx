import { createContext, useContext, useState, useEffect } from "react";
import { message } from "antd";
import { useAuthContext } from "./AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getCartQueryFn,
    addToCartMutationFn,
    removeFromCartMutationFn,
    updateCartQuantityMutationFn,
    clearCartMutationFn
} from "../lib/api";

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const { user } = useAuthContext();
    const queryClient = useQueryClient();

    // Local state for guest users
    const [localCart, setLocalCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Server state for logged-in users
    const { data: serverCartData } = useQuery({
        queryKey: ['cart'],
        queryFn: getCartQueryFn,
        enabled: !!user,
    });

    // Derived state: Use server cart if logged in, otherwise local cart
    const cart = user ? (serverCartData?.data?.items || []) : localCart;

    // Sync local cart to localStorage
    useEffect(() => {
        if (!user) {
            localStorage.setItem("cart", JSON.stringify(localCart));
        }
    }, [localCart, user]);

    // Mutations
    const addItemMutation = useMutation({
        mutationFn: addToCartMutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries(['cart']);
            message.success("Added to cart");
        },
        onError: () => message.error("Failed to add to cart")
    });

    const removeItemMutation = useMutation({
        mutationFn: removeFromCartMutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries(['cart']);
            message.success("Removed from cart");
        },
        onError: () => message.error("Failed to remove from cart")
    });

    const updateItemMutation = useMutation({
        mutationFn: updateCartQuantityMutationFn,
        onSuccess: () => queryClient.invalidateQueries(['cart']),
        onError: () => message.error("Failed to update cart")
    });

    const clearCartMutation = useMutation({
        mutationFn: clearCartMutationFn,
        onSuccess: () => queryClient.invalidateQueries(['cart']),
        onError: () => message.error("Failed to clear cart")
    });

    const addToCart = (product, quantity = 1, color, size) => {
        if (user) {
            addItemMutation.mutate({ productId: product._id, quantity, color, size });
        } else {
            setLocalCart((prevCart) => {
                const existingItemIndex = prevCart.findIndex(
                    (item) => item._id === product._id && item.color === color && item.size === size
                );

                if (existingItemIndex > -1) {
                    const newCart = [...prevCart];
                    newCart[existingItemIndex] = {
                        ...newCart[existingItemIndex],
                        quantity: newCart[existingItemIndex].quantity + quantity
                    };
                    message.success("Updated cart quantity");
                    return newCart;
                } else {
                    message.success("Added to cart");
                    return [...prevCart, { ...product, quantity, color, size }];
                }
            });
        }
    };

    const removeFromCart = (productId, color, size) => {
        if (user) {
            removeItemMutation.mutate({ productId, color, size });
        } else {
            setLocalCart((prevCart) =>
                prevCart.filter((item) => !(item._id === productId && item.color === color && item.size === size))
            );
            message.success("Removed from cart");
        }
    };

    const updateQuantity = (productId, color, size, quantity) => {
        if (quantity < 1) return;

        if (user) {
            updateItemMutation.mutate({ productId, color, size, quantity });
        } else {
            setLocalCart(prevCart =>
                prevCart.map(item =>
                    (item._id === productId && item.color === color && item.size === size)
                        ? { ...item, quantity }
                        : item
                )
            );
        }
    }

    const clearCart = () => {
        if (user) {
            clearCartMutation.mutate();
        } else {
            setLocalCart([]);
        }
    };

    const getCartTotal = () => {
        // Handle server cart structure where item.product is the populated object
        return cart.reduce((total, item) => {
            const price = user ? item.product?.price : item.price;
            return total + (price || 0) * item.quantity;
        }, 0);
    };

    // Helper to normalize cart items for consistent display
    const normalizedCart = cart.map(item => {
        if (user && item.product) {
            return {
                ...item.product,
                quantity: item.quantity,
                color: item.color,
                size: item.size,
            };
        }
        return item;
    });

    return (
        <CartContext.Provider
            value={{
                cart: normalizedCart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
