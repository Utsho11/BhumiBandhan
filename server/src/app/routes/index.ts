import { Router } from "express";
import { ParcelRoutes } from "../modules/parcel/parcel.routes";
import { VerifyRoutes } from "../modules/verify/verify.routes";
import { MutationRoutes } from "../modules/mutation/mutation.routes";
import { LienRoutes } from "../modules/lien/lien.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";

const router = Router();

const moduleRoutes = [
  { path: "/parcels", route: ParcelRoutes },
  { path: "/verify", route: VerifyRoutes },
  { path: "/mutation", route: MutationRoutes },
  { path: "/liens", route: LienRoutes },
  { path: "/auth", route: AuthRoutes },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
