import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Vote from "@/models/Vote";

// GET all votes for the dashboard
export async function GET() {
  try {
    await connectDB();
    const votes = await Vote.find({}).sort({ votedAt: -1 });
    return NextResponse.json(votes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch votes" },
      { status: 500 },
    );
  }
}

// DELETE all votes (Caution: Settings tab action)
export async function DELETE() {
  try {
    await connectDB();
    await Vote.deleteMany({});
    return NextResponse.json({ message: "All votes cleared" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clear votes" },
      { status: 500 },
    );
  }
}
