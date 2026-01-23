import mongoose, { Schema, model, models } from "mongoose";

const VoteSchema = new Schema({
  userEmail: { type: String, required: true },
  productId: { type: String, required: true }, // This is the beer ID
  beerName: { type: String, required: true },
  brewery: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 10 },
  votedAt: { type: Date, default: Date.now },
});

// Enforce one vote per user per product
VoteSchema.index({ userEmail: 1, productId: 1 }, { unique: true });

export default models.Vote || model("Vote", VoteSchema);
