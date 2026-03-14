import { NextRequest, NextResponse } from 'next/server';
import { DataConnectors } from '@/lib/data-connectors';

/**
 * GET /api/connectors
 * Get available data sources and active connections
 */
export async function GET() {
  try {
    const availableSources = DataConnectors.getAvailableSources();
    const activeConnections = DataConnectors.getActiveConnections();
    const health = DataConnectors.getConnectorHealth();

    return NextResponse.json({
      success: true,
      available_sources: availableSources,
      active_connections: Array.from(activeConnections.entries()).map(([source, status]) => ({
        source,
        ...status,
      })),
      health_status: health,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[v0] Connector retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve connectors', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/connectors
 * Authenticate with a data source
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, credentials } = body;

    if (!source || !credentials) {
      return NextResponse.json(
        { error: 'Source and credentials are required' },
        { status: 400 }
      );
    }

    console.log('[v0] Authenticating with data source:', source);

    const status = await DataConnectors.authenticateSource(source, credentials);

    return NextResponse.json({
      success: true,
      connector_status: status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[v0] Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed', details: String(error) },
      { status: 500 }
    );
  }
}
