import app from "../src/server";
import connectDB from "../src/config/db";

// Ensure DB is connected before handling requests
let dbPromise: Promise<void> | null = null;

export default async function handler(req: any, res: any) {
  if (!dbPromise) {
    dbPromise = connectDB().then(() => {}) as Promise<void>;
  }
  await dbPromise;
  return app(req, res);
}
