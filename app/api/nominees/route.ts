import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const showAll = searchParams.get('showAll') === 'true';

    const where = showAll ? {} : { status: true };

    try {
        const total = await prisma.nominee.count({ where });
        const pages = Math.ceil(total / limit);
        const skip = (page - 1) * limit;

        const nominees = await prisma.nominee.findMany({
            where,
            skip,
            take: limit,
            include: {
                position: true,
                institution: true,
                district: true,
                rating: {
                    include: {
                        ratingCategory: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });

        return NextResponse.json({
            data: nominees,
            count: total,
            pages,
            currentPage: page
        });
    } catch (error) {
        console.error('Error fetching nominees:', error);
        return NextResponse.json({ error: 'Failed to fetch nominees' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const nominee = await prisma.nominee.create({
            data: {
                name: data.name,
                image: data.image,
                positionId: data.positionId,
                institutionId: data.institutionId,
                districtId: data.districtId,
                status: data.status || true,
            }
        });
        return NextResponse.json(nominee);
    } catch (error) {
        console.error('Error creating nominee:', error);
        return NextResponse.json({ error: 'Failed to create nominee' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        const nominee = await prisma.nominee.update({
            where: { id: data.id },
            data: {
                name: data.name,
                image: data.image,
                positionId: data.positionId,
                institutionId: data.institutionId,
                districtId: data.districtId,
                status: data.status
            }
        });
        return NextResponse.json(nominee);
    } catch (error) {
        console.error('Error updating nominee:', error);
        return NextResponse.json({ error: 'Failed to update nominee' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = parseInt(searchParams.get('id') || '');
        
        const nominee = await prisma.nominee.delete({
            where: { id }
        });
        return NextResponse.json(nominee);
    } catch (error) {
        console.error('Error deleting nominee:', error);
        return NextResponse.json({ error: 'Failed to delete nominee' }, { status: 500 });
    }
}

// For activate/deactivate, use the PUT handler with a status field