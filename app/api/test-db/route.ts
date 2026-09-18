import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  const auth = requireAdmin(request);
  if (auth.response) return auth.response;
  try {
    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json({
        success: false,
        message: "MongoDB is not connected. In-memory store is active.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Connected to MongoDB successfully!",
      database: db.connection.name,
      host: db.connection.host,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Database connection failed",
      },
      { status: 500 }
    );
  }
}
