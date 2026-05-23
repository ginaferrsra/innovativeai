// Comprehensive Legal Deadline Calculator for Canadian Courts
// Supports all provinces and court levels

export interface DeadlineRule {
  id: string;
  name: string;
  description: string;
  category: DeadlineCategory;
  jurisdiction: string;
  court: string;
  baseDays: number;
  businessDays: boolean;
  excludeHolidays: boolean;
  source?: string;
  notes?: string;
}

export type DeadlineCategory =
  | 'service'
  | 'response'
  | 'motion'
  | 'appeal'
  | 'discovery'
  | 'trial'
  | 'limitation';

export interface CalculatedDeadline {
  rule: DeadlineRule;
  startDate: Date;
  dueDate: Date;
  daysRemaining: number;
  isOverdue: boolean;
  warnings: string[];
}

// Canadian statutory holidays (federal and common provincial)
export const CANADIAN_HOLIDAYS_2024: Date[] = [
  new Date('2024-01-01'), // New Year's Day
  new Date('2024-02-19'), // Family Day (most provinces)
  new Date('2024-03-29'), // Good Friday
  new Date('2024-04-01'), // Easter Monday
  new Date('2024-05-20'), // Victoria Day
  new Date('2024-07-01'), // Canada Day
  new Date('2024-08-05'), // Civic Holiday (most provinces)
  new Date('2024-09-02'), // Labour Day
  new Date('2024-09-30'), // National Day for Truth and Reconciliation
  new Date('2024-10-14'), // Thanksgiving
  new Date('2024-11-11'), // Remembrance Day
  new Date('2024-12-25'), // Christmas Day
  new Date('2024-12-26'), // Boxing Day
];

export const CANADIAN_HOLIDAYS_2025: Date[] = [
  new Date('2025-01-01'), // New Year's Day
  new Date('2025-02-17'), // Family Day
  new Date('2025-04-18'), // Good Friday
  new Date('2025-04-21'), // Easter Monday
  new Date('2025-05-19'), // Victoria Day
  new Date('2025-07-01'), // Canada Day
  new Date('2025-08-04'), // Civic Holiday
  new Date('2025-09-01'), // Labour Day
  new Date('2025-09-30'), // National Day for Truth and Reconciliation
  new Date('2025-10-13'), // Thanksgiving
  new Date('2025-11-11'), // Remembrance Day
  new Date('2025-12-25'), // Christmas Day
  new Date('2025-12-26'), // Boxing Day
];

export const CANADIAN_HOLIDAYS_2026: Date[] = [
  new Date('2026-01-01'), // New Year's Day
  new Date('2026-02-16'), // Family Day
  new Date('2026-04-03'), // Good Friday
  new Date('2026-04-06'), // Easter Monday
  new Date('2026-05-18'), // Victoria Day
  new Date('2026-07-01'), // Canada Day
  new Date('2026-08-03'), // Civic Holiday
  new Date('2026-09-07'), // Labour Day
  new Date('2026-09-30'), // National Day for Truth and Reconciliation
  new Date('2026-10-12'), // Thanksgiving
  new Date('2026-11-11'), // Remembrance Day
  new Date('2026-12-25'), // Christmas Day
  new Date('2026-12-28'), // Boxing Day (observed, 26th is Saturday)
];

