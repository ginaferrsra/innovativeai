// Comprehensive Canadian Court Forms Registry
// Organized by Province/Territory, Court Level, and Form Category

export interface CourtFormEntry {
  id: string;
  formNumber: string;
  name: string;
  category: 'civil' | 'criminal' | 'family' | 'small_claims' | 'appeal' | 'administrative';
  court: string;
  province: string;
  description: string;
  url: string;
  lastUpdated: string;
  isSearchable: boolean;
}

export const PROVINCES = [
  { code: 'ON', name: 'Ontario' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'AB', name: 'Alberta' },
  { code: 'QC', name: 'Quebec' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'YT', name: 'Yukon' },
  { code: 'FED', name: 'Federal' },
] as const;

export const COURT_FORMS: CourtFormEntry[] = [
  // ONTARIO - Superior Court of Justice
  { id: 'on-4a', formNumber: 'Form 4A', name: 'General Heading of Documents', category: 'civil', court: 'Superior Court of Justice', province: 'ON', description: 'Standard heading for all court documents filed in the Superior Court', url: 'https://www.ontariocourtforms.on.ca/en/rules-of-civil-procedure-forms/', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'on-4c', formNumber: 'Form 4C', name: 'Backsheet', category: 'civil', court: 'Superior Court of Justice', province: 'ON', description: 'Mandatory backsheet for all filed court documents', url: 'https://www.ontariocourtforms.on.ca/en/rules-of-civil-procedure-forms/', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'on-14a', formNumber: 'Form 14A', name: 'Notice of Motion', category: 'civil', court: 'Superior Court of Justice', province: 'ON', description: 'Notice for bringing a motion before the court, including Charter motions', url: 'https://www.ontariocourtforms.on.ca/en/rules-of-civil-procedure-forms/', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'on-14b', formNumber: 'Form 14B', name: 'Motion Form (Short)', category: 'civil', court: 'Superior Court of Justice', province: 'ON', description: 'Short motion form for unopposed or consent motions', url: 'https://www.ontariocourtforms.on.ca/en/rules-of-civil-procedure-forms/', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'on-14f', formNumber: 'Form 14F', name: 'Notice of Constitutional Question', category: 'civil', court: 'Superior Court of Justice', province: 'ON', description: 'Required notice when challenging validity of a statute under the Charter', url: 'https://www.ontariocourtforms.on.ca/en/rules-of-civil-procedure-forms/', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'on-18a', formNumber: 'Form 18A', name: 'Statement of Claim (General)', category: 'civil', court: 'Superior Court of Justice', province: 'ON', description: 'General statement of claim to commence civil proceedings', url: 'https://www.ontariocourtforms.on.ca/en/rules-of-civil-procedure-forms/', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'on-18b', formNumber: 'Form 18B', name: 'Notice of Action', category: 'civil', court: 'Superior Court of Justice', province: 'ON', description: 'Notice of action with statement of claim to follow', url: 'https://www.ontariocourtforms.on.ca/en/rules-of-civil-procedure-forms/', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'on-27a', formNumber: 'Form 27A', name: 'Counterclaim (Defendant)', category: 'civil', court: 'Superior Court of Justice', province: 'ON', description: 'Counterclaim against plaintiff by defendant', url: 'https://www.ontariocourtforms.on.ca/en/rules-of-civil-procedure-forms/', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'on-38a', formNumber: 'Form 38A', name: 'Notice of Appeal to Divisional Court', category: 'appeal', court: 'Divisional Court', province: 'ON', description: 'Notice to appeal a decision to the Divisional Court', url: 'https://www.ontariocourtforms.on.ca/en/rules-of-civil-procedure-forms/', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'on-61a', formNumber: 'Form 61A', name: 'Notice of Appeal to Court of Appeal', category: 'appeal', court: 'Court of Appeal for Ontario', province: 'ON', description: 'Notice of appeal to the Ontario Court of Appeal', url: 'https://www.ontariocourtforms.on.ca/en/rules-of-civil-procedure-forms/', lastUpdated: '2025-01-15', isSearchable: true },
  // Ontario - Criminal
  { id: 'on-crim-1', formNumber: 'Form 1', name: 'Information', category: 'criminal', court: 'Ontario Court of Justice', province: 'ON', description: 'Information sworn before a justice to commence criminal proceedings', url: 'https://www.ontariocourtforms.on.ca/en/criminal-proceedings-rules-forms/', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'on-crim-2', formNumber: 'Form 2', name: 'Summons to a Person Charged with an Offence', category: 'criminal', court: 'Ontario Court of Justice', province: 'ON', description: 'Summons compelling appearance of accused', url: 'https://www.ontariocourtforms.on.ca/en/criminal-proceedings-rules-forms/', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'on-crim-bail', formNumber: 'Form 11', name: 'Release Order', category: 'criminal', court: 'Ontario Court of Justice', province: 'ON', description: 'Order for release of accused with or without conditions', url: 'https://www.ontariocourtforms.on.ca/en/criminal-proceedings-rules-forms/', lastUpdated: '2025-01-15', isSearchable: true },
  // Ontario - Family
  { id: 'on-fam-8', formNumber: 'Form 8', name: 'Application (Family)', category: 'family', court: 'Superior Court of Justice - Family', province: 'ON', description: 'Application to commence family law proceedings', url: 'https://www.ontariocourtforms.on.ca/en/family-law-rules-forms/', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'on-fam-10', formNumber: 'Form 10', name: 'Answer (Family)', category: 'family', court: 'Superior Court of Justice - Family', province: 'ON', description: 'Answer to a family law application', url: 'https://www.ontariocourtforms.on.ca/en/family-law-rules-forms/', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'on-fam-13', formNumber: 'Form 13', name: 'Financial Statement (Support)', category: 'family', court: 'Superior Court of Justice - Family', province: 'ON', description: 'Sworn financial statement for support claims', url: 'https://www.ontariocourtforms.on.ca/en/family-law-rules-forms/', lastUpdated: '2025-01-15', isSearchable: true },
  // Ontario - Small Claims
  { id: 'on-sc-7a', formNumber: 'Form 7A', name: 'Plaintiff\'s Claim', category: 'small_claims', court: 'Small Claims Court', province: 'ON', description: 'Claim form for Small Claims Court (up to $35,000)', url: 'https://www.ontariocourtforms.on.ca/en/small-claims-court-forms/', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'on-sc-9a', formNumber: 'Form 9A', name: 'Defence', category: 'small_claims', court: 'Small Claims Court', province: 'ON', description: 'Defence form for Small Claims Court', url: 'https://www.ontariocourtforms.on.ca/en/small-claims-court-forms/', lastUpdated: '2025-01-15', isSearchable: true },

  // BRITISH COLUMBIA
  { id: 'bc-1', formNumber: 'Form 1', name: 'Notice of Civil Claim', category: 'civil', court: 'Supreme Court of British Columbia', province: 'BC', description: 'Notice of civil claim to commence a proceeding', url: 'https://www.bccourts.ca/supreme_court/practice_and_procedure/civil_rules_forms.aspx', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'bc-2', formNumber: 'Form 2', name: 'Response to Civil Claim', category: 'civil', court: 'Supreme Court of British Columbia', province: 'BC', description: 'Response to a notice of civil claim', url: 'https://www.bccourts.ca/supreme_court/practice_and_procedure/civil_rules_forms.aspx', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'bc-32', formNumber: 'Form 32', name: 'Notice of Application', category: 'civil', court: 'Supreme Court of British Columbia', province: 'BC', description: 'Notice of application for court orders', url: 'https://www.bccourts.ca/supreme_court/practice_and_procedure/civil_rules_forms.aspx', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'bc-fam-1', formNumber: 'Form F1', name: 'Notice of Family Claim', category: 'family', court: 'Supreme Court of British Columbia', province: 'BC', description: 'Notice to start family law proceedings', url: 'https://www.bccourts.ca/supreme_court/practice_and_procedure/family_rules_forms.aspx', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'bc-sc-1', formNumber: 'CRT Form 1', name: 'Dispute Application', category: 'small_claims', court: 'Civil Resolution Tribunal', province: 'BC', description: 'Application to commence a dispute at the CRT', url: 'https://civilresolutionbc.ca/', lastUpdated: '2025-01-15', isSearchable: true },

  // ALBERTA
  { id: 'ab-1', formNumber: 'Form 10', name: 'Statement of Claim', category: 'civil', court: 'Court of King\'s Bench', province: 'AB', description: 'Statement of claim in the Court of King\'s Bench of Alberta', url: 'https://www.alberta.ca/court-kings-bench-forms', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'ab-2', formNumber: 'Form 25', name: 'Defence', category: 'civil', court: 'Court of King\'s Bench', province: 'AB', description: 'Statement of defence in the Court of King\'s Bench', url: 'https://www.alberta.ca/court-kings-bench-forms', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'ab-fam', formNumber: 'FL Form 1', name: 'Family Law Application', category: 'family', court: 'Court of King\'s Bench - Family', province: 'AB', description: 'Application for family matters including divorce, custody, support', url: 'https://www.alberta.ca/family-law-forms', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'ab-appeal', formNumber: 'Appeal Form A', name: 'Notice of Appeal', category: 'appeal', court: 'Court of Appeal of Alberta', province: 'AB', description: 'Notice of appeal to the Alberta Court of Appeal', url: 'https://www.alberta.ca/court-of-appeal-forms', lastUpdated: '2025-01-15', isSearchable: true },

  // QUEBEC
  { id: 'qc-1', formNumber: 'Formule I', name: 'Demande introductive d\'instance', category: 'civil', court: 'Cour superieure du Quebec', province: 'QC', description: 'Application to institute proceedings in the Superior Court', url: 'https://www.justice.gouv.qc.ca/en/forms', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'qc-fam', formNumber: 'Formule III', name: 'Demande en divorce', category: 'family', court: 'Cour superieure du Quebec', province: 'QC', description: 'Application for divorce', url: 'https://www.justice.gouv.qc.ca/en/forms', lastUpdated: '2025-01-15', isSearchable: true },

  // MANITOBA
  { id: 'mb-1', formNumber: 'Form 14A', name: 'Statement of Claim', category: 'civil', court: 'Court of King\'s Bench', province: 'MB', description: 'Statement of claim in the Manitoba Court of King\'s Bench', url: 'https://www.manitobacourts.mb.ca/court-of-kings-bench/forms/', lastUpdated: '2025-01-15', isSearchable: true },

  // SASKATCHEWAN
  { id: 'sk-1', formNumber: 'Form 3-1', name: 'Statement of Claim', category: 'civil', court: 'Court of King\'s Bench', province: 'SK', description: 'Statement of claim for Saskatchewan civil proceedings', url: 'https://www.sasklawcourts.ca/kings-bench/forms', lastUpdated: '2025-01-15', isSearchable: true },

  // NOVA SCOTIA
  { id: 'ns-1', formNumber: 'Form 5.01A', name: 'Notice of Action', category: 'civil', court: 'Supreme Court of Nova Scotia', province: 'NS', description: 'Notice of action to commence a civil proceeding', url: 'https://www.courts.ns.ca/General/forms_supreme.htm', lastUpdated: '2025-01-15', isSearchable: true },

  // NEW BRUNSWICK
  { id: 'nb-1', formNumber: 'Form 16A', name: 'Statement of Claim', category: 'civil', court: 'Court of King\'s Bench', province: 'NB', description: 'Statement of claim for New Brunswick civil proceedings', url: 'https://www.gnb.ca/cour/03COB/forms-formulaires-e.asp', lastUpdated: '2025-01-15', isSearchable: true },

  // NEWFOUNDLAND
  { id: 'nl-1', formNumber: 'Form 1', name: 'Statement of Claim', category: 'civil', court: 'Supreme Court of Newfoundland and Labrador', province: 'NL', description: 'Statement of claim for NL civil proceedings', url: 'https://www.court.nl.ca/supreme/forms/', lastUpdated: '2025-01-15', isSearchable: true },

  // PEI
  { id: 'pe-1', formNumber: 'Form 1A', name: 'Notice of Civil Claim', category: 'civil', court: 'Supreme Court of Prince Edward Island', province: 'PE', description: 'Notice of civil claim for PEI proceedings', url: 'https://www.courts.pe.ca/supreme-court/forms', lastUpdated: '2025-01-15', isSearchable: true },

  // TERRITORIES
  { id: 'nt-1', formNumber: 'Form 1', name: 'Statement of Claim', category: 'civil', court: 'Supreme Court of the Northwest Territories', province: 'NT', description: 'Statement of claim for NWT proceedings', url: 'https://www.nwtcourts.ca/en/forms/', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'nu-1', formNumber: 'Form 1', name: 'Statement of Claim', category: 'civil', court: 'Nunavut Court of Justice', province: 'NU', description: 'Statement of claim for Nunavut proceedings', url: 'https://www.nunavutcourts.ca/forms', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'yt-1', formNumber: 'Form 1', name: 'Statement of Claim', category: 'civil', court: 'Supreme Court of Yukon', province: 'YT', description: 'Statement of claim for Yukon proceedings', url: 'https://www.yukoncourts.ca/courts/supreme/forms', lastUpdated: '2025-01-15', isSearchable: true },

  // FEDERAL
  { id: 'fed-1', formNumber: 'Form 1', name: 'Statement of Claim', category: 'civil', court: 'Federal Court', province: 'FED', description: 'Statement of claim in the Federal Court of Canada', url: 'https://www.fct-cf.gc.ca/en/pages/online-resources/forms', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'fed-68a', formNumber: 'Form 68A', name: 'Notice of Appeal', category: 'appeal', court: 'Federal Court of Appeal', province: 'FED', description: 'Notice of appeal to the Federal Court of Appeal', url: 'https://www.fca-caf.gc.ca/fca-caf/forms-formulaires-eng.html', lastUpdated: '2025-01-15', isSearchable: true },
  { id: 'fed-scc', formNumber: 'Form 25', name: 'Application for Leave to Appeal', category: 'appeal', court: 'Supreme Court of Canada', province: 'FED', description: 'Application for leave to appeal to the Supreme Court of Canada', url: 'https://www.scc-csc.ca/unrep-nonrep/app-dem/form-formulaire-eng.aspx', lastUpdated: '2025-01-15', isSearchable: true },
];

export function searchForms(query: string, province?: string, category?: string): CourtFormEntry[] {
  return COURT_FORMS.filter((form) => {
    const matchesQuery = !query || 
      form.name.toLowerCase().includes(query.toLowerCase()) ||
      form.formNumber.toLowerCase().includes(query.toLowerCase()) ||
      form.description.toLowerCase().includes(query.toLowerCase()) ||
      form.court.toLowerCase().includes(query.toLowerCase());
    const matchesProvince = !province || province === 'all' || form.province === province;
    const matchesCategory = !category || category === 'all' || form.category === category;
    return matchesQuery && matchesProvince && matchesCategory;
  });
}

export function getFormsByProvince(province: string): CourtFormEntry[] {
  return COURT_FORMS.filter((f) => f.province === province);
}

export function getFormsByCategory(category: string): CourtFormEntry[] {
  return COURT_FORMS.filter((f) => f.category === category);
}
