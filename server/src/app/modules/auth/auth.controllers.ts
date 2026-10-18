import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import * as authServices from "./auth.services";

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.loginUser(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "লগইন সফল হয়েছে (Login successful)",
    data: result,
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
