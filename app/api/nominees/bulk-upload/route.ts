import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';

interface NomineeData {
  name: string;
  positionId: number;
  institutionId: number;
  districtId: number;
  evidence: string;
}

interface CSVRecord {
  name: string;
  positionId: string;
  institutionId: string;
  districtId: string;
  evidence?: string;
}

// Upload nominees to API
async function uploadNominee(nominee: NomineeData) {
  try {
    const response = await fetch('/api/nominees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nominee),
    });

    if (!response.ok) {
      throw new Error(`Failed to upload nominee ${nominee.name}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
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
    });

    // Transform and validate the data
    const nominees: NomineeData[] = records.map((record: CSVRecord) => ({
      name: record.name,
      positionId: parseInt(record.positionId),
      institutionId: parseInt(record.institutionId),
      districtId: parseInt(record.districtId),
      evidence: record.evidence || '',
    }));

    // Validate the nominees
    for (const nominee of nominees) {
      if (!nominee.name || isNaN(nominee.positionId) ||
        isNaN(nominee.institutionId) || isNaN(nominee.districtId)) {
        return NextResponse.json({
          error: 'Invalid data in CSV file. Please check all required fields.',
          invalidNominee: nominee,
        }, { status: 400 });
      }
    }

    // Upload all nominees
    const results = await Promise.all(
      nominees.map(async (nominee) => {
        try {
          const result = await uploadNominee(nominee);
          return {
            success: true,
            nominee: nominee.name,
            data: result,
          };
        } catch (error) {
          return {
            success: false,
            nominee: nominee.name,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    // Calculate summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return NextResponse.json({
      message: 'Bulk upload completed',
      summary: {
        total: nominees.length,
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