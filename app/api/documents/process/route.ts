import { NextRequest, NextResponse } from 'next/server';
import { DocumentProcessor } from '@/lib/document-processor';
import { CharterAnalyzer } from '@/lib/charter-analyzer';
import { RAGEngine } from '@/lib/rag-engine';

/**
 * POST /api/documents/process
 * Process uploaded document: extract text, analyze Charter breaches, index for RAG
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caseId = formData.get('caseId') as string;
    const performCharterAnalysis = formData.get('charterAnalysis') === 'true';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('[v0] Processing document:', file.name);

    // Step 1: Partition document
    const elements = await DocumentProcessor.partitionDocument(file);
    console.log('[v0] Extracted', elements.length, 'elements');

    // Step 2: Clean elements
    const cleanedElements = DocumentProcessor.cleanElements(elements);

    // Step 3: Filter relevant content
    const filteredElements = DocumentProcessor.filterElements(cleanedElements);

    // Step 4: Chunk for RAG
    const chunks = DocumentProcessor.chunkElements(filteredElements);

    // Step 5: Extract entities
    const extraction = DocumentProcessor.extractEntities(
      elements.map(el => el.text).join(' ')
    );

    // Step 6: Index into vector store
    RAGEngine.indexDocuments(chunks);
    const vectorStats = RAGEngine.getVectorStoreStats();

    let charterAnalysis = null;
    if (performCharterAnalysis && caseId) {
      console.log('[v0] Performing Charter analysis');
      charterAnalysis = CharterAnalyzer.performCaseAnalysis(
        cleanedElements,
        { case_id: caseId }
      );
    }

    return NextResponse.json({
      success: true,
      document: {
        filename: file.name,
        size_bytes: file.size,
        elements_extracted: elements.length,
        elements_processed: cleanedElements.length,
        elements_indexed: chunks.length,
      },
      extraction: extraction,
      vector_store: vectorStats,
      charter_analysis: charterAnalysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[v0] Document processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process document', details: String(error) },
      { status: 500 }
    );
  }
}
