"use server";
import connectDB from "@/utils/db";
import Vote from "@/models/Vote";

interface VotePayload {
  userEmail: string;
  productId: string;
  beerName: string;
  brewery: string;
  rating: number;
}

export async function submitBeerVote(payload: VotePayload) {
  try {
    await connectDB();
    await Vote.create(payload);
    return { success: true };
  } catch (error: unknown) {
    // Handling the error as an unknown type safely
    const err = error as { code?: number };

    if (err.code === 11000) {
      return {
        success: false,
        message: "You have already voted for this specific beer!",
      };
    }
    return {
      success: false,
      message: "An error occurred while saving your vote.",
    };
  }
}
