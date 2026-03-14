import { DocumentElement, CharterBreach, DefenseStrategy, CaseAnalysis } from './types';

/**
 * Canadian Charter of Rights and Freedoms Analyzer
 * Identifies breaches, extracts key judicial language, generates defense strategies
 * Based on Canadian case law patterns
 */

export class CharterAnalyzer {
  // Charter section definitions
  private static readonly CHARTER_SECTIONS = {
    's.2': {
      title: 'Fundamental Freedoms',
      description: 'Freedom of conscience, expression, peaceful assembly, association',
    },
    's.7': {
      title: 'Right to Life, Liberty, Security',
      description: 'Right not to be deprived thereof except in accordance with principles of fundamental justice',
    },
    's.8': {
      title: 'Search and Seizure',
      description: 'Right to be secure against unreasonable search and seizure',
    },
    's.9': {
      title: 'Detention and Imprisonment',
      description: 'Right not to be detained or imprisoned arbitrarily',
    },
    's.10(b)': {
      title: 'Right to Counsel',
      description: 'Right to retain and instruct counsel without delay',
    },
    's.11(b)': {
      title: 'Presumption of Innocence',
      description: 'Presumed innocent until proven guilty',
    },
    's.12': {
      title: 'Treatment or Punishment',
      description: 'Right not to be subjected to any cruel and unusual treatment or punishment',
    },
    's.24(2)': {
      title: 'Remedy for Rights Violation',
      description: 'Exclusion of evidence where obtained in breach of Charter',
    },
  };

  private static readonly BREACH_INDICATORS = {
    's.8': [
      'warrantless search',
      'unreasonable search',
      'without warrant',
      'illegal search',
      'improper search',
      'warrantless entry',
      'unauthorized search',
    ],
    's.9': [
      'arbitrary detention',
      'unlawful detention',
      'wrongful arrest',
      'unjustified detention',
      'without cause',
    ],
    's.10(b)': [
      'denied counsel',
      'without counsel',
      'denied lawyer',
      'right to counsel',
      'before speaking to counsel',
      'interrogated without counsel',
    ],
    's.11(b)': [
      'burden of proof',
      'prove innocence',
      'onus on accused',
      'guilty unless proven',
    ],
    's.12': [
      'cruel punishment',
      'unusual punishment',
      'excessive sentence',
      'disproportionate',
    ],
  };

  /**
   * Analyze document for Charter breaches
   */
  static analyzeBreaches(elements: DocumentElement[], caseContext: any = {}): CharterBreach[] {
    const breaches: CharterBreach[] = [];
    const fullText = elements.map(el => el.text).join(' ').toLowerCase();

    // Check each Charter section
    Object.entries(this.CHARTER_SECTIONS).forEach(([section, details]) => {
      const indicators = this.BREACH_INDICATORS[section as keyof typeof this.BREACH_INDICATORS] || [];

      indicators.forEach(indicator => {
        const regex = new RegExp(indicator, 'gi');
        const matches = fullText.match(regex);

        if (matches && matches.length > 0) {
          const context = this.extractContext(fullText, indicator);
          const severity = this.assessSeverity(context, section, caseContext);

          breaches.push({
            section,
            title: details.title,
            description: details.description,
            indicator,
            context: context.substring(0, 300),
            severity,
            confidence_score: Math.min(0.95, 0.7 + matches.length * 0.1),
            recommendations: this.generateRecommendations(section, context),
          });
        }
      });
    });

    return breaches.sort((a, b) => (b.severity === 'critical' ? 1 : -1));
  }

  /**
   * Extract relevant context around breach indicator
   */
  private static extractContext(text: string, indicator: string): string {
    const regex = new RegExp(`.{0,150}${indicator}.{0,150}`, 'i');
    const match = text.match(regex);
    return match ? match[0] : indicator;
  }

  /**
   * Assess breach severity
   */
  private static assessSeverity(
    context: string,
    section: string,
    caseContext: any
  ): 'critical' | 'high' | 'medium' | 'low' {
    const text = context.toLowerCase();

    // Critical indicators
    if (section === 's.10(b)' && (text.includes('interrogated') || text.includes('confession'))) {
      return 'critical';
    }
    if (section === 's.8' && text.includes('warrantless') && text.includes('residential')) {
      return 'critical';
    }

    // High severity
    if (section.startsWith('s.1') && text.includes('without')) {
      return 'high';
    }

    // Medium
    if (text.includes('arguably') || text.includes('potentially')) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Generate defense recommendations for breach
   */
  private static generateRecommendations(section: string, context: string): string[] {
    const recommendations: Record<string, string[]> = {
      's.8': [
        'Challenge legality of search under s.8 - was there reasonable expectation of privacy?',
        'File s.24(2) application for exclusion of evidence if search was unreasonable',
        'Argue warrant was not reasonably executed or exceeded its scope',
        'Investigate whether informer privilege or good faith exception applies',
      ],
      's.9': [
        'Argue detention lacked reasonable grounds or probable cause',
        'Establish timeline to show arbitrary detention duration',
        'Challenge adequacy of grounds for continued detention',
        'Request release pending trial or appeal',
      ],
      's.10(b)': [
        'All statements obtained after s.10(b) violation are presumptively inadmissible',
        'No waiver of right to counsel unless full compliance with s.10(b) established',
        'Exclusion of confession/statement likely under s.24(2) analysis',
        'Consider Crown disclosure of legal advice provided, if any',
      ],
      's.11(b)': [
        'Crown must prove guilt beyond reasonable doubt',
        'Identify gaps in evidence supporting Crown case',
        'Challenge quality/reliability of Crown evidence',
        'Present positive evidence of innocence',
      ],
      's.12': [
        'Gather sentencing comparables and precedents',
        'Present mitigating factors and rehabilitation efforts',
        'Argue sentence is manifestly unfit or disproportionate',
        'File appeal if sentence grossly excessive',
      ],
    };

    return recommendations[section] || ['Consider early Charter application to suppress evidence', 'Consult specialized Charter counsel'];
  }

  /**
   * Extract judicial language patterns for argument strength
   */
  static extractJudicialLanguage(elements: DocumentElement[]): string[] {
    const text = elements.map(el => el.text).join(' ');
    const keyPhrases: Set<string> = new Set();

    const patterns = [
      /serious(?:\s+and\s+)?flagrant(?:\s+violation)?/gi,
      /good faith(?:\s+error)?/gi,
      /reasonable grounds?/gi,
      /fundamental justice/gi,
      /proportionality/gi,
      /nexus/gi,
      /compelling state objective/gi,
      /minimal impairment/gi,
      /deterrence/gi,
      /public confidence in administration of justice/gi,
    ];

    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(m => keyPhrases.add(m.trim()));
      }
    });

    return Array.from(keyPhrases);
  }

  /**
   * Generate comprehensive defense strategy
   */
  static generateDefenseStrategy(
    breaches: CharterBreach[],
    caseContext: any,
    judicialLanguage: string[]
  ): DefenseStrategy {
    const criticalBreaches = breaches.filter(b => b.severity === 'critical');
    const hasStrongBreaches = criticalBreaches.length > 0;

    const strategy: DefenseStrategy = {
      primary_strategy: this.determinePrimaryStrategy(criticalBreaches, caseContext),
      secondary_strategies: this.generateSecondaryStrategies(breaches),
      evidential_gaps: this.identifyEvidentialGaps(caseContext),
      jurisdictional_considerations: this.getJurisdictionalConsiderations(caseContext),
      key_arguments: this.buildKeyArguments(breaches, judicialLanguage),
      procedural_steps: this.buildProcedureSteps(hasStrongBreaches),
      estimated_success_probability: this.estimateSuccessProbability(breaches, caseContext),
      comparable_cases: this.findComparableCases(breaches),
    };

    return strategy;
  }

  private static determinePrimaryStrategy(
    criticalBreaches: CharterBreach[],
    caseContext: any
  ): string {
    if (criticalBreaches.length === 0) {
      return 'Trial defense on merits - challenge Crown evidence, establish reasonable doubt';
    }

    const breachTypes = criticalBreaches.map(b => b.section).join(', ');
    return `Charter-based defense - seek exclusion of evidence under s.24(2) due to breaches: ${breachTypes}`;
  }

  private static generateSecondaryStrategies(breaches: CharterBreach[]): string[] {
    const strategies: Set<string> = new Set();

    if (breaches.some(b => b.severity === 'high')) {
      strategies.add('Negotiate early resolution with Charter application leverage');
    }
    if (breaches.some(b => b.section === 's.10(b)')) {
      strategies.add('Challenge admissibility of all post-breach statements/confessions');
    }
    if (breaches.some(b => b.section === 's.8')) {
      strategies.add('Attack physical evidence reliability through search legitimacy');
    }
    if (breaches.length > 2) {
      strategies.add('Cumulative effect argument - multiple breaches demonstrate systematic rights violations');
    }

    return Array.from(strategies);
  }

  private static identifyEvidentialGaps(caseContext: any): string[] {
    const gaps: Set<string> = new Set();

    if (!caseContext.complete_disclosure) {
      gaps.add('Crown disclosure may be incomplete - demand full particulars');
    }
    if (!caseContext.video_evidence) {
      gaps.add('No video evidence of arrest/detention - credibility contest likely');
    }
    if (!caseContext.recordings) {
      gaps.add('No recordings of interrogation - challenging statement admissibility');
    }
    if (!caseContext.forensics) {
      gaps.add('Limited forensic evidence - inference of Crown weakness');
    }

    return Array.from(gaps);
  }

  private static getJurisdictionalConsiderations(caseContext: any): string[] {
    const province = caseContext.province || 'Ontario';
    const considerations: Record<string, string[]> = {
      Ontario: [
        'Ontario Court of Appeal precedent on s.24(2) application',
        'Superior Court motion practice for Charter applications',
        'Crown disclosure obligations under R. v. Stinchcombe',
      ],
      'British Columbia': [
        'BC Supreme Court s.24(2) jurisprudence',
        'Disclosure obligations per R. v. Clark',
        'Right to counsel implementation in BC RCMP practice',
      ],
      Alberta: [
        'Alberta Court of Appeal Charter breach standards',
        's.24(2) application framework in AB courts',
        'Peace officer procedures and Charter compliance',
      ],
    };

    return considerations[province] || considerations.Ontario;
  }

  private static buildKeyArguments(breaches: CharterBreach[], judicialLanguage: string[]): string[] {
    const arguments_: Set<string> = new Set();

    breaches.forEach(breach => {
      breach.recommendations.forEach(rec => arguments_.add(rec));
    });

    if (judicialLanguage.includes('serious and flagrant violation')) {
      arguments_.add('Breach was serious and flagrant, meeting threshold for s.24(2) exclusion');
    }

    arguments_.add('Crown cannot cure breaches through Charter application - evidence must be excluded');
    arguments_.add('Public confidence in admin of justice requires exclusion of improperly obtained evidence');

    return Array.from(arguments_);
  }

  private static buildProcedureSteps(hasStrongBreaches: boolean): string[] {
    if (hasStrongBreaches) {
      return [
        'File Charter notice if required by local rules',
        'Conduct pre-trial Charter application motion',
        'Present evidence of breach(es) and Crown failure to respond',
        'Argue s.24(2) remedy - exclusion of tainted evidence',
        'If successful, proceed to trial with case substantially weakened',
      ];
    }

    return [
      'Request full Crown disclosure',
      'Analyze evidence for weaknesses and Charter issues',
      'Prepare Charter application if breaches identified',
      'Engage in Crown negotiations from strength position',
      'Prepare comprehensive defense trial strategy',
    ];
  }

  private static estimateSuccessProbability(breaches: CharterBreach[], caseContext: any): number {
    const criticalCount = breaches.filter(b => b.severity === 'critical').length;
    const highCount = breaches.filter(b => b.severity === 'high').length;

    let probability = 0.4; // Base rate
    probability += criticalCount * 0.25; // +25% per critical breach
    probability += highCount * 0.1; // +10% per high severity breach

    // Adjust for context
    if (caseContext.co_accused) probability *= 0.85; // Complexity factor
    if (caseContext.victim_credibility_issues) probability += 0.1;

    return Math.min(0.95, Math.max(0.15, probability));
  }

  private static findComparableCases(breaches: CharterBreach[]): string[] {
    const cases: Record<string, string[]> = {
      's.8': [
        'R. v. Grant (2009 SCC 32) - s.24(2) framework for search breaches',
        'R. v. Stillman (1997 1 SCR 607) - derivative evidence from unlawful search',
        'R. v. Morgentaler (1993 3 SCR 463) - Charter protection of security of person',
      ],
      's.9': [
        'R. v. Duarte (1990 1 SCR 30) - arbitrary detention standards',
        'R. v. Therens (1985 1 SCR 613) - right against self-incrimination',
      ],
      's.10(b)': [
        'R. v. Manninen (1987 1 SCR 1233) - immediate right to counsel requirements',
        'R. v. Bartle (1994 3 SCR 173) - s.10(b) compliance standards',
        'R. v. Elshaw (1991 3 SCR 24) - waiver of right to counsel',
      ],
      's.24(2)': [
        'R. v. Grant (2009 SCC 32) - three-pronged test for exclusion',
        'R. v. Sekhri (2014 SCC 15) - evidence exclusion principles',
      ],
    };

    const caseList: Set<string> = new Set();
    breaches.forEach(breach => {
      const comparable = cases[breach.section] || [];
      comparable.forEach(c => caseList.add(c));
    });

    return Array.from(caseList);
  }

  /**
   * Comprehensive case analysis combining breaches and strategy
   */
  static performCaseAnalysis(
    elements: DocumentElement[],
    caseContext: any = {}
  ): CaseAnalysis {
    const breaches = this.analyzeBreaches(elements, caseContext);
    const judicialLanguage = this.extractJudicialLanguage(elements);
    const defenseStrategy = this.generateDefenseStrategy(breaches, caseContext, judicialLanguage);

    return {
      case_id: caseContext.case_id || 'CASE-' + Date.now(),
      breaches,
      judicial_language: judicialLanguage,
      defense_strategy: defenseStrategy,
      analysis_timestamp: new Date().toISOString(),
      confidence_score: breaches.length > 0 ? Math.min(0.98, 0.7 + breaches.length * 0.05) : 0.5,
    };
  }
}
