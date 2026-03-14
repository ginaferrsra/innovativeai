import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const breakingOnly = searchParams.get('breakingOnly') === 'true';
  
  let filter = '_type == "legislationUpdate"';
  
  if (type) filter += ` && legislationType == "${type}"`;
  if (breakingOnly) filter += ' && isBreakingChange == true';
  
  const query = `*[${filter}] | order(publishedAt desc) [0...20] {
    _id,
    title,
    legislationType,
    source,
    sourceUrl,
    effectiveDate,
    summary,
    aiSummary,
    impactAreas,
    isBreakingChange,
    publishedAt
  }`;
  
  try {
    const updates = await client.fetch(query);
    return NextResponse.json({ updates });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch legislation updates' }, { status: 500 });
  }
}
