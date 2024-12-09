import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assuming a `prisma.ts` file in `/lib`.

export async function GET() {
  const nominees = await prisma.nominee.findMany();
  return NextResponse.json(nominees);
}

export async function POST(req: Request) {
  const formData = await req.formData();  // Use formData() instead of json()
  
  // Extract the fields from the FormData
  const name = formData.get("name")?.toString() || "";
  const positionId = formData.get("position")?.toString() || ""; // Get positionId (instead of position name)
  const institutionId = formData.get("institution")?.toString() || "";
  const districtId = formData.get("district")?.toString() || "";
  const status = formData.get("status") === "true";  // Convert to boolean
  const evidence = formData.get("evidence")?.toString() || "";

  // Ensure positionId is a valid number (if not, throw an error)
  const parsedPositionId = parseInt(positionId, 10);
  if (isNaN(parsedPositionId)) {
    return NextResponse.json({ error: "Invalid position ID" }, { status: 400 });
  }
  const parsedInstitutionId = parseInt(institutionId, 10);
  if (isNaN(parsedInstitutionId)) {
    return NextResponse.json({ error: "Invalid istitution ID" }, { status: 400 });
  }
  const parsedDistrictId = parseInt(districtId, 10);
  if (isNaN(parsedDistrictId)) {
    return NextResponse.json({ error: "Invalid district ID" }, { status: 400 });
  }

  const newNominee = await prisma.nominee.create({
    data: {
      name,
      position: {
        connect: { id: parsedPositionId },  // Use connect to associate the position by ID
      },
      institution: {
        connect: { id: parsedInstitutionId },  // Use connect to associate the inst by ID
      },
      district: {
        connect: { id: parsedDistrictId },  // Use connect to associate the dst by ID
      },
      status,
      evidence,
    },
  });

  return NextResponse.json(newNominee);
}
