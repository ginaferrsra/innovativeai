import { NextRequest, NextResponse } from 'next/server';
import { DataConnectors } from '@/lib/data-connectors';

/**
 * POST /api/connectors/[source]/sync
 * Trigger sync from a specific data source
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { source: string } }
) {
  try {
    const source = params.source;
    const body = await request.json();
    const { maxDocuments } = body;

    console.log('[v0] Syncing from:', source);

    const status = await DataConnectors.syncSource(source, maxDocuments);

    return NextResponse.json({
      success: true,
      connector_status: status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[v0] Sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/connectors/[source]/sync
 * Get sync status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { source: string } }
) {
  try {
    const source = params.source;
    const activeConnections = DataConnectors.getActiveConnections();
    const status = activeConnections.get(source);

    if (!status) {
      return NextResponse.json(
        { error: `${source} not connected` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      connector_status: status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[v0] Status retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve status', details: String(error) },
      { status: 500 }
    );
  }
}
