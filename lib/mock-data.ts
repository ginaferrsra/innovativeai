import type { User, Case, Document, WorkflowTask, LegalAnalysis, CourtForm, CanadianCharter } from './types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'sarah.chen@torontolawfirm.ca',
    name: 'Sarah Chen',
    role: 'lawyer',
    jurisdiction: ['Ontario', 'Federal'],
    firm: 'Toronto Legal Associates',
    licenseNumber: 'ONT-12345',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'user-2',
    email: 'james.smith@example.ca',
    name: 'James Smith',
    role: 'self-represented',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

export const mockCases: Case[] = [
  {
    id: 'case-1',
    title: 'Smith v. Metro Health Services',
    description: 'Medical negligence claim arising from surgical procedure complications',
    type: 'civil_lawsuit',
    status: 'active',
    jurisdiction: 'Ontario',
    courtLevel: 'superior',
    createdBy: 'user-1',
    assignedTo: ['user-1'],
    clients: ['user-2'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-15'),
    tags: ['medical-negligence', 'damages', 'discovery'],
  },
  {
    id: 'case-2',
    title: 'R v. Thompson',
    description: 'Criminal defence for charges of fraud and money laundering',
    type: 'criminal_defence',
    status: 'active',
    jurisdiction: 'Ontario',
    courtLevel: 'superior',
    createdBy: 'user-1',
    assignedTo: ['user-1'],
    clients: ['user-3'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-10'),
    tags: ['criminal', 'fraud', 'defence-strategy'],
  },
];

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    caseId: 'case-1',
    title: 'Statement of Claim',
    type: 'brief',
    content: 'Plaintiff claims damages for medical malpractice occurring on January 15, 2023...',
    extractedData: {
      claimAmount: 500000,
      injuries: ['post-surgical infection', 'extended hospitalization'],
      dateOfIncident: '2023-01-15',
    },
    uploadedBy: 'user-1',
    uploadedAt: new Date('2024-02-01'),
    processedAt: new Date('2024-02-02'),
    status: 'processed',
  },
];

export const mockWorkflowTasks: WorkflowTask[] = [
  {
    id: 'task-1',
    caseId: 'case-1',
    title: 'Analyze Medical Records',
    description: 'Review plaintiff medical records for causal connection to alleged negligence',
    type: 'document_analysis',
    status: 'completed',
    priority: 'high',
    assignedTo: 'user-1',
    createdAt: new Date('2024-02-02'),
    completedAt: new Date('2024-02-05'),
    result: {
      analysis: 'Medical records show clear temporal connection between procedure and complications.',
      recommendations: ['Retain expert medical witness', 'Request defendant hospital records'],
      confidence: 0.92,
    },
  },
  {
    id: 'task-2',
    caseId: 'case-1',
    title: 'Legal Research on Negligence Standard',
    description: 'Research applicable standard of care for surgical procedures in Ontario',
    type: 'legal_research',
    status: 'processing',
    priority: 'high',
    assignedTo: 'user-1',
    createdAt: new Date('2024-02-10'),
    scheduledFor: new Date('2024-02-12'),
  },
];

export const mockLegalAnalysis: LegalAnalysis[] = [
  {
    id: 'analysis-1',
    caseId: 'case-1',
    documentId: 'doc-1',
    analysisType: 'risk_assessment',
    result: {
      summary: 'Strong case for medical negligence with moderate damages potential',
      keyFindings: [
        'Clear breach of duty of care identified',
        'Direct causal link between breach and damages',
        'Quantifiable damages documented',
      ],
      risks: [
        {
          level: 'medium',
          description: 'Defendant may argue pre-existing condition contributed to complications',
        },
        {
          level: 'low',
          description: 'Statute of limitations defense (action brought within limitation period)',
        },
      ],
      recommendations: [
        'Retain independent medical expert to establish standard of care',
        'Gather all medical records from past 10 years for context',
        'Consider structured settlement negotiation',
      ],
      applicableLaw: {
        statute: 'Negligence Act (Ontario)',
        charter: 'Canadian Charter of Rights and Freedoms - Right to life, liberty and security',
      },
    },
    createdAt: new Date('2024-02-05'),
    relevantCaselaw: [
      {
        citation: 'Ter Neuzen v. Korn, [1995] 3 S.C.R. 674',
        relevance: 'highly_relevant',
      },
      {
        citation: 'White v. Stonestreet, 2006 CanLII 26171 (ON SC)',
        relevance: 'highly_relevant',
      },
    ],
  },
];

export const mockCourtForms: CourtForm[] = [
  {
    id: 'form-1',
    jurisdiction: 'Ontario',
    city: 'Toronto',
    court: 'Superior Court of Justice',
    formName: 'Statement of Claim',
    formNumber: 'SCF 01A',
    description: 'General statement of claim for civil litigation',
    url: 'https://www.ontario.ca/laws/statute/911191',
    lastUpdated: new Date('2024-01-15'),
    category: 'civil',
  },
  {
    id: 'form-2',
    jurisdiction: 'Ontario',
    city: 'Toronto',
    court: 'Superior Court of Justice',
    formName: 'Notice of Motion',
    formNumber: 'SCF 02A',
    description: 'Notice of motion for interlocutory orders',
    url: 'https://www.ontario.ca/laws/statute/911191',
    lastUpdated: new Date('2024-01-15'),
    category: 'civil',
  },
];

export const mockCharterRights: CanadianCharter[] = [
  {
    section: 2,
    title: 'Fundamental Freedoms',
    text: 'Everyone has the following fundamental freedoms: (a) freedom of conscience and religion; (b) freedom of thought, belief, expression and the freedom of the press and other media of communication; (c) freedom of peaceful assembly; and (d) freedom of association.',
    applicableCourts: ['all'],
  },
  {
    section: 7,
    title: 'Life, Liberty and Security',
    text: 'Everyone has the right to life, liberty and security of the person.',
    applicableCourts: ['all'],
  },
  {
    section: 8,
    title: 'Search or Seizure',
    text: 'Everyone has the right to be secure against unreasonable search or seizure.',
    applicableCourts: ['all'],
  },
  {
    section: 9,
    title: 'Arbitrary Detention',
    text: 'Everyone has the right not to be arbitrarily detained or imprisoned.',
    applicableCourts: ['all'],
  },
];
