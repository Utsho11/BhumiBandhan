import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import * as mutationServices from "./mutation.services";

export const getMutationsList = catchAsync(async (req: Request, res: Response) => {
  const result = await mutationServices.getMutations(req.query.status as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "ই-নামজারি আবেদনের তালিকা প্রাপ্ত হয়েছে",
    data: result,
  });
});

export const getSingleMutation = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.params;
  const result = await mutationServices.getMutationByTokenOrId(token);

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "উক্ত টোকেন বা আবেদন নম্বরের কোনো রেকর্ড পাওয়া যায়নি।",
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "আবেদনের অগ্রগতি পাওয়া গেছে",
    data: result,
  });
});

export const applyMutation = catchAsync(async (req: Request, res: Response) => {
  const result = await mutationServices.createMutation(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "ই-নামজারি আবেদন সফলভাবে দাখিল হয়েছে (e-Mutation application submitted)",
    data: result,
  });
});

export const updateStage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await mutationServices.updateMutationStage(id, req.body);

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "আবেদন খুঁজে পাওয়া যায়নি।",
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "ই-নামজারি আবেদনের স্ট্যাটাস হালনাগাদ করা হয়েছে",
    data: result,
  });
});
