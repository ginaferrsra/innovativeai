// Production-Ready Canadian Factum Templates
// Court-compliant formatting for all Canadian jurisdictions

export interface FactumSection {
  id: string;
  title: string;
  required: boolean;
  description: string;
  placeholder: string;
  helpText: string;
  maxWords?: number;
  formatting?: {
    numbered?: boolean;
    indent?: boolean;
    bold?: boolean;
  };
}

export interface FactumTemplate {
  id: string;
  name: string;
  court: string;
  jurisdiction: string;
  description: string;
  sections: FactumSection[];
  formatting: {
    font: string;
    fontSize: string;
    lineSpacing: string;
    margins: string;
    pageLimit?: number;
    wordLimit?: number;
  };
  rules: {
    ruleNumber: string;
    ruleName: string;
    url: string;
  };
}

export interface FactumData {
  id: string;
  templateId: string;
  caseInfo: {
    courtFileNumber: string;
    courtName: string;
    registryLocation: string;
    appellant?: string;
    respondent?: string;
    plaintiff?: string;
    defendant?: string;
    applicant?: string;
    moving_party?: string;
    responding_party?: string;
  };
  sections: Record<string, string>;
  citations: Citation[];
  status: 'draft' | 'review' | 'final';
  createdAt: Date;
  updatedAt: Date;
}

export interface Citation {
  id: string;
  caseName: string;
  citation: string;
  year: number;
  court: string;
  paragraph?: string;
  pinpoint?: string;
  url?: string;
  category: 'binding' | 'persuasive' | 'distinguished';
}

// Ontario Court of Appeal Factum Template (Rule 61.11)
export const ONTARIO_APPEAL_FACTUM: FactumTemplate = {
  id: 'ont-coa-factum',
  name: 'Factum - Court of Appeal for Ontario',
  court: 'Court of Appeal for Ontario',
  jurisdiction: 'ON',
  description: 'Appellant/Respondent factum for appeals to the Court of Appeal for Ontario pursuant to Rule 61.11',
  formatting: {
    font: 'Times New Roman or Arial',
    fontSize: '12pt (body), 14pt (headings)',
    lineSpacing: 'Double-spaced (except for quotations)',
    margins: '1 inch on all sides',
    pageLimit: 30,
  },
  rules: {
    ruleNumber: 'Rule 61.11',
    ruleName: 'Rules of Civil Procedure',
    url: 'https://www.ontario.ca/laws/regulation/900194',
  },
  sections: [
    {
      id: 'part1-overview',
      title: 'PART I - OVERVIEW AND STATEMENT OF FACTS',
      required: true,
      description: 'A concise overview of the case and statement of material facts',
      placeholder: 'Begin with a 1-2 paragraph overview summarizing the nature of the appeal and the relief sought. Follow with a chronological statement of the material facts...',
      helpText: 'The overview should orient the reader to the nature of the appeal. Facts must be stated fairly and accurately, with references to the Appeal Book.',
      formatting: { numbered: true },
    },
    {
      id: 'part2-issues',
      title: 'PART II - STATEMENT OF ISSUES',
      required: true,
      description: 'Clear identification of the legal issues on appeal',
      placeholder: '1. Did the trial judge err in law by...\n2. Did the trial judge err in fact or mixed fact and law by...',
      helpText: 'Frame issues as questions. Each issue should correspond to a ground of appeal. Be specific and avoid compound issues.',
      formatting: { numbered: true },
    },
    {
      id: 'part3-argument',
      title: 'PART III - LAW AND ARGUMENT',
      required: true,
      description: 'Legal argument with authorities supporting each issue',
      placeholder: 'A. Issue 1: [Standard of Review]\n\nThe standard of review for questions of law is correctness...\n\n[Supporting authorities and argument]',
      helpText: 'Address each issue identified in Part II. State the applicable standard of review. Cite authorities with proper citation format.',
      formatting: { numbered: false },
    },
    {
      id: 'part4-relief',
      title: 'PART IV - ORDER REQUESTED',
      required: true,
      description: 'Precise relief being sought from the court',
      placeholder: 'The Appellant respectfully requests that this Honourable Court:\n\n1. Allow the appeal;\n2. Set aside the judgment below;\n3. Order that...',
      helpText: 'Be specific about the order sought. Include costs submissions.',
      formatting: { numbered: true },
    },
    {
      id: 'schedule-a',
      title: 'SCHEDULE A - AUTHORITIES CITED',
      required: true,
      description: 'List of all cases, statutes, and secondary sources cited',
      placeholder: 'CASES\n\n1. Housen v. Nikolaisen, 2002 SCC 33\n2. ...\n\nSTATUTES\n\n1. Courts of Justice Act, R.S.O. 1990, c. C.43\n2. ...',
      helpText: 'List authorities in order of importance or alphabetically. Include full citations.',
      formatting: { numbered: true },
    },
    {
      id: 'schedule-b',
      title: 'SCHEDULE B - RELEVANT STATUTES',
      required: true,
      description: 'Full text of relevant statutory provisions',
      placeholder: 'Courts of Justice Act, R.S.O. 1990, c. C.43\n\nSection 134(1):\nUnless otherwise provided, a court to which an appeal is taken may...',
      helpText: 'Include only provisions directly relevant to the appeal. Bilingual statutes may be included in English only.',
      formatting: { numbered: false },
    },
  ],
};

