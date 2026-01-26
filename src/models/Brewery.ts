import mongoose, { Schema, model, models } from "mongoose";

export interface IBrewery {
  _id: string;
  name: string;
  description: string;
  location: string; // The physical booth location
  logoUrl: string; // The image hosted on Cloudinary
  createdAt: Date;
}

const BrewerySchema = new Schema<IBrewery>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    logoUrl: { type: String, required: true },
  },
  { timestamps: true },
);

export default models.Brewery || model<IBrewery>("Brewery", BrewerySchema);
