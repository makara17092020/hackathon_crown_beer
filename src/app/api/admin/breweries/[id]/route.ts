import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Brewery from "@/models/Brewery";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const brewery = await Brewery.findById(id);
  return brewery
    ? NextResponse.json(brewery)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const data = await req.json();
  const updated = await Brewery.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  await Brewery.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}
