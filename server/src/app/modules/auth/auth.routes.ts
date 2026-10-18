import { Router } from "express";
import * as authControllers from "./auth.controllers";

const router = Router();

router.post("/login", authControllers.login);
router.get("/demo-accounts", authControllers.getDemoAccounts);

export const AuthRoutes = router;
