import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust the path to your prisma instance

export async function GET() {
  try {
    // Query counts for all relevant models
    const usersCount = await prisma.user.count();
    const nomineesCount = await prisma.nominee.count();
    const positionsCount = await prisma.position.count();
    const institutionsCount = await prisma.institution.count();
    const districtsCount = await prisma.district.count();
    const nomineeRatingsCount = await prisma.nomineeRating.count();
    const institutionRatingsCount = await prisma.institutionRating.count();
    const departmentsCount = await prisma.department.count();
    const impactAreasCount = await prisma.impactArea.count();
    const ratingCategoriesCount = await prisma.ratingCategory.count();
    const institutionRatingCategoriesCount = await prisma.institutionRatingCategory.count();

    const data = [
      { name: "Users", count: usersCount },
      { name: "Nominees", count: nomineesCount },
      { name: "Positions", count: positionsCount },
      { name: "Institutions", count: institutionsCount },
      { name: "Districts", count: districtsCount },
      { name: "Nominee Ratings", count: nomineeRatingsCount },
      { name: "Institution Ratings", count: institutionRatingsCount },
      { name: "Departments", count: departmentsCount },
      { name: "Impact Areas", count: impactAreasCount },
      { name: "Rating Categories", count: ratingCategoriesCount },
      { name: "Institution Rating Categories", count: institutionRatingCategoriesCount },
    ];

    return NextResponse.json(data);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: "Error fetching model counts" }, { status: 500 });
  }
}
