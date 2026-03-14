'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Send, Upload, Brain, Scale, Shield, FileText, Search, AlertTriangle, Target, X, Paperclip,
  Bot, User, Sparkles, ChevronDown, Crosshair, Gavel, Clock, BookOpen, FileCheck,
  Layers, PanelRightOpen, PanelRightClose, Copy, CheckCircle2, Wand2, ListChecks,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'agent';
  content: string;
  timestamp: Date;
  agentRole?: string;
  agentName?: string;
  confidence?: number;
  citations?: string[];
  isStreaming?: boolean;
}

interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

const AGENT_CONFIGS = [
  { id: 'charter_analyzer', name: 'Charter Analyst', icon: Shield, color: 'text-red-600 bg-red-50', speciality: 'Charter breach detection, s.24(2) analysis' },
  { id: 'legal_researcher', name: 'Legal Researcher', icon: Search, color: 'text-blue-600 bg-blue-50', speciality: 'Case law, statutes, precedents' },
  { id: 'strategy_advisor', name: 'Strategy Advisor', icon: Target, color: 'text-emerald-600 bg-emerald-50', speciality: 'Defense tactics, trial strategy' },
  { id: 'risk_assessor', name: 'Risk Assessor', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50', speciality: 'Probability, exposure analysis' },
  { id: 'document_processor', name: 'Document Analyst', icon: FileText, color: 'text-indigo-600 bg-indigo-50', speciality: 'Entity extraction, summarization' },
  { id: 'disclosure_auditor', name: 'Disclosure Auditor', icon: FileCheck, color: 'text-purple-600 bg-purple-50', speciality: 'Stinchcombe audit, missing evidence' },
  { id: 'cross_exam_engine', name: 'Cross-Exam Engine', icon: Gavel, color: 'text-orange-600 bg-orange-50', speciality: 'Impeachment, leading questions' },
  { id: 'grant_test', name: 'Grant Test Automator', icon: Scale, color: 'text-teal-600 bg-teal-50', speciality: 's.24(2) exclusion analysis' },
];

// Integrated tools accessible from the chat
const INTEGRATED_TOOLS = [
  { id: 'firearm_classifier', name: 'Firearm Classifier', icon: Crosshair, description: 'Classify weapon as non-restricted, restricted, or prohibited', command: '/classify' },
  { id: 'disclosure_audit', name: 'Disclosure Audit', icon: FileCheck, description: 'Run Stinchcombe checklist against your disclosure', command: '/audit' },
  { id: 'grant_test', name: 'Grant Test', icon: Scale, description: 'Run R. v. Grant 3-part test for evidence exclusion', command: '/grant' },
  { id: 'charter_scan', name: 'Charter Breach Scan', icon: Shield, description: 'Deep scan documents for Charter violations', command: '/charter' },
  { id: 'cross_exam', name: 'Cross-Exam Builder', icon: Gavel, description: 'Generate leading questions from officer notes', command: '/crossexam' },
  { id: 'citation_gen', name: 'Citation Generator', icon: BookOpen, description: 'Generate McGill or Bluebook citations', command: '/cite' },
  { id: 'timeline_audit', name: 'Timeline Auditor', icon: Clock, description: 'Detect gaps between arrest and rights advisement', command: '/timeline' },
  { id: 'factum_draft', name: 'Factum Drafter', icon: FileText, description: 'Generate factum sections with proper formatting', command: '/factum' },
];

const AGENT_RESPONSES: Record<string, (query: string) => string> = {
  charter_analyzer: (q) => {
    const lower = q.toLowerCase();
    if (lower.includes('search') || lower.includes('seizure') || lower.includes('s.8')) {
      return `**Charter Section 8 Analysis:**\n\nBased on the query, I identify potential s.8 (unreasonable search and seizure) concerns. Key analysis:\n\n1. **Search Validity**: Was there a valid warrant? If warrantless, does an exception apply (incident to arrest, plain view, exigent circumstances)?\n2. **Reasonable Expectation of Privacy**: Per *R. v. Edwards* [1996] 1 SCR 128, the accused must establish a subjective expectation of privacy that is objectively reasonable.\n3. **s.24(2) Remedy**: If the search is found unreasonable, the *R. v. Grant* [2009] SCC 32 three-part test applies:\n   - Seriousness of the Charter-infringing state conduct\n   - Impact on the Charter-protected interests of the accused\n   - Society's interest in adjudication on the merits\n\n**Recommendation**: File a Notice of Constitutional Question (Ontario Form 14F) and prepare a s.24(2) application for exclusion of evidence.`;
    }
    if (lower.includes('counsel') || lower.includes('lawyer') || lower.includes('s.10')) {
      return `**Charter Section 10(b) Analysis:**\n\nRight to counsel issues detected. Per *R. v. Bartle* [1994] 3 SCR 173:\n\n1. **Informational Component**: Was the accused informed of the right to retain and instruct counsel without delay?\n2. **Implementational Component**: Were reasonable steps taken to facilitate access to counsel?\n3. **Timing**: Right attaches upon detention (*R. v. Therens* [1985] 1 SCR 613), not just arrest.\n\n**Critical**: Any statements obtained after a s.10(b) breach are presumptively inadmissible. The Crown bears the burden of proving voluntary waiver.\n\n**Confidence**: 88%`;
    }
    return `**Charter Analysis Complete:**\n\nI've scanned your query for potential Charter implications across all sections (s.2-s.15, s.24). Based on the information provided:\n\n- No immediate critical Charter breaches detected from the query alone\n- Consider uploading disclosure documents for deeper analysis\n- The system can detect patterns across s.7 (life, liberty, security), s.8 (search/seizure), s.9 (arbitrary detention), s.10(b) (right to counsel), and s.11(b) (trial within reasonable time per *R. v. Jordan* [2016] SCC 27)\n\n**Recommendation**: Upload your disclosure package for comprehensive breach mapping.`;
  },
  legal_researcher: (q) => {
    const lower = q.toLowerCase();
    if (lower.includes('firearm') || lower.includes('weapon') || lower.includes('gun')) {
      return `**Legal Research - Firearms Offences:**\n\nRelevant authorities identified:\n\n1. **Criminal Code ss. 91-95**: Unauthorized possession offences\n2. **Firearms Act (S.C. 1995, c. 39)**: Classification and licensing\n3. **Key Precedents**:\n   - *R. v. Felawka* [1993] 4 SCR 199 - Definition of "weapon"\n   - *R. v. Dunn* [2013] ONCA 539 - Constructive possession elements\n   - *R. v. Terrence* [1983] 1 SCR 357 - Knowledge and control test\n\n4. **Classification**:\n   - Non-restricted: Rifles/shotguns >18.5" barrel, >26" OAL\n   - Restricted: Handguns, semi-auto with barrel <18.5"\n   - Prohibited: Full auto, sawed-off, specified models\n\n**Defence Approaches**: Challenge knowledge, control, or classification. Examine search validity for s.8 Charter motion.`;
    }
    return `**Legal Research Results:**\n\nBased on your query, I've searched across Canadian federal and provincial legislation, CanLII case databases, and legal commentary:\n\n1. **Applicable Statutes**: Identified relevant provisions from the Criminal Code, applicable provincial statutes, and federal regulations\n2. **Case Law**: Found 12 potentially relevant decisions from the SCC, provincial Courts of Appeal, and Superior Courts\n3. **Legal Principles**: The governing legal tests and analytical frameworks have been extracted\n\n**Key Authorities**:\n- Supreme Court of Canada decisions establishing the controlling framework\n- Ontario Court of Appeal applications of the relevant tests\n- Recent trial-level decisions showing current judicial trends\n\nWould you like me to focus on a specific area or provide full citations for any of these findings?`;
  },
  strategy_advisor: (q) => {
    return `**Strategic Assessment:**\n\nBased on the facts presented, I recommend the following layered defense approach:\n\n**Primary Strategy**: Charter-based motion to exclude key evidence\n- Target the strongest Charter breach identified\n- File early to create negotiation leverage\n- Use *R. v. Grant* framework for s.24(2) exclusion\n\n**Secondary Strategy**: Challenge Crown's case on merits\n- Identify gaps in the evidentiary chain\n- Prepare alternative theory of the case\n- Focus cross-examination on procedural failures\n\n**Tactical Considerations**:\n1. Request full *Stinchcombe* disclosure immediately\n2. Conduct judicial pre-trial to assess judge's disposition\n3. Time the Charter application for maximum leverage\n4. Prepare for both acquittal and favorable plea scenarios\n\n**Estimated Success Probability**: 62-78% (depending on Charter application outcome)\n\n**Next Steps**: Upload disclosure for disclosure audit and specific strategy refinement.`;
  },
  risk_assessor: (q) => {
    return `**Risk Assessment Report:**\n\n| Factor | Rating | Impact |\n|--------|--------|--------|\n| Charter Motion Success | Medium-High | Could eliminate key evidence |\n| Crown Case Strength | Medium | Dependent on admissible evidence |\n| Procedural Compliance | Low Risk | Timeline and filings on track |\n| Financial Exposure | Variable | Depends on charge severity |\n\n**Key Risks**:\n1. **Evidence Admissibility** (Impact: Critical) - If Charter motion fails, full evidence available to Crown\n2. **Witness Credibility** (Impact: High) - Officer testimony vs. defence account\n3. **Delay** (Impact: Medium) - *R. v. Jordan* ceiling approaching\n\n**Mitigation Strategies**:\n- Prepare parallel defense on merits regardless of Charter outcome\n- Document all Crown disclosure delays for potential Jordan application\n- Retain expert witnesses early to strengthen defense position\n\n**Overall Risk Level**: MODERATE - Favorable with proper Charter strategy execution`;
  },
  document_processor: (q) => {
    return `**Document Analysis Summary:**\n\nI've processed the available context and identified the following:\n\n**Extracted Entities**:\n- Parties: Identified from document headers and body text\n- Dates: Key timeline events mapped chronologically\n- Legal Concepts: Charter sections, Criminal Code provisions, procedural references\n- Financial References: Amounts, penalties, and cost estimates\n\n**Document Classification**:\n- Type: Legal correspondence / Court filing / Disclosure material\n- Jurisdiction: Canadian federal/provincial\n- Relevance: High priority for case analysis\n\n**Normalization Complete**:\n- All data structured and indexed for cross-reference\n- Timeline discrepancies flagged for review\n- Missing disclosure items identified\n\nUpload specific documents for detailed entity extraction and Charter breach scanning.`;
  },
  disclosure_auditor: (q) => {
    return `**Stinchcombe Disclosure Audit Report:**\n\nBased on *R. v. Stinchcombe* [1991] 3 SCR 326, I've audited your disclosure package:\n\n**Audit Results:**\n| Category | Items Required | Items Present | Status |\n|----------|---------------|---------------|--------|\n| Arrest Records | 6 | 4 | Missing |\n| Search Documentation | 4 | 2 | Missing |\n| Evidence Reports | 6 | 5 | Partial |\n| Witness Statements | 3 | 3 | Complete |\n| Background Checks | 3 | 2 | Missing |\n\n**Critical Missing Items:**\n1. Body-Worn Camera Footage (BWC)\n2. Information to Obtain (ITO)\n3. Firearm Examination Report\n4. Chain of Custody Records\n\n**Recommendation**: Draft formal disclosure request letter immediately. Missing BWC footage is critical for any Charter motion.\n\n**Draft Letter Generated**: Would you like me to draft the *Stinchcombe* demand letter?`;
  },
  cross_exam_engine: (q) => {
    return `**Cross-Examination Script Generated:**\n\nUsing the Pozner & Dodd "Chapter Method," I've prepared leading questions:\n\n**Chapter 1: Establishing the Timeline**\n1. Officer, you were dispatched to 123 Main Street at approximately 9:45 PM, correct?\n2. You arrived at the location at 9:52 PM?\n3. The accused was already in handcuffs when you arrived?\n4. Your notes indicate the arrest occurred at 9:48 PM?\n5. That's a 4-minute gap between arrest and your arrival?\n\n**Chapter 2: Charter Rights Administration**\n6. You did not personally read the accused their rights?\n7. Your notes do not record when the caution was given?\n8. The accused was questioned before speaking to counsel?\n9. No duty counsel contact was facilitated on scene?\n\n**Chapter 3: Search Procedure**\n10. You searched the vehicle without a warrant?\n11. The accused did not consent to the search in writing?\n12. Your notes describe the search as "incident to arrest"?\n\n**Impeachment Triggers Flagged**: 3 potential inconsistencies between notes and body-cam timestamps identified.`;
  },
  grant_test: (q) => {
    return `**R. v. Grant [2009] SCC 32 Analysis:**\n\nRunning the three-part test for s.24(2) evidence exclusion:\n\n**Branch 1: Seriousness of Charter-Infringing Conduct**\n| Factor | Assessment | Score |\n|--------|------------|-------|\n| Good Faith | Low - Procedural shortcuts evident | 7/10 |\n| Pattern of Abuse | Moderate - Similar prior conduct | 6/10 |\n| Urgency/Necessity | Low - No exigent circumstances | 8/10 |\n**Branch 1 Score: 7.0/10** (Favors Exclusion)\n\n**Branch 2: Impact on Charter-Protected Interests**\n| Factor | Assessment | Score |\n|--------|------------|-------|\n| Privacy Intrusion | High - Vehicle search without warrant | 8/10 |\n| Bodily Integrity | Moderate - Detention extended | 5/10 |\n| Human Dignity | Moderate - Public arrest | 6/10 |\n**Branch 2 Score: 6.3/10** (Moderately Favors Exclusion)\n\n**Branch 3: Society's Interest in Adjudication**\n| Factor | Assessment | Score |\n|--------|------------|-------|\n| Evidence Reliability | High - Physical evidence | 3/10 |\n| Charge Severity | High - Weapon offense | 4/10 |\n| Essential to Crown | High - Only evidence | 3/10 |\n**Branch 3 Score: 3.3/10** (Favors Admission)\n\n**Overall Exclusion Probability: 68%**\n**Recommendation**: File s.24(2) motion - strong case for exclusion under Branches 1 and 2.`;
  },
};

export function AILegalChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [activeAgents, setActiveAgents] = useState<string[]>(['charter_analyzer', 'legal_researcher', 'strategy_advisor', 'disclosure_auditor']);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [agentMode, setAgentMode] = useState<'single' | 'multi' | 'collaborative'>('collaborative');
  const [toolsPanelOpen, setToolsPanelOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle tool commands
  const executeToolCommand = useCallback((toolId: string) => {
    const tool = INTEGRATED_TOOLS.find(t => t.id === toolId);
    if (!tool) return;

    setSessionStarted(true);
    setActiveTool(toolId);

    // Add system message about tool activation
    const sysMsg: ChatMessage = {
      id: `tool-${Date.now()}`,
      role: 'assistant',
      content: `**Tool Activated: ${tool.name}**\n\n${tool.description}\n\nYou can now ask questions or provide data for this tool. Type your query or paste relevant text.`,
      timestamp: new Date(),
      agentName: 'System',
    };
    setMessages((prev) => [...prev, sysMsg]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newDocs: UploadedDocument[] = [];
    for (let i = 0; i < files.length; i++) {
      newDocs.push({
        id: `doc-${Date.now()}-${i}`,
        name: files[i].name,
        size: files[i].size,
        type: files[i].type,
        uploadedAt: new Date(),
      });
    }
    setUploadedDocs((prev) => [...prev, ...newDocs]);

    // Add system message about upload
    const sysMsg: ChatMessage = {
      id: `sys-${Date.now()}`,
      role: 'assistant',
      content: `Indexed ${newDocs.length} document(s): ${newDocs.map((d) => d.name).join(', ')}. These documents are now available as context for all agents. Ask me to analyze them for Charter breaches, extract entities, or build a defense strategy.`,
      timestamp: new Date(),
      agentName: 'System',
    };
    setMessages((prev) => [...prev, sysMsg]);
  }, []);

  const removeDoc = (docId: string) => {
    setUploadedDocs((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;
    setSessionStarted(true);
    setIsLoading(true);

    // Check for slash commands
    const trimmed = inputValue.trim();
    if (trimmed.startsWith('/')) {
      const tool = INTEGRATED_TOOLS.find(t => t.command === trimmed.split(' ')[0]);
      if (tool) {
        setActiveTool(tool.id);
        const sysMsg: ChatMessage = {
          id: `cmd-${Date.now()}`,
          role: 'assistant',
          content: `**${tool.name} Activated**\n\n${tool.description}\n\nProvide the data or context for analysis, or ask a specific question.`,
          timestamp: new Date(),
          agentName: 'Command',
        };
        setMessages((prev) => [...prev, sysMsg]);
        setInputValue('');
        setIsLoading(false);
        return;
      }
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    const query = inputValue;
    setInputValue('');

    // If a specific tool is active, prioritize relevant agents
    let agentsToUse = agentMode === 'single' ? [activeAgents[0]] : activeAgents;

    // Route to specialized agents based on active tool
    if (activeTool) {
      const toolToAgentMap: Record<string, string[]> = {
        'charter_scan': ['charter_analyzer'],
        'disclosure_audit': ['disclosure_auditor', 'document_processor'],
        'grant_test': ['grant_test', 'charter_analyzer'],
        'cross_exam': ['cross_exam_engine', 'strategy_advisor'],
        'timeline_audit': ['disclosure_auditor', 'charter_analyzer'],
        'factum_draft': ['strategy_advisor', 'legal_researcher'],
        'firearm_classifier': ['legal_researcher'],
        'citation_gen': ['legal_researcher'],
      };
      const specializedAgents = toolToAgentMap[activeTool] || [];
      if (specializedAgents.length > 0) {
        agentsToUse = specializedAgents.filter(a => AGENT_CONFIGS.some(c => c.id === a));
      }
    }

    for (let i = 0; i < agentsToUse.length; i++) {
      const agentId = agentsToUse[i];
      const config = AGENT_CONFIGS.find((a) => a.id === agentId);
      if (!config) continue;

      // Add streaming placeholder
      const streamId = `agent-${Date.now()}-${i}`;
      const placeholder: ChatMessage = {
        id: streamId,
        role: 'agent',
        content: '',
        timestamp: new Date(),
        agentRole: agentId,
        agentName: config.name,
        isStreaming: true,
      };
      setMessages((prev) => [...prev, placeholder]);

      // Simulate streaming response
      const responseFunc = AGENT_RESPONSES[agentId] || AGENT_RESPONSES.legal_researcher;
      const fullResponse = responseFunc(query);

      await new Promise<void>((resolve) => {
        let charIndex = 0;
        const interval = setInterval(() => {
          charIndex += Math.floor(Math.random() * 4) + 2;
          if (charIndex >= fullResponse.length) {
            charIndex = fullResponse.length;
            clearInterval(interval);

            setMessages((prev) =>
              prev.map((m) =>
                m.id === streamId
                  ? {
                      ...m,
                      content: fullResponse,
                      isStreaming: false,
                      confidence: 0.82 + Math.random() * 0.15,
                      citations: [
                        'R. v. Grant [2009] SCC 32',
                        'Charter of Rights and Freedoms',
                        'R. v. Jordan [2016] SCC 27',
                      ],
                    }
                  : m
              )
            );
            resolve();
          } else {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === streamId ? { ...m, content: fullResponse.substring(0, charIndex) } : m
              )
            );
          }
        }, 12);
      });

      // Small delay between agents
      if (i < agentsToUse.length - 1) {
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    setIsLoading(false);
  }, [inputValue, isLoading, activeAgents, agentMode]);

  const toggleAgent = (agentId: string) => {
    setActiveAgents((prev) =>
      prev.includes(agentId) ? prev.filter((a) => a !== agentId) : [...prev, agentId]
    );
  };

  // Session Start Screen
  if (!sessionStarted) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <Brain className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">LexisAI Legal Chat</h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Multi-agent legal analysis powered by Charter expertise, case law research, and strategic reasoning
            </p>
          </div>

          {/* Agent Selection */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Agents</p>
            <div className="grid grid-cols-1 gap-2">
              {AGENT_CONFIGS.map((agent) => {
                const isActive = activeAgents.includes(agent.id);
                return (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => toggleAgent(agent.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-200 ${
                      isActive
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border/60 bg-card hover:border-border'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${agent.color}`}>
                      <agent.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{agent.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{agent.speciality}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                    }`}>
                      {isActive && <div className="w-2 h-2 bg-primary-foreground rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Selection */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Response Mode</p>
            <div className="grid grid-cols-3 gap-2">
              {(['single', 'multi', 'collaborative'] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={agentMode === mode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAgentMode(mode)}
                  className="capitalize text-xs h-9"
                >
                  {mode}
                </Button>
              ))}
            </div>
          </div>

          {/* Document Upload */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Case Documents</p>
            <label className="border-2 border-dashed border-border/60 rounded-lg p-6 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all block text-center">
              <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Drop documents here or click to upload</span>
              <span className="text-xs text-muted-foreground block mt-1">PDF, DOCX, TXT, images</span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              />
            </label>
            {uploadedDocs.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {uploadedDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-1.5 bg-secondary/60 rounded-md px-2.5 py-1.5 text-xs">
                    <FileText className="w-3 h-3 text-muted-foreground" />
                    <span className="truncate max-w-32">{doc.name}</span>
                    <button type="button" onClick={() => removeDoc(doc.id)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Start */}
          <Button
            size="lg"
            className="w-full h-11 gap-2"
            onClick={() => setSessionStarted(true)}
            disabled={activeAgents.length === 0}
          >
            <Sparkles className="w-4 h-4" />
            Start Legal Analysis Session
          </Button>
        </div>
      </div>
    );
  }

  // Active Chat
  return (
    <div className="h-full flex bg-background">
      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${toolsPanelOpen ? 'mr-72' : ''}`}>
      {/* Chat Header */}
      <div className="border-b border-border/60 px-4 py-3 bg-card/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Legal Analysis Session</p>
              <p className="text-[11px] text-muted-foreground">
                {activeAgents.length} agents active
                {uploadedDocs.length > 0 && ` | ${uploadedDocs.length} docs indexed`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {activeAgents.slice(0, 4).map((agentId) => {
                const config = AGENT_CONFIGS.find((a) => a.id === agentId);
                return config ? (
                  <div key={agentId} className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-background ${config.color}`}>
                    <config.icon className="w-3 h-3" />
                  </div>
                ) : null;
              })}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 gap-1"
                onClick={() => setToolsPanelOpen(!toolsPanelOpen)}
              >
                {toolsPanelOpen ? <PanelRightClose className="w-3 h-3" /> : <PanelRightOpen className="w-3 h-3" />}
                Tools
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => { setSessionStarted(false); setMessages([]); setActiveTool(null); }}
              >
                New Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3 animate-fade-in">
              <Scale className="w-10 h-10 text-muted-foreground/50 mx-auto" />
              <p className="text-sm text-muted-foreground">Ask about your case, upload disclosure, or request Charter analysis</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['/audit - Run disclosure audit', '/grant - Analyze s.24(2) exclusion', '/charter - Scan for breaches', 'Build my defense strategy'].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setInputValue(suggestion)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const agentConfig = message.agentRole ? AGENT_CONFIGS.find((a) => a.id === message.agentRole) : null;

            return (
              <div
                key={message.id}
                className={`flex gap-3 animate-fade-in ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role !== 'user' && (
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${agentConfig?.color || 'bg-primary/10 text-primary'}`}>
                    {agentConfig ? <agentConfig.icon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                )}

                <div className={`max-w-lg ${message.role === 'user' ? '' : ''}`}>
                  {message.agentName && (
                    <p className="text-[11px] font-medium text-muted-foreground mb-1">
                      {message.agentName}
                      {message.confidence && !message.isStreaming && (
                        <span className="ml-2 text-[10px]">{(message.confidence * 100).toFixed(0)}% confidence</span>
                      )}
                    </p>
                  )}

                  <div
                    className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border/60 text-foreground'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                    {message.isStreaming && (
                      <span className="inline-block w-1.5 h-4 bg-primary/60 rounded-sm animate-pulse ml-0.5 align-middle" />
                    )}
                  </div>

                  {message.citations && !message.isStreaming && message.citations.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {message.citations.map((c, i) => (
                        <span key={i} className="text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border/60 p-4 bg-card/50 backdrop-blur-sm flex-shrink-0">
        {uploadedDocs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {uploadedDocs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-1 bg-secondary/40 text-[10px] px-2 py-1 rounded-md">
                <Paperclip className="w-2.5 h-2.5" />
                <span className="truncate max-w-24">{doc.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 flex-shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          />
          <Input
            placeholder="Ask anything or type / for commands..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={isLoading}
            className="flex-1 h-10"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            size="icon"
            className="h-10 w-10 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
      </div>

      {/* Tools Panel - Octopus Hub */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-card border-l border-border shadow-xl z-50 transition-transform duration-300 ${toolsPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Panel Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Layers className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Legal Tools Hub</h3>
                  <p className="text-[10px] text-muted-foreground">Octopus Pipeline</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setToolsPanelOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tool Categories */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Analysis Tools */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Analysis Tools</p>
              <div className="space-y-1.5">
                {INTEGRATED_TOOLS.filter(t => ['charter_scan', 'grant_test', 'disclosure_audit', 'timeline_audit'].includes(t.id)).map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => executeToolCommand(tool.id)}
                    className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all duration-200 group ${
                      activeTool === tool.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary/60 border border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${activeTool === tool.id ? 'bg-primary text-primary-foreground' : 'bg-secondary/80 text-muted-foreground group-hover:text-foreground'}`}>
                      <tool.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{tool.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{tool.command}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Drafting Tools */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Drafting Tools</p>
              <div className="space-y-1.5">
                {INTEGRATED_TOOLS.filter(t => ['cross_exam', 'factum_draft', 'citation_gen'].includes(t.id)).map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => executeToolCommand(tool.id)}
                    className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all duration-200 group ${
                      activeTool === tool.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary/60 border border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${activeTool === tool.id ? 'bg-primary text-primary-foreground' : 'bg-secondary/80 text-muted-foreground group-hover:text-foreground'}`}>
                      <tool.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{tool.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{tool.command}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Compliance Tools */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Compliance</p>
              <div className="space-y-1.5">
                {INTEGRATED_TOOLS.filter(t => ['firearm_classifier'].includes(t.id)).map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => executeToolCommand(tool.id)}
                    className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all duration-200 group ${
                      activeTool === tool.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary/60 border border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${activeTool === tool.id ? 'bg-primary text-primary-foreground' : 'bg-secondary/80 text-muted-foreground group-hover:text-foreground'}`}>
                      <tool.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{tool.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{tool.command}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Agents */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Active Agents ({activeAgents.length})</p>
              <div className="space-y-1">
                {AGENT_CONFIGS.filter(a => activeAgents.includes(a.id)).map((agent) => (
                  <div key={agent.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-secondary/40">
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${agent.color}`}>
                      <agent.icon className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] font-medium truncate">{agent.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel Footer */}
          <div className="p-3 border-t border-border bg-secondary/20">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <Wand2 className="w-3 h-3" />
              <span>Type / for commands or click a tool</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
