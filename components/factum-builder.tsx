'use client';

import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText, Plus, Save, Download, AlertCircle, CheckCircle2,
  ChevronRight, ChevronLeft, Scale, Users, BookOpen, Gavel,
  FileCheck, Trash2, Copy, Eye, PenLine, ListOrdered,
} from 'lucide-react';
import {
  type Factum,
  type FactumSection,
  type FactumParty,
  type FactumCitation,
  CANADIAN_COURTS,
  getSectionsForCourt,
  getFormattingForCourt,
  calculateWordCount,
  calculatePageCount,
  validateFactum,
  generateCoverPage,
  ARGUMENT_TEMPLATES,
} from '@/lib/factum-builder';

interface FactumBuilderProps {
  onSave?: (factum: Factum) => void;
  initialFactum?: Partial<Factum>;
}

export function FactumBuilder({ onSave, initialFactum }: FactumBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Factum state
  const [province, setProvince] = useState(initialFactum?.province || 'ON');
  const [court, setCourt] = useState(initialFactum?.court || '');
  const [courtFile, setCourtFile] = useState(initialFactum?.courtFile || '');
  const [title, setTitle] = useState(initialFactum?.title || '');
  const [parties, setParties] = useState<FactumParty[]>(initialFactum?.parties || []);
  const [sections, setSections] = useState<FactumSection[]>([]);
  const [citations, setCitations] = useState<FactumCitation[]>(initialFactum?.citations || []);

  // Party form state
  const [newParty, setNewParty] = useState<Partial<FactumParty>>({
    role: 'appellant',
  });

  // Citation form state
  const [newCitation, setNewCitation] = useState<Partial<FactumCitation>>({
    type: 'case',
  });

  const steps = [
    { id: 'court', title: 'Court Selection', icon: Scale },
    { id: 'parties', title: 'Parties', icon: Users },
    { id: 'sections', title: 'Content', icon: FileText },
    { id: 'citations', title: 'Authorities', icon: BookOpen },
    { id: 'review', title: 'Review', icon: FileCheck },
  ];

  // Initialize sections when court changes
  const handleCourtChange = useCallback((courtId: string) => {
    setCourt(courtId);
    const sectionTemplates = getSectionsForCourt(courtId);
    setSections(sectionTemplates.map(s => ({ ...s, content: '' })));
  }, []);

  // Calculate totals
  const totalWordCount = useMemo(() => 
    sections.reduce((sum, s) => sum + calculateWordCount(s.content), 0),
    [sections]
  );

  const formatting = useMemo(() => getFormattingForCourt(court), [court]);
  const pageCount = useMemo(() => calculatePageCount(totalWordCount, formatting), [totalWordCount, formatting]);

  // Build factum object
  const factum: Factum = useMemo(() => ({
    id: initialFactum?.id || `factum-${Date.now()}`,
    title,
    courtFile,
    court,
    courtLevel: court === 'SCC' ? 'supreme' : court.includes('CA') ? 'appeal' : 'trial',
    province,
    parties,
    sections,
    citations,
    createdAt: initialFactum?.createdAt || new Date(),
    updatedAt: new Date(),
    status: 'draft',
    wordCount: totalWordCount,
    pageCount,
  }), [title, courtFile, court, province, parties, sections, citations, totalWordCount, pageCount, initialFactum]);

  const validation = useMemo(() => validateFactum(factum), [factum]);
  const completionPercentage = useMemo(() => {
    const totalChecks = 5 + sections.filter(s => s.required).length;
    let completed = 0;
    if (court) completed++;
    if (courtFile) completed++;
    if (parties.length >= 2) completed++;
    if (citations.length > 0) completed++;
    if (title) completed++;
    sections.forEach(s => {
      if (s.required && s.content.trim()) completed++;
    });
    return Math.round((completed / totalChecks) * 100);
  }, [court, courtFile, parties, citations, title, sections]);

  // Party management
  const addParty = useCallback(() => {
    if (newParty.name && newParty.role) {
      setParties(prev => [...prev, {
        id: `party-${Date.now()}`,
        name: newParty.name!,
        role: newParty.role as FactumParty['role'],
        counsel: newParty.counsel,
      }]);
      setNewParty({ role: 'respondent' });
    }
  }, [newParty]);

  const removeParty = useCallback((id: string) => {
    setParties(prev => prev.filter(p => p.id !== id));
  }, []);

  // Citation management
  const addCitation = useCallback(() => {
    if (newCitation.citation) {
      setCitations(prev => [...prev, {
        id: `cite-${Date.now()}`,
        type: newCitation.type as FactumCitation['type'],
        citation: newCitation.citation!,
        pinpoint: newCitation.pinpoint,
        relevance: newCitation.relevance || '',
      }]);
      setNewCitation({ type: 'case' });
    }
  }, [newCitation]);

  const removeCitation = useCallback((id: string) => {
    setCitations(prev => prev.filter(c => c.id !== id));
  }, []);

  // Section content update
  const updateSectionContent = useCallback((sectionId: string, content: string) => {
    setSections(prev => prev.map(s => 
      s.id === sectionId ? { ...s, content } : s
    ));
  }, []);

  // Insert template
  const insertTemplate = useCallback((templateKey: string, sectionId: string) => {
    const template = ARGUMENT_TEMPLATES[templateKey as keyof typeof ARGUMENT_TEMPLATES];
    if (template) {
      updateSectionContent(sectionId, template);
      setShowTemplates(false);
    }
  }, [updateSectionContent]);

  // Save factum
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(factum);
    }
    // In production, this would save to database
    localStorage.setItem(`factum-${factum.id}`, JSON.stringify(factum));
  }, [factum, onSave]);

  // Export to text (simplified - in production would generate PDF)
  const handleExport = useCallback(() => {
    const coverPage = generateCoverPage(factum);
    const content = sections.map(s => `\n\n${s.title}\n\n${s.content}`).join('');
    const citationList = citations.map(c => `- ${c.citation}`).join('\n');
    
    const fullDocument = `${coverPage}\n\n${content}\n\nAUTHORITIES CITED:\n${citationList}`;
    
    const blob = new Blob([fullDocument], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'Factum'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [factum, sections, citations, title]);

  const courts = CANADIAN_COURTS[province as keyof typeof CANADIAN_COURTS]?.courts || [];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Gavel className="h-4 w-4" />
            Create Factum
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Factum Builder - Court Compliant
            </DialogTitle>
            <DialogDescription>
              Create a properly formatted factum for Canadian courts with guided sections and citation management.
            </DialogDescription>
          </DialogHeader>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 py-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <button
                  type="button"
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : isCompleted 
                        ? 'bg-primary/20 text-primary'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium hidden md:inline">{step.title}</span>
                </button>
              );
            })}
            <div className="flex-1" />
            <div className="text-sm text-muted-foreground">
              {completionPercentage}% Complete
            </div>
          </div>
          <Progress value={completionPercentage} className="h-1" />

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto py-4">
            {/* Step 0: Court Selection */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Province/Territory</label>
                    <Select value={province} onValueChange={setProvince}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CANADIAN_COURTS).map(([code, data]) => (
                          <SelectItem key={code} value={code}>{data.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Court</label>
                    <Select value={court} onValueChange={handleCourtChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select court" />
                      </SelectTrigger>
                      <SelectContent>
                        {courts.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({c.level})
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Court File Number</label>
                    <Input
                      placeholder="e.g., CV-24-00123456"
                      value={courtFile}
                      onChange={(e) => setCourtFile(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Factum Title</label>
                    <Input
                      placeholder="e.g., Factum of the Appellant"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>

                {court && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Formatting Requirements</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-1 text-muted-foreground">
                      <p>Font: {formatting.fontFamily}, {formatting.fontSize}pt</p>
                      <p>Line Spacing: {formatting.lineSpacing}</p>
                      <p>Margins: {formatting.marginLeft}" left, {formatting.marginRight}" right</p>
                      <p>Citation Style: {formatting.citationStyle} Guide</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Step 1: Parties */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Add Party</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Party Name</label>
                        <Input
                          placeholder="Full legal name"
                          value={newParty.name || ''}
                          onChange={(e) => setNewParty(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Role</label>
                        <Select 
                          value={newParty.role} 
                          onValueChange={(v) => setNewParty(prev => ({ ...prev, role: v as FactumParty['role'] }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="appellant">Appellant</SelectItem>
                            <SelectItem value="respondent">Respondent</SelectItem>
                            <SelectItem value="applicant">Applicant</SelectItem>
                            <SelectItem value="plaintiff">Plaintiff</SelectItem>
                            <SelectItem value="defendant">Defendant</SelectItem>
                            <SelectItem value="intervenor">Intervenor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Counsel Name (Optional)</label>
                        <Input
                          placeholder="Lawyer's full name"
                          value={newParty.counsel?.name || ''}
                          onChange={(e) => setNewParty(prev => ({ 
                            ...prev, 
                            counsel: { ...prev.counsel, name: e.target.value } as FactumParty['counsel']
                          }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Firm (Optional)</label>
                        <Input
                          placeholder="Law firm name"
                          value={newParty.counsel?.firm || ''}
                          onChange={(e) => setNewParty(prev => ({ 
                            ...prev, 
                            counsel: { ...prev.counsel, firm: e.target.value } as FactumParty['counsel']
                          }))}
                        />
                      </div>

                      <Button onClick={addParty} className="w-full gap-2" size="sm">
                        <Plus className="h-3 w-3" />
                        Add Party
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Parties Added ({parties.length})</h4>
                    {parties.length === 0 ? (
                      <Card className="border-dashed">
                        <CardContent className="py-8 text-center text-sm text-muted-foreground">
                          No parties added yet. Add at least an appellant/plaintiff and respondent/defendant.
                        </CardContent>
                      </Card>
                    ) : (
                      parties.map((party) => (
                        <Card key={party.id} className="bg-secondary/30">
                          <CardContent className="py-3 flex items-start justify-between">
                            <div>
                              <p className="font-medium text-sm">{party.name}</p>
                              <Badge variant="secondary" className="text-xs mt-1">
                                {party.role}
                              </Badge>
                              {party.counsel && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Counsel: {party.counsel.name}
                                  {party.counsel.firm && `, ${party.counsel.firm}`}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => removeParty(party.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Content/Sections */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Factum Sections</h3>
                    <p className="text-xs text-muted-foreground">
                      Total: {totalWordCount} words | ~{pageCount} pages
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowTemplates(true)}>
                    <ListOrdered className="h-4 w-4 mr-2" />
                    Insert Template
                  </Button>
                </div>

                <Tabs defaultValue={sections[0]?.id} className="w-full">
                  <TabsList className="w-full justify-start overflow-x-auto">
                    {sections.map((section) => (
                      <TabsTrigger key={section.id} value={section.id} className="text-xs">
                        {section.title.replace(/^PART [IVX]+ - |SCHEDULE [A-Z] - /, '')}
                        {section.required && <span className="text-destructive ml-1">*</span>}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {sections.map((section) => {
                    const wordCount = calculateWordCount(section.content);
                    const isOverLimit = section.maxWords && wordCount > section.maxWords;
                    
                    return (
                      <TabsContent key={section.id} value={section.id} className="mt-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-sm">{section.title}</CardTitle>
                                <CardDescription className="text-xs">
                                  {section.description}
                                </CardDescription>
                              </div>
                              <div className="text-right">
                                <Badge 
                                  variant={isOverLimit ? 'destructive' : 'secondary'}
                                  className="text-xs"
                                >
                                  {wordCount}{section.maxWords ? `/${section.maxWords}` : ''} words
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <textarea
                              className="w-full min-h-[300px] p-3 text-sm border rounded-lg bg-background resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                              placeholder={`Enter content for ${section.title}...`}
                              value={section.content}
                              onChange={(e) => updateSectionContent(section.id, e.target.value)}
                            />
                            {isOverLimit && (
                              <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Exceeds maximum word count by {wordCount - section.maxWords!} words
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    );
                  })}
                </Tabs>

                {/* Templates Modal */}
                <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Argument Templates</DialogTitle>
                      <DialogDescription>
                        Insert pre-written legal argument templates. Customize after inserting.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {Object.entries(ARGUMENT_TEMPLATES).map(([key, value]) => (
                        <Card 
                          key={key} 
                          className="cursor-pointer hover:bg-secondary/50 transition-colors"
                          onClick={() => {
                            const activeSection = sections.find(s => !s.content);
                            if (activeSection) {
                              insertTemplate(key, activeSection.id);
                            }
                          }}
                        >
                          <CardContent className="py-3">
                            <p className="font-medium text-sm">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {value.substring(0, 150)}...
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* Step 3: Citations */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Add Authority</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Type</label>
                        <Select 
                          value={newCitation.type} 
                          onValueChange={(v) => setNewCitation(prev => ({ ...prev, type: v as FactumCitation['type'] }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="case">Case Law</SelectItem>
                            <SelectItem value="statute">Statute</SelectItem>
                            <SelectItem value="regulation">Regulation</SelectItem>
                            <SelectItem value="secondary">Secondary Source</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Full Citation (McGill Format)</label>
                        <Input
                          placeholder="e.g., R v Oakes, [1986] 1 SCR 103"
                          value={newCitation.citation || ''}
                          onChange={(e) => setNewCitation(prev => ({ ...prev, citation: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Pinpoint (Optional)</label>
                        <Input
                          placeholder="e.g., para 65"
                          value={newCitation.pinpoint || ''}
                          onChange={(e) => setNewCitation(prev => ({ ...prev, pinpoint: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Relevance</label>
                        <Input
                          placeholder="How this authority supports your argument"
                          value={newCitation.relevance || ''}
                          onChange={(e) => setNewCitation(prev => ({ ...prev, relevance: e.target.value }))}
                        />
                      </div>

                      <Button onClick={addCitation} className="w-full gap-2" size="sm">
                        <Plus className="h-3 w-3" />
                        Add Citation
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Authorities Cited ({citations.length})</h4>
                    <div className="max-h-[400px] overflow-y-auto space-y-2">
                      {citations.length === 0 ? (
                        <Card className="border-dashed">
                          <CardContent className="py-8 text-center text-sm text-muted-foreground">
                            No citations added. Add case law, statutes, and other authorities.
                          </CardContent>
                        </Card>
                      ) : (
                        citations.map((cite) => (
                          <Card key={cite.id} className="bg-secondary/30">
                            <CardContent className="py-3 flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <Badge variant="outline" className="text-xs mb-1">
                                  {cite.type}
                                </Badge>
                                <p className="font-medium text-sm">{cite.citation}</p>
                                {cite.pinpoint && (
                                  <p className="text-xs text-muted-foreground">at {cite.pinpoint}</p>
                                )}
                                {cite.relevance && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {cite.relevance}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive flex-shrink-0"
                                onClick={() => removeCitation(cite.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-bold text-primary">{totalWordCount}</p>
                      <p className="text-sm text-muted-foreground">Total Words</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-bold text-primary">{pageCount}</p>
                      <p className="text-sm text-muted-foreground">Estimated Pages</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-bold text-primary">{citations.length}</p>
                      <p className="text-sm text-muted-foreground">Authorities Cited</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Validation Status */}
                <Card className={validation.valid ? 'border-green-500/50 bg-green-500/5' : 'border-destructive/50 bg-destructive/5'}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      {validation.valid ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      {validation.valid ? 'Ready for Filing' : 'Issues to Address'}
                    </CardTitle>
                  </CardHeader>
                  {!validation.valid && (
                    <CardContent className="pt-0">
                      <ul className="text-sm space-y-1">
                        {validation.errors.map((error, i) => (
                          <li key={i} className="text-destructive flex items-start gap-2">
                            <span className="text-destructive">-</span>
                            {error}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>

                {/* Preview Button */}
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setShowPreview(true)}
                >
                  <Eye className="h-4 w-4" />
                  Preview Cover Page
                </Button>

                {/* Cover Page Preview Modal */}
                <Dialog open={showPreview} onOpenChange={setShowPreview}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Cover Page Preview</DialogTitle>
                    </DialogHeader>
                    <pre className="whitespace-pre-wrap font-mono text-xs bg-secondary/30 p-4 rounded-lg max-h-[500px] overflow-y-auto">
                      {generateCoverPage(factum)}
                    </pre>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <DialogFooter className="flex-row justify-between border-t pt-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              
              {currentStep === steps.length - 1 ? (
                <Button onClick={handleExport} disabled={!validation.valid}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Factum
                </Button>
              ) : (
                <Button onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Actions Card */}
      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Gavel className="h-5 w-5 text-primary" />
            Factum Builder
          </CardTitle>
          <CardDescription>
            Create court-compliant factums with proper formatting for any Canadian court
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>All Canadian Courts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>McGill Citation Format</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Word Count Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Argument Templates</span>
            </div>
          </div>
          
          <Button className="w-full gap-2" onClick={() => setIsOpen(true)}>
            <PenLine className="h-4 w-4" />
            Start New Factum
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
