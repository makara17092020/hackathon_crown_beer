"use server";
import connectDB from "@/utils/db";
import Vote from "@/models/Vote";

export async function submitBeerVote(payload: {
  userEmail: string;
  productId: string;
  beerName: string;
  brewery: string;
  rating: number;
}) {
  try {
    await connectDB();

    await Vote.create(payload);

    return { success: true };
  } catch (error: any) {
    // MongoDB error code 11000 is for unique index violations
    if (error.code === 11000) {
      return {
        success: false,
        message:
          "You have already voted for this specific beer! You can still vote for others.",
      };
    }
    return {
      success: false,
      message: "An error occurred while saving your vote.",
    };
  }
}
