import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  color: string;
  createdBy: Types.ObjectId;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    color: { type: String, default: "#6366f1" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

const Category: Model<ICategory> = mongoose.model<ICategory>(
  "Category",
  categorySchema,
);
export default Category;
