import { createContext, useContext, useState, useEffect } from "react";
import { message } from "antd";

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1, color, size) => {
        const existingItemIndex = cart.findIndex(
            (item) => item._id === product._id && item.color === color && item.size === size
        );

        if (existingItemIndex > -1) {
            message.success("Updated cart quantity");
        } else {
            message.success("Added to cart");
        }

        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex(
                (item) => item._id === product._id && item.color === color && item.size === size
            );

            if (existingItemIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingItemIndex] = {
                    ...newCart[existingItemIndex],
                    quantity: newCart[existingItemIndex].quantity + quantity
                };
                return newCart;
            } else {
                return [...prevCart, { ...product, quantity, color, size }];
            }
        });
    };

    const removeFromCart = (productId, color, size) => {
        setCart((prevCart) =>
            prevCart.filter((item) => !(item._id === productId && item.color === color && item.size === size))
        );
        message.success("Removed from cart");
    };

    const updateQuantity = (productId, color, size, quantity) => {
        setCart(prevCart =>
            prevCart.map(item =>
                (item._id === productId && item.color === color && item.size === size)
                    ? { ...item, quantity: Math.max(1, quantity) }
                    : item
            )
        );
    }

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
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
