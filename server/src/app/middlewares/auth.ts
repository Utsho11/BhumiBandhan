import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../../config";
import { IUserProfile } from "../modules/auth/auth.services";

export interface IAuthRequest extends Request {
  user?: IUserProfile;
}

export const auth = (...roles: string[]) => {
  return async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : (req.cookies?.accessToken as string | undefined);

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "অননুমোদিত প্রবেশাধিকার! অনুগ্রহ করে প্রথমে লগইন করুন। (Unauthorized: No token provided)",
        });
      }

      const decoded = jwt.verify(token, config.jwtSecret) as IUserProfile;
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "আপনার এই কার্যক্রমে প্রবেশের অনুমতি নেই। (Forbidden: Insufficient permissions)",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "টোকেনটি অবৈধ বা মেয়াদোত্তীর্ণ হয়েছে। (Invalid or expired token)",
      });
    }
  };
};
