import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import * as lienServices from "./lien.services";

export const getLiens = catchAsync(async (req: Request, res: Response) => {
  const { dagNo } = req.params;
  const result = await lienServices.getPlotLiens(dagNo);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "দাগের ব্যাংক বন্ধক ও লিয়েনের তালিকা",
    data: result,
  });
});

export const addLien = catchAsync(async (req: Request, res: Response) => {
  const result = await lienServices.registerBankLien(req.body);

  sendResponse(res, {
    statusCode: result.success ? 201 : 400,
    success: result.success,
    message: result.success
      ? "ব্যাংক বন্ধক / লিয়েন সফলভাবে নিবন্ধিত হয়েছে"
      : result.messageBn,
    data: result,
  });
});

export const releaseLien = catchAsync(async (req: Request, res: Response) => {
  const { dagNo, lienId } = req.params;
  const result = await lienServices.releaseBankLien(dagNo, lienId);

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "লিয়েন রেকর্ড পাওয়া যায়নি।",
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "ব্যাংক লিয়েন সফলভাবে খালাস (Released) করা হয়েছে",
    data: result,
  });
});
