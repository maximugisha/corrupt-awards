// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { content, userId, nomineeId, institutionId } = await req.json();

    if (!content || !userId || (!nomineeId && !institutionId)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        nomineeId,
        institutionId,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const nomineeId = searchParams.get('nomineeId');
    const institutionId = searchParams.get('institutionId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where = {
      ...(nomineeId && { nomineeId: parseInt(nomineeId) }),
      ...(institutionId && { institutionId: parseInt(institutionId) }),
    };

    const total = await prisma.comment.count({ where });
    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const comments = await prisma.comment.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      data: comments,
      count: total,
      pages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}