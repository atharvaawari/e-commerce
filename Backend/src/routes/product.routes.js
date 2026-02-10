import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  syncProducts,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/sync", syncProducts);
productRouter.route("/").get(getAllProducts).post(createProduct);
productRouter.route("/:id").get(getProductById).put(updateProduct).delete(deleteProduct);

export default productRouter;
