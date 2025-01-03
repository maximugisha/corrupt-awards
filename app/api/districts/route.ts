import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { buildFilters } from '@/utils/filters';
import { paginate } from '@/utils/pagination';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    const baseFilters = buildFilters(searchParams, {
        searchFields: ['name'],
        rangeFields: {
            createdAt: {
                min: new Date(),
                max: new Date()
            },
        },
    });

    const where = {
        ...baseFilters,
        ...((!includeInactive) ? { status: true } : {})
    };

    const queryParams = {
        where,
        orderBy: { createdAt: 'desc' as const },
        include: {}
    };

    const result = await paginate(prisma.district, { page, limit }, queryParams);
    return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        if (!body.name) {
            return NextResponse.json(
                { error: 'District name is required' },
                { status: 400 }
            );
        }

        if (!body.region) {
            return NextResponse.json(
                { error: 'Region is required' },
                { status: 400 }
            );
        }

        const district = await prisma.district.create({
            data: {
                name: body.name,
                region: body.region,
            }
        });

        return NextResponse.json(district, { status: 201 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json(
                    { error: 'A district with this name already exists' },
                    { status: 409 }
                );
            }
        }

        console.error('Error creating district:', error);
        return NextResponse.json(
            { error: 'Failed to create district' },
            { status: 500 }
        );
    }
}