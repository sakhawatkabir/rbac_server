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
  return user;
};
