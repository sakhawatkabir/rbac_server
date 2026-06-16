import User, { UserRole } from '../models/User';

interface AppError extends Error {
  statusCode?: number;
}

const createError = (message: string, statusCode: number): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id).select('-password');
  if (!user) throw createError('User not found', 404);
  return user;
};

export const updateUserRole = async (id: string, role: UserRole) => {
  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
  if (!user) throw createError('User not found', 404);
  return user;
};
