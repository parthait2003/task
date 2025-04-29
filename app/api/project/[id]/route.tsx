import Project from "@/models/Project";
import connectMongoDB from "@/config/database";
import { NextResponse } from "next/server";

// GET method to fetch a project by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectMongoDB();
  try {
    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching project", error }, { status: 500 });
  }
}

// PUT method to update a project by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectMongoDB();
  try {
    const body = await req.json();
    const updatedProject = await Project.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedProject) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating project", error }, { status: 500 });
  }
}

// DELETE method to remove a project by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectMongoDB();
  try {
    const deletedProject = await Project.findByIdAndDelete(params.id);
    if (!deletedProject) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting project", error }, { status: 500 });
  }
}
