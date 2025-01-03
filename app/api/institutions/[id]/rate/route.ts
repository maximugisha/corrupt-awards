import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
 try {
   const institutionId = parseInt(req.nextUrl.pathname.split('/')[3], 10);
   const institution = await prisma.institution.findUnique({
     where: { id: institutionId },
   });

   if (!institution) {
     return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
   }

   const { ratings } = await req.json();

   if (!Array.isArray(ratings) || ratings.length === 0) {
     return NextResponse.json({ error: 'Ratings must be an array with at least one item' }, { status: 400 });
   }

   const createdRatings = [];
   for (const rating of ratings) {
     const { categoryId, score, severity, evidence } = rating;
     
     // Hardcode userId for now
     const userId = 1;

     if (typeof score !== 'number' || typeof severity !== 'number') {
       return NextResponse.json({ error: 'Invalid score or severity' }, { status: 400 });
     }

     const newRating = await prisma.institutionRating.create({
       data: {
         score,
         severity,
         evidence,
         user: {
           connect: { id: userId }
         },
         institution: {
           connect: { id: institutionId }
         },
         ratingCategory: {
           connect: { id: categoryId }
         }
       },
     });

     createdRatings.push(newRating);
   }

   return NextResponse.json({ ratings: createdRatings }, { status: 201 });
 } catch (error) {
   console.error(error);
   return NextResponse.json({ error: 'Error submitting ratings' }, { status: 500 });
 }
}