import { NextRequest, NextResponse } from 'next/server';
import { CharterAnalyzer } from '@/lib/charter-analyzer';
import { DocumentProcessor } from '@/lib/document-processor';

/**
 * POST /api/analysis/charter
 * Perform comprehensive Charter breach analysis
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentText, caseContext = {} } = body;

    if (!documentText) {
      return NextResponse.json(
        { error: 'Document text is required' },
        { status: 400 }
      );
    }

    console.log('[v0] Starting Charter analysis');

    // Parse text into elements
    const elements = [
      {
        id: 'analysis-input',
        element_type: 'NarrativeText' as const,
        text: documentText,
        metadata: caseContext,
      },
    ];

    // Analyze for breaches
    const breaches = CharterAnalyzer.analyzeBreaches(elements, caseContext);
    console.log('[v0] Found', breaches.length, 'potential Charter breaches');

    // Extract judicial language
    const judicialLanguage = CharterAnalyzer.extractJudicialLanguage(elements);

    // Generate defense strategy
    const strategy = CharterAnalyzer.generateDefenseStrategy(breaches, caseContext, judicialLanguage);

    // Perform comprehensive analysis
    const analysis = CharterAnalyzer.performCaseAnalysis(elements, caseContext);

    return NextResponse.json({
      success: true,
      case_id: caseContext.case_id || 'ANALYSIS-' + Date.now(),
      breaches: breaches,
      judicial_language: judicialLanguage,
      defense_strategy: strategy,
      full_analysis: analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[v0] Charter analysis error:', error);
    return NextResponse.json(
      { error: 'Charter analysis failed', details: String(error) },
      { status: 500 }
    );
  }
}
