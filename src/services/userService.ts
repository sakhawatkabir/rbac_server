import User, { UserRole } from "../models/User";
import Request from "../models/Request";

interface AppError extends Error {
  statusCode?: number;
}

const createError = (message: string, statusCode: number): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const getAllUsers = async () => {
  return User.find().select("-password").sort({ createdAt: -1 });
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw createError("User not found", 404);
  return user;
};

export const updateUserRole = async (id: string, role: UserRole) => {
  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select(
    "-password",
  );
  if (!user) throw createError("User not found", 404);

  if (role === "User") {
    await Request.updateMany(
      { user: user._id, status: "Approved" },
      { status: "Rejected" },
    );
  }

  return user;
};

export const updateUserStatus = async (
  id: string,
  status: "Active" | "Inactive" | "Suspended",
) => {
  const user = await User.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  ).select("-password");
  if (!user) throw createError("User not found", 404);
  return user;
};

export const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw createError("User not found", 404);
  return { message: "User deleted" };
};
