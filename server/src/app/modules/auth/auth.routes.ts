import { Router } from "express";
import * as authControllers from "./auth.controllers";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/register", authControllers.register);
router.post("/login", authControllers.login);
router.get("/profile", auth(), authControllers.getProfile);
router.get("/demo-accounts", authControllers.getDemoAccounts);

export const AuthRoutes = router;
