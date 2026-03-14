import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const court = searchParams.get('court');
  const legalArea = searchParams.get('legalArea');
  const charterSection = searchParams.get('charterSection');
  
  let filter = '_type == "caseLaw" && isGoodLaw == true';
  
  if (search) {
    filter += ` && (caseName match "*${search}*" || headnote match "*${search}*" || ratio match "*${search}*")`;
  }
  if (court) filter += ` && court == "${court}"`;
  if (legalArea) filter += ` && "${legalArea}" in legalAreas`;
  if (charterSection) filter += ` && "${charterSection}" in charterSections`;
  
  const query = `*[${filter}] | order(year desc) [0...50] {
    _id,
    caseName,
    citation,
    neutralCitation,
    canliiUrl,
    court,
    year,
    legalAreas,
    charterSections,
    headnote,
    ratio,
    outcome,
    isGoodLaw,
    citedBy
  }`;
  
  try {
    const caseLaw = await client.fetch(query);
    return NextResponse.json({ caseLaw });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch case law' }, { status: 500 });
  }
}
