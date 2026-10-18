import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import * as parcelServices from "./parcel.services";

export const getParcels = catchAsync(async (req: Request, res: Response) => {
  const result = await parcelServices.getAllParcels(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "ভূমি রেকর্ডের তথ্য সফলভাবে প্রাপ্ত হয়েছে (Land parcels retrieved successfully)",
    data: result,
  });
});

export const getSingleParcel = catchAsync(async (req: Request, res: Response) => {
  const identifier = req.params.identifier as string;
  const result = await parcelServices.getParcelByUlpinOrDag(identifier);

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "উক্ত দাগ বা ইউএলপিআইএন (ULPIN) নম্বরের কোনো রেকর্ড পাওয়া যায়নি।",
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "দাগের বিস্তারিত তথ্য প্রাপ্ত হয়েছে",
    data: result,
  });
});
