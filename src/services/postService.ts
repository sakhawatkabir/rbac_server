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

interface CreatePostInput {
  title: string;
  content: string;
  category: string;
  status: "Draft" | "Published";
  image?: string;
  authorId: Types.ObjectId;
}

interface UpdatePostInput {
  title?: string;
  content?: string;
  category?: string;
  status?: "Draft" | "Published";
  image?: string;
}

export const getAllPosts = async (authorId?: string) => {
  const filter = authorId ? { author: authorId } : {};
  return Post.find(filter)
    .populate("author", "name email")
    .sort({ createdAt: -1 });
};

export const getPostById = async (id: string) => {
  const post = await Post.findById(id).populate("author", "name email");
  if (!post) throw createError("Post not found", 404);
  return post;
};

export const createPost = async ({
  title,
  content,
  category,
  status,
  image,
  authorId,
}: CreatePostInput) => {
  if (!title || !content)
    throw createError("Title and content are required", 400);
  const post = await Post.create({
    title,
    content,
    category,
    status,
    image,
    author: authorId,
  });
  return post.populate("author", "name email");
};

export const updatePost = async (
  id: string,
  data: UpdatePostInput,
  userId?: string,
  userRole?: string,
) => {
  if (userRole && userRole !== "Admin") {
    const post = await Post.findById(id);
    if (!post) throw createError("Post not found", 404);
    if (post.author.toString() !== userId)
      throw createError("Not authorized to update this post", 403);
  }
  const updated = await Post.findByIdAndUpdate(id, data, {
    new: true,
  }).populate("author", "name email");
  if (!updated) throw createError("Post not found", 404);
  return updated;
};

export const deletePost = async (
  id: string,
  userId?: string,
  userRole?: string,
) => {
  if (userRole && userRole !== "Admin") {
    const post = await Post.findById(id);
    if (!post) throw createError("Post not found", 404);
    if (post.author.toString() !== userId)
      throw createError("Not authorized to delete this post", 403);
  }
  const post = await Post.findByIdAndDelete(id);
  if (!post) throw createError("Post not found", 404);
  return { message: "Post deleted" };
};
