import { Request, Response } from "express";
import * as categoryService from "../services/categoryService";
import { Types } from "mongoose";
import { IUser } from "../models/User";

interface AppError extends Error {
  statusCode?: number;
}

interface AuthRequest extends Request {
  user?: IUser;
}

export const getAllCategories = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const createdBy =
      req.user?.role === "Admin"
        ? undefined
        : req.user!._id.toString();
    const categories = await categoryService.getAllCategories(createdBy);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createCategory = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const category = await categoryService.createCategory(
      req.body.name,
      req.body.color || "#6366f1",
      req.user!._id as Types.ObjectId,
    );
    res.status(201).json(category);
  } catch (error) {
    const err = error as AppError;
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const updateCategory = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const category = await categoryService.updateCategory(
      id,
      req.body.name,
      req.body.color,
      req.user!._id.toString(),
      req.user!.role,
    );
    res.json(category);
  } catch (error) {
    const err = error as AppError;
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const deleteCategory = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await categoryService.deleteCategory(
      id,
      req.user!._id.toString(),
      req.user!.role,
    );
    res.json(result);
  } catch (error) {
    const err = error as AppError;
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
