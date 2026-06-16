import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { Types } from 'mongoose';
import { IUser } from '../models/User';

interface AppError extends Error {
  statusCode?: number;
}

interface AuthRequest extends Request {
  user?: IUser;
}

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (error) {
    const err = error as AppError;
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    const err = error as AppError;
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await authService.getMe(req.user!._id as Types.ObjectId);
    res.json(user);
  } catch (error) {
    const err = error as AppError;
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
