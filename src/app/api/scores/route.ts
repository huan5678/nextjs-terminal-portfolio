
import { prisma } from '@/lib/prisma';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * GET handler to fetch the leaderboard.
 * @returns Top 15 countries by total score.
 */
export async function GET() {
  try {
    const scores = await prisma.country_scores.findMany({
      orderBy: {
        total_score: 'desc',
      },
      take: 15,
    });

    // Prisma returns BigInt, which needs to be converted for JSON serialization
    const serializedScores = scores.map(score => ({
        ...score,
        total_score: score.total_score?.toString() ?? '0',
    }));

    return NextResponse.json(serializedScores);
  } catch (error: any) {
    return NextResponse.json({ message: `Error fetching scores: ${error.message}` }, { status: 500 });
  }
}

/**
 * POST handler to submit a score.
 * It finds the user's country and upserts the total score for that country.
 */
export async function POST(req: NextRequest) {
  try {
    const { score } = await req.json();
    const country_code = req.headers.get('x-vercel-ip-country') || 'DEV';

    if (typeof score !== 'number' || score <= 0) {
      return NextResponse.json({ message: 'Invalid score.' }, { status: 400 });
    }

    await prisma.country_scores.upsert({
        where: { country_code },
        create: { 
            country_code, 
            total_score: score 
        },
        update: { 
            total_score: { 
                increment: score 
            } 
        },
    });

    // After updating the score, fetch the latest leaderboard
    const updatedScores = await prisma.country_scores.findMany({
      orderBy: {
        total_score: 'desc',
      },
      take: 15,
    });

    // Serialize BigInt to string for the response
    const serializedScores = updatedScores.map(s => ({
      ...s,
      total_score: s.total_score?.toString() ?? '0',
    }));

    return NextResponse.json(serializedScores);
  } catch (error: any) {
    return NextResponse.json({ message: `Error submitting score: ${error.message}` }, { status: 500 });
  }
}
