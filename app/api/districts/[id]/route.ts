import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
    try {
        const id = parseInt(req.url.split('/').pop() as string, 10);
        const data = await req.json();
        
        // Check if district exists and has no active nominees before deactivating
        if (data.status === false) {
            const district = await prisma.district.findUnique({
                where: { id },
                include: {
                    nominees: {
                        where: { status: true }
                    }
                }
            });

            if (district?.nominees.length) {
                return NextResponse.json(
                    { error: 'Cannot deactivate district with active nominees' },
                    { status: 400 }
                );
            }
        }

        const updatedDistrict = await prisma.district.update({
            where: { id },
            data: {
                name: data.name,
                region: data.region,
                ...(typeof data.status === 'boolean' && { status: data.status })
            },
        });

        return NextResponse.json(updatedDistrict);
    } catch (error) {
        console.error('Error updating district:', error);
        return NextResponse.json(
            { error: 'Failed to update district' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const id = parseInt(req.url.split('/').pop() as string, 10);
        
        // Check if district has any nominees
        const district = await prisma.district.findUnique({
            where: { id },
            include: {
                nominees: true
            }
        });

        if (district?.nominees.length) {
            return NextResponse.json(
                { error: 'Cannot delete district with associated nominees' },
                { status: 400 }
            );
        }

        await prisma.district.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'District deleted successfully' });
    } catch (error) {
        console.error('Error deleting district:', error);
        return NextResponse.json(
            { error: 'Failed to delete district' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const id = parseInt(req.url.split('/').pop() as string, 10);
        
        const district = await prisma.district.findUnique({
            where: { id },
            include: {
                nominees: true
            }
        });

        if (!district) {
            return NextResponse.json(
                { error: 'District not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(district);
    } catch (error) {
        console.error('Error fetching district:', error);
        return NextResponse.json(
            { error: 'Failed to fetch district' },
            { status: 500 }
        );
    }
}