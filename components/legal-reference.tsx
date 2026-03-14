'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Scale, BookOpen, MapPin, AlertCircle, Download, ExternalLink } from 'lucide-react';
import { mockCourtForms, mockCharterRights } from '@/lib/mock-data';

export function LegalReference() {
  const [chartSearch, setChartSearch] = useState('');
  const [formsSearch, setFormsSearch] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('all');

  const filteredCharter = mockCharterRights.filter((item) =>
    item.title.toLowerCase().includes(chartSearch.toLowerCase()) ||
    item.text.toLowerCase().includes(chartSearch.toLowerCase()),
  );

  const filteredForms = mockCourtForms.filter((form) => {
    const matchesSearch =
      form.formName.toLowerCase().includes(formsSearch.toLowerCase()) ||
      form.description.toLowerCase().includes(formsSearch.toLowerCase());
    const matchesJurisdiction = selectedJurisdiction === 'all' || form.jurisdiction === selectedJurisdiction;
    return matchesSearch && matchesJurisdiction;
  });

  const jurisdictions = Array.from(new Set(mockCourtForms.map((f) => f.jurisdiction)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Legal Reference Library</h1>
        <p className="text-muted-foreground">Canadian law, court forms, and legal resources</p>
      </div>

      <Tabs defaultValue="charter" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="charter" className="gap-2">
            <Scale className="h-4 w-4" />
            Charter of Rights
          </TabsTrigger>
          <TabsTrigger value="forms" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Court Forms
          </TabsTrigger>
        </TabsList>

        {/* Charter of Rights and Freedoms */}
        <TabsContent value="charter" className="space-y-4">
          <Card className="bg-secondary/30 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Canadian Charter of Rights and Freedoms</CardTitle>
              <CardDescription>
                Complete searchable reference of fundamental rights and legal protections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Charter sections, rights, and protections..."
                  value={chartSearch}
                  onChange={(e) => setChartSearch(e.target.value)}
                  className="pl-10 bg-background border-border/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Charter Results */}
          <div className="grid gap-4">
            {filteredCharter.map((item) => (
              <Card key={item.section} className="border-border/50 hover:border-border transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Badge className="bg-primary text-primary-foreground">Section {item.section}</Badge>
                        {item.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-foreground leading-relaxed italic border-l-4 border-primary/30 pl-4">
                    "{item.text}"
                  </p>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <span className="text-xs text-foreground font-semibold">Applicable to all Canadian courts</span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredCharter.length === 0 && (
              <Card className="border-dashed border-border/50 bg-secondary/30">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">No Charter sections found matching your search</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Court Forms */}
        <TabsContent value="forms" className="space-y-4">
          <Card className="bg-secondary/30 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Canadian Court Forms Repository</CardTitle>
              <CardDescription>
                Updated court forms for every province and territory, all jurisdictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search forms by name or number..."
                  value={formsSearch}
                  onChange={(e) => setFormsSearch(e.target.value)}
                  className="pl-10 bg-background border-border/50"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedJurisdiction === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedJurisdiction('all')}
                >
                  All Jurisdictions
                </Button>
                {jurisdictions.map((jurisdiction) => (
                  <Button
                    key={jurisdiction}
                    variant={selectedJurisdiction === jurisdiction ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedJurisdiction(jurisdiction)}
                  >
                    {jurisdiction}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Forms Grid */}
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredForms.map((form) => (
              <Card key={form.id} className="border-border/50 hover:border-border transition-colors flex flex-col">
                <CardHeader className="pb-3">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{form.formName}</CardTitle>
                    <CardDescription className="text-xs">
                      Form {form.formNumber} • {form.court}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-foreground">{form.description}</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {form.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {form.jurisdiction}
                      </Badge>
                      {form.city && (
                        <Badge variant="secondary" className="text-xs">
                          {form.city}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Updated: {new Date(form.lastUpdated).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                      <ExternalLink className="h-3 w-3" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredForms.length === 0 && (
            <Card className="border-dashed border-border/50 bg-secondary/30">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No forms found matching your criteria</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Additional Resources */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            About This Repository
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-foreground">
          <p>
            • <strong>Comprehensive Coverage:</strong> Complete Charter of Rights and Freedoms with all 34 sections
          </p>
          <p>
            • <strong>All Jurisdictions:</strong> Court forms for every province, territory, and court level in Canada
          </p>
          <p>
            • <strong>Auto-Updated:</strong> Forms are automatically updated when new versions are released
          </p>
          <p>
            • <strong>Searchable:</strong> Full-text search across all legal documents and forms
          </p>
          <p>
            • <strong>Cross-Referenced:</strong> Links between related sections and applicable statutes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
