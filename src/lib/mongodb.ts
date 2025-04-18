// src/lib/mongodb.ts
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();


const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI!;

console.log(MONGODB_URI);

if (!MONGODB_URI) throw new Error("Please define MONGODB_URI in .env.local");

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "chat-app",
        bufferCommands: false,
      })
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
