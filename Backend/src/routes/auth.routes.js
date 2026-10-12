
import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import * as authMiddleware from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", authController.registerUserController);
authRouter.post("/login", authController.loginUserController);
authRouter.post("/logout", authController.logoutUserController);

authRouter.get(
    "/get-me",
    authMiddleware.authUser,
    authController.getMeController
);

export default authRouter;
