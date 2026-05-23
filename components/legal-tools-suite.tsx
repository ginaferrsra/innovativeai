'use client';

import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
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
  Calculator, Calendar, CheckSquare, Plus, Trash2, Download,
  Clock, DollarSign, AlertCircle, FileText, ChevronRight,
  ExternalLink, Info, CalendarDays, Scale, List,
} from 'lucide-react';
import {
  type CourtFee,
  type TimelineEvent,
  type ChecklistItem,
  type Checklist,
  COURT_FEES,
  LEGAL_CHECKLISTS,
  TIMELINE_CATEGORIES,
  LIMITATION_PERIODS,
  calculateFees,
  getFeesByProvince,
  sortTimelineEvents,
  generateTimelineNarrative,
  getChecklistById,
  getLimitationPeriods,
  calculateDeadline,
} from '@/lib/legal-tools';

export function LegalToolsSuite() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Legal Tools</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Calculators, checklists, and tools to help with your legal matters
          </p>
        </div>
      </div>

      <Tabs defaultValue="fees" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="fees" className="gap-2 py-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Fee Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2 py-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="checklists" className="gap-2 py-2">
            <CheckSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Checklists</span>
          </TabsTrigger>
          <TabsTrigger value="deadlines" className="gap-2 py-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Deadlines</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fees" className="mt-4">
          <FeeCalculator />
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <TimelineBuilder />
        </TabsContent>

        <TabsContent value="checklists" className="mt-4">
          <ChecklistManager />
        </TabsContent>

        <TabsContent value="deadlines" className="mt-4">
          <DeadlineCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================
// FEE CALCULATOR COMPONENT
// ============================================

