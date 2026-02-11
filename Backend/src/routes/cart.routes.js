import { Router } from 'express';
import { getCart, addToCart, removeFromCart, updateQuantity, clearCart } from "../controllers/cart.controller.js";
import { verifyJWT } from "../middleware/isAuthenticated.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getCart);
router.route("/add").post(addToCart);
router.route("/remove").post(removeFromCart);
router.route("/update").post(updateQuantity);
router.route("/clear").post(clearCart);

export default router;