// Ontario Divisional Court Factum Template (Rule 68.04)
export const ONTARIO_DIVISIONAL_FACTUM: FactumTemplate = {
  id: 'ont-div-factum',
  name: 'Factum - Divisional Court of Ontario',
  court: 'Divisional Court of Ontario',
  jurisdiction: 'ON',
  description: 'Factum for appeals and applications to the Divisional Court pursuant to Rule 68.04',
  formatting: {
    font: 'Times New Roman or Arial',
    fontSize: '12pt',
    lineSpacing: 'Double-spaced',
    margins: '1 inch on all sides',
    pageLimit: 25,
  },
  rules: {
    ruleNumber: 'Rule 68.04',
    ruleName: 'Rules of Civil Procedure',
    url: 'https://www.ontario.ca/laws/regulation/900194',
  },
  sections: [
    {
      id: 'part1-overview',
      title: 'PART I - OVERVIEW',
      required: true,
      description: 'Brief overview of the matter and position',
      placeholder: 'This is an appeal from the decision of [tribunal/court] dated [date]. The Appellant seeks to have the decision set aside on the grounds that...',
      helpText: 'Keep the overview to 1-2 paragraphs. Focus on the key issue and relief sought.',
      formatting: { numbered: false },
    },
    {
      id: 'part2-facts',
      title: 'PART II - FACTS',
      required: true,
      description: 'Statement of material facts',
      placeholder: 'The material facts are as follows:\n\n1. On [date], the Appellant...\n2. The tribunal/lower court found that...',
      helpText: 'State facts chronologically. Reference the record. Be objective and complete.',
      formatting: { numbered: true },
    },
    {
      id: 'part3-issues',
      title: 'PART III - ISSUES',
      required: true,
      description: 'Statement of issues on appeal',
      placeholder: 'The issues on this appeal are:\n\n1. Whether the tribunal erred in law by...\n2. Whether the decision was unreasonable because...',
      helpText: 'Frame as questions. Be specific about the alleged errors.',
      formatting: { numbered: true },
    },
    {
      id: 'part4-law',
      title: 'PART IV - LAW AND ARGUMENT',
      required: true,
      description: 'Legal argument with supporting authorities',
      placeholder: 'A. Standard of Review\n\nThe applicable standard of review is...\n\nB. The Tribunal Erred in Law\n\n...',
      helpText: 'Address standard of review first. Then address each issue with supporting case law.',
      formatting: { numbered: false },
    },
    {
      id: 'part5-relief',
      title: 'PART V - ORDER REQUESTED',
      required: true,
      description: 'Relief sought',
      placeholder: 'The Appellant requests an order:\n\n1. Allowing the appeal;\n2. Setting aside the decision of [tribunal];\n3. Costs of this appeal.',
      helpText: 'Be specific. Include costs.',
      formatting: { numbered: true },
    },
    {
      id: 'authorities',
      title: 'SCHEDULE A - AUTHORITIES',
      required: true,
      description: 'List of authorities cited',
      placeholder: 'Cases:\n1. Canada (Minister of Citizenship and Immigration) v. Vavilov, 2019 SCC 65\n\nStatutes:\n1. Judicial Review Procedure Act, R.S.O. 1990, c. J.1',
      helpText: 'List all authorities cited in the factum.',
      formatting: { numbered: true },
    },
  ],
};

