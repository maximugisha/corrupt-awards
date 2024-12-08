import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assuming a `prisma.ts` file in `/lib`

// This handles GET requests to fetch a specific user by their ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  // Wait for params to be resolved
  const { id } = await params;

  try {
    // Fetch the user by their ID
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }, // Ensure the ID is converted to an integer
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: unknown) {
    // Type assertion to ensure the error is an instance of Error
    if (error instanceof Error) {
      return NextResponse.json({ message: "Error fetching user", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Unknown error occurred", error: String(error) }, { status: 500 });
  }
}

// This handles PUT requests to update a specific user
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  // Wait for params to be resolved
  const { id } = await params;
  const data = await req.json();

  try {
    // Update the user details using the data received in the request
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) }, // Ensure the ID is parsed as an integer
      data,
    });

    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    // Type assertion to ensure the error is an instance of Error
    if (error instanceof Error) {
      return NextResponse.json({ message: "Error updating user" }, { status: 500 });
    }
    return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 });
  }
}

// This handles DELETE requests to delete a specific user
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    // Wait for params to be resolved
    const { id } = await params;
  
    try {
      // Delete the user by their ID
      const deletedUser = await prisma.user.delete({
        where: { id: parseInt(id) }, // Ensure the ID is parsed as an integer
      });
  
      return NextResponse.json(deletedUser);
    } catch (error: unknown) {
      // Type assertion to ensure the error is an instance of Error
      if (error instanceof Error) {
        return NextResponse.json({ message: "Error deleting user" }, { status: 500 });
      }
      return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 });
    }
  }
