import mongoose from "mongoose";

// Aapka Direct Link
const MONGODB_URI = "mongodb://virtualsolutionspath_db_user:Virtual123@ac-ob5wmox-shard-00-00.poee7aw.mongodb.net:27017,ac-ob5wmox-shard-00-01.poee7aw.mongodb.net:27017,ac-ob5wmox-shard-00-02.poee7aw.mongodb.net:27017/vsp_database?ssl=true&replicaSet=atlas-nf2ghg-shard-0&authSource=admin";

// 👇 Ye caching logic zaroori hai Next.js k liye, warna "Too Many Connections" ka error ayega
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

// 👇 Note: Humne "export const" use kia hai (Default nahi)
export const connectDB = async () => {
  if (cached.conn) {
    console.log("🚀 Using Existing Database Connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⚡ Connecting to MongoDB...");
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ KAMAAL HO GAYA! Database Connected!");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.log("❌ Connection Failed:", e);
    throw e;
  }

  return cached.conn;
};