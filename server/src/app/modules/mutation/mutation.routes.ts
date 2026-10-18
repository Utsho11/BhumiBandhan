import { Router } from "express";
import * as mutationControllers from "./mutation.controllers";

const router = Router();

router.get("/", mutationControllers.getMutationsList);
router.get("/:token", mutationControllers.getSingleMutation);
router.post("/apply", mutationControllers.applyMutation);
router.patch("/:id/stage", mutationControllers.updateStage);

export const MutationRoutes = router;
