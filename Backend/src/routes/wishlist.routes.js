import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middleware/isAuthenticated.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getWishlist);
router.route("/add").post(addToWishlist);
router.route("/remove/:productId").delete(removeFromWishlist);

export default router;
