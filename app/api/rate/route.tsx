import RateModel from "@/models/rate";
import connectDB from "@/config/database";
import { NextResponse } from "next/server";
import Rate from "@/app/rate/page";

export async function POST(request: Request) {
  const { basecountry, foreigncurrency, fromcountry, tocountry, ratecurrency, transfertype, status, unit } = await request.json();
  await connectDB();
  await RateModel.create({ basecountry, foreigncurrency, fromcountry, tocountry, ratecurrency, transfertype, status, unit });
  return NextResponse.json({ message: "rate Created" }, { status: 201 });
}

export async function GET() {
  await connectDB();
  const rates = await RateModel.find();
  return NextResponse.json({ rates });
}

export async function DELETE(request: any) {
  const { id } = request.query; 
  await connectDB();
  await RateModel.findByIdAndDelete(id);
  return NextResponse.json({ message: "Rate Deleted" }, { status: 200 });
}

