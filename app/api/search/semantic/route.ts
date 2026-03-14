import { NextRequest, NextResponse } from 'next/server';
import { RAGEngine } from '@/lib/rag-engine';

/**
 * POST /api/search/semantic
 * Semantic search with context retrieval
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, topK = 5, searchType = 'hybrid' } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    console.log('[v0] Performing', searchType, 'search for:', query);

    let results;
    if (searchType === 'semantic') {
      results = RAGEngine.semanticSearch(query, topK);
    } else if (searchType === 'hybrid') {
      results = RAGEngine.hybridSearch(query, topK);
    } else {
      results = RAGEngine.semanticSearch(query, topK);
    }

    // Get context for each query
    const context = RAGEngine.retrieveContext(query, Math.min(3, topK));

    return NextResponse.json({
      success: true,
      query: query,
      search_type: searchType,
      results_count: results.length,
      results: results,
      context: context,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[v0] Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/search/semantic
 * Get vector store statistics
 */
export async function GET() {
  try {
    const stats = RAGEngine.getVectorStoreStats();

    return NextResponse.json({
      success: true,
      vector_store_stats: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[v0] Stats retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve stats', details: String(error) },
      { status: 500 }
    );
  }
}
