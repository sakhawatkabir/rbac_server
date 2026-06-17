import Category from "../models/Category";
import Post from "../models/Post";
import { Types } from "mongoose";

interface AppError extends Error {
  statusCode?: number;
}

const createError = (message: string, statusCode: number): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const getAllCategories = async (createdBy?: string) => {
  const filter = createdBy ? { createdBy } : {};
  return Category.find(filter)
    .populate("createdBy", "_id name")
    .sort({ name: 1 });
};

export const createCategory = async (
  name: string,
  color: string,
  userId: Types.ObjectId,
) => {
  const existing = await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });
  if (existing) throw createError("Category already exists", 400);
  return Category.create({ name, color, createdBy: userId });
};

export const updateCategory = async (
  id: string,
  name: string,
  color: string,
  userId: string,
  userRole: string,
) => {
  const category = await Category.findById(id);
  if (!category) throw createError("Category not found", 404);
  if (userRole !== "Admin" && category.createdBy.toString() !== userId) {
    throw createError("Not authorized to update this category", 403);
  }
  category.name = name;
  category.color = color;
  return category.save();
};

export const deleteCategory = async (
  id: string,
  userId: string,
  userRole: string,
) => {
  const category = await Category.findById(id);
  if (!category) throw createError("Category not found", 404);
  if (userRole !== "Admin" && category.createdBy.toString() !== userId) {
    throw createError("Not authorized to delete this category", 403);
  }

  // Delete all posts with this category
  await Post.deleteMany({ category: category.name });

  await Category.findByIdAndDelete(id);
  return { message: "Category and all associated posts deleted" };
};
