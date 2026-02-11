import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";

const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    return res.status(200).json(
        new ApiResponse(200, cart, "Cart retrieved successfully")
    );
});

const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1, color, size } = req.body;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: [{ product: productId, quantity, color, size }]
        });
    } else {
        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId && 
            item.color === color && 
            item.size === size
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity, color, size });
        }
        await cart.save();
    }
    
    // Populate product details for the response
    await cart.populate("items.product");

    return res.status(200).json(
        new ApiResponse(200, cart, "Item added to cart")
    );
});

const removeFromCart = asyncHandler(async (req, res) => {
    const { productId, color, size } = req.body;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    cart.items = cart.items.filter(item => 
        !(item.product.toString() === productId && 
          item.color === color && 
          item.size === size)
    );

    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json(
        new ApiResponse(200, cart, "Item removed from cart")
    );
});

const updateQuantity = asyncHandler(async (req, res) => {
    const { productId, color, size, quantity } = req.body;

    if (!productId || quantity < 1) {
        throw new ApiError(400, "Invalid request parameters");
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const itemIndex = cart.items.findIndex(item => 
        item.product.toString() === productId && 
        item.color === color && 
        item.size === size
    );

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        await cart.populate("items.product");
        
        return res.status(200).json(
            new ApiResponse(200, cart, "Cart updated")
        );
    } else {
        throw new ApiError(404, "Item not found in cart");
    }
});

const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (cart) {
        cart.items = [];
        await cart.save();
    }

    return res.status(200).json(
        new ApiResponse(200, cart, "Cart cleared")
    );
});

export { getCart, addToCart, removeFromCart, updateQuantity, clearCart };