function FeeCalculator() {
  const [selectedProvince, setSelectedProvince] = useState('ON');
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedFees, setSelectedFees] = useState<string[]>([]);

  const feeSchedules = useMemo(() => getFeesByProvince(selectedProvince), [selectedProvince]);
  const currentSchedule = useMemo(
    () => feeSchedules.find(s => s.court === selectedCourt),
    [feeSchedules, selectedCourt]
  );

  const { fees, total } = useMemo(
    () => calculateFees(selectedFees),
    [selectedFees]
  );

  const toggleFee = useCallback((feeId: string) => {
    setSelectedFees(prev => 
      prev.includes(feeId) 
        ? prev.filter(id => id !== feeId)
        : [...prev, feeId]
    );
  }, []);

  const provinces = [...new Set(COURT_FEES.map(f => f.province))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Court Fee Calculator
          </CardTitle>
          <CardDescription>
            Calculate filing fees for Canadian courts. Fees are subject to change - verify with the court before filing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Province/Territory</label>
              <Select value={selectedProvince} onValueChange={(v) => { setSelectedProvince(v); setSelectedCourt(''); setSelectedFees([]); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map(p => (
                    <SelectItem key={p} value={p}>
                      {p === 'FED' ? 'Federal' : p === 'ON' ? 'Ontario' : p === 'BC' ? 'British Columbia' : p === 'AB' ? 'Alberta' : p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Court</label>
              <Select value={selectedCourt} onValueChange={(v) => { setSelectedCourt(v); setSelectedFees([]); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select court" />
                </SelectTrigger>
                <SelectContent>
                  {feeSchedules.map(s => (
                    <SelectItem key={s.court} value={s.court}>{s.court}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {currentSchedule && (
            <>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Select Fees</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {currentSchedule.fees.map(fee => (
                    <div
                      key={fee.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                        selectedFees.includes(fee.id) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => toggleFee(fee.id)}
                    >
                      <Checkbox checked={selectedFees.includes(fee.id)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">{fee.name}</p>
                          <p className="text-sm font-bold text-primary">${fee.amount}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{fee.description}</p>
                        {fee.notes && (
                          <p className="text-xs text-amber-600 mt-1">{fee.notes}</p>
                        )}
                        {fee.waiverAvailable && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Fee waiver available
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {currentSchedule.feeWaiverUrl && (
                <a
                  href={currentSchedule.feeWaiverUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Info className="h-4 w-4" />
                  Apply for fee waiver
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Fee Summary */}
      {selectedFees.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Fee Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {fees.map(fee => (
                <div key={fee.id} className="flex justify-between text-sm">
                  <span>{fee.name}</span>
                  <span className="font-medium">${fee.amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================
// TIMELINE BUILDER COMPONENT
// ============================================

function TimelineBuilder() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    category: 'other',
    importance: 'supporting',
  });

  const sortedEvents = useMemo(() => sortTimelineEvents(events), [events]);
  const narrative = useMemo(() => generateTimelineNarrative(events), [events]);

  const addEvent = useCallback(() => {
    if (newEvent.date && newEvent.title && newEvent.description) {
      setEvents(prev => [...prev, {
        id: `event-${Date.now()}`,
        date: newEvent.date!,
        title: newEvent.title!,
        description: newEvent.description!,
        category: newEvent.category as TimelineEvent['category'],
        importance: newEvent.importance as TimelineEvent['importance'],
      }]);
      setNewEvent({ category: 'other', importance: 'supporting' });
      setIsAddingEvent(false);
    }
  }, [newEvent]);

  const removeEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const exportTimeline = useCallback(() => {
    const text = `CHRONOLOGY OF EVENTS\n${'='.repeat(50)}\n\n${narrative}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'case-timeline.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [narrative]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Case Timeline Builder
              </CardTitle>
              <CardDescription>
                Create a chronological timeline of events for your case
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Timeline Event</DialogTitle>
                    <DialogDescription>
                      Add a significant event to your case timeline
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Input
                          type="date"
                          value={newEvent.date || ''}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select
                          value={newEvent.category}
                          onValueChange={(v) => setNewEvent(prev => ({ ...prev, category: v as TimelineEvent['category'] }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIMELINE_CATEGORIES.map(cat => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        placeholder="Brief title for this event"
                        value={newEvent.title || ''}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <textarea
                        className="w-full min-h-[100px] p-3 text-sm border rounded-lg bg-background resize-y"
                        placeholder="Detailed description of what happened..."
                        value={newEvent.description || ''}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Importance</label>
                      <Select
                        value={newEvent.importance}
                        onValueChange={(v) => setNewEvent(prev => ({ ...prev, importance: v as TimelineEvent['importance'] }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="important">Important</SelectItem>
                          <SelectItem value="supporting">Supporting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingEvent(false)}>Cancel</Button>
                    <Button onClick={addEvent}>Add Event</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {events.length > 0 && (
                <Button variant="outline" size="sm" onClick={exportTimeline} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedEvents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No events yet. Add your first event to start building your timeline.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedEvents.map((event, index) => {
                const category = TIMELINE_CATEGORIES.find(c => c.id === event.category);
                return (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${category?.color || 'bg-gray-500'}`} />
                      {index < sortedEvents.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <Card className="flex-1 mb-2">
                      <CardContent className="py-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">
                                {new Date(event.date).toLocaleDateString('en-CA')}
                              </Badge>
                              <Badge variant="outline" className="text-xs capitalize">
                                {event.category}
                              </Badge>
                              {event.importance === 'critical' && (
                                <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                                  Critical
                                </Badge>
                              )}
                            </div>
                            <p className="font-medium text-sm">{event.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// CHECKLIST MANAGER COMPONENT
// ============================================

function ChecklistManager() {
  const [selectedChecklist, setSelectedChecklist] = useState<string | null>(null);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});

  const currentChecklist = useMemo(
    () => selectedChecklist ? getChecklistById(selectedChecklist) : null,
    [selectedChecklist]
  );

  const progress = useMemo(() => {
    if (!currentChecklist) return 0;
    const completed = currentChecklist.items.filter(item => checklistState[item.id]).length;
    return Math.round((completed / currentChecklist.items.length) * 100);
  }, [currentChecklist, checklistState]);

  const toggleItem = useCallback((itemId: string) => {
    setChecklistState(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }, []);

  const categories = [...new Set(LEGAL_CHECKLISTS.map(c => c.category))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            Legal Checklists
          </CardTitle>
          <CardDescription>
            Step-by-step checklists for common legal procedures
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedChecklist ? (
            <div className="grid gap-4 md:grid-cols-2">
              {LEGAL_CHECKLISTS.map(checklist => (
                <Card
                  key={checklist.id}
                  className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all"
                  onClick={() => setSelectedChecklist(checklist.id)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge variant="outline" className="text-xs capitalize mb-2">
                          {checklist.category.replace('_', ' ')}
                        </Badge>
                        <p className="font-medium text-sm">{checklist.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{checklist.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {checklist.items.length} items
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : currentChecklist && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => setSelectedChecklist(null)}>
                  Back to all checklists
                </Button>
                <Badge variant="secondary">{progress}% Complete</Badge>
              </div>

              <div>
                <h3 className="font-semibold">{currentChecklist.title}</h3>
                <p className="text-sm text-muted-foreground">{currentChecklist.description}</p>
              </div>

              <Progress value={progress} className="h-2" />

              <div className="space-y-2">
                {currentChecklist.items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                      checklistState[item.id]
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20'
                        : 'hover:bg-secondary/50'
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <Checkbox checked={checklistState[item.id] || false} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{index + 1}.</span>
                        <p className={`text-sm ${checklistState[item.id] ? 'line-through text-muted-foreground' : ''}`}>
                          {item.text}
                        </p>
                        {item.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                      </div>
                      {item.notes && (
                        <p className="text-xs text-amber-600 mt-1">{item.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// DEADLINE CALCULATOR COMPONENT
// ============================================

function DeadlineCalculator() {
  const [selectedProvince, setSelectedProvince] = useState('ON');
  const [discoveryDate, setDiscoveryDate] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const limitations = useMemo(() => getLimitationPeriods(selectedProvince), [selectedProvince]);
  
  const selectedLimitation = useMemo(
    () => limitations.find(l => l.type === selectedType),
    [limitations, selectedType]
  );

  const deadline = useMemo(() => {
    if (!discoveryDate || !selectedLimitation) return null;
    const period = selectedLimitation.period;
    if (period === 'No limitation') return 'No limitation period';
    
    const years = parseInt(period);
    const days = period.includes('days') ? parseInt(period) : 0;
    
    if (years) {
      return calculateDeadline(new Date(discoveryDate), years);
    }
    if (days) {
      const date = new Date(discoveryDate);
      date.setDate(date.getDate() + days);
      return date;
    }
    return null;
  }, [discoveryDate, selectedLimitation]);

  const provinces = [...new Set(LIMITATION_PERIODS.map(l => l.province))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Limitation Period Calculator
          </CardTitle>
          <CardDescription>
            Calculate the deadline to start legal proceedings. Limitation periods vary by claim type and jurisdiction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-900/20 dark:border-amber-800">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium">Important</p>
                <p>This calculator provides general information only. Limitation periods can be complex with many exceptions. Consult a lawyer to determine your specific deadline.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Province</label>
              <Select value={selectedProvince} onValueChange={(v) => { setSelectedProvince(v); setSelectedType(''); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map(p => (
                    <SelectItem key={p} value={p}>
                      {p === 'FED' ? 'Federal' : p === 'ON' ? 'Ontario' : p === 'BC' ? 'British Columbia' : p === 'AB' ? 'Alberta' : p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Claim Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select claim type" />
                </SelectTrigger>
                <SelectContent>
                  {limitations.map(l => (
                    <SelectItem key={l.type} value={l.type}>{l.type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Discovery</label>
              <Input
                type="date"
                value={discoveryDate}
                onChange={(e) => setDiscoveryDate(e.target.value)}
              />
            </div>
          </div>

          {selectedLimitation && (
            <Card className="bg-secondary/30">
              <CardContent className="pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Limitation Period</p>
                    <p className="text-lg font-bold text-primary">{selectedLimitation.period}</p>
                    <p className="text-xs text-muted-foreground mt-1">{selectedLimitation.statute}</p>
                    {selectedLimitation.notes && (
                      <p className="text-xs text-amber-600 mt-1">{selectedLimitation.notes}</p>
                    )}
                  </div>
                  {deadline && deadline !== 'No limitation period' && (
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline to File</p>
                      <p className="text-lg font-bold text-destructive">
                        {deadline instanceof Date 
                          ? deadline.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
                          : deadline
                        }
                      </p>
                    </div>
                  )}
                  {deadline === 'No limitation period' && (
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="text-lg font-bold text-green-600">No Limitation</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reference Table */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Quick Reference</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left p-2">Claim Type</th>
                    <th className="text-left p-2">Period</th>
                    <th className="text-left p-2 hidden md:table-cell">Statute</th>
                  </tr>
                </thead>
                <tbody>
                  {limitations.map((l, idx) => (
                    <tr key={l.type} className={idx % 2 === 0 ? 'bg-background' : 'bg-secondary/20'}>
                      <td className="p-2">{l.type}</td>
                      <td className="p-2 font-medium">{l.period}</td>
                      <td className="p-2 text-muted-foreground hidden md:table-cell">{l.statute}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
