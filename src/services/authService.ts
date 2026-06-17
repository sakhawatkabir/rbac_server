import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Types } from 'mongoose';

const generateToken = (id: Types.ObjectId): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};

interface AppError extends Error {
  statusCode?: number;
}

const createError = (message: string, statusCode: number): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  return error;
};

interface SignupInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const signup = async ({ name, email, password }: SignupInput) => {
  const existing = await User.findOne({ email });
  if (existing) throw createError('User already exists', 400);

  const user = await User.create({ name, email, password });
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id as Types.ObjectId),
  };
};

export const login = async ({ email, password }: LoginInput) => {
  const user = await User.findOne({ email });
  if (!user) throw createError('Invalid email or password', 401);

  if (user.status === 'Suspended') {
    throw createError('Your account has been suspended. Contact an administrator.', 403);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw createError('Invalid email or password', 401);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id as Types.ObjectId),
  };
};

export const getMe = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw createError('User not found', 404);
  if (user.status === 'Suspended') throw createError('Account suspended', 403);
  return user;
};

interface UpdateProfileInput {
  name?: string;
  email?: string;
  department?: string;
  avatar?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const updateProfile = async (userId: Types.ObjectId, input: UpdateProfileInput) => {
  const user = await User.findById(userId);
  if (!user) throw createError('User not found', 404);

  // If changing password, verify current password first
  if (input.newPassword) {
    if (!input.currentPassword) throw createError('Current password is required', 400);
    const isMatch = await user.matchPassword(input.currentPassword);
    if (!isMatch) throw createError('Current password is incorrect', 401);
    user.password = input.newPassword;
  }

  if (input.name !== undefined) user.name = input.name;
  if (input.email !== undefined) user.email = input.email;
  if (input.department !== undefined) user.department = input.department;
  if (input.avatar !== undefined) user.avatar = input.avatar;

  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    avatar: user.avatar,
    status: user.status,
  };
};
