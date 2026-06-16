import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { UserRole } from '../models/User';

interface AppError extends Error {
  statusCode?: number;
}

const paramId = (req: Request): string =>
  Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.getUserById(paramId(req));
    res.json(user);
  } catch (error) {
    const err = error as AppError;
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.updateUserRole(paramId(req), req.body.role as UserRole);
    res.json(user);
  } catch (error) {
    const err = error as AppError;
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.updateUserStatus(paramId(req), req.body.status);
    res.json(user);
  } catch (error) {
    const err = error as AppError;
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await userService.deleteUser(paramId(req));
    res.json(result);
  } catch (error) {
    const err = error as AppError;
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
