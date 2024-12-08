import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assuming a `prisma.ts` file in `/lib`.

export async function GET() {
  const nominees = await prisma.nominee.findMany();
  return NextResponse.json(nominees);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newNominee = await prisma.nominee.create({ data });
  return NextResponse.json(newNominee);
}