//connection in serverless architecture.
//caching the mongodb

import mongoose from "mongoose";

//mongoDB URI
const MONGODB_URI = process.env.MONGODB_URI;

// Create a global cache if it doesn't exist
let cached = (global as any).mongoose || { conn: null, promise: null };

//Create Connection Function:
export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");
  //creating connection
  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "Eventify",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;
  return cached.conn;
};

//we do this pattern to cache the connection, we cache so that the server dont make the connection again and again.
