import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const id = parseInt(req.url.split('/').pop() as string, 10);
        
        const institution = await prisma.institution.findUnique({
            where: { id },
            include: {
                nominees: true,
                rating: true
            }
        });

        if (!institution) {
            return NextResponse.json(
                { error: 'Institution not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(institution);
    } catch (error) {
        console.error('Error fetching institution:', error);
        return NextResponse.json(
            { error: 'Failed to fetch institution' },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const id = parseInt(req.url.split('/').pop() as string, 10);
        const data = await req.json();
        
        if (data.status === false) {
            const institution = await prisma.institution.findUnique({
                where: { id },
                include: {
                    nominees: {
                        where: { status: true }
                    }
                }
            });

            if (institution?.nominees.length) {
                return NextResponse.json(
                    { error: 'Cannot deactivate institution with active nominees' },
                    { status: 400 }
                );
            }
        }

        const updatedInstitution = await prisma.institution.update({
            where: { id },
            data: {
                name: data.name,
                status: data.status,
                image: data.image
            },
            include: {
                nominees: true,
                rating: true
            }
        });

        return NextResponse.json(updatedInstitution);
    } catch (error) {
        console.error('Error updating institution:', error);
        return NextResponse.json(
            { error: 'Failed to update institution' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const id = parseInt(req.url.split('/').pop() as string, 10);
        
        const institution = await prisma.institution.findUnique({
            where: { id },
            include: {
                nominees: true,
                rating: true
            }
        });

        if (institution?.nominees.length || institution?.rating.length) {
            return NextResponse.json(
                { error: 'Cannot delete institution with associated nominees or ratings' },
                { status: 400 }
            );
        }

        await prisma.institution.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Institution deleted successfully' });
    } catch (error) {
        console.error('Error deleting institution:', error);
        return NextResponse.json(
            { error: 'Failed to delete institution' },
            { status: 500 }
        );
    }
}