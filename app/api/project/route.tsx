import Project from "@/models/project"; // Adjust the import path based on your project structure
import connectMongoDB from "@/config/database"; // Your db connect function
import { NextResponse } from "next/server";

// GET all projects
export async function GET() {
  try {
    await connectMongoDB();
    const projects = await Project.find();
    return NextResponse.json({ success: true, data: projects }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST a new project
export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const newProject = await Project.create(body);
    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 500 });
  }
}