// Common deadline rules for Canadian courts
export const DEADLINE_RULES: DeadlineRule[] = [
  // ONTARIO - Superior Court of Justice
  {
    id: 'on-scj-defence',
    name: 'Statement of Defence',
    description: 'Time to file a Statement of Defence after service of Statement of Claim',
    category: 'response',
    jurisdiction: 'ON',
    court: 'Superior Court of Justice',
    baseDays: 20,
    businessDays: false,
    excludeHolidays: false,
    source: 'Rules of Civil Procedure, Rule 18.01',
    notes: '40 days if served outside Ontario but within Canada; 60 days if served outside Canada',
  },
  {
    id: 'on-scj-defence-outside-on',
    name: 'Statement of Defence (Outside Ontario)',
    description: 'Time to file defence when served outside Ontario but within Canada',
    category: 'response',
    jurisdiction: 'ON',
    court: 'Superior Court of Justice',
    baseDays: 40,
    businessDays: false,
    excludeHolidays: false,
    source: 'Rules of Civil Procedure, Rule 18.01',
  },
  {
    id: 'on-scj-motion-response',
    name: 'Responding to Motion',
    description: 'Time to serve responding materials for a motion',
    category: 'motion',
    jurisdiction: 'ON',
    court: 'Superior Court of Justice',
    baseDays: 4,
    businessDays: true,
    excludeHolidays: true,
    source: 'Rules of Civil Procedure, Rule 37.07(4)',
    notes: 'Must be served at least 4 days before the motion hearing',
  },
  {
    id: 'on-scj-motion-service',
    name: 'Motion Materials Service',
    description: 'Time before motion to serve motion materials',
    category: 'motion',
    jurisdiction: 'ON',
    court: 'Superior Court of Justice',
    baseDays: 7,
    businessDays: true,
    excludeHolidays: true,
    source: 'Rules of Civil Procedure, Rule 37.07(1)',
  },
  {
    id: 'on-scj-discovery-answers',
    name: 'Answers to Undertakings',
    description: 'Time to provide answers to undertakings after examination for discovery',
    category: 'discovery',
    jurisdiction: 'ON',
    court: 'Superior Court of Justice',
    baseDays: 60,
    businessDays: false,
    excludeHolidays: false,
    source: 'Rules of Civil Procedure, Rule 31.07(1)',
  },
  {
    id: 'on-scj-affidavit-docs',
    name: 'Affidavit of Documents',
    description: 'Time to serve affidavit of documents after close of pleadings',
    category: 'discovery',
    jurisdiction: 'ON',
    court: 'Superior Court of Justice',
    baseDays: 30,
    businessDays: false,
    excludeHolidays: false,
    source: 'Rules of Civil Procedure, Rule 30.03(1)',
  },
  {
    id: 'on-coa-appeal',
    name: 'Notice of Appeal',
    description: 'Time to file notice of appeal to Court of Appeal',
    category: 'appeal',
    jurisdiction: 'ON',
    court: 'Court of Appeal for Ontario',
    baseDays: 30,
    businessDays: false,
    excludeHolidays: false,
    source: 'Rules of Civil Procedure, Rule 61.04(1)',
    notes: 'From date of order being appealed',
  },
  {
    id: 'on-coa-factum',
    name: 'Appellant Factum',
    description: 'Time to serve and file appellant factum',
    category: 'appeal',
    jurisdiction: 'ON',
    court: 'Court of Appeal for Ontario',
    baseDays: 30,
    businessDays: false,
    excludeHolidays: false,
    source: 'Rules of Civil Procedure, Rule 61.09(2)',
    notes: 'From service of appeal book and compendium',
  },
  {
    id: 'on-coa-respondent-factum',
    name: 'Respondent Factum',
    description: 'Time to serve and file respondent factum',
    category: 'appeal',
    jurisdiction: 'ON',
    court: 'Court of Appeal for Ontario',
    baseDays: 30,
    businessDays: false,
    excludeHolidays: false,
    source: 'Rules of Civil Procedure, Rule 61.12(2)',
    notes: 'From service of appellant factum',
  },
  {
    id: 'on-scc-defence',
    name: 'Defence (Small Claims)',
    description: 'Time to file defence in Small Claims Court',
    category: 'response',
    jurisdiction: 'ON',
    court: 'Small Claims Court',
    baseDays: 20,
    businessDays: false,
    excludeHolidays: false,
    source: 'Small Claims Court Rules, Rule 9.01(1)',
  },

  // ONTARIO - Family Court
  {
    id: 'on-fam-answer',
    name: 'Answer to Application',
    description: 'Time to file Answer to family law Application',
    category: 'response',
    jurisdiction: 'ON',
    court: 'Family Court',
    baseDays: 30,
    businessDays: false,
    excludeHolidays: false,
    source: 'Family Law Rules, Rule 10(1)',
  },
  {
    id: 'on-fam-reply',
    name: 'Reply',
    description: 'Time to file Reply in family law matter',
    category: 'response',
    jurisdiction: 'ON',
    court: 'Family Court',
    baseDays: 10,
    businessDays: false,
    excludeHolidays: false,
    source: 'Family Law Rules, Rule 10(8)',
  },
  {
    id: 'on-fam-motion-serve',
    name: 'Family Law Motion Service',
    description: 'Time before motion to serve motion materials',
    category: 'motion',
    jurisdiction: 'ON',
    court: 'Family Court',
    baseDays: 6,
    businessDays: true,
    excludeHolidays: true,
    source: 'Family Law Rules, Rule 14(11)',
  },
  {
    id: 'on-fam-motion-response',
    name: 'Family Law Motion Response',
    description: 'Time to serve responding materials',
    category: 'motion',
    jurisdiction: 'ON',
    court: 'Family Court',
    baseDays: 4,
    businessDays: true,
    excludeHolidays: true,
    source: 'Family Law Rules, Rule 14(11.2)',
  },

  // BRITISH COLUMBIA
  {
    id: 'bc-sc-response',
    name: 'Response to Civil Claim',
    description: 'Time to file Response to Civil Claim',
    category: 'response',
    jurisdiction: 'BC',
    court: 'Supreme Court of British Columbia',
    baseDays: 21,
    businessDays: false,
    excludeHolidays: false,
    source: 'Supreme Court Civil Rules, Rule 3-3(1)',
    notes: '35 days if served outside BC',
  },
  {
    id: 'bc-sc-notice-application',
    name: 'Notice of Application Service',
    description: 'Time to serve notice of application before hearing',
    category: 'motion',
    jurisdiction: 'BC',
    court: 'Supreme Court of British Columbia',
    baseDays: 7,
    businessDays: true,
    excludeHolidays: true,
    source: 'Supreme Court Civil Rules, Rule 8-1(5)',
  },
  {
    id: 'bc-ca-notice-appeal',
    name: 'Notice of Appeal',
    description: 'Time to file notice of appeal',
    category: 'appeal',
    jurisdiction: 'BC',
    court: 'Court of Appeal for British Columbia',
    baseDays: 30,
    businessDays: false,
    excludeHolidays: false,
    source: 'Court of Appeal Rules, Rule 7(1)',
  },
  {
    id: 'bc-ca-factum',
    name: 'Factum (Appeal)',
    description: 'Time to file appellant factum',
    category: 'appeal',
    jurisdiction: 'BC',
    court: 'Court of Appeal for British Columbia',
    baseDays: 42,
    businessDays: false,
    excludeHolidays: false,
    source: 'Court of Appeal Rules, Rule 29(1)',
    notes: 'From service of transcript',
  },

  // ALBERTA
  {
    id: 'ab-kb-defence',
    name: 'Statement of Defence',
    description: 'Time to file Statement of Defence',
    category: 'response',
    jurisdiction: 'AB',
    court: "Court of King's Bench of Alberta",
    baseDays: 20,
    businessDays: false,
    excludeHolidays: false,
    source: 'Alberta Rules of Court, Rule 3.28',
  },
  {
    id: 'ab-ca-notice-appeal',
    name: 'Notice of Appeal',
    description: 'Time to file notice of appeal',
    category: 'appeal',
    jurisdiction: 'AB',
    court: 'Court of Appeal of Alberta',
    baseDays: 30,
    businessDays: false,
    excludeHolidays: false,
    source: 'Alberta Rules of Court, Rule 14.7',
  },

  // FEDERAL COURTS
  {
    id: 'fed-fc-defence',
    name: 'Statement of Defence',
    description: 'Time to file defence in Federal Court',
    category: 'response',
    jurisdiction: 'FED',
    court: 'Federal Court',
    baseDays: 30,
    businessDays: false,
    excludeHolidays: false,
    source: 'Federal Courts Rules, Rule 204',
  },
  {
    id: 'fed-fca-notice-appeal',
    name: 'Notice of Appeal',
    description: 'Time to file notice of appeal to Federal Court of Appeal',
    category: 'appeal',
    jurisdiction: 'FED',
    court: 'Federal Court of Appeal',
    baseDays: 30,
    businessDays: false,
    excludeHolidays: false,
    source: 'Federal Courts Rules, Rule 337',
  },

  // SUPREME COURT OF CANADA
  {
    id: 'scc-leave-application',
    name: 'Leave Application',
    description: 'Time to file application for leave to appeal',
    category: 'appeal',
    jurisdiction: 'FED',
    court: 'Supreme Court of Canada',
    baseDays: 60,
    businessDays: false,
    excludeHolidays: false,
    source: 'Rules of the Supreme Court of Canada, Rule 25(1)',
    notes: 'From date of judgment of Court of Appeal',
  },
  {
    id: 'scc-appellant-factum',
    name: 'Appellant Factum (SCC)',
    description: 'Time to file appellant factum after leave granted',
    category: 'appeal',
    jurisdiction: 'FED',
    court: 'Supreme Court of Canada',
    baseDays: 84,
    businessDays: false,
    excludeHolidays: false,
    source: 'Rules of the Supreme Court of Canada, Rule 42(1)',
    notes: '12 weeks (84 days) from date of order granting leave',
  },

  // LIMITATION PERIODS
  {
    id: 'on-limitation-general',
    name: 'General Limitation (Ontario)',
    description: 'Basic limitation period for civil claims in Ontario',
    category: 'limitation',
    jurisdiction: 'ON',
    court: 'All',
    baseDays: 730, // 2 years
    businessDays: false,
    excludeHolidays: false,
    source: 'Limitations Act, 2002, s. 4',
    notes: 'From date claim was discovered or ought to have been discovered',
  },
  {
    id: 'bc-limitation-general',
    name: 'General Limitation (BC)',
    description: 'Basic limitation period for civil claims in BC',
    category: 'limitation',
    jurisdiction: 'BC',
    court: 'All',
    baseDays: 730, // 2 years
    businessDays: false,
    excludeHolidays: false,
    source: 'Limitation Act, SBC 2012, c. 13, s. 6',
    notes: 'From date claim was discovered',
  },
  {
    id: 'ab-limitation-general',
    name: 'General Limitation (Alberta)',
    description: 'Basic limitation period for civil claims in Alberta',
    category: 'limitation',
    jurisdiction: 'AB',
    court: 'All',
    baseDays: 730, // 2 years
    businessDays: false,
    excludeHolidays: false,
    source: 'Limitations Act, RSA 2000, c. L-12, s. 3(1)',
  },

  // CRIMINAL DEADLINES
  {
    id: 'criminal-summary-appeal',
    name: 'Summary Conviction Appeal',
    description: 'Time to file appeal of summary conviction',
    category: 'appeal',
    jurisdiction: 'ALL',
    court: 'Criminal',
    baseDays: 30,
    businessDays: false,
    excludeHolidays: false,
    source: 'Criminal Code, s. 830(1)',
  },
  {
    id: 'criminal-indictable-appeal',
    name: 'Indictable Offence Appeal',
    description: 'Time to file notice of appeal for indictable offence',
    category: 'appeal',
    jurisdiction: 'ALL',
    court: 'Criminal',
    baseDays: 30,
    businessDays: false,
    excludeHolidays: false,
    source: 'Criminal Code, s. 678(1)',
    notes: 'Extensions may be granted for cause',
  },
];

// Helper functions
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isHoliday(date: Date): boolean {
  const allHolidays = [...CANADIAN_HOLIDAYS_2024, ...CANADIAN_HOLIDAYS_2025, ...CANADIAN_HOLIDAYS_2026];
  return allHolidays.some(
    (holiday) =>
      holiday.getFullYear() === date.getFullYear() &&
      holiday.getMonth() === date.getMonth() &&
      holiday.getDate() === date.getDate()
  );
}

function addCalendarDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addBusinessDays(date: Date, days: number, excludeHolidays: boolean): Date {
  let result = new Date(date);
  let remainingDays = days;

  while (remainingDays > 0) {
    result.setDate(result.getDate() + 1);
    if (!isWeekend(result) && (!excludeHolidays || !isHoliday(result))) {
      remainingDays--;
    }
  }

  return result;
}

export function calculateDeadline(
  rule: DeadlineRule,
  startDate: Date
): CalculatedDeadline {
  let dueDate: Date;

  if (rule.businessDays) {
    dueDate = addBusinessDays(startDate, rule.baseDays, rule.excludeHolidays);
  } else {
    dueDate = addCalendarDays(startDate, rule.baseDays);
  }

  // If deadline falls on weekend or holiday, move to next business day
  while (isWeekend(dueDate) || isHoliday(dueDate)) {
    dueDate.setDate(dueDate.getDate() + 1);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDateMidnight = new Date(dueDate);
  dueDateMidnight.setHours(0, 0, 0, 0);

  const daysRemaining = Math.ceil(
    (dueDateMidnight.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const warnings: string[] = [];

  if (daysRemaining <= 0) {
    warnings.push('This deadline has passed!');
  } else if (daysRemaining <= 3) {
    warnings.push('Urgent: Deadline is in 3 days or less');
  } else if (daysRemaining <= 7) {
    warnings.push('Warning: Deadline approaching within a week');
  }

  if (rule.notes) {
    warnings.push(`Note: ${rule.notes}`);
  }

  return {
    rule,
    startDate,
    dueDate,
    daysRemaining,
    isOverdue: daysRemaining < 0,
    warnings,
  };
}

export function getRulesByJurisdiction(jurisdiction: string): DeadlineRule[] {
  return DEADLINE_RULES.filter(
    (rule) => rule.jurisdiction === jurisdiction || rule.jurisdiction === 'ALL'
  );
}

export function getRulesByCategory(category: DeadlineCategory): DeadlineRule[] {
  return DEADLINE_RULES.filter((rule) => rule.category === category);
}

export function getRulesByCourtAndCategory(
  jurisdiction: string,
  court: string,
  category?: DeadlineCategory
): DeadlineRule[] {
  return DEADLINE_RULES.filter((rule) => {
    const matchesJurisdiction = rule.jurisdiction === jurisdiction || rule.jurisdiction === 'ALL';
    const matchesCourt = rule.court === court || rule.court === 'All';
    const matchesCategory = !category || rule.category === category;
    return matchesJurisdiction && matchesCourt && matchesCategory;
  });
}

export const DEADLINE_CATEGORIES: { id: DeadlineCategory; name: string; description: string }[] = [
  { id: 'service', name: 'Service', description: 'Deadlines for serving documents' },
  { id: 'response', name: 'Response', description: 'Deadlines for responding to claims' },
  { id: 'motion', name: 'Motion', description: 'Motion filing and response deadlines' },
  { id: 'appeal', name: 'Appeal', description: 'Appeal filing deadlines' },
  { id: 'discovery', name: 'Discovery', description: 'Discovery-related deadlines' },
  { id: 'trial', name: 'Trial', description: 'Trial preparation deadlines' },
  { id: 'limitation', name: 'Limitation', description: 'Limitation periods for claims' },
];
