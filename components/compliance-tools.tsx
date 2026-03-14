'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Crosshair, Shield, Clock, Copy, CheckCircle2, AlertTriangle,
  Bell, BookOpen, Calendar, FileText, Scale,
} from 'lucide-react';

// ─── Firearm Classification Calculator ──────────────────────────────────────
type Classification = 'non-restricted' | 'restricted' | 'prohibited' | 'unknown';

interface ClassificationResult {
  classification: Classification;
  reasoning: string[];
  statutes: string[];
  confidence: number;
}

function classifyFirearm(
  barrelLength: number,
  overallLength: number,
  actionType: string,
  caliber: string,
): ClassificationResult {
  const reasons: string[] = [];
  const statutes: string[] = ['Firearms Act, S.C. 1995, c. 39', 'Criminal Code, R.S.C. 1985, c. C-46, ss. 84(1)'];

  // Prohibited checks first
  if (actionType === 'full_auto') {
    reasons.push('Fully automatic firearms are prohibited under s. 84(1) of the Criminal Code.');
    statutes.push('SOR/98-462 (Regulations Prescribing Certain Firearms)');
    return { classification: 'prohibited', reasoning: reasons, statutes, confidence: 0.98 };
  }
  if (barrelLength > 0 && barrelLength < 105 && actionType === 'handgun') {
    reasons.push(`Barrel length (${barrelLength}mm) is less than 105mm for a handgun -- prohibited under s. 84(1).`);
    statutes.push('Criminal Code s. 84(1) definition of "prohibited firearm"');
    return { classification: 'prohibited', reasoning: reasons, statutes, confidence: 0.96 };
  }
  if (overallLength > 0 && overallLength < 660 && actionType !== 'handgun') {
    reasons.push(`Overall length (${overallLength}mm) is less than 660mm -- may be prohibited as a sawed-off firearm.`);
    statutes.push('Criminal Code s. 84(1)');
    return { classification: 'prohibited', reasoning: reasons, statutes, confidence: 0.92 };
  }

  // Restricted checks
  if (actionType === 'handgun') {
    reasons.push('Handguns with barrel length >= 105mm are classified as restricted.');
    reasons.push(`Barrel length: ${barrelLength}mm meets the 105mm minimum threshold.`);
    statutes.push('Criminal Code s. 84(1) definition of "restricted firearm"');
    return { classification: 'restricted', reasoning: reasons, statutes, confidence: 0.95 };
  }
  if (actionType === 'semi_auto' && overallLength > 0 && overallLength < 660) {
    reasons.push('Semi-automatic firearm with overall length < 660mm is restricted.');
    return { classification: 'restricted', reasoning: reasons, statutes, confidence: 0.93 };
  }
  if (barrelLength > 0 && barrelLength < 470 && actionType !== 'handgun') {
    reasons.push(`Non-handgun with barrel length (${barrelLength}mm) < 470mm is restricted.`);
    statutes.push('Criminal Code s. 84(1)');
    return { classification: 'restricted', reasoning: reasons, statutes, confidence: 0.94 };
  }

  // Non-restricted
  if (barrelLength >= 470 && overallLength >= 660) {
    reasons.push(`Barrel length (${barrelLength}mm) >= 470mm and overall length (${overallLength}mm) >= 660mm.`);
    reasons.push('Firearm meets non-restricted classification criteria.');
    statutes.push('Firearms Act, s. 2, definition of "non-restricted firearm"');
    return { classification: 'non-restricted', reasoning: reasons, statutes, confidence: 0.95 };
  }

  reasons.push('Insufficient data for definitive classification. Please verify all dimensions.');
  return { classification: 'unknown', reasoning: reasons, statutes, confidence: 0.4 };
}

const classColors: Record<Classification, string> = {
  'non-restricted': 'bg-green-100 text-green-800 border-green-300',
  restricted: 'bg-amber-100 text-amber-800 border-amber-300',
  prohibited: 'bg-red-100 text-red-800 border-red-300',
  unknown: 'bg-muted text-muted-foreground border-border',
};

