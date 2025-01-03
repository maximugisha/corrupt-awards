// app/api/positions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const includeInactive = searchParams.get('includeInactive') === 'true';
  
    const where: Prisma.PositionWhereInput = includeInactive ? {} : { status: true };

    const result = await prisma.position.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
            nominees: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const total = await prisma.position.count({ where });
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
        const body = await req.json();
        const { name } = body;

        if (!name?.trim()) {
            return NextResponse.json(
                { error: 'Position name is required' },
                { status: 400 }
            );
        }

        const newPosition = await prisma.position.create({
            data: {
                name: name.trim(),
                status: true
            },
            include: {
                nominees: true
            }
        });

        return NextResponse.json(newPosition, { status: 201 });
    } catch (error) {
        console.error('Error creating position:', error);
        return NextResponse.json(
            { error: 'Failed to create position' },
            { status: 500 }
        );
    }
}