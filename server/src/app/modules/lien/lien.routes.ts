import { Router } from "express";
import * as lienControllers from "./lien.controllers";

const router = Router();

router.get("/:dagNo", lienControllers.getLiens);
router.post("/register", lienControllers.addLien);
router.patch("/:dagNo/:lienId/release", lienControllers.releaseLien);

export const LienRoutes = router;
