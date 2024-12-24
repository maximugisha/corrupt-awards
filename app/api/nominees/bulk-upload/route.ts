import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { prisma } from "@/lib/prisma";

interface NomineeData {
  name: string;
  position: string;
  institution: string;
  district: string;
  image?: string;
}

interface CSVRecord {
  name: string;
  position: string;
  institution: string;
  district: string;
  image?: string;
}

async function validateImageUrl(url: string | undefined) {
  if (!url) return null;
  try {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return null;
    }
    return url;
  } catch (error) {
    console.error('Error validating image URL:', error);
    return null;
  }
}

async function processNominee(record: CSVRecord) {
  try {
    // Validate required fields
    if (!record.name || !record.position || !record.institution || !record.district) {
      throw new Error("Missing required fields");
    }

    // Validate image URL if provided
    const imageUrl = await validateImageUrl(record.image);

    // Find or verify position
    const position = await prisma.position.findFirstOrThrow({
      where: {
        name: {
          equals: record.position,
          mode: 'insensitive'
        }
      }
    });

    // Find or verify institution
    const institution = await prisma.institution.findFirstOrThrow({
      where: {
        name: {
          equals: record.institution,
          mode: 'insensitive'
        }
      }
    });

    // Find or verify district
    const district = await prisma.district.findFirstOrThrow({
      where: {
        name: {
          equals: record.district,
          mode: 'insensitive'
        }
      }
    });

    // Create nominee
    const nominee = await prisma.nominee.create({
      data: {
        name: record.name,
        positionId: position.id,
        institutionId: institution.id,
        districtId: district.id,
        image: imageUrl,
        votes: 0,
      },
    });

    return {
      success: true,
      nominee: record.name,
      data: nominee,
    };
  } catch (error) {
    return {
      success: false,
      nominee: record.name,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No valid file provided' },
        { status: 400 }
      );
    }

    // Read file content
    const csvText = await file.text();

    // Parse CSV to JSON
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CSVRecord[];

    // Process all nominees
    const results = await Promise.all(
      records.map(processNominee)
    );

    // Calculate summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return NextResponse.json({
      message: 'Bulk upload completed',
      summary: {
        total: records.length,
        successful,
        failed,
      },
      results,
    });

  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      {
        error: 'Failed to process upload',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    template: {
      headers: ["name", "position", "institution", "district", "image"],
      required: ["name", "position", "institution", "district"],
      optional: ["image"],
      example: {
        name: "John Doe",
        position: "Chairman",
        institution: "Example Institution",
        district: "Central District",
        image: "https://example.com/image.jpg"
      }
    }
  });
}