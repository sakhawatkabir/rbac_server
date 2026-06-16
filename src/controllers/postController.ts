import { Request, Response } from 'express';
import * as postService from '../services/postService';
import { Types } from 'mongoose';
import { IUser } from '../models/User';

interface AppError extends Error {
  statusCode?: number;
}

interface AuthRequest extends Request {
  user?: IUser;
}

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await postService.createPost({
      title: req.body.title,
      content: req.body.content,
      authorId: req.user!._id as Types.ObjectId,
    });
    res.status(201).json(post);
  } catch (error) {
    const err = error as AppError;
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
