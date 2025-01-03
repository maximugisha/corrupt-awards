// app/api/positions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
    try {
        const id = parseInt(req.url.split('/').pop() as string, 10);
        const data = await req.json();
        
        // Check if position exists and has no active nominees before deactivating
        if (data.status === false) {
            const position = await prisma.position.findUnique({
                where: { id },
                include: {
                    nominees: {
                        where: { status: true }
                    }
                }
            });

            if (position?.nominees.length) {
                return NextResponse.json(
                    { error: 'Cannot deactivate position with active nominees' },
                    { status: 400 }
                );
            }
        }

        const updatedPosition = await prisma.position.update({
            where: { id },
            data: {
                name: data.name,
                ...(typeof data.status === 'boolean' && { status: data.status })
            },
        });

        return NextResponse.json(updatedPosition);
    } catch (error) {
        console.error('Error updating position:', error);
        return NextResponse.json(
            { error: 'Failed to update position' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const id = parseInt(req.url.split('/').pop() as string, 10);
        
        // Check if position has any nominees
        const position = await prisma.position.findUnique({
            where: { id },
            include: {
                nominees: true
            }
        });

        if (position?.nominees.length) {
            return NextResponse.json(
                { error: 'Cannot delete position with associated nominees' },
                { status: 400 }
            );
        }

        await prisma.position.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Position deleted successfully' });
    } catch (error) {
        console.error('Error deleting position:', error);
        return NextResponse.json(
            { error: 'Failed to delete position' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const id = parseInt(req.url.split('/').pop() as string, 10);
        
        const position = await prisma.position.findUnique({
            where: { id },
            include: {
                nominees: true
            }
        });

        if (!position) {
            return NextResponse.json(
                { error: 'Position not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(position);
    } catch (error) {
        console.error('Error fetching position:', error);
        return NextResponse.json(
            { error: 'Failed to fetch position' },
            { status: 500 }
        );
    }
}