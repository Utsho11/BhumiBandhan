import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import * as authServices from "./auth.services";
import { IAuthRequest } from "../../middlewares/auth";

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.registerUser(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "নাগরিক নিবন্ধন সফল হয়েছে (Citizen registration successful)",
    data: result,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.loginUser(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "লগইন সফল হয়েছে (Login successful)",
    data: result,
  });
});

export const getProfile = catchAsync(async (req: IAuthRequest, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "ব্যবহারকারী প্রোফাইল তথ্য (User profile retrieved)",
    data: req.user || null,
  });
});

export const getDemoAccounts = catchAsync(async (_req: Request, res: Response) => {
  const result = await authServices.getAvailableDemoAccounts();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "ডেমো অ্যাকাউন্ট তালিকা",
    data: result,
  });
});
