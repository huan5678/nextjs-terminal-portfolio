
import { type NextRequest, NextResponse } from 'next/server';

/**
 * GET handler to return the user's country code.
 * Vercel provides this in the `x-vercel-ip-country` header.
 */
export async function GET(req: NextRequest) {
  const country = req.headers.get('x-vercel-ip-country') || 'DEV';
  return NextResponse.json({ country });
}
