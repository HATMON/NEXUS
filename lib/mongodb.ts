import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  connection: null,
  promise: null,
};

global.mongooseCache = cached;

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    return null;
  }

  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongodbUri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 2500,
      })
      .then((conn) => conn)
      .catch(() => {
        // Fallback store is active when MongoDB is not connected or IP is restricted
        return null;
      });
  }

  try {
    const conn = await cached.promise;
    if (!conn) {
      cached.promise = null;
      return null;
    }
    cached.connection = conn;
    return cached.connection;
  } catch {
    cached.promise = null;
    return null;
  }
}
