import { Request, Response } from "express";
import { cloudinary } from "../config/cloudinary";

interface UploadedFile {
  path: string;
  filename: string;
}

interface MulterRequest extends Request {
  file?: Express.Multer.File & { path: string; filename: string };
}

export const uploadImage = async (
  req: MulterRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const { oldPublicId } = req.body as { oldPublicId?: string };
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId).catch(() => {});
    }

    res.status(201).json({
      url: req.file.path,
      publicId: req.file.filename,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: (error as Error).message ?? "Upload failed" });
  }
};

/**
 * DELETE /api/upload/:publicId
 */
export const deleteImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const publicId = decodeURIComponent(
      Array.isArray(req.params.publicId)
        ? req.params.publicId[0]
        : req.params.publicId,
    );
    await cloudinary.uploader.destroy(publicId);
    res.json({ message: "Image deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: (error as Error).message ?? "Delete failed" });
  }
};
