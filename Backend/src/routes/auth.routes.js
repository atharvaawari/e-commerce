import { Router } from "express";
import { loginCotroller, registerController, refreshAccessToken, logoutController } from "../controllers/auth.controller.js";
import { getcurrentUserController } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/isAuthenticated.js"


const authRouter = Router();

authRouter.post("/login", loginCotroller);
authRouter.post("/register", registerController);
authRouter.get("/refresh-token", refreshAccessToken);
authRouter.get("/current-user", verifyJWT, getcurrentUserController);
authRouter.post("/logout", verifyJWT, logoutController);

export default authRouter;