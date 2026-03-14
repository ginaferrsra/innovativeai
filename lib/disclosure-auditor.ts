// Stinchcombe Disclosure Auditor & R. v. Grant Test Automator
// Based on R. v. Stinchcombe [1991] 3 SCR 326 and R. v. Grant [2009] SCC 32

export interface DisclosureItem {
  id: string;
  category: string;
  item: string;
  required: boolean;
  description: string;
  present: boolean;
  notes?: string;
}

export interface DisclosureAudit {
  case_type: string;
  total_items: number;
  present_count: number;
  missing_count: number;
  compliance_score: number;
  items: DisclosureItem[];
  missing_critical: DisclosureItem[];
  recommendations: string[];
  draft_letter: string;
}

export interface GrantTestResult {
  evidence_description: string;
  branch_1: { score: number; analysis: string; factors: string[] };
  branch_2: { score: number; analysis: string; factors: string[] };
  branch_3: { score: number; analysis: string; factors: string[] };
  overall_exclusion_probability: number;
  recommendation: 'exclude' | 'admit' | 'borderline';
  summary: string;
}

// Standard disclosure checklist for weapon/firearm offences
const WEAPON_DISCLOSURE_CHECKLIST: Omit<DisclosureItem, 'id' | 'present' | 'notes'>[] = [
  { category: 'Arrest', item: 'Arresting Officer Notes', required: true, description: 'Complete notes from the arresting officer(s) including time, location, and circumstances' },
  { category: 'Arrest', item: 'Arrest Report / Occurrence Report', required: true, description: 'Official occurrence report with all relevant details' },
  { category: 'Arrest', item: 'Body-Worn Camera Footage', required: true, description: 'Body camera footage from all officers present at the scene' },
  { category: 'Arrest', item: 'In-Car Camera Footage', required: true, description: 'Dashboard camera footage from patrol vehicles' },
  { category: 'Arrest', item: 'Caution / Charter Rights Record', required: true, description: 'Record confirming when and how Charter rights were read' },
  { category: 'Arrest', item: 'Right to Counsel Implementation', required: true, description: 'Record showing accused was provided opportunity to contact counsel' },
  { category: 'Search', item: 'Search Warrant (if applicable)', required: true, description: 'Copy of search warrant including Information to Obtain (ITO)' },
  { category: 'Search', item: 'Information to Obtain (ITO)', required: true, description: 'Sworn information used to obtain the search warrant' },
  { category: 'Search', item: 'Search Report / Inventory', required: true, description: 'Complete inventory of items found and seized during search' },
  { category: 'Search', item: 'Photographs of Search Scene', required: true, description: 'Photographs documenting the search location and seized items' },
  { category: 'Evidence', item: 'Firearm Examination Report', required: true, description: 'Expert analysis of the seized firearm including classification and operability' },
  { category: 'Evidence', item: 'IBIS Report (Ballistics)', required: false, description: 'Integrated Ballistics Identification System report if applicable' },
  { category: 'Evidence', item: 'Fingerprint Analysis', required: false, description: 'Fingerprint analysis from seized items' },
  { category: 'Evidence', item: 'DNA Analysis', required: false, description: 'DNA analysis if applicable' },
  { category: 'Evidence', item: 'Chain of Custody Records', required: true, description: 'Complete documentation of evidence handling and storage' },
  { category: 'Evidence', item: 'Continuity of Evidence Report', required: true, description: 'Report establishing the continuity of all exhibits' },
  { category: 'Witnesses', item: 'Witness Statements', required: true, description: 'Statements from all civilian witnesses' },
  { category: 'Witnesses', item: 'Supplementary Officer Notes', required: true, description: 'Notes from all officers involved, not just arresting officer' },
  { category: 'Witnesses', item: 'Expert Witness Reports', required: false, description: 'Reports from any expert witnesses the Crown intends to call' },
  { category: 'Background', item: 'Accused Criminal Record (CPIC)', required: true, description: 'Canadian Police Information Centre record' },
  { category: 'Background', item: 'Prior Contact Records', required: false, description: 'Records of prior police contact with the accused' },
  { category: 'Background', item: 'Firearms Registry Check', required: true, description: 'Canadian Firearms Program registry check results' },
  { category: 'Proceedings', item: '911 Call Recording', required: false, description: 'Recording and transcript of any 911 calls' },
  { category: 'Proceedings', item: 'Dispatch Communications', required: true, description: 'Police dispatch recordings and Computer-Aided Dispatch logs' },
  { category: 'Proceedings', item: 'Interview / Interrogation Recording', required: true, description: 'Audio/video recording of any interviews with the accused' },
  { category: 'Proceedings', item: 'KGB Statements', required: false, description: 'Prior inconsistent statements under oath (R. v. B.(K.G.))' },
];

export class DisclosureAuditorEngine {
  /**
   * Run Stinchcombe disclosure audit against standard checklist
   */
  static auditDisclosure(
    caseType: string,
    providedItems: string[],
    documentText?: string
  ): DisclosureAudit {
    const checklist = this.getChecklist(caseType);
    const normalizedProvided = providedItems.map((i) => i.toLowerCase().trim());
    const textLower = (documentText || '').toLowerCase();

    const auditedItems: DisclosureItem[] = checklist.map((item, index) => {
      const nameMatch = normalizedProvided.some(
        (p) => p.includes(item.item.toLowerCase()) || item.item.toLowerCase().includes(p)
      );
      const textMatch = textLower.includes(item.item.toLowerCase()) ||
        textLower.includes(item.category.toLowerCase() + ' ' + item.item.split(' ')[0].toLowerCase());

      return {
        ...item,
        id: `di-${index}`,
        present: nameMatch || textMatch,
      };
    });

    const presentCount = auditedItems.filter((i) => i.present).length;
    const missingCount = auditedItems.filter((i) => !i.present).length;
    const missingCritical = auditedItems.filter((i) => !i.present && i.required);

    return {
      case_type: caseType,
      total_items: auditedItems.length,
      present_count: presentCount,
      missing_count: missingCount,
      compliance_score: (presentCount / auditedItems.length) * 100,
      items: auditedItems,
      missing_critical: missingCritical,
      recommendations: this.generateRecommendations(missingCritical),
      draft_letter: this.generateDisclosureRequest(missingCritical, caseType),
    };
  }

  private static getChecklist(caseType: string): Omit<DisclosureItem, 'id' | 'present' | 'notes'>[] {
    // Return weapon checklist for weapon/firearm cases, expand for others
    return WEAPON_DISCLOSURE_CHECKLIST;
  }

  private static generateRecommendations(missingCritical: DisclosureItem[]): string[] {
    const recs: string[] = [];
    if (missingCritical.length === 0) {
      recs.push('Disclosure appears substantially complete per Stinchcombe obligations');
      return recs;
    }

    recs.push(`${missingCritical.length} critical disclosure items are missing - formal request recommended`);

    if (missingCritical.some((i) => i.item.includes('Body-Worn Camera'))) {
      recs.push('CRITICAL: Body-worn camera footage missing - may indicate non-recording or suppression. Demand production with covering letter.');
    }
    if (missingCritical.some((i) => i.item.includes('Firearm Examination'))) {
      recs.push('CRITICAL: No firearm examination report - Crown cannot prove weapon classification or operability without this.');
    }
    if (missingCritical.some((i) => i.item.includes('Caution') || i.item.includes('Charter Rights'))) {
      recs.push('CRITICAL: No record of Charter caution - strong basis for s.10(b) breach application.');
    }
    if (missingCritical.some((i) => i.item.includes('Search Warrant') || i.item.includes('ITO'))) {
      recs.push('CRITICAL: Search warrant and/or ITO missing - cannot assess legality of search for s.8 motion.');
    }

    return recs;
  }

  private static generateDisclosureRequest(missingItems: DisclosureItem[], caseType: string): string {
    const items = missingItems.map((i) => `- ${i.item}: ${i.description}`).join('\n');
    return `[Date]\n\n[Crown Attorney Name]\nCrown Attorney's Office\n[Court Location]\n\nRe: R. v. [Accused Name]\n[Court File Number]\n\nDear Crown Counsel,\n\nPursuant to R. v. Stinchcombe, [1991] 3 S.C.R. 326, and the Crown's ongoing disclosure obligations, I am writing to request the following outstanding disclosure materials:\n\n${items}\n\nThe duty to disclose is not limited to materials the Crown intends to rely on at trial, but extends to all relevant information in the possession or control of the Crown. The failure to provide complete disclosure constitutes a breach of the accused's rights under section 7 of the Canadian Charter of Rights and Freedoms.\n\nPlease provide the above materials at your earliest convenience, and in any event no later than [14 days from date]. Should disclosure remain incomplete, we reserve the right to bring a motion for a stay of proceedings pursuant to s. 24(1) of the Charter.\n\nYours truly,\n\n[Counsel Name]\n[Firm Name]\n[Contact Information]`;
  }
}

export class GrantTestEngine {
  /**
   * Run the three-part R. v. Grant [2009] SCC 32 test for s.24(2) evidence exclusion
   */
  static analyzeExclusion(
    breachDescription: string,
    evidenceDescription: string,
    context: {
      breach_type: string;
      was_deliberate: boolean;
      was_urgent: boolean;
      evidence_is_bodily: boolean;
      evidence_is_statement: boolean;
      evidence_is_physical: boolean;
      offence_severity: 'minor' | 'moderate' | 'serious';
      impact_on_accused: 'minimal' | 'moderate' | 'significant' | 'severe';
    }
  ): GrantTestResult {
    // Branch 1: Seriousness of the Charter-infringing State Conduct
    const branch1 = this.analyzeBranch1(context);

    // Branch 2: Impact on the Charter-Protected Interests of the Accused
    const branch2 = this.analyzeBranch2(context);

    // Branch 3: Society's Interest in Adjudication on the Merits
    const branch3 = this.analyzeBranch3(context);

    // Calculate overall exclusion probability
    const exclusionScore = (branch1.score * 0.35) + (branch2.score * 0.35) + ((1 - branch3.score) * 0.30);

    return {
      evidence_description: evidenceDescription,
      branch_1: branch1,
      branch_2: branch2,
      branch_3: branch3,
      overall_exclusion_probability: Math.round(exclusionScore * 100) / 100,
      recommendation: exclusionScore > 0.65 ? 'exclude' : exclusionScore > 0.40 ? 'borderline' : 'admit',
      summary: this.generateSummary(branch1, branch2, branch3, exclusionScore),
    };
  }

