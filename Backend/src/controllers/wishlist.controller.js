import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Wishlist } from "../models/wishlist.model.js";

const getWishlist = asyncHandler(async (req, res) => {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");

    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    return res.status(200).json(
        new ApiResponse(200, wishlist, "Wishlist retrieved successfully")
    );
});

const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: req.user._id,
            products: [productId]
        });
    } else {
        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
            await wishlist.save();
        } else {
            return res.status(200).json(
                new ApiResponse(200, wishlist, "Product already in wishlist")
            );
        }
    }
    
    await wishlist.populate("products");

    return res.status(200).json(
        new ApiResponse(200, wishlist, "Product added to wishlist")
    );
});

const removeFromWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        throw new ApiError(404, "Wishlist not found");
    }

    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();
    
    await wishlist.populate("products");

    return res.status(200).json(
        new ApiResponse(200, wishlist, "Product removed from wishlist")
    );
});

export { getWishlist, addToWishlist, removeFromWishlist };
