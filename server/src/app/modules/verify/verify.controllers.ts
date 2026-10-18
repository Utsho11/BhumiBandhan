import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import * as verifyServices from "./verify.services";

export const checkPlotRisk = catchAsync(async (req: Request, res: Response) => {
  const result = await verifyServices.checkPlotRiskAudit(req.body);

  sendResponse(res, {
    statusCode: result.found ? 200 : 404,
    success: result.found,
    message: result.found
      ? "জমির ঝুঁকি মূল্যায়ন সফলভাবে সম্পন্ন হয়েছে (Plot risk assessment completed)"
      : result.messageBn,
    data: result,
  });
});

export const verifyDeed = catchAsync(async (req: Request, res: Response) => {
  const result = verifyServices.verifyDeedCryptographicSignature(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "দলিলের ক্রিপ্টোগ্রাফিক যাচাইকরণ সম্পন্ন হয়েছে (Deed hash verification completed)",
    data: result,
  });
});

export const checkDoubleSellingShield = catchAsync(async (req: Request, res: Response) => {
  const result = verifyServices.testAntiDoubleSellingAttempt(req.body);

  sendResponse(res, {
    statusCode: result.allowed ? 200 : 409,
    success: result.allowed,
    message: result.reasonBn,
    data: result,
  });
});
