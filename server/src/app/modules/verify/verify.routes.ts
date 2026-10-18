import { Router } from "express";
import * as verifyControllers from "./verify.controllers";

const router = Router();

router.post("/check-plot", verifyControllers.checkPlotRisk);
router.post("/deed-hash", verifyControllers.verifyDeed);
router.post("/anti-double-sale", verifyControllers.checkDoubleSellingShield);

export const VerifyRoutes = router;
