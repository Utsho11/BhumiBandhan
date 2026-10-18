import { Router } from "express";
import * as parcelControllers from "./parcel.controllers";

const router = Router();

router.get("/", parcelControllers.getParcels);
router.get("/:identifier", parcelControllers.getSingleParcel);

export const ParcelRoutes = router;
