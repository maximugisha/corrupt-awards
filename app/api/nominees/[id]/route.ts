import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const id = parseInt(req.nextUrl.pathname.split('/').pop() as string, 10);
        
        const nominee = await prisma.nominee.findUnique({
            where: { id },
            include: {
                position: true,
                institution: true,
                district: true,
                rating: {
                    include: {
                        ratingCategory: true
                    }
                }
            }
        });

        if (!nominee) {
            return NextResponse.json(
                { error: 'Nominee not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(nominee);
    } catch (error) {
        console.error('Error fetching nominee:', error);
        return NextResponse.json(
            { error: 'Failed to fetch nominee' },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const id = parseInt(req.nextUrl.pathname.split('/').pop() as string, 10);
        const data = await req.json();
        
        const existingNominee = await prisma.nominee.findUnique({
            where: { id },
        });

        if (!existingNominee) {
            return NextResponse.json(
                { error: 'Nominee not found' },
                { status: 404 }
            );
        }

        const updatedNominee = await prisma.nominee.update({
            where: { id },
            data: {
                name: data.name,
                positionId: data.positionId,
                institutionId: data.institutionId,
                districtId: data.districtId,
                status: data.status,
                evidence: data.evidence,
                image: data.image,
            },
            include: {
                position: true,
                institution: true,
                district: true,
            },
        });

        return NextResponse.json(updatedNominee);
    } catch (error) {
        console.error('Error updating nominee:', error);
        return NextResponse.json(
            { error: 'Error updating nominee' },
            { status: 500 }
        );
    }
}