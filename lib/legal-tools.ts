// Legal Tools Library - Timeline Builder, Fee Calculator, Checklist Generator
// Comprehensive tools for self-represented litigants and legal professionals

// ============================================
// COURT FEE CALCULATOR
// ============================================

export interface CourtFee {
  id: string;
  name: string;
  amount: number;
  description: string;
  waiverAvailable: boolean;
  notes?: string;
}

export interface CourtFeeSchedule {
  province: string;
  court: string;
  effectiveDate: string;
  fees: CourtFee[];
  feeWaiverUrl?: string;
}

export const COURT_FEES: CourtFeeSchedule[] = [
  {
    province: 'ON',
    court: 'Superior Court of Justice',
    effectiveDate: '2025-01-01',
    feeWaiverUrl: 'https://www.ontario.ca/page/fee-waiver-court-services',
    fees: [
      { id: 'on-scj-soc', name: 'Statement of Claim (Issuing)', amount: 229, description: 'Filing fee for issuing a Statement of Claim', waiverAvailable: true },
      { id: 'on-scj-soc-freq', name: 'Statement of Claim (Frequent Litigant)', amount: 458, description: 'Filing fee for frequent litigants', waiverAvailable: true },
      { id: 'on-scj-defence', name: 'Statement of Defence', amount: 181, description: 'Filing a Statement of Defence', waiverAvailable: true },
      { id: 'on-scj-motion', name: 'Notice of Motion', amount: 127, description: 'Filing a Notice of Motion', waiverAvailable: true },
      { id: 'on-scj-motion-hearing', name: 'Motion (Hearing Fee)', amount: 280, description: 'Hearing fee for motions', waiverAvailable: true },
      { id: 'on-scj-trial', name: 'Trial Record', amount: 810, description: 'Setting action down for trial', waiverAvailable: true },
      { id: 'on-scj-appeal', name: 'Notice of Appeal', amount: 278, description: 'Filing Notice of Appeal to Divisional Court', waiverAvailable: true },
      { id: 'on-scj-divorce', name: 'Application for Divorce', amount: 212, description: 'Commencing divorce proceedings', waiverAvailable: true },
      { id: 'on-scj-certificate', name: 'Certificate of Divorce', amount: 22, description: 'Issuing certificate of divorce', waiverAvailable: true },
    ],
  },
  {
    province: 'ON',
    court: 'Small Claims Court',
    effectiveDate: '2025-01-01',
    feeWaiverUrl: 'https://www.ontario.ca/page/fee-waiver-court-services',
    fees: [
      { id: 'on-scc-claim-infrequent', name: 'Claim (Infrequent Claimant)', amount: 102, description: 'Filing a claim if you file 10 or fewer claims per year', waiverAvailable: true },
      { id: 'on-scc-claim-frequent', name: 'Claim (Frequent Claimant)', amount: 230, description: 'Filing a claim if you file more than 10 claims per year', waiverAvailable: true },
      { id: 'on-scc-defence', name: 'Defence', amount: 73, description: 'Filing a defence', waiverAvailable: true },
      { id: 'on-scc-default', name: 'Default Judgment', amount: 35, description: 'Requesting default judgment', waiverAvailable: true },
      { id: 'on-scc-motion', name: 'Motion', amount: 40, description: 'Filing a motion', waiverAvailable: true },
      { id: 'on-scc-trial', name: 'Trial Date', amount: 145, description: 'Fixing a date for trial', waiverAvailable: true, notes: 'Infrequent claimant rate' },
      { id: 'on-scc-summons', name: 'Summons to Witness', amount: 22, description: 'Requesting witness summons', waiverAvailable: true },
    ],
  },
  {
    province: 'ON',
    court: 'Court of Appeal for Ontario',
    effectiveDate: '2025-01-01',
    feeWaiverUrl: 'https://www.ontario.ca/page/fee-waiver-court-services',
    fees: [
      { id: 'on-coa-appeal', name: 'Notice of Appeal', amount: 278, description: 'Filing Notice of Appeal', waiverAvailable: true },
      { id: 'on-coa-certificate', name: 'Certificate of Perfection', amount: 232, description: 'Filing certificate that appeal is perfected', waiverAvailable: true },
      { id: 'on-coa-motion', name: 'Motion', amount: 127, description: 'Filing a motion', waiverAvailable: true },
      { id: 'on-coa-leave', name: 'Motion for Leave', amount: 127, description: 'Motion for leave to appeal', waiverAvailable: true },
    ],
  },
  {
    province: 'BC',
    court: 'Supreme Court of British Columbia',
    effectiveDate: '2025-01-01',
    feeWaiverUrl: 'https://www2.gov.bc.ca/gov/content/justice/courthouse-services/documents/forms-registry/registry-forms',
    fees: [
      { id: 'bc-sc-claim', name: 'Notice of Civil Claim', amount: 208, description: 'Filing a Notice of Civil Claim', waiverAvailable: true },
      { id: 'bc-sc-response', name: 'Response to Civil Claim', amount: 208, description: 'Filing a Response', waiverAvailable: true },
      { id: 'bc-sc-application', name: 'Application', amount: 80, description: 'Filing an application (chamber)', waiverAvailable: true },
      { id: 'bc-sc-trial', name: 'Trial', amount: 400, description: 'Setting matter for trial', waiverAvailable: true, notes: 'First day' },
      { id: 'bc-sc-trial-add', name: 'Trial (Additional Days)', amount: 400, description: 'Per additional trial day', waiverAvailable: true },
      { id: 'bc-sc-divorce', name: 'Family Claim (Divorce)', amount: 210, description: 'Filing for divorce', waiverAvailable: true },
    ],
  },
  {
    province: 'BC',
    court: 'Civil Resolution Tribunal',
    effectiveDate: '2025-01-01',
    fees: [
      { id: 'bc-crt-small', name: 'Small Claims Dispute ($5,000 or less)', amount: 75, description: 'Disputes up to $5,000', waiverAvailable: true },
      { id: 'bc-crt-strata', name: 'Strata Property Dispute', amount: 225, description: 'Strata property claims', waiverAvailable: true },
      { id: 'bc-crt-vehicle', name: 'Motor Vehicle Accident Claim', amount: 100, description: 'MVA claims up to $50,000', waiverAvailable: true },
    ],
  },
  {
    province: 'AB',
    court: "Court of King's Bench",
    effectiveDate: '2025-01-01',
    fees: [
      { id: 'ab-kb-soc', name: 'Statement of Claim', amount: 200, description: 'Filing a Statement of Claim', waiverAvailable: true },
      { id: 'ab-kb-defence', name: 'Statement of Defence', amount: 200, description: 'Filing a Statement of Defence', waiverAvailable: true },
      { id: 'ab-kb-application', name: 'Application', amount: 100, description: 'Filing an application', waiverAvailable: true },
      { id: 'ab-kb-trial', name: 'Trial', amount: 600, description: 'Setting action for trial', waiverAvailable: true },
      { id: 'ab-kb-appeal', name: 'Appeal', amount: 200, description: 'Filing Notice of Appeal', waiverAvailable: true },
    ],
  },
  {
    province: 'FED',
    court: 'Federal Court',
    effectiveDate: '2025-01-01',
    feeWaiverUrl: 'https://www.fct-cf.gc.ca/en/pages/representing-yourself/fee-waivers',
    fees: [
      { id: 'fed-fc-application', name: 'Application for Leave/Judicial Review', amount: 50, description: 'Filing application for judicial review', waiverAvailable: true },
      { id: 'fed-fc-action', name: 'Statement of Claim', amount: 150, description: 'Commencing an action', waiverAvailable: true },
      { id: 'fed-fc-motion', name: 'Notice of Motion', amount: 50, description: 'Filing a motion', waiverAvailable: true },
      { id: 'fed-fc-trial', name: 'Trial Record', amount: 150, description: 'Filing trial record', waiverAvailable: true },
    ],
  },
  {
    province: 'FED',
    court: 'Supreme Court of Canada',
    effectiveDate: '2025-01-01',
    fees: [
      { id: 'scc-leave', name: 'Application for Leave to Appeal', amount: 65, description: 'Filing application for leave', waiverAvailable: true },
      { id: 'scc-appeal', name: 'Notice of Appeal', amount: 50, description: 'Filing Notice of Appeal (after leave granted)', waiverAvailable: true },
      { id: 'scc-motion', name: 'Motion', amount: 50, description: 'Filing a motion', waiverAvailable: true },
    ],
  },
];

export function calculateFees(selectedFees: string[]): { fees: CourtFee[]; total: number } {
  const allFees = COURT_FEES.flatMap(s => s.fees);
  const fees = allFees.filter(f => selectedFees.includes(f.id));
  const total = fees.reduce((sum, f) => sum + f.amount, 0);
  return { fees, total };
}

export function getFeesByProvince(province: string): CourtFeeSchedule[] {
  return COURT_FEES.filter(s => s.province === province);
}

// ============================================
// TIMELINE/CHRONOLOGY BUILDER
// ============================================

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'incident' | 'police' | 'court' | 'medical' | 'witness' | 'evidence' | 'other';
  documents?: string[];
  witnesses?: string[];
  importance: 'critical' | 'important' | 'supporting';
}

export interface Timeline {
  id: string;
  caseId?: string;
  title: string;
  events: TimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export const TIMELINE_CATEGORIES = [
  { id: 'incident', name: 'Incident', color: 'bg-red-500' },
  { id: 'police', name: 'Police/Investigation', color: 'bg-blue-500' },
  { id: 'court', name: 'Court Proceeding', color: 'bg-purple-500' },
  { id: 'medical', name: 'Medical', color: 'bg-green-500' },
  { id: 'witness', name: 'Witness Contact', color: 'bg-amber-500' },
  { id: 'evidence', name: 'Evidence', color: 'bg-cyan-500' },
  { id: 'other', name: 'Other', color: 'bg-gray-500' },
] as const;

export function sortTimelineEvents(events: TimelineEvent[]): TimelineEvent[] {
  return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function generateTimelineNarrative(events: TimelineEvent[]): string {
  const sorted = sortTimelineEvents(events);
  return sorted.map((event, index) => {
    const date = new Date(event.date).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return `${index + 1}. On ${date}, ${event.description}`;
  }).join('\n\n');
}

// ============================================
// CHECKLIST GENERATOR
// ============================================

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  dueDate?: string;
  notes?: string;
  required: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  description: string;
  category: string;
  items: ChecklistItem[];
  province?: string;
  court?: string;
}

export const LEGAL_CHECKLISTS: Checklist[] = [
  {
    id: 'civil-plaintiff',
    title: 'Civil Lawsuit Checklist (Plaintiff)',
    description: 'Essential steps for starting a civil lawsuit',
    category: 'civil',
    items: [
      { id: 'cp-1', text: 'Determine if you have a valid legal claim', completed: false, required: true, category: 'preparation' },
      { id: 'cp-2', text: 'Identify all potential defendants', completed: false, required: true, category: 'preparation' },
      { id: 'cp-3', text: 'Calculate your damages/losses', completed: false, required: true, category: 'preparation' },
      { id: 'cp-4', text: 'Check limitation period (deadline to sue)', completed: false, required: true, category: 'preparation', notes: 'Usually 2 years in most provinces' },
      { id: 'cp-5', text: 'Gather all relevant documents', completed: false, required: true, category: 'evidence' },
      { id: 'cp-6', text: 'Identify potential witnesses', completed: false, required: false, category: 'evidence' },
      { id: 'cp-7', text: 'Consider sending demand letter', completed: false, required: false, category: 'pre-litigation' },
      { id: 'cp-8', text: 'Determine correct court and jurisdiction', completed: false, required: true, category: 'filing' },
      { id: 'cp-9', text: 'Draft Statement of Claim', completed: false, required: true, category: 'filing' },
      { id: 'cp-10', text: 'Pay filing fee or apply for fee waiver', completed: false, required: true, category: 'filing' },
      { id: 'cp-11', text: 'File Statement of Claim with court', completed: false, required: true, category: 'filing' },
      { id: 'cp-12', text: 'Serve Statement of Claim on defendant', completed: false, required: true, category: 'service' },
      { id: 'cp-13', text: 'File Affidavit of Service', completed: false, required: true, category: 'service' },
      { id: 'cp-14', text: 'Prepare for discovery', completed: false, required: true, category: 'discovery' },
      { id: 'cp-15', text: 'Attend mandatory mediation (if required)', completed: false, required: false, category: 'mediation' },
    ],
  },
  {
    id: 'civil-defendant',
    title: 'Civil Lawsuit Checklist (Defendant)',
    description: 'Essential steps for responding to a civil lawsuit',
    category: 'civil',
    items: [
      { id: 'cd-1', text: 'Note the deadline to file defence', completed: false, required: true, category: 'urgent', notes: 'Usually 20-30 days' },
      { id: 'cd-2', text: 'Read the Statement of Claim carefully', completed: false, required: true, category: 'preparation' },
      { id: 'cd-3', text: 'Gather relevant documents', completed: false, required: true, category: 'evidence' },
      { id: 'cd-4', text: 'Consider if you have a counterclaim', completed: false, required: false, category: 'preparation' },
      { id: 'cd-5', text: 'Draft Statement of Defence', completed: false, required: true, category: 'filing' },
      { id: 'cd-6', text: 'File Statement of Defence', completed: false, required: true, category: 'filing' },
      { id: 'cd-7', text: 'Serve Statement of Defence on plaintiff', completed: false, required: true, category: 'service' },
      { id: 'cd-8', text: 'Prepare Affidavit of Documents', completed: false, required: true, category: 'discovery' },
    ],
  },
  {
    id: 'small-claims-plaintiff',
    title: 'Small Claims Court Checklist (Plaintiff)',
    description: 'Steps for filing a small claims court case',
    category: 'small_claims',
    items: [
      { id: 'sc-1', text: 'Verify claim is within monetary limit', completed: false, required: true, category: 'preparation' },
      { id: 'sc-2', text: 'Gather evidence (receipts, contracts, photos)', completed: false, required: true, category: 'evidence' },
      { id: 'sc-3', text: 'Get defendant\'s full legal name and address', completed: false, required: true, category: 'preparation' },
      { id: 'sc-4', text: 'Complete Plaintiff\'s Claim form', completed: false, required: true, category: 'filing' },
      { id: 'sc-5', text: 'Make required copies', completed: false, required: true, category: 'filing' },
      { id: 'sc-6', text: 'File claim and pay fee', completed: false, required: true, category: 'filing' },
      { id: 'sc-7', text: 'Serve claim on defendant', completed: false, required: true, category: 'service' },
      { id: 'sc-8', text: 'File Affidavit of Service', completed: false, required: true, category: 'service' },
      { id: 'sc-9', text: 'Prepare for settlement conference', completed: false, required: true, category: 'settlement' },
      { id: 'sc-10', text: 'Organize evidence for trial', completed: false, required: true, category: 'trial' },
    ],
  },
  {
    id: 'criminal-accused',
    title: 'Criminal Proceedings Checklist (Accused)',
    description: 'Key steps if you are charged with a criminal offence',
    category: 'criminal',
    items: [
      { id: 'cr-1', text: 'Exercise right to remain silent', completed: false, required: true, category: 'rights' },
      { id: 'cr-2', text: 'Contact a lawyer immediately', completed: false, required: true, category: 'rights' },
      { id: 'cr-3', text: 'Note all details of arrest/detention', completed: false, required: true, category: 'documentation' },
      { id: 'cr-4', text: 'Apply for legal aid if eligible', completed: false, required: false, category: 'representation' },
      { id: 'cr-5', text: 'Obtain disclosure from Crown', completed: false, required: true, category: 'disclosure' },
      { id: 'cr-6', text: 'Review disclosure thoroughly', completed: false, required: true, category: 'disclosure' },
      { id: 'cr-7', text: 'Identify potential Charter issues', completed: false, required: false, category: 'defence' },
      { id: 'cr-8', text: 'Prepare defence strategy', completed: false, required: true, category: 'defence' },
      { id: 'cr-9', text: 'Attend all court dates', completed: false, required: true, category: 'court' },
      { id: 'cr-10', text: 'Comply with bail conditions', completed: false, required: true, category: 'conditions' },
    ],
  },
  {
    id: 'appeal-civil',
    title: 'Civil Appeal Checklist',
    description: 'Steps for appealing a civil court decision',
    category: 'appeals',
    items: [
      { id: 'ap-1', text: 'Determine if you have grounds for appeal', completed: false, required: true, category: 'assessment' },
      { id: 'ap-2', text: 'Note the deadline to file (usually 30 days)', completed: false, required: true, category: 'urgent' },
      { id: 'ap-3', text: 'Order transcripts immediately', completed: false, required: true, category: 'preparation' },
      { id: 'ap-4', text: 'Draft Notice of Appeal', completed: false, required: true, category: 'filing' },
      { id: 'ap-5', text: 'File Notice of Appeal', completed: false, required: true, category: 'filing' },
      { id: 'ap-6', text: 'Serve Notice on all parties', completed: false, required: true, category: 'service' },
      { id: 'ap-7', text: 'Prepare Appeal Record', completed: false, required: true, category: 'preparation' },
      { id: 'ap-8', text: 'Draft Factum/Appeal Brief', completed: false, required: true, category: 'preparation' },
      { id: 'ap-9', text: 'File and serve Appeal Record and Factum', completed: false, required: true, category: 'filing' },
      { id: 'ap-10', text: 'Prepare oral argument', completed: false, required: true, category: 'hearing' },
    ],
  },
  {
    id: 'family-divorce',
    title: 'Divorce Application Checklist',
    description: 'Steps for filing for divorce in Canada',
    category: 'family',
    items: [
      { id: 'fd-1', text: 'Confirm residency requirement (1 year in province)', completed: false, required: true, category: 'eligibility' },
      { id: 'fd-2', text: 'Determine grounds for divorce', completed: false, required: true, category: 'preparation', notes: 'Separation 1+ year, adultery, or cruelty' },
      { id: 'fd-3', text: 'Gather marriage certificate', completed: false, required: true, category: 'documents' },
      { id: 'fd-4', text: 'List all assets and debts', completed: false, required: true, category: 'financial' },
      { id: 'fd-5', text: 'Consider parenting arrangements', completed: false, required: false, category: 'children' },
      { id: 'fd-6', text: 'Calculate child/spousal support', completed: false, required: false, category: 'financial' },
      { id: 'fd-7', text: 'Complete Application for Divorce', completed: false, required: true, category: 'filing' },
      { id: 'fd-8', text: 'Complete Financial Statement', completed: false, required: true, category: 'filing' },
      { id: 'fd-9', text: 'File application with court', completed: false, required: true, category: 'filing' },
      { id: 'fd-10', text: 'Serve spouse with documents', completed: false, required: true, category: 'service' },
      { id: 'fd-11', text: 'Attend case conference', completed: false, required: false, category: 'court' },
    ],
  },
  {
    id: 'trial-preparation',
    title: 'Trial Preparation Checklist',
    description: 'Getting ready for your day in court',
    category: 'trial',
    items: [
      { id: 'tp-1', text: 'Create document index/exhibit list', completed: false, required: true, category: 'documents' },
      { id: 'tp-2', text: 'Organize documents chronologically', completed: false, required: true, category: 'documents' },
      { id: 'tp-3', text: 'Make copies for court, yourself, and other parties', completed: false, required: true, category: 'documents' },
      { id: 'tp-4', text: 'Prepare witness list', completed: false, required: false, category: 'witnesses' },
      { id: 'tp-5', text: 'Arrange for witness attendance (summons if needed)', completed: false, required: false, category: 'witnesses' },
      { id: 'tp-6', text: 'Prepare questions for direct examination', completed: false, required: true, category: 'preparation' },
      { id: 'tp-7', text: 'Prepare questions for cross-examination', completed: false, required: true, category: 'preparation' },
      { id: 'tp-8', text: 'Prepare opening statement', completed: false, required: true, category: 'preparation' },
      { id: 'tp-9', text: 'Prepare closing argument', completed: false, required: true, category: 'preparation' },
      { id: 'tp-10', text: 'Review all evidence and documents', completed: false, required: true, category: 'preparation' },
      { id: 'tp-11', text: 'Confirm courthouse location and courtroom', completed: false, required: true, category: 'logistics' },
      { id: 'tp-12', text: 'Plan travel and parking', completed: false, required: true, category: 'logistics' },
      { id: 'tp-13', text: 'Prepare appropriate attire', completed: false, required: true, category: 'logistics' },
    ],
  },
];

export function getChecklistById(id: string): Checklist | undefined {
  return LEGAL_CHECKLISTS.find(c => c.id === id);
}

export function getChecklistsByCategory(category: string): Checklist[] {
  return LEGAL_CHECKLISTS.filter(c => c.category === category);
}

// ============================================
// LIMITATION PERIOD CALCULATOR
// ============================================

export interface LimitationPeriod {
  type: string;
  province: string;
  period: string;
  statute: string;
  notes?: string;
}

export const LIMITATION_PERIODS: LimitationPeriod[] = [
  // Ontario
  { type: 'General Civil Claims', province: 'ON', period: '2 years', statute: 'Limitations Act, 2002', notes: 'From date claim discovered' },
  { type: 'Personal Injury', province: 'ON', period: '2 years', statute: 'Limitations Act, 2002' },
  { type: 'Property Damage', province: 'ON', period: '2 years', statute: 'Limitations Act, 2002' },
  { type: 'Contract Claims', province: 'ON', period: '2 years', statute: 'Limitations Act, 2002' },
  { type: 'Real Property Recovery', province: 'ON', period: '10 years', statute: 'Real Property Limitations Act' },
  { type: 'Sexual Assault', province: 'ON', period: 'No limitation', statute: 'Limitations Act, 2002' },
  { type: 'Assault/Battery', province: 'ON', period: '2 years', statute: 'Limitations Act, 2002', notes: 'Except sexual assault' },
  
  // British Columbia
  { type: 'General Civil Claims', province: 'BC', period: '2 years', statute: 'Limitation Act' },
  { type: 'Personal Injury', province: 'BC', period: '2 years', statute: 'Limitation Act' },
  { type: 'Sexual Assault', province: 'BC', period: 'No limitation', statute: 'Limitation Act' },
  { type: 'Land Recovery', province: 'BC', period: '10 years', statute: 'Limitation Act' },
  
  // Alberta
  { type: 'General Civil Claims', province: 'AB', period: '2 years', statute: 'Limitations Act' },
  { type: 'Personal Injury', province: 'AB', period: '2 years', statute: 'Limitations Act' },
  { type: 'Recovery of Land', province: 'AB', period: '10 years', statute: 'Limitations Act' },
  
  // Federal
  { type: 'Crown Claims', province: 'FED', period: '6 years', statute: 'Crown Liability and Proceedings Act' },
  { type: 'Tax Appeals', province: 'FED', period: '90 days', statute: 'Income Tax Act', notes: 'From Notice of Assessment' },
  { type: 'Immigration Appeals', province: 'FED', period: '15 days', statute: 'Immigration and Refugee Protection Act', notes: 'For judicial review' },
];

export function getLimitationPeriods(province: string): LimitationPeriod[] {
  return LIMITATION_PERIODS.filter(l => l.province === province);
}

export function calculateDeadline(discoveryDate: Date, periodYears: number): Date {
  const deadline = new Date(discoveryDate);
  deadline.setFullYear(deadline.getFullYear() + periodYears);
  return deadline;
}