// British Columbia Court of Appeal Factum
export const BC_APPEAL_FACTUM: FactumTemplate = {
  id: 'bc-coa-factum',
  name: 'Factum - Court of Appeal for British Columbia',
  court: 'Court of Appeal for British Columbia',
  jurisdiction: 'BC',
  description: 'Factum for appeals to the BC Court of Appeal pursuant to the Court of Appeal Rules',
  formatting: {
    font: 'Times New Roman, Arial, or Calibri',
    fontSize: '12pt minimum',
    lineSpacing: 'Double-spaced (1.5 for quotations)',
    margins: '1 inch on all sides',
    wordLimit: 12000,
  },
  rules: {
    ruleNumber: 'Rule 31',
    ruleName: 'Court of Appeal Rules',
    url: 'https://www.bccourts.ca/Court_of_Appeal/practice_and_procedure/',
  },
  sections: [
    {
      id: 'opening',
      title: 'OPENING STATEMENT',
      required: true,
      description: 'Brief overview (max 2 pages)',
      placeholder: 'This appeal concerns [brief description]. The central issue is whether [state issue]. The Appellant submits that the trial judge erred by...',
      helpText: 'Maximum 2 pages. Orient the reader to the key issues.',
      maxWords: 500,
      formatting: { numbered: false },
    },
    {
      id: 'facts',
      title: 'STATEMENT OF FACTS',
      required: true,
      description: 'Concise statement of facts relevant to the appeal',
      placeholder: '1. The parties\n\n2. Background facts\n\n3. The proceedings below\n\n4. The judgment under appeal',
      helpText: 'Include only facts relevant to the issues on appeal. Reference the Appeal Book.',
      formatting: { numbered: true },
    },
    {
      id: 'issues',
      title: 'ISSUES ON APPEAL',
      required: true,
      description: 'Clear statement of issues',
      placeholder: '1. Did the trial judge err in finding that...?\n2. Is the trial judge\'s award of damages supportable?',
      helpText: 'State each issue as a question. Be precise.',
      formatting: { numbered: true },
    },
    {
      id: 'argument',
      title: 'ARGUMENT',
      required: true,
      description: 'Legal argument organized by issue',
      placeholder: 'A. Standard of Review\n\n[Discuss applicable standards]\n\nB. Issue 1: [Title]\n\n[Legal argument with authorities]\n\nC. Issue 2: [Title]\n\n[Legal argument with authorities]',
      helpText: 'Address each issue in order. State standard of review. Cite authorities properly.',
      formatting: { numbered: false },
    },
    {
      id: 'nature-of-order',
      title: 'NATURE OF ORDER SOUGHT',
      required: true,
      description: 'Specific relief requested',
      placeholder: 'The Appellant seeks an order:\n(a) allowing the appeal;\n(b) setting aside the judgment dated [date];\n(c) [specific relief];\n(d) costs throughout.',
      helpText: 'Be specific about the order you want the court to make.',
      formatting: { numbered: false },
    },
    {
      id: 'authorities',
      title: 'LIST OF AUTHORITIES',
      required: true,
      description: 'All authorities cited',
      placeholder: 'Cases\n\n1. Housen v. Nikolaisen, 2002 SCC 33\n\nStatutes\n\n1. Court of Appeal Act, R.S.B.C. 1996, c. 77',
      helpText: 'List all authorities cited. Use proper citation format.',
      formatting: { numbered: true },
    },
  ],
};

// Alberta Court of Appeal Factum
export const ALBERTA_APPEAL_FACTUM: FactumTemplate = {
  id: 'ab-coa-factum',
  name: 'Factum - Court of Appeal of Alberta',
  court: 'Court of Appeal of Alberta',
  jurisdiction: 'AB',
  description: 'Factum for appeals to the Alberta Court of Appeal pursuant to the Alberta Rules of Court',
  formatting: {
    font: 'Arial or Times New Roman',
    fontSize: '12pt',
    lineSpacing: 'Double-spaced',
    margins: '1 inch on all sides',
    pageLimit: 30,
  },
  rules: {
    ruleNumber: 'Part 14, Division 5',
    ruleName: 'Alberta Rules of Court',
    url: 'https://www.qp.alberta.ca/documents/Rules2010/Rules_vol_1.pdf',
  },
  sections: [
    {
      id: 'introduction',
      title: 'INTRODUCTION',
      required: true,
      description: 'Brief introduction to the appeal',
      placeholder: 'This is an appeal from the judgment of Justice [Name] of the Court of King\'s Bench of Alberta, dated [date], in which...',
      helpText: 'Provide context for the appeal in 1-2 paragraphs.',
      formatting: { numbered: false },
    },
    {
      id: 'facts',
      title: 'STATEMENT OF FACTS',
      required: true,
      description: 'Material facts relevant to the appeal',
      placeholder: '1. The Appellant is...\n2. The Respondent is...\n3. On [date], the following occurred...',
      helpText: 'State facts neutrally and chronologically. Reference the record.',
      formatting: { numbered: true },
    },
    {
      id: 'grounds',
      title: 'GROUNDS OF APPEAL',
      required: true,
      description: 'Specific grounds for the appeal',
      placeholder: 'The Appellant appeals on the following grounds:\n\n1. The trial judge erred in law by...\n2. The trial judge made a palpable and overriding error of fact by...',
      helpText: 'State each ground clearly and specifically.',
      formatting: { numbered: true },
    },
    {
      id: 'standard',
      title: 'STANDARD OF REVIEW',
      required: true,
      description: 'Applicable standards of review',
      placeholder: 'The applicable standards of review are:\n\n1. Questions of law: Correctness\n2. Questions of fact: Palpable and overriding error\n3. Questions of mixed fact and law: [depends on whether extricable question of law]',
      helpText: 'Identify the standard for each ground of appeal.',
      formatting: { numbered: true },
    },
    {
      id: 'argument',
      title: 'ARGUMENT',
      required: true,
      description: 'Legal argument on each ground',
      placeholder: 'A. Ground 1: The Trial Judge Erred in Law\n\n[Legal argument with authorities]\n\nB. Ground 2: Palpable and Overriding Error\n\n[Legal argument with authorities]',
      helpText: 'Address each ground of appeal with supporting authorities.',
      formatting: { numbered: false },
    },
    {
      id: 'relief',
      title: 'RELIEF SOUGHT',
      required: true,
      description: 'Order requested from the court',
      placeholder: 'The Appellant requests that this Honourable Court:\n\n1. Allow the appeal;\n2. Set aside the judgment below;\n3. [Specify relief];\n4. Award costs to the Appellant.',
      helpText: 'Be specific about the relief you are seeking.',
      formatting: { numbered: true },
    },
    {
      id: 'authorities',
      title: 'LIST OF AUTHORITIES',
      required: true,
      description: 'Authorities cited in the factum',
      placeholder: 'CASES\n\n1. Housen v. Nikolaisen, 2002 SCC 33\n2. ...\n\nLEGISLATION\n\n1. Alberta Rules of Court, Alta Reg 124/2010',
      helpText: 'List all authorities in order of importance.',
      formatting: { numbered: true },
    },
  ],
};

// Federal Court of Appeal Memorandum of Fact and Law
export const FEDERAL_APPEAL_FACTUM: FactumTemplate = {
  id: 'fed-coa-factum',
  name: 'Memorandum of Fact and Law - Federal Court of Appeal',
  court: 'Federal Court of Appeal',
  jurisdiction: 'FED',
  description: 'Memorandum for appeals to the Federal Court of Appeal pursuant to the Federal Courts Rules',
  formatting: {
    font: 'Times New Roman or Arial',
    fontSize: '12pt',
    lineSpacing: 'Double-spaced',
    margins: '1 inch on all sides',
    pageLimit: 30,
  },
  rules: {
    ruleNumber: 'Rule 70',
    ruleName: 'Federal Courts Rules',
    url: 'https://laws-lois.justice.gc.ca/eng/regulations/SOR-98-106/',
  },
  sections: [
    {
      id: 'part1-facts',
      title: 'PART I - STATEMENT OF FACTS',
      required: true,
      description: 'Concise statement of the facts',
      placeholder: 'A. Overview\n\n1. This is an appeal from the decision of the Federal Court dated [date]...\n\nB. Background Facts\n\n2. The Appellant is...\n\nC. Proceedings Below\n\n3. The Federal Court found that...',
      helpText: 'Include overview, background, and the decision under appeal.',
      formatting: { numbered: true },
    },
    {
      id: 'part2-issues',
      title: 'PART II - STATEMENT OF THE ISSUES',
      required: true,
      description: 'Issues to be determined on appeal',
      placeholder: '1. Did the Federal Court err in its interpretation of section X of the Act?\n2. Did the Federal Court apply the correct standard of review?',
      helpText: 'Frame each issue as a question. Be specific.',
      formatting: { numbered: true },
    },
    {
      id: 'part3-argument',
      title: 'PART III - SUBMISSIONS',
      required: true,
      description: 'Legal argument on each issue',
      placeholder: 'A. Standard of Review\n\n1. Following Canada (Minister of Citizenship and Immigration) v. Vavilov, 2019 SCC 65, the standard of review is...\n\nB. The Federal Court Erred\n\n2. The Federal Court erred because...',
      helpText: 'Address standard of review first, then each issue with authorities.',
      formatting: { numbered: true },
    },
    {
      id: 'part4-relief',
      title: 'PART IV - ORDER SOUGHT',
      required: true,
      description: 'Relief requested',
      placeholder: 'The Appellant requests that this Honourable Court:\n\na) allow the appeal;\nb) set aside the judgment of the Federal Court;\nc) [specific relief];\nd) costs.',
      helpText: 'Be specific about the order you want.',
      formatting: { numbered: false },
    },
    {
      id: 'part5-authorities',
      title: 'PART V - LIST OF AUTHORITIES',
      required: true,
      description: 'All authorities cited',
      placeholder: 'Jurisprudence\n\n1. Canada (Minister of Citizenship and Immigration) v. Vavilov, 2019 SCC 65\n\nLegislation\n\n1. Federal Courts Act, R.S.C. 1985, c. F-7',
      helpText: 'List all authorities. Use McGill Guide citation format.',
      formatting: { numbered: true },
    },
  ],
};

// Supreme Court of Canada Factum
export const SCC_FACTUM: FactumTemplate = {
  id: 'scc-factum',
  name: 'Factum - Supreme Court of Canada',
  court: 'Supreme Court of Canada',
  jurisdiction: 'FED',
  description: 'Factum for appeals to the Supreme Court of Canada pursuant to the Rules of the Supreme Court of Canada',
  formatting: {
    font: 'Book Antiqua, Times New Roman, or Arial',
    fontSize: '12pt',
    lineSpacing: 'Double-spaced',
    margins: '1 inch on all sides',
    pageLimit: 40,
  },
  rules: {
    ruleNumber: 'Rule 42',
    ruleName: 'Rules of the Supreme Court of Canada',
    url: 'https://laws-lois.justice.gc.ca/eng/regulations/SOR-2002-156/',
  },
  sections: [
    {
      id: 'part1-overview',
      title: 'PART I - OVERVIEW AND STATEMENT OF FACTS',
      required: true,
      description: 'Overview of the case and statement of facts',
      placeholder: 'A. Overview\n\n1. This appeal raises the following question of national importance: [state question]...\n\nB. Statement of Facts\n\n2. The material facts are as follows...',
      helpText: 'The overview should explain why this case matters nationally. Facts must be accurate and fair.',
      formatting: { numbered: true },
    },
    {
      id: 'part2-questions',
      title: 'PART II - QUESTIONS IN ISSUE',
      required: true,
      description: 'Questions before the Court',
      placeholder: '1. What is the proper interpretation of section X?\n2. Should this Court reconsider the approach established in [case]?',
      helpText: 'Frame questions clearly. These should be the constitutional or legal questions of national importance.',
      formatting: { numbered: true },
    },
    {
      id: 'part3-argument',
      title: 'PART III - STATEMENT OF ARGUMENT',
      required: true,
      description: 'Comprehensive legal argument',
      placeholder: 'A. Introduction\n\n1. The Appellant submits that...\n\nB. Analysis of the First Question\n\n2. The proper interpretation of section X is...\n\nC. Policy Considerations\n\n3. This interpretation promotes...',
      helpText: 'Develop arguments fully. Address jurisprudence, legislative history, and policy.',
      formatting: { numbered: true },
    },
    {
      id: 'part4-costs',
      title: 'PART IV - SUBMISSIONS ON COSTS',
      required: true,
      description: 'Submissions regarding costs',
      placeholder: '1. The Appellant seeks its costs throughout.\n\n2. In the alternative, if unsuccessful, the Appellant submits that costs should not be awarded against it because...',
      helpText: 'Address costs. Special cost rules may apply in public interest cases.',
      formatting: { numbered: true },
    },
    {
      id: 'part5-relief',
      title: 'PART V - ORDER SOUGHT',
      required: true,
      description: 'Precise order requested',
      placeholder: 'The Appellant requests that this Honourable Court:\n\n1. Allow the appeal;\n2. Answer the constitutional question as follows: [answer];\n3. [Specific relief];\n4. Award costs throughout.',
      helpText: 'Be precise. If constitutional questions were stated, provide proposed answers.',
      formatting: { numbered: true },
    },
    {
      id: 'part6-authorities',
      title: 'PART VI - TABLE OF AUTHORITIES',
      required: true,
      description: 'Complete list of authorities',
      placeholder: 'JURISPRUDENCE                                           Paragraph(s)\n\nReference re Secession of Quebec, [1998] 2 S.C.R. 217      12, 45\n\nSTATUTES AND REGULATIONS\n\nConstitution Act, 1982, s. 52                               1, 15',
      helpText: 'Include paragraph references. Use McGill Guide format.',
      formatting: { numbered: false },
    },
    {
      id: 'part7-legislation',
      title: 'PART VII - STATUTORY PROVISIONS',
      required: true,
      description: 'Relevant statutory provisions',
      placeholder: 'Constitution Act, 1982\n\nSection 52\n(1) The Constitution of Canada is the supreme law of Canada...',
      helpText: 'Include complete text of relevant provisions in both official languages if applicable.',
      formatting: { numbered: false },
    },
  ],
};

// Motion Factum Template
export const MOTION_FACTUM: FactumTemplate = {
  id: 'motion-factum',
  name: 'Factum on Motion - Superior Court',
  court: 'Superior Court of Justice',
  jurisdiction: 'ON',
  description: 'Factum for substantive motions in the Superior Court of Justice',
  formatting: {
    font: 'Times New Roman or Arial',
    fontSize: '12pt',
    lineSpacing: 'Double-spaced',
    margins: '1 inch on all sides',
    pageLimit: 20,
  },
  rules: {
    ruleNumber: 'Rule 37',
    ruleName: 'Rules of Civil Procedure',
    url: 'https://www.ontario.ca/laws/regulation/900194',
  },
  sections: [
    {
      id: 'part1-overview',
      title: 'PART I - OVERVIEW',
      required: true,
      description: 'Brief overview of the motion',
      placeholder: 'The Moving Party brings this motion for [describe relief]. The central issue is [state issue].',
      helpText: 'Keep to 1-2 paragraphs. Orient the reader quickly.',
      formatting: { numbered: false },
    },
    {
      id: 'part2-facts',
      title: 'PART II - FACTS',
      required: true,
      description: 'Material facts for the motion',
      placeholder: '1. The Moving Party is the [plaintiff/defendant] in this action.\n2. On [date], the following occurred...',
      helpText: 'State only facts relevant to the motion. Reference supporting affidavits.',
      formatting: { numbered: true },
    },
    {
      id: 'part3-issues',
      title: 'PART III - ISSUES',
      required: true,
      description: 'Issues on the motion',
      placeholder: '1. Should the Court grant summary judgment?\n2. Is there a genuine issue requiring a trial?',
      helpText: 'Frame as questions specific to the motion.',
      formatting: { numbered: true },
    },
    {
      id: 'part4-law',
      title: 'PART IV - LAW AND ARGUMENT',
      required: true,
      description: 'Legal argument with authorities',
      placeholder: 'A. The Test for Summary Judgment\n\nPursuant to Rule 20 and Hryniak v. Mauldin, 2014 SCC 7...\n\nB. Application to This Case\n\n...',
      helpText: 'State the applicable legal test, then apply it to the facts.',
      formatting: { numbered: false },
    },
    {
      id: 'part5-relief',
      title: 'PART V - RELIEF SOUGHT',
      required: true,
      description: 'Order requested',
      placeholder: 'The Moving Party requests:\n\n1. An order granting summary judgment;\n2. Damages in the amount of $[amount];\n3. Costs of this motion on a substantial indemnity basis.',
      helpText: 'Be specific about the relief sought.',
      formatting: { numbered: true },
    },
    {
      id: 'authorities',
      title: 'SCHEDULE A - LIST OF AUTHORITIES',
      required: true,
      description: 'Authorities cited',
      placeholder: 'Cases:\n1. Hryniak v. Mauldin, 2014 SCC 7\n\nRules:\n1. Rules of Civil Procedure, R.R.O. 1990, Reg. 194, Rule 20',
      helpText: 'List all authorities cited.',
      formatting: { numbered: true },
    },
  ],
};

// All templates registry
export const FACTUM_TEMPLATES: Record<string, FactumTemplate> = {
  'ont-coa-factum': ONTARIO_APPEAL_FACTUM,
  'ont-div-factum': ONTARIO_DIVISIONAL_FACTUM,
  'bc-coa-factum': BC_APPEAL_FACTUM,
  'ab-coa-factum': ALBERTA_APPEAL_FACTUM,
  'fed-coa-factum': FEDERAL_APPEAL_FACTUM,
  'scc-factum': SCC_FACTUM,
  'motion-factum': MOTION_FACTUM,
};

export function getFactumTemplate(templateId: string): FactumTemplate | null {
  return FACTUM_TEMPLATES[templateId] || null;
}

export function getFactumTemplatesByJurisdiction(jurisdiction: string): FactumTemplate[] {
  return Object.values(FACTUM_TEMPLATES).filter(
    t => t.jurisdiction === jurisdiction || t.jurisdiction === 'FED'
  );
}

// Citation formatting helpers
export function formatCitation(citation: Citation): string {
  let formatted = citation.caseName;
  if (citation.citation) {
    formatted += `, ${citation.citation}`;
  }
  if (citation.paragraph) {
    formatted += ` at para ${citation.paragraph}`;
  }
  if (citation.pinpoint) {
    formatted += `, ${citation.pinpoint}`;
  }
  return formatted;
}

// Canadian common authorities
export const COMMON_AUTHORITIES: Citation[] = [
  {
    id: 'housen',
    caseName: 'Housen v. Nikolaisen',
    citation: '2002 SCC 33',
    year: 2002,
    court: 'SCC',
    category: 'binding',
  },
  {
    id: 'vavilov',
    caseName: 'Canada (Minister of Citizenship and Immigration) v. Vavilov',
    citation: '2019 SCC 65',
    year: 2019,
    court: 'SCC',
    category: 'binding',
  },
  {
    id: 'hryniak',
    caseName: 'Hryniak v. Mauldin',
    citation: '2014 SCC 7',
    year: 2014,
    court: 'SCC',
    category: 'binding',
  },
  {
    id: 'donoghue',
    caseName: 'Donoghue v. Stevenson',
    citation: '[1932] AC 562',
    year: 1932,
    court: 'House of Lords',
    category: 'binding',
  },
  {
    id: 'oakes',
    caseName: 'R. v. Oakes',
    citation: '[1986] 1 S.C.R. 103',
    year: 1986,
    court: 'SCC',
    category: 'binding',
  },
  {
    id: 'grant',
    caseName: 'R. v. Grant',
    citation: '2009 SCC 32',
    year: 2009,
    court: 'SCC',
    category: 'binding',
  },
  {
    id: 'jordan',
    caseName: 'R. v. Jordan',
    citation: '2016 SCC 27',
    year: 2016,
    court: 'SCC',
    category: 'binding',
  },
  {
    id: 'sattva',
    caseName: 'Sattva Capital Corp. v. Creston Moly Corp.',
    citation: '2014 SCC 53',
    year: 2014,
    court: 'SCC',
    category: 'binding',
  },
];
