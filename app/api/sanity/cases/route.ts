import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const caseType = searchParams.get('caseType');
  const province = searchParams.get('province');
  
  let filter = '_type == "caseFile"';
  
  if (status) filter += ` && status == "${status}"`;
  if (caseType) filter += ` && caseType == "${caseType}"`;
  if (province) filter += ` && province == "${province}"`;
  
  const query = `*[${filter}] | order(updatedAt desc) {
    _id,
    caseNumber,
    title,
    caseType,
    status,
    court,
    province,
    clientName,
    chargesOrClaims,
    charterSectionsAtIssue,
    importantDates,
    disclosureComplete,
    stinchcombeAuditStatus,
    assignedLawyer,
    createdAt,
    updatedAt
  }`;
  
  try {
    const cases = await client.fetch(query);
    return NextResponse.json({ cases });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Import writeClient for mutations
    const { writeClient } = await import('@/sanity/lib/client');
    
    const newCase = await writeClient.create({
      _type: 'caseFile',
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return NextResponse.json({ case: newCase });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 });
  }
}
