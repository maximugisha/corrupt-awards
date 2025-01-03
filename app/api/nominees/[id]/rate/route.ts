import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
      const body = await req.json(); // Read body once and store it
      console.log('Received payload:', body);
      
      const nomineeId = parseInt(req.nextUrl.pathname.split('/')[3], 10);
      const nominee = await prisma.nominee.findUnique({
        where: { id: nomineeId },
      });
  
      if (!nominee) {
        return NextResponse.json({ error: 'Nominee not found' }, { status: 404 });
      }
  
      const { ratings } = body; // Use stored body instead of reading again

    if (!Array.isArray(ratings) || ratings.length === 0) {
      return NextResponse.json({ error: 'Ratings must be an array with at least one item' }, { status: 400 });
    }

    // Validate and create each rating
    const createdRatings = [];
    for (const rating of ratings) {
      const { userId, ratingCategoryId, score, severity, evidence } = rating;

      if (typeof score !== 'number' || typeof severity !== 'number') {
        return NextResponse.json({ error: 'Invalid score or severity' }, { status: 400 });
      }

      const newRating = await prisma.nomineeRating.create({
        data: {
          userId,
          nomineeId,
          ratingCategoryId,
          score,
          severity,
          evidence,
        },
      });

      createdRatings.push(newRating);
    }

    // Return the created ratings
    return NextResponse.json({ ratings: createdRatings }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error submitting ratings' }, { status: 500 });
  }
}