  private static analyzeBranch1(context: any): { score: number; analysis: string; factors: string[] } {
    let score = 0.5;
    const factors: string[] = [];

    if (context.was_deliberate) {
      score += 0.3;
      factors.push('Breach appears deliberate or systematic - weighs heavily toward exclusion (R. v. Harrison [2009] SCC 34)');
    } else {
      score -= 0.1;
      factors.push('Breach may have been made in good faith - still weighs toward exclusion but less strongly');
    }

    if (!context.was_urgent) {
      score += 0.1;
      factors.push('No exigent circumstances justified the state conduct');
    } else {
      score -= 0.15;
      factors.push('Exigent circumstances may partially mitigate state conduct');
    }

    if (context.breach_type === 's.8' || context.breach_type === 's.10(b)') {
      score += 0.1;
      factors.push(`${context.breach_type} breach is well-established in law - officers should have known better`);
    }

    return {
      score: Math.min(1, Math.max(0, score)),
      analysis: 'Seriousness of the Charter-Infringing State Conduct',
      factors,
    };
  }

  private static analyzeBranch2(context: any): { score: number; analysis: string; factors: string[] } {
    let score = 0.5;
    const factors: string[] = [];

    if (context.evidence_is_bodily) {
      score += 0.3;
      factors.push('Bodily evidence (breath, blood, DNA) involves highest privacy interest - strongly favors exclusion');
    }
    if (context.evidence_is_statement) {
      score += 0.25;
      factors.push('Self-incriminating statement - right against self-incrimination deeply engaged');
    }
    if (context.evidence_is_physical) {
      score -= 0.1;
      factors.push('Physical evidence (discoverable) has lower impact on accused interests than statements');
    }

    const impactScores: Record<string, number> = { minimal: -0.15, moderate: 0, significant: 0.15, severe: 0.3 };
    score += impactScores[context.impact_on_accused] || 0;
    factors.push(`Impact on accused assessed as "${context.impact_on_accused}"`);

    return {
      score: Math.min(1, Math.max(0, score)),
      analysis: 'Impact on the Charter-Protected Interests of the Accused',
      factors,
    };
  }

  private static analyzeBranch3(context: any): { score: number; analysis: string; factors: string[] } {
    let score = 0.5;
    const factors: string[] = [];

    const severityScores: Record<string, number> = { minor: -0.2, moderate: 0.1, serious: 0.3 };
    score += severityScores[context.offence_severity] || 0;
    factors.push(`Offence severity: "${context.offence_severity}" - ${context.offence_severity === 'serious' ? 'society has strong interest in adjudication' : 'lesser public interest in adjudication'}`);

    if (context.evidence_is_physical) {
      score += 0.15;
      factors.push('Reliable physical evidence - exclusion would gut the prosecution\'s case');
    }
    if (context.evidence_is_statement && context.breach_type === 's.10(b)') {
      score -= 0.1;
      factors.push('Unreliable statement obtained in breach - admission would undermine trial fairness');
    }

    return {
      score: Math.min(1, Math.max(0, score)),
      analysis: 'Society\'s Interest in the Adjudication of the Case on its Merits',
      factors,
    };
  }

  private static generateSummary(
    b1: { score: number },
    b2: { score: number },
    b3: { score: number },
    exclusionScore: number
  ): string {
    if (exclusionScore > 0.65) {
      return `The three-part Grant analysis strongly favors EXCLUSION of this evidence. The state conduct was serious (${(b1.score * 100).toFixed(0)}%), the impact on accused rights was significant (${(b2.score * 100).toFixed(0)}%), and society's interest does not outweigh these factors. Admission would bring the administration of justice into disrepute.`;
    }
    if (exclusionScore > 0.40) {
      return `The Grant analysis is BORDERLINE. State conduct seriousness: ${(b1.score * 100).toFixed(0)}%, impact on accused: ${(b2.score * 100).toFixed(0)}%, society's interest: ${(b3.score * 100).toFixed(0)}%. This is a close case -- the outcome will likely depend on the specific judge's emphasis on individual branches.`;
    }
    return `The Grant analysis favors ADMISSION of this evidence. While Charter rights were engaged, the state conduct was less serious (${(b1.score * 100).toFixed(0)}%), impact was moderate (${(b2.score * 100).toFixed(0)}%), and society has a strong interest in adjudication (${(b3.score * 100).toFixed(0)}%).`;
  }
}
