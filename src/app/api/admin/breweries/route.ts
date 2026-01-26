import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Brewery from "@/models/Brewery";
import { v2 as cloudinary } from "cloudinary";

export async function GET() {
  await connectDB();
  const breweries = await Brewery.find({}).sort({ createdAt: -1 });
  return NextResponse.json(breweries);
}

export async function POST(req: Request) {
  try {
    await connectDB();

    // Configure Cloudinary inside the POST handler to ensure .env variables are loaded
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const formData = await req.formData();
    const file = formData.get("image") as File;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 },
      );
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using a Promise
    const uploadRes: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "beers" }, (err, result) => {
          if (err) {
            console.error("Cloudinary Upload Error:", err);
            reject(err);
          } else {
            resolve(result);
          }
        })
        .end(buffer);
    });

    // Create entry in MongoDB
    const brewery = await Brewery.create({
      name,
      description,
      location,
      logoUrl: uploadRes.secure_url,
    });

    return NextResponse.json(brewery);
  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
