import Post from '../models/Post';
import { Types } from 'mongoose';

interface AppError extends Error {
  statusCode?: number;
}

const createError = (message: string, statusCode: number): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  return error;
};

interface CreatePostInput {
  title: string;
  content: string;
  authorId: Types.ObjectId;
}

export const getAllPosts = async () => {
  return Post.find().populate('author', 'name email').sort({ createdAt: -1 });
};

export const createPost = async ({ title, content, authorId }: CreatePostInput) => {
  if (!title || !content) throw createError('Title and content are required', 400);

  const post = await Post.create({ title, content, author: authorId });
  return post.populate('author', 'name email');
};
