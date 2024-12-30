import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all approved nominees
    const nominees = await prisma.nominee.findMany({
      where: { status: true },
      select: {
        id: true,
        name: true,
        position: true,
        image: true,
        institution: {
          select: {
            name: true,

            status: true,
            rating: {
              select: {
                id: true,
                score: true,
                user: true,
              },
            },
          },
        },
        district: true,
        status: true,
        rating: {
          select: {
            score: true,
            ratingCategory: true,
            user: true,
            evidence: true,
          },
        },
      },
    });

    // Calculate the average rating for each nominee
    const enrichedNominees = await Promise.all(
      nominees.map(async (nominee) => {
        const ratings = nominee.rating;
        const totalRatings = ratings.length;
        const averageRating = totalRatings > 0
          ? ratings.reduce((sum, rating) => sum + rating.score, 0) / totalRatings
          : 0;

        return {
          ...nominee,
          totalRatings,
          averageRating: Number(averageRating.toFixed(2)),
        };
      })
    );

    // Sort nominees by averageRating in descending order and take the top 5
    const topNominees = enrichedNominees
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);

    return NextResponse.json(topNominees);
  } catch (error) {
    console.error("Error fetching top nominees:", error);
    return NextResponse.error();
  }
}