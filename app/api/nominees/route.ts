import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { buildFilters } from '@/utils/filters';
import { paginate } from '@/utils/pagination';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const filters = buildFilters(searchParams, {
        searchFields: ['name'],
        exactFields: ['status', 'institutionId', 'positionId'],
        rangeFields: {
            createdAt: { min: new Date(), max: new Date() },
        },
    });

    // Define include to fetch related models: position, institution, and district
    const include = {
        rating: true,
        position: true,
        institution: true,
        district: true,
    };

    const result = await paginate(prisma.nominee, { page, limit }, filters, include);

    return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
    try {
        const { name, positionId, institutionId, districtId, status, evidence } = await req.json();

        const newNominee = await prisma.nominee.create({
            data: {
                name,
                positionId,
                institutionId,
                districtId,
                status,
                evidence,
            },
            include: {
                position: true,
                institution: true,
                district: true,
            },
        });

        return NextResponse.json(newNominee, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error creating nominee' }, { status: 500 });
    }
}