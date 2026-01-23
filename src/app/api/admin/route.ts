import { NextResponse } from "next/server";
import connectDB from "@/utils/db";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      message: "Admin API connected to MongoDB",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 },
    );
  }
}