export function FirearmClassificationCalculator() {
  const [barrelLength, setBarrelLength] = useState('');
  const [overallLength, setOverallLength] = useState('');
  const [actionType, setActionType] = useState('');
  const [caliber, setCaliber] = useState('');
  const [result, setResult] = useState<ClassificationResult | null>(null);

  const calculate = () => {
    const res = classifyFirearm(
      Number.parseFloat(barrelLength) || 0,
      Number.parseFloat(overallLength) || 0,
      actionType,
      caliber,
    );
    setResult(res);
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Crosshair className="h-4 w-4 text-primary" />
          Firearm Classification Calculator
        </CardTitle>
        <CardDescription className="text-xs">
          Input weapon specifications to determine classification under the Firearms Act and Criminal Code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Barrel Length (mm)</label>
            <Input
              type="number"
              placeholder="e.g. 470"
              value={barrelLength}
              onChange={(e) => setBarrelLength(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Overall Length (mm)</label>
            <Input
              type="number"
              placeholder="e.g. 1000"
              value={overallLength}
              onChange={(e) => setOverallLength(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Action Type</label>
            <Select value={actionType} onValueChange={setActionType}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bolt_action">Bolt Action</SelectItem>
                <SelectItem value="lever_action">Lever Action</SelectItem>
                <SelectItem value="pump_action">Pump Action</SelectItem>
                <SelectItem value="semi_auto">Semi-Automatic</SelectItem>
                <SelectItem value="full_auto">Full Automatic</SelectItem>
                <SelectItem value="handgun">Handgun</SelectItem>
                <SelectItem value="break_action">Break Action</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Caliber</label>
            <Input
              placeholder="e.g. 9mm, .308"
              value={caliber}
              onChange={(e) => setCaliber(e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full h-9 text-sm" disabled={!actionType}>
          <Scale className="w-3.5 h-3.5 mr-2" />
          Classify Firearm
        </Button>

        {result && (
          <div className="space-y-3 pt-3 border-t border-border/60 animate-fade-in">
            <div className="flex items-center justify-between">
              <Badge className={`${classColors[result.classification]} border text-sm px-3 py-1 capitalize`}>
                {result.classification.replace('-', ' ')}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Confidence: {(result.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <Progress value={result.confidence * 100} className="h-1.5" />

            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Analysis:</p>
              {result.reasoning.map((r, i) => (
                <p key={i} className="text-xs text-muted-foreground flex gap-2">
                  <span className="text-primary flex-shrink-0">-</span> {r}
                </p>
              ))}
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-foreground">Applicable Statutes:</p>
              {result.statutes.map((s, i) => (
                <p key={i} className="text-[11px] text-muted-foreground font-mono">{s}</p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── PAL License Expiry & Renewal Alerts ────────────────────────────────────
interface LicenseEntry {
  id: string;
  type: 'PAL' | 'RPAL' | 'POL';
  licenseNumber: string;
  holderName: string;
  issuedDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring_soon' | 'expired' | 'suspended';
}

const MOCK_LICENSES: LicenseEntry[] = [
  { id: '1', type: 'PAL', licenseNumber: 'PAL-2021-44819', holderName: 'John Mitchell', issuedDate: '2021-03-15', expiryDate: '2026-03-15', status: 'valid' },
  { id: '2', type: 'RPAL', licenseNumber: 'RPAL-2020-33127', holderName: 'Sarah Chen', issuedDate: '2020-06-22', expiryDate: '2025-06-22', status: 'expired' },
  { id: '3', type: 'PAL', licenseNumber: 'PAL-2022-51204', holderName: 'Robert Tremblay', issuedDate: '2022-11-10', expiryDate: '2027-11-10', status: 'valid' },
  { id: '4', type: 'RPAL', licenseNumber: 'RPAL-2021-47832', holderName: 'Emily Wong', issuedDate: '2021-08-05', expiryDate: '2026-08-05', status: 'expiring_soon' },
];

const licenseStatusColors: Record<string, string> = {
  valid: 'bg-green-100 text-green-800 border-green-300',
  expiring_soon: 'bg-amber-100 text-amber-800 border-amber-300',
  expired: 'bg-red-100 text-red-800 border-red-300',
  suspended: 'bg-muted text-muted-foreground border-border',
};

function getDaysUntilExpiry(expiryDate: string): number {
  const now = new Date();
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function PALAlertsDashboard() {
  const [licenses] = useState<LicenseEntry[]>(MOCK_LICENSES);

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4 text-primary" />
          PAL Expiry & Renewal Tracker
        </CardTitle>
        <CardDescription className="text-xs">
          Track Possession and Acquisition License expiry dates with automated reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {licenses.map((lic) => {
          const days = getDaysUntilExpiry(lic.expiryDate);
          const pct = Math.max(0, Math.min(100, (days / (365 * 5)) * 100));
          return (
            <div key={lic.id} className="p-3 rounded-lg border border-border/60 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{lic.holderName}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">{lic.licenseNumber}</p>
                </div>
                <Badge className={`${licenseStatusColors[lic.status]} border text-[10px] capitalize`}>
                  {lic.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-[10px]">{lic.type}</Badge>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Expires: {new Date(lic.expiryDate).toLocaleDateString()}
                </span>
                <span className={`text-[11px] font-medium ${days < 0 ? 'text-red-600' : days < 180 ? 'text-amber-600' : 'text-green-600'}`}>
                  {days < 0 ? `${Math.abs(days)} days overdue` : `${days} days remaining`}
                </span>
              </div>
              <Progress value={pct} className="h-1" />
              {days < 180 && days >= 0 && (
                <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
                  <AlertTriangle className="w-3 h-3" />
                  Renewal recommended -- submit form to your CFO at least 6 months before expiry
                </div>
              )}
              {days < 0 && (
                <div className="flex items-center gap-1.5 text-xs text-red-700 bg-red-50 rounded px-2 py-1">
                  <AlertTriangle className="w-3 h-3" />
                  LICENSE EXPIRED -- Possession without valid license is an offence under s. 91 Criminal Code
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ─── Automated Citation Generator ───────────────────────────────────────────
type CitationFormat = 'mcgill' | 'bluebook';

interface GeneratedCitation {
  formatted: string;
  format: CitationFormat;
  type: 'case' | 'statute';
}

function generateCitation(
  input: string,
  format: CitationFormat,
  type: 'case' | 'statute',
): GeneratedCitation {
  const trimmed = input.trim();

  if (type === 'case') {
    if (format === 'mcgill') {
      // McGill Guide: R v Grant, 2009 SCC 32 at para 71.
      const cleaned = trimmed.replace(/\./g, '').replace(/\bvs?\b/gi, 'v');
      return { formatted: `${cleaned}.`, format, type };
    }
    // Bluebook: R. v. Grant, [2009] S.C.C. 32.
    const cleaned = trimmed.replace(/\bv\b/g, 'v.');
    return { formatted: `${cleaned}.`, format, type };
  }

  // Statute
  if (format === 'mcgill') {
    return { formatted: `${trimmed}.`, format, type };
  }
  return { formatted: `${trimmed}.`, format, type };
}

export function CitationGenerator() {
  const [input, setInput] = useState('');
  const [format, setFormat] = useState<CitationFormat>('mcgill');
  const [type, setType] = useState<'case' | 'statute'>('case');
  const [citation, setCitation] = useState<GeneratedCitation | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!input.trim()) return;
    setCitation(generateCitation(input, format, type));
  };

  const copyToClipboard = () => {
    if (!citation) return;
    navigator.clipboard.writeText(citation.formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="h-4 w-4 text-primary" />
          Automated Citation Generator
        </CardTitle>
        <CardDescription className="text-xs">
          Generate McGill Guide or Bluebook citations for cases and statutes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Format</label>
            <Select value={format} onValueChange={(v: CitationFormat) => setFormat(v)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mcgill">McGill Guide (Canadian)</SelectItem>
                <SelectItem value="bluebook">Bluebook</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Type</label>
            <Select value={type} onValueChange={(v: 'case' | 'statute') => setType(v)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="case">Case Law</SelectItem>
                <SelectItem value="statute">Statute</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            {type === 'case' ? 'Case Name & Citation' : 'Statute Title & Reference'}
          </label>
          <Input
            placeholder={type === 'case' ? 'e.g. R v Grant, 2009 SCC 32' : 'e.g. Criminal Code, RSC 1985, c C-46, s 91'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-9 font-mono text-sm"
          />
        </div>

        <Button onClick={generate} className="w-full h-9 text-sm" disabled={!input.trim()}>
          Generate Citation
        </Button>

        {citation && (
          <div className="space-y-2 pt-3 border-t border-border/60 animate-fade-in">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-[10px] uppercase">{citation.format}</Badge>
              <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-7 gap-1.5 text-xs">
                {copied ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <div className="p-3 bg-secondary/50 rounded-md border border-border/50">
              <p className="text-sm font-mono text-foreground">{citation.formatted}</p>
            </div>
          </div>
        )}

        {/* Quick Examples */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium text-muted-foreground">Quick examples:</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { text: 'R v Grant, 2009 SCC 32', t: 'case' as const },
              { text: 'R v Jordan, 2016 SCC 27', t: 'case' as const },
              { text: 'Criminal Code, RSC 1985, c C-46', t: 'statute' as const },
              { text: 'Firearms Act, SC 1995, c 39', t: 'statute' as const },
            ].map((ex) => (
              <button
                key={ex.text}
                type="button"
                onClick={() => { setInput(ex.text); setType(ex.t); }}
                className="text-[11px] px-2 py-1 rounded bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {ex.text}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Combined Compliance Tools Panel ────────────────────────────────────────
export function ComplianceToolsPanel() {
  return (
    <Tabs defaultValue="classifier" className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-9">
        <TabsTrigger value="classifier" className="text-xs gap-1.5">
          <Crosshair className="w-3 h-3" />
          Classifier
        </TabsTrigger>
        <TabsTrigger value="pal" className="text-xs gap-1.5">
          <Bell className="w-3 h-3" />
          PAL Alerts
        </TabsTrigger>
        <TabsTrigger value="citations" className="text-xs gap-1.5">
          <BookOpen className="w-3 h-3" />
          Citations
        </TabsTrigger>
      </TabsList>
      <TabsContent value="classifier" className="mt-4">
        <FirearmClassificationCalculator />
      </TabsContent>
      <TabsContent value="pal" className="mt-4">
        <PALAlertsDashboard />
      </TabsContent>
      <TabsContent value="citations" className="mt-4">
        <CitationGenerator />
      </TabsContent>
    </Tabs>
  );
}
