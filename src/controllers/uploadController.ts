import { Request, Response } from 'express';
import { cloudinary } from '../config/cloudinary';

interface UploadedFile {
  path: string;       // Cloudinary secure URL (set by multer-storage-cloudinary)
  filename: string;   // public_id
}

interface MulterRequest extends Request {
  file?: Express.Multer.File & { path: string; filename: string };
}

/**
 * POST /api/upload/avatar
 * Uploads a profile picture to Cloudinary.
 * Requires multipart/form-data with field name "image".
 * Deletes the old avatar from Cloudinary if oldPublicId is provided in the body.
 */
export const uploadImage = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    // If the client sends the previous public_id, delete it to avoid orphaned files
    const { oldPublicId } = req.body as { oldPublicId?: string };
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId).catch(() => {
        // Non-fatal — old image may have already been deleted
      });
    }

    res.status(201).json({
      url:      req.file.path,
      publicId: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message ?? 'Upload failed' });
  }
};

/**
 * DELETE /api/upload/:publicId
 * Deletes an image from Cloudinary by its public_id.
 */
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const publicId = decodeURIComponent(
      Array.isArray(req.params.publicId) ? req.params.publicId[0] : req.params.publicId,
    );
    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message ?? 'Delete failed' });
  }
};
