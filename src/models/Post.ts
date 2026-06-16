import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  category: string;
  status: 'Draft' | 'Published';
  author: Types.ObjectId;
}

const postSchema = new Schema<IPost>(
  {
    title:    { type: String, required: true },
    content:  { type: String, required: true },
    category: { type: String, default: 'Announcement' },
    status:   { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
    author:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Post: Model<IPost> = mongoose.model<IPost>('Post', postSchema);
export default Post;
