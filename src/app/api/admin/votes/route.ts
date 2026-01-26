import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Vote from "@/models/Vote";

// GET: To show votes in the Admin Dashboard
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

// POST: This is what the VoteForm calls
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { userEmail, productId, beerName, brewery, rating } = body;

    // Check for duplicate votes (Optional but recommended)
    const existingVote = await Vote.findOne({ userEmail, productId });
    if (existingVote) {
      return NextResponse.json(
        { error: "You already voted for this brewery!" },
        { status: 400 },
      );
    }

    const newVote = await Vote.create({
      userEmail,
      productId,
      beerName,
      brewery,
      rating,
      votedAt: new Date(),
    });

    return NextResponse.json({ success: true, data: newVote }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save vote" }, { status: 500 });
  }
}

// DELETE: To clear all votes via Admin Settings
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
