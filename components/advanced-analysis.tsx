'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, Shield, Scale, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface AnalysisResult {
  case_id: string;
  breaches: any[];
  judicial_language: string[];
  defense_strategy: any;
  full_analysis: any;
}

export function AdvancedAnalysis() {
  const [documentText, setDocumentText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [caseContext, setCaseContext] = useState({
    case_id: '',
    province: 'Ontario',
    court: 'Superior Court',
  });

  const performAnalysis = async () => {
    if (!documentText.trim()) return;

    try {
      setAnalyzing(true);
      console.log('[v0] Starting Charter analysis');

      const response = await fetch('/api/analysis/charter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText,
          caseContext,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
        console.log('[v0] Analysis complete');
      }
    } catch (error) {
      console.error('[v0] Analysis error:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Charter Breach Analysis</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Case ID"
              value={caseContext.case_id}
              onChange={(e) =>
                setCaseContext({ ...caseContext, case_id: e.target.value })
              }
            />
            <select
              value={caseContext.province}
              onChange={(e) =>
                setCaseContext({ ...caseContext, province: e.target.value })
              }
              className="p-2 border rounded"
            >
              <option>Ontario</option>
              <option>British Columbia</option>
              <option>Alberta</option>
              <option>Quebec</option>
              <option>Manitoba</option>
              <option>Saskatchewan</option>
            </select>
            <Input
              placeholder="Court"
              value={caseContext.court}
              onChange={(e) =>
                setCaseContext({ ...caseContext, court: e.target.value })
              }
            />
          </div>

          <textarea
            value={documentText}
            onChange={(e) => setDocumentText(e.target.value)}
            placeholder="Paste case documents, affidavits, or court files here for analysis..."
            className="w-full h-40 p-3 border rounded font-mono text-sm"
          />

          <Button
            onClick={performAnalysis}
            disabled={!documentText.trim() || analyzing}
            size="lg"
            className="w-full"
          >
            {analyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Analyze for Charter Breaches
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Breaches Overview */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold">Charter Breaches Identified</h3>
            </div>

            {analysis.breaches.length === 0 ? (
              <p className="text-muted-foreground">No Charter breaches identified</p>
            ) : (
              <div className="space-y-3">
                {analysis.breaches.map((breach, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded border-l-4 ${
                      breach.severity === 'critical'
                        ? 'bg-red-50 border-red-500'
                        : breach.severity === 'high'
                          ? 'bg-orange-50 border-orange-500'
                          : 'bg-yellow-50 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{breach.section}: {breach.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded font-medium ${
                        breach.severity === 'critical'
                          ? 'bg-red-200 text-red-800'
                          : breach.severity === 'high'
                            ? 'bg-orange-200 text-orange-800'
                            : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {breach.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{breach.context}</p>
                    <div className="bg-white p-3 rounded text-sm">
                      <p className="font-medium mb-2">Recommended Actions:</p>
                      <ul className="space-y-1">
                        {breach.recommendations.slice(0, 3).map((rec, i) => (
                          <li key={i} className="flex gap-2 text-xs">
                            <span className="text-primary">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Defense Strategy */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Defense Strategy</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded border">
                <p className="text-sm font-medium text-blue-900">Primary Strategy</p>
                <p className="text-sm mt-1">
                  {analysis.defense_strategy.primary_strategy}
                </p>
              </div>

              {analysis.defense_strategy.secondary_strategies.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Secondary Strategies</p>
                  <ul className="space-y-2">
                    {analysis.defense_strategy.secondary_strategies.map((strategy, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <span className="text-blue-600">→</span>
                        <span>{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.defense_strategy.evidential_gaps.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded">
                  <p className="text-sm font-medium mb-2 text-yellow-900">Evidential Gaps</p>
                  <ul className="space-y-1">
                    {analysis.defense_strategy.evidential_gaps.map((gap, idx) => (
                      <li key={idx} className="text-sm text-yellow-800">• {gap}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-green-50 p-4 rounded border">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-green-900">
                    Estimated Success Probability
                  </p>
                  <p className="font-bold text-lg text-green-700">
                    {(analysis.defense_strategy.estimated_success_probability * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Procedural Steps */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Recommended Procedural Steps</h3>
            </div>

            <ol className="space-y-3">
              {analysis.defense_strategy.procedural_steps.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="font-bold text-green-600 min-w-6">{idx + 1}.</span>
                  <span className="text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </Card>

          {/* Comparable Cases */}
          {analysis.defense_strategy.comparable_cases.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold">Comparable Case Law</h3>
              </div>

              <div className="space-y-2">
                {analysis.defense_strategy.comparable_cases.map((caseRef, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-purple-50 rounded border border-purple-200 text-sm"
                  >
                    {caseRef}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Judicial Language */}
          {analysis.judicial_language.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Key Judicial Language</h3>
              <div className="space-y-2">
                {analysis.judicial_language.map((phrase, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-2 bg-slate-100 rounded text-sm font-mono"
                  >
                    "{phrase}"
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
