import mongoose from "mongoose";

let cached: typeof mongoose | null = null;

const connectDB = async (): Promise<typeof mongoose> => {
  if (cached) return cached;

  try {
    const uri = process.env.MONGO_URI as string;
    const conn = await mongoose.connect(uri, {
      tlsAllowInvalidCertificates: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    cached = mongoose;
    return cached;
  } catch (error) {
    console.error(`MongoDB error: ${(error as Error).message}`);
    throw error;
  }
};

export default connectDB;
