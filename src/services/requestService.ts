import Request, { RequestStatus } from "../models/Request";
import User, { IUser } from "../models/User";
import { Types } from "mongoose";

interface AppError extends Error {
  statusCode?: number;
}

const createError = (message: string, statusCode: number): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const createRequest = async (userId: Types.ObjectId) => {
  const existing = await Request.findOne({ user: userId, status: "Pending" });
  if (existing) throw createError("You already have a pending request", 400);

  const request = await Request.create({
    user: userId,
    requestedRole: "Manager",
  });
  return request.populate("user", "name email");
};

export const getMyRequests = async (userId: Types.ObjectId) => {
  return Request.find({ user: userId }).sort({ createdAt: -1 });
};

export const getAllRequests = async () => {
  return Request.find().populate("user", "name email").sort({ createdAt: -1 });
};

export const updateRequestStatus = async (
  requestId: string,
  status: RequestStatus,
) => {
  if (!["Approved", "Rejected"].includes(status)) {
    throw createError("Invalid status", 400);
  }

  const request = await Request.findById(requestId).populate("user");
  if (!request) throw createError("Request not found", 404);

  request.status = status;
  await request.save();

  if (status === "Approved") {
    const populatedUser = request.user as unknown as IUser;
    await User.findByIdAndUpdate(populatedUser._id, { role: "Manager" });
  }

  return request;
};
