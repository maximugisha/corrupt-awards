// app/api/institutions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const includeInactive = searchParams.get('includeInactive') === 'true';
  
    const where: Prisma.InstitutionWhereInput = includeInactive ? {} : { status: true };

    const result = await prisma.institution.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
            nominees: true,
            rating: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const total = await prisma.institution.count({ where });
    const pages = Math.ceil(total / limit);

    return NextResponse.json({
        data: result,
        count: total,
        pages,
        currentPage: page
    });
}

export async function POST(req: NextRequest) {
    try {
        const { name, image } = await req.json();

        if (!name?.trim()) {
            return NextResponse.json(
                { error: 'Institution name is required' },
                { status: 400 }
            );
        }

        const newInstitution = await prisma.institution.create({
            data: {
                name: name.trim(),
                image,
                status: true
            },
        });

        return NextResponse.json(newInstitution, { status: 201 });
    } catch (error) {
        console.error('Error creating institution:', error);
        return NextResponse.json(
            { error: 'Failed to create institution' },
            { status: 500 }
        );
    }
}