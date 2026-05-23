// Comprehensive Factum Builder Library for Canadian Courts
// Supports all provinces, court levels, and proper legal formatting

export interface FactumSection {
  id: string;
  title: string;
  required: boolean;
  description: string;
  content: string;
  order: number;
  maxWords?: number;
  minWords?: number;
  formatting?: FactumFormatting;
}

export interface FactumFormatting {
  fontFamily: string;
  fontSize: number;
  lineSpacing: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  paragraphIndent: number;
  citationStyle: 'McGill' | 'Canadian' | 'APA';
}

export interface FactumParty {
  id: string;
  name: string;
  role: 'appellant' | 'respondent' | 'applicant' | 'defendant' | 'plaintiff' | 'intervenor';
  counsel?: {
    name: string;
    firm: string;
    address: string;
    phone: string;
    email: string;
    lsucNumber?: string;
  };
}

export interface FactumCitation {
  id: string;
  type: 'case' | 'statute' | 'regulation' | 'secondary';
  citation: string;
  pinpoint?: string;
  url?: string;
  relevance: string;
}

export interface Factum {
  id: string;
  title: string;
  courtFile: string;
  court: string;
  courtLevel: 'trial' | 'appeal' | 'supreme';
  province: string;
  parties: FactumParty[];
  sections: FactumSection[];
  citations: FactumCitation[];
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'review' | 'final';
  wordCount: number;
  pageCount: number;
}

// Court-specific formatting requirements
export const COURT_FORMATTING: Record<string, FactumFormatting> = {
  'ON-COA': {
    fontFamily: 'Times New Roman',
    fontSize: 12,
    lineSpacing: 1.5,
    marginTop: 1,
    marginBottom: 1,
    marginLeft: 1.25,
    marginRight: 1,
    paragraphIndent: 0.5,
    citationStyle: 'McGill',
  },
  'ON-SCJ': {
    fontFamily: 'Times New Roman',
    fontSize: 12,
    lineSpacing: 1.5,
    marginTop: 1,
    marginBottom: 1,
    marginLeft: 1,
    marginRight: 1,
    paragraphIndent: 0.5,
    citationStyle: 'McGill',
  },
  'BC-CA': {
    fontFamily: 'Arial',
    fontSize: 12,
    lineSpacing: 2,
    marginTop: 1,
    marginBottom: 1,
    marginLeft: 1.5,
    marginRight: 1,
    paragraphIndent: 0,
    citationStyle: 'McGill',
  },
  'BC-SC': {
    fontFamily: 'Arial',
    fontSize: 12,
    lineSpacing: 1.5,
    marginTop: 1,
    marginBottom: 1,
    marginLeft: 1,
    marginRight: 1,
    paragraphIndent: 0,
    citationStyle: 'McGill',
  },
  'FED-CA': {
    fontFamily: 'Times New Roman',
    fontSize: 12,
    lineSpacing: 1.5,
    marginTop: 1,
    marginBottom: 1,
    marginLeft: 1.25,
    marginRight: 1,
    paragraphIndent: 0.5,
    citationStyle: 'McGill',
  },
  'SCC': {
    fontFamily: 'Times New Roman',
    fontSize: 12,
    lineSpacing: 1.5,
    marginTop: 1,
    marginBottom: 1,
    marginLeft: 1.5,
    marginRight: 1,
    paragraphIndent: 0.5,
    citationStyle: 'McGill',
  },
};

// Standard factum sections by court level
export const APPEAL_FACTUM_SECTIONS: Omit<FactumSection, 'content'>[] = [
  {
    id: 'part-i',
    title: 'PART I - STATEMENT OF THE CASE',
    required: true,
    description: 'Concise overview of the case, identifying the nature of the appeal and the order(s) under appeal.',
    order: 1,
    maxWords: 500,
  },
  {
    id: 'part-ii',
    title: 'PART II - STATEMENT OF FACTS',
    required: true,
    description: 'Clear, chronological statement of facts relevant to the issues on appeal, with references to the evidence.',
    order: 2,
    maxWords: 2000,
  },
  {
    id: 'part-iii',
    title: 'PART III - ISSUES AND THE LAW',
    required: true,
    description: 'Statement of each issue raised, followed by concise argument with authorities.',
    order: 3,
  },
  {
    id: 'part-iv',
    title: 'PART IV - ORDER REQUESTED',
    required: true,
    description: 'Precise statement of the order or relief sought from the court.',
    order: 4,
    maxWords: 200,
  },
  {
    id: 'schedule-a',
    title: 'SCHEDULE A - AUTHORITIES CITED',
    required: true,
    description: 'List of all cases, statutes, and secondary sources cited in the factum.',
    order: 5,
  },
  {
    id: 'schedule-b',
    title: 'SCHEDULE B - RELEVANT STATUTORY PROVISIONS',
    required: false,
    description: 'Full text of relevant statutory provisions not included in the appeal book.',
    order: 6,
  },
];

export const TRIAL_FACTUM_SECTIONS: Omit<FactumSection, 'content'>[] = [
  {
    id: 'overview',
    title: 'OVERVIEW',
    required: true,
    description: 'Brief summary of the case and the relief sought.',
    order: 1,
    maxWords: 300,
  },
  {
    id: 'facts',
    title: 'STATEMENT OF FACTS',
    required: true,
    description: 'Detailed statement of relevant facts with evidence references.',
    order: 2,
  },
  {
    id: 'issues',
    title: 'ISSUES TO BE DETERMINED',
    required: true,
    description: 'Clear statement of each legal issue to be decided.',
    order: 3,
    maxWords: 200,
  },
  {
    id: 'law',
    title: 'LAW AND ARGUMENT',
    required: true,
    description: 'Legal argument with supporting authorities.',
    order: 4,
  },
  {
    id: 'relief',
    title: 'RELIEF SOUGHT',
    required: true,
    description: 'Specific orders or relief requested.',
    order: 5,
    maxWords: 200,
  },
  {
    id: 'costs',
    title: 'COSTS',
    required: false,
    description: 'Submissions on costs.',
    order: 6,
    maxWords: 300,
  },
  {
    id: 'authorities',
    title: 'LIST OF AUTHORITIES',
    required: true,
    description: 'Complete list of all authorities cited.',
    order: 7,
  },
];

export const SCC_FACTUM_SECTIONS: Omit<FactumSection, 'content'>[] = [
  {
    id: 'part-i',
    title: 'PART I - OVERVIEW AND STATEMENT OF FACTS',
    required: true,
    description: 'Concise statement providing an overview and relevant facts (max 1500 words for appellant).',
    order: 1,
    maxWords: 1500,
  },
  {
    id: 'part-ii',
    title: 'PART II - QUESTIONS IN ISSUE',
    required: true,
    description: 'Statement of the questions in issue.',
    order: 2,
    maxWords: 200,
  },
  {
    id: 'part-iii',
    title: 'PART III - STATEMENT OF ARGUMENT',
    required: true,
    description: 'Argument on each question, with authorities (max 6000 words for appellant).',
    order: 3,
    maxWords: 6000,
  },
  {
    id: 'part-iv',
    title: 'PART IV - SUBMISSIONS ON COSTS',
    required: false,
    description: 'Submissions regarding costs.',
    order: 4,
    maxWords: 300,
  },
  {
    id: 'part-v',
    title: 'PART V - ORDER SOUGHT',
    required: true,
    description: 'Order or orders sought.',
    order: 5,
    maxWords: 100,
  },
  {
    id: 'part-vi',
    title: 'PART VI - TABLE OF AUTHORITIES',
    required: true,
    description: 'Alphabetical list of authorities cited.',
    order: 6,
  },
  {
    id: 'part-vii',
    title: 'PART VII - STATUTORY PROVISIONS',
    required: true,
    description: 'Text of statutory provisions relied upon.',
    order: 7,
  },
];

// Province-specific court information
export const CANADIAN_COURTS = {
  ON: {
    name: 'Ontario',
    courts: [
      { id: 'ON-COA', name: 'Court of Appeal for Ontario', level: 'appeal' as const },
      { id: 'ON-SCJ', name: 'Superior Court of Justice', level: 'trial' as const },
      { id: 'ON-DIV', name: 'Divisional Court', level: 'appeal' as const },
      { id: 'ON-OCJ', name: 'Ontario Court of Justice', level: 'trial' as const },
      { id: 'ON-SCC', name: 'Small Claims Court', level: 'trial' as const },
    ],
  },
  BC: {
    name: 'British Columbia',
    courts: [
      { id: 'BC-CA', name: 'Court of Appeal for British Columbia', level: 'appeal' as const },
      { id: 'BC-SC', name: 'Supreme Court of British Columbia', level: 'trial' as const },
      { id: 'BC-PC', name: 'Provincial Court of British Columbia', level: 'trial' as const },
    ],
  },
  AB: {
    name: 'Alberta',
    courts: [
      { id: 'AB-CA', name: 'Court of Appeal of Alberta', level: 'appeal' as const },
      { id: 'AB-KB', name: "Court of King's Bench of Alberta", level: 'trial' as const },
      { id: 'AB-PC', name: 'Provincial Court of Alberta', level: 'trial' as const },
    ],
  },
  QC: {
    name: 'Quebec',
    courts: [
      { id: 'QC-CA', name: "Cour d'appel du Québec", level: 'appeal' as const },
      { id: 'QC-CS', name: 'Cour supérieure du Québec', level: 'trial' as const },
      { id: 'QC-CQ', name: 'Cour du Québec', level: 'trial' as const },
    ],
  },
  MB: {
    name: 'Manitoba',
    courts: [
      { id: 'MB-CA', name: 'Court of Appeal of Manitoba', level: 'appeal' as const },
      { id: 'MB-KB', name: "Court of King's Bench of Manitoba", level: 'trial' as const },
    ],
  },
  SK: {
    name: 'Saskatchewan',
    courts: [
      { id: 'SK-CA', name: 'Court of Appeal for Saskatchewan', level: 'appeal' as const },
      { id: 'SK-KB', name: "Court of King's Bench for Saskatchewan", level: 'trial' as const },
    ],
  },
  NS: {
    name: 'Nova Scotia',
    courts: [
      { id: 'NS-CA', name: 'Nova Scotia Court of Appeal', level: 'appeal' as const },
      { id: 'NS-SC', name: 'Supreme Court of Nova Scotia', level: 'trial' as const },
    ],
  },
  NB: {
    name: 'New Brunswick',
    courts: [
      { id: 'NB-CA', name: 'Court of Appeal of New Brunswick', level: 'appeal' as const },
      { id: 'NB-KB', name: "Court of King's Bench of New Brunswick", level: 'trial' as const },
    ],
  },
  NL: {
    name: 'Newfoundland and Labrador',
    courts: [
      { id: 'NL-CA', name: 'Court of Appeal of Newfoundland and Labrador', level: 'appeal' as const },
      { id: 'NL-SC', name: 'Supreme Court of Newfoundland and Labrador', level: 'trial' as const },
    ],
  },
  PE: {
    name: 'Prince Edward Island',
    courts: [
      { id: 'PE-CA', name: 'Court of Appeal of Prince Edward Island', level: 'appeal' as const },
      { id: 'PE-SC', name: 'Supreme Court of Prince Edward Island', level: 'trial' as const },
    ],
  },
  FED: {
    name: 'Federal',
    courts: [
      { id: 'SCC', name: 'Supreme Court of Canada', level: 'supreme' as const },
      { id: 'FED-CA', name: 'Federal Court of Appeal', level: 'appeal' as const },
      { id: 'FED-FC', name: 'Federal Court', level: 'trial' as const },
      { id: 'FED-TCC', name: 'Tax Court of Canada', level: 'trial' as const },
    ],
  },
};

// Citation formatting helpers
export function formatMcGillCitation(citation: FactumCitation): string {
  if (citation.type === 'case') {
    return citation.pinpoint 
      ? `${citation.citation} at para ${citation.pinpoint}`
      : citation.citation;
  }
  if (citation.type === 'statute') {
    return citation.citation;
  }
  return citation.citation;
}

export function getSectionsForCourt(courtId: string): Omit<FactumSection, 'content'>[] {
  if (courtId === 'SCC') {
    return SCC_FACTUM_SECTIONS;
  }
  const court = Object.values(CANADIAN_COURTS)
    .flatMap(p => p.courts)
    .find(c => c.id === courtId);
  
  if (court?.level === 'appeal') {
    return APPEAL_FACTUM_SECTIONS;
  }
  return TRIAL_FACTUM_SECTIONS;
}

export function getFormattingForCourt(courtId: string): FactumFormatting {
  return COURT_FORMATTING[courtId] || COURT_FORMATTING['ON-SCJ'];
}

export function calculateWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function calculatePageCount(wordCount: number, formatting: FactumFormatting): number {
  // Approximate words per page based on formatting
  const wordsPerLine = formatting.fontSize === 12 ? 12 : 10;
  const linesPerPage = formatting.lineSpacing === 2 ? 23 : 28;
  const wordsPerPage = wordsPerLine * linesPerPage;
  return Math.ceil(wordCount / wordsPerPage);
}

export function validateFactum(factum: Factum): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required sections
  const sections = getSectionsForCourt(factum.court);
  for (const section of sections) {
    if (section.required) {
      const factumSection = factum.sections.find(s => s.id === section.id);
      if (!factumSection || !factumSection.content.trim()) {
        errors.push(`Required section "${section.title}" is missing or empty`);
      } else if (section.maxWords) {
        const wordCount = calculateWordCount(factumSection.content);
        if (wordCount > section.maxWords) {
          errors.push(`Section "${section.title}" exceeds maximum word count (${wordCount}/${section.maxWords})`);
        }
      }
    }
  }
  
  // Check parties
  if (factum.parties.length < 2) {
    errors.push('At least two parties (appellant/respondent or plaintiff/defendant) are required');
  }
  
  // Check court file number
  if (!factum.courtFile.trim()) {
    errors.push('Court file number is required');
  }
  
  // Check citations in Schedule A
  if (factum.citations.length === 0) {
    errors.push('At least one authority must be cited');
  }
  
  return { valid: errors.length === 0, errors };
}

// Templates for common arguments
export const ARGUMENT_TEMPLATES = {
  charter_s7: `The [Appellant/Respondent] submits that their rights under s. 7 of the Canadian Charter of Rights and Freedoms were infringed. Section 7 guarantees that everyone has the right to life, liberty and security of the person and the right not to be deprived thereof except in accordance with the principles of fundamental justice.

[FACTS SUPPORTING S.7 BREACH]

The principles of fundamental justice require that [SPECIFIC PRINCIPLE]. In this case, [HOW PRINCIPLE WAS VIOLATED].

See: R v Oakes, [1986] 1 SCR 103; Canada (Attorney General) v Bedford, 2013 SCC 72.`,

  charter_s8: `The [Appellant/Respondent] submits that their rights under s. 8 of the Charter were violated through an unreasonable search and seizure.

The search/seizure in question occurred on [DATE] when [DESCRIBE SEARCH]. This search was unreasonable because [REASONS - no warrant, exceeded scope, etc.].

The reasonable expectation of privacy test from R v Edwards, [1996] 1 SCR 128 requires consideration of:
1. Whether the accused had a subjective expectation of privacy
2. Whether that expectation was objectively reasonable

[APPLY TEST TO FACTS]

The evidence obtained should be excluded under s. 24(2) as its admission would bring the administration of justice into disrepute.`,

  charter_s10b: `The [Appellant/Respondent] submits that their s. 10(b) right to counsel was violated.

Upon detention, every person has the right to retain and instruct counsel without delay and to be informed of that right. This includes the right to a reasonable opportunity to exercise the right and a corresponding duty on the police to hold off questioning until that opportunity has been provided.

[DESCRIBE HOW RIGHT WAS VIOLATED]

See: R v Sinclair, 2010 SCC 35; R v Bartle, [1994] 3 SCR 173.`,

  standard_of_review_correctness: `The standard of review on this issue is correctness. Questions of law, including constitutional questions and questions of general importance to the legal system, are reviewed on a correctness standard.

[CITE: Canada (Minister of Citizenship and Immigration) v Vavilov, 2019 SCC 65]

Applying the correctness standard, this Court may substitute its own view for that of the lower court.`,

  standard_of_review_palpable: `The standard of review for findings of fact is palpable and overriding error. An appellate court may not interfere with factual findings unless it can identify a palpable error that affected the result.

[CITE: Housen v Nikolaisen, 2002 SCC 33]

A palpable error is one that is obvious or readily apparent. An overriding error is one that affects the outcome of the case.`,
};

// Generate factum cover page
export function generateCoverPage(factum: Factum): string {
  const appellant = factum.parties.find(p => ['appellant', 'applicant', 'plaintiff'].includes(p.role));
  const respondent = factum.parties.find(p => ['respondent', 'defendant'].includes(p.role));
  
  return `
Court File No.: ${factum.courtFile}

${factum.court.toUpperCase()}

BETWEEN:

${appellant?.name.toUpperCase() || '[APPELLANT NAME]'}
${appellant?.role.toUpperCase() || 'APPELLANT'}

- and -

${respondent?.name.toUpperCase() || '[RESPONDENT NAME]'}
${respondent?.role.toUpperCase() || 'RESPONDENT'}

FACTUM OF THE ${appellant?.role.toUpperCase() || 'APPELLANT'}

${appellant?.counsel ? `
${appellant.counsel.name}
${appellant.counsel.firm}
${appellant.counsel.address}
Tel: ${appellant.counsel.phone}
Email: ${appellant.counsel.email}
${appellant.counsel.lsucNumber ? `LSUC#: ${appellant.counsel.lsucNumber}` : ''}

Counsel for the ${appellant.role.charAt(0).toUpperCase() + appellant.role.slice(1)}
` : '[COUNSEL INFORMATION]'}
`.trim();
}
