import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assuming a `prisma.ts` file in `/lib`

// This handles GET requests to fetch a specific nominee by their ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  // Wait for params to be resolved
  const { id } = await params;

  try {
    // Fetch the nominee by their ID
    const nominee = await prisma.nominee.findUnique({
      where: { id: parseInt(id) }, // Ensure the ID is converted to an integer
    });

    if (!nominee) {
      return NextResponse.json({ message: "Nominee not found" }, { status: 404 });
    }

    return NextResponse.json(nominee);
  } catch (error: unknown) {
    // Type assertion to ensure the error is an instance of Error
    if (error instanceof Error) {
      return NextResponse.json({ message: "Error fetching nominee", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Unknown error occurred", error: String(error) }, { status: 500 });
  }
}

// This handles PUT requests to update a specific nominee
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  // Wait for params to be resolved
  const { id } = await params;
  const data = await req.json();

  try {
    // Update the nominee details using the data received in the request
    const updatedNominee = await prisma.nominee.update({
      where: { id: parseInt(id) }, // Ensure the ID is parsed as an integer
      data,
    });

    return NextResponse.json(updatedNominee);
  } catch (error: unknown) {
    // Type assertion to ensure the error is an instance of Error
    if (error instanceof Error) {
      return NextResponse.json({ message: "Error updating nominee" }, { status: 500 });
    }
    return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 });
  }
}

// This handles DELETE requests to delete a specific nominee
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    // Wait for params to be resolved
    const { id } = await params;
  
    try {
      // Delete the nominee by their ID
      const deletedNominee = await prisma.nominee.delete({
        where: { id: parseInt(id) }, // Ensure the ID is parsed as an integer
      });
  
      return NextResponse.json(deletedNominee);
    } catch (error: unknown) {
      // Type assertion to ensure the error is an instance of Error
      if (error instanceof Error) {
        return NextResponse.json({ message: "Error deleting nominee" }, { status: 500 });
      }
      return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 });
    }
  }
