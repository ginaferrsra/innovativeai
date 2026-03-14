'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, TrendingUp, ShieldAlert, Scale, Zap, Plus } from 'lucide-react';
import { mockLegalAnalysis, mockCases } from '@/lib/mock-data';

export function AnalysisDashboard() {
  const analysis = mockLegalAnalysis[0]; // Get first analysis
  const caseData = mockCases[0]; // Get first case

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Legal Analysis</h1>
          <p className="text-muted-foreground">Document analysis, risk assessment, and legal recommendations</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          New Analysis
        </Button>
      </div>

      {/* Case Context */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Selected Case</p>
            <p className="text-lg font-semibold text-foreground">{caseData.title}</p>
            <div className="flex gap-2 flex-wrap mt-2">
              <Badge variant="secondary">{caseData.type.replace(/_/g, ' ')}</Badge>
              <Badge className="bg-green-100 text-green-800 border-green-300">{caseData.status}</Badge>
              <Badge variant="outline">{caseData.jurisdiction}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="caselaw">Case Law</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Analysis Summary
              </CardTitle>
              <CardDescription>{analysis.analysisType.replace(/_/g, ' ')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">{analysis.result.summary}</p>

              <div className="grid gap-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-3 text-sm">Key Findings</h4>
                  <div className="space-y-2">
                    {analysis.result.keyFindings.map((finding, idx) => (
                      <div key={idx} className="flex gap-2 text-sm">
                        <span className="text-primary font-bold">✓</span>
                        <span className="text-foreground">{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Applicable Law */}
              <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
                <h4 className="font-semibold text-foreground mb-3 text-sm">Applicable Law</h4>
                <div className="space-y-2 text-sm">
                  {analysis.result.applicableLaw.statute && (
                    <div>
                      <span className="text-muted-foreground">Statute: </span>
                      <span className="text-foreground font-semibold">{analysis.result.applicableLaw.statute}</span>
                    </div>
                  )}
                  {analysis.result.applicableLaw.charter && (
                    <div>
                      <span className="text-muted-foreground">Charter: </span>
                      <span className="text-foreground font-semibold">{analysis.result.applicableLaw.charter}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risks Tab */}
        <TabsContent value="risks" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-orange-600" />
                Risk Assessment
              </CardTitle>
              <CardDescription>Identified legal and procedural risks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.result.risks.map((risk, idx) => {
                const colors = {
                  low: 'bg-blue-100 border-blue-300',
                  medium: 'bg-yellow-100 border-yellow-300',
                  high: 'bg-orange-100 border-orange-300',
                };

                const textColors = {
                  low: 'text-blue-900',
                  medium: 'text-yellow-900',
                  high: 'text-orange-900',
                };

                const iconColors = {
                  low: 'text-blue-600',
                  medium: 'text-yellow-600',
                  high: 'text-orange-600',
                };

                return (
                  <div
                    key={idx}
                    className={`rounded-lg border-2 p-4 space-y-2 ${colors[risk.level as keyof typeof colors]}`}
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className={`h-5 w-5 ${iconColors[risk.level as keyof typeof iconColors]}`} />
                      <Badge className={`capitalize ${risk.level === 'high' ? 'bg-red-600' : risk.level === 'medium' ? 'bg-yellow-600' : 'bg-blue-600'} text-white`}>
                        {risk.level} Risk
                      </Badge>
                    </div>
                    <p className={`text-sm font-medium ${textColors[risk.level as keyof typeof textColors]}`}>
                      {risk.description}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Strategic Recommendations
              </CardTitle>
              <CardDescription>AI-generated recommendations based on case analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.result.recommendations.map((rec, idx) => (
                <div key={idx} className="flex gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
                  <div className="text-primary font-bold text-lg flex-shrink-0">{idx + 1}</div>
                  <p className="text-sm text-foreground flex-1 pt-0.5">{rec}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Case Law Tab */}
        <TabsContent value="caselaw" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Relevant Case Law
              </CardTitle>
              <CardDescription>Referenced precedents and legal authorities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.relevantCaselaw.map((caselaw, idx) => {
                const relevanceColors = {
                  highly_relevant: 'border-primary bg-primary/5',
                  relevant: 'border-accent bg-accent/5',
                  reference: 'border-border/50 bg-secondary/30',
                };

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 space-y-2 ${relevanceColors[caselaw.relevance as keyof typeof relevanceColors]}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{caselaw.citation}</p>
                        <Badge
                          variant={caselaw.relevance === 'highly_relevant' ? 'default' : 'secondary'}
                          className="text-xs capitalize mt-1"
                        >
                          {caselaw.relevance.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      {caselaw.url && (
                        <Button variant="ghost" size="sm" className="text-primary">
                          View →
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-secondary/30 border-border/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-semibold">Analysis Confidence</p>
              <p className="text-3xl font-bold text-primary">95%</p>
              <Progress value={95} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/30 border-border/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-semibold">Risk Level</p>
              <p className="text-3xl font-bold text-orange-600">Medium</p>
              <p className="text-xs text-foreground">2 medium risks identified</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/30 border-border/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-semibold">Related Cases</p>
              <p className="text-3xl font-bold text-primary">{analysis.relevantCaselaw.length}</p>
              <p className="text-xs text-foreground">Legal precedents</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
