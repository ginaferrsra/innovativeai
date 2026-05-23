// Comprehensive Learning Resources Library
// Educational content for self-represented litigants and legal professionals

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  category: LearningCategory;
  type: ResourceType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  content: string;
  topics: string[];
  relatedResources: string[];
  externalLinks?: ExternalLink[];
  lastUpdated: string;
  province?: string;
}

export interface ExternalLink {
  title: string;
  url: string;
  type: 'official' | 'guide' | 'form' | 'video';
}

export type LearningCategory = 
  | 'court_procedures' 
  | 'legal_documents' 
  | 'self_representation'
  | 'charter_rights'
  | 'civil_procedure'
  | 'criminal_procedure'
  | 'family_law'
  | 'small_claims'
  | 'appeals';

export type ResourceType = 
  | 'tutorial' 
  | 'guide' 
  | 'checklist' 
  | 'template'
  | 'video'
  | 'article'
  | 'faq';

export const LEARNING_CATEGORIES: { id: LearningCategory; name: string; description: string }[] = [
  { id: 'court_procedures', name: 'Court Procedures', description: 'Learn how courts work and what to expect' },
  { id: 'legal_documents', name: 'Legal Documents', description: 'How to draft and file legal documents' },
  { id: 'self_representation', name: 'Self-Representation', description: 'Guide for representing yourself in court' },
  { id: 'charter_rights', name: 'Charter Rights', description: 'Understanding your constitutional rights' },
  { id: 'civil_procedure', name: 'Civil Procedure', description: 'Civil litigation process and rules' },
  { id: 'criminal_procedure', name: 'Criminal Procedure', description: 'Criminal court process and rights' },
  { id: 'family_law', name: 'Family Law', description: 'Divorce, custody, and support matters' },
  { id: 'small_claims', name: 'Small Claims', description: 'Small claims court process' },
  { id: 'appeals', name: 'Appeals', description: 'How to appeal a court decision' },
];

export const LEARNING_RESOURCES: LearningResource[] = [
  // COURT PROCEDURES
  {
    id: 'court-101',
    title: 'Understanding the Canadian Court System',
    description: 'A comprehensive overview of how Canadian courts are structured and how they work.',
    category: 'court_procedures',
    type: 'tutorial',
    difficulty: 'beginner',
    duration: '20 min read',
    topics: ['court hierarchy', 'jurisdiction', 'court levels'],
    relatedResources: ['filing-101', 'courtroom-etiquette'],
    lastUpdated: '2025-01-15',
    content: `
# Understanding the Canadian Court System

## Court Hierarchy

Canada has a hierarchical court system with different levels of courts handling different types of cases:

### 1. Supreme Court of Canada
- The highest court in Canada
- Hears appeals on important legal questions
- Decisions are binding on all other courts
- Leave (permission) to appeal is usually required

### 2. Provincial/Territorial Courts of Appeal
- Hear appeals from lower courts
- Three judges typically hear each case
- Decisions are binding within the province

### 3. Superior Courts (Trial Level)
- Called different names in different provinces:
  - Ontario: Superior Court of Justice
  - BC: Supreme Court of British Columbia
  - Alberta: Court of King's Bench
- Handle serious criminal matters and civil cases over monetary thresholds
- Have inherent jurisdiction

### 4. Provincial/Territorial Courts
- Handle less serious criminal matters
- Small claims (monetary limits vary by province)
- Family matters in some provinces
- Traffic and regulatory offences

### 5. Federal Courts
- Federal Court: Immigration, intellectual property, federal administrative law
- Tax Court of Canada: Tax disputes
- Federal Court of Appeal: Appeals from Federal Court

## Key Concepts

### Jurisdiction
Jurisdiction refers to a court's authority to hear a case. Courts have:
- **Subject matter jurisdiction**: What types of cases they can hear
- **Geographic jurisdiction**: What area they cover
- **Monetary jurisdiction**: Maximum amounts they can award

### Precedent (Stare Decisis)
Lower courts must follow decisions of higher courts in the same jurisdiction. This creates consistency and predictability in the law.

### The Adversarial System
Canadian courts use an adversarial system where:
- Two parties present their cases
- The judge acts as a neutral decision-maker
- Each side has the opportunity to present evidence and cross-examine witnesses

## What to Expect in Court

1. **Arrive early**: At least 30 minutes before your scheduled time
2. **Dress appropriately**: Business attire is expected
3. **Bring all documents**: Multiple copies of everything you need
4. **Address the judge properly**: "Your Honour" or "Justice [Name]"
5. **Stand when speaking**: And when the judge enters/leaves
6. **Be respectful**: To everyone, including the other party
    `,
    externalLinks: [
      { title: 'Courts of Canada', url: 'https://www.justice.gc.ca/eng/csj-sjc/ccs-ajc/', type: 'official' },
      { title: 'Ontario Courts', url: 'https://www.ontariocourts.ca/', type: 'official' },
    ],
  },
  {
    id: 'filing-101',
    title: 'How to File Court Documents',
    description: 'Step-by-step guide to preparing and filing documents with the court.',
    category: 'court_procedures',
    type: 'guide',
    difficulty: 'beginner',
    duration: '15 min read',
    topics: ['filing', 'documents', 'court clerk'],
    relatedResources: ['court-101', 'document-formatting'],
    lastUpdated: '2025-01-15',
    content: `
# How to File Court Documents

## Before You File

### 1. Determine the Correct Court
- Check monetary limits for small claims
- Verify which court has jurisdiction
- Find the correct courthouse location

### 2. Use the Correct Forms
- Each court has specific forms
- Forms are usually available online
- Use the most current version

### 3. Prepare Your Documents
- Type all documents (handwritten may not be accepted)
- Use required formatting (fonts, margins, spacing)
- Include all mandatory information
- Sign where required

## Filing Process

### Step 1: Make Copies
- Original for the court
- One copy for yourself
- One copy for each other party
- Extra copies for witnesses if needed

### Step 2: Calculate and Pay Fees
- Filing fees vary by court and document type
- Fee waivers available for those who qualify
- Payment methods: cash, credit card, certified cheque

### Step 3: Submit to Court Clerk
- Go to the courthouse filing counter
- Present your documents
- Pay the filing fee
- Get your stamped copies back

### Step 4: Serve the Other Party
- You must serve documents on the other party
- Different rules for different document types
- Keep proof of service

## Common Filing Mistakes to Avoid

1. **Wrong court**: Filing in a court without jurisdiction
2. **Missing signatures**: Forgetting to sign documents
3. **Insufficient copies**: Not bringing enough copies
4. **Wrong forms**: Using outdated or incorrect forms
5. **Late filing**: Missing deadlines

## E-Filing (Where Available)

Many courts now accept electronic filing:
- Ontario: [Civil Submissions Online](https://www.ontario.ca/page/file-court-documents-online)
- BC: [Court Services Online](https://justice.gov.bc.ca/cso/)
- Federal Court: [Federal Court E-Filing](https://www.fct-cf.gc.ca/en/pages/online-resources/e-filing)

### Benefits of E-Filing
- File from anywhere
- Available 24/7
- Automatic fee calculation
- Confirmation of filing
    `,
    externalLinks: [
      { title: 'Ontario Court Forms', url: 'https://www.ontariocourtforms.on.ca/', type: 'form' },
      { title: 'BC Court Forms', url: 'https://www.bccourts.ca/supreme_court/practice_and_procedure/', type: 'form' },
    ],
  },
  {
    id: 'courtroom-etiquette',
    title: 'Courtroom Etiquette and Protocol',
    description: 'How to conduct yourself properly in the courtroom.',
    category: 'court_procedures',
    type: 'guide',
    difficulty: 'beginner',
    duration: '10 min read',
    topics: ['etiquette', 'protocol', 'behaviour'],
    relatedResources: ['court-101', 'self-rep-basics'],
    lastUpdated: '2025-01-15',
    content: `
# Courtroom Etiquette and Protocol

## Addressing the Court

### Judges
- Provincial Court: "Your Honour"
- Superior Court/Federal Court: "Your Honour" or "Justice [Last Name]"
- Court of Appeal: "My Lord/My Lady" (traditional) or "Justice [Last Name]"

### Referring to Parties
- Yourself: "the Plaintiff" or "the Defendant" (not "I" in formal submissions)
- The other party: by their role, not their name
- Witnesses: "the witness" or their name

## Physical Conduct

### When to Stand
- When the judge enters or leaves
- When speaking to the judge
- When the court is called to order
- When making submissions

### When to Sit
- When the judge sits
- When the other party is speaking
- During breaks

### Movement
- Do not approach the bench without permission
- Stay at counsel table or designated area
- Ask permission to hand documents to the court

## Dress Code

### Recommended
- Business suit or dress
- Conservative colours
- Clean and pressed clothing
- Closed-toe shoes

### Avoid
- Casual clothing (jeans, t-shirts)
- Revealing clothing
- Hats (religious head coverings excepted)
- Strong fragrances

## Communication

### Do
- Speak clearly and slowly
- Wait your turn
- Be concise and relevant
- Say "Thank you, Your Honour" when appropriate

### Don't
- Interrupt the judge or other party
- Argue with the judge
- Show emotional outbursts
- Use slang or profanity
- Speak to the other party directly

## Electronic Devices

- Turn off or silence all devices
- No recording without court permission
- No texting or browsing during proceedings
- Laptops may be permitted for notes (ask first)

## Important Reminders

1. **Be early**: Arrive at least 30 minutes before
2. **Be prepared**: Have all documents organized
3. **Be patient**: Courts often run behind schedule
4. **Be respectful**: To everyone, including court staff
5. **Be honest**: Always tell the truth
    `,
    externalLinks: [],
  },

  // SELF-REPRESENTATION
  {
    id: 'self-rep-basics',
    title: 'Guide to Self-Representation in Court',
    description: 'Everything you need to know about representing yourself in legal proceedings.',
    category: 'self_representation',
    type: 'tutorial',
    difficulty: 'intermediate',
    duration: '30 min read',
    topics: ['self-representation', 'litigant', 'pro se'],
    relatedResources: ['court-101', 'evidence-basics', 'making-arguments'],
    lastUpdated: '2025-01-15',
    content: `
# Guide to Self-Representation in Court

## Is Self-Representation Right for You?

### Consider Self-Representation If:
- Your case is straightforward
- You have time to prepare
- You can remain calm under pressure
- The stakes are manageable
- You understand the basics of the legal system

### Consider Getting a Lawyer If:
- Significant money or rights are at stake
- The other side has a lawyer
- The case involves complex legal issues
- You're facing criminal charges with jail time
- You're uncomfortable speaking in public

## Resources for Self-Represented Litigants

### Free Legal Help
1. **Legal Aid**: For those who qualify financially
2. **Pro Bono Programs**: Free legal clinics
3. **Duty Counsel**: Available at most courthouses
4. **Law Society Referral Services**: Free consultations
5. **Community Legal Clinics**: Specialized help

### Self-Help Resources
- Court websites and guides
- Law libraries (often in courthouses)
- Legal information websites (CanLII, CLEO)
- This platform!

## Key Skills You'll Need

### 1. Research
- Understanding relevant laws
- Finding applicable cases
- Knowing court rules and procedures

### 2. Writing
- Drafting clear legal documents
- Organizing arguments logically
- Using proper legal format

### 3. Speaking
- Presenting arguments clearly
- Examining and cross-examining witnesses
- Responding to questions from the judge

### 4. Organization
- Managing documents
- Meeting deadlines
- Preparing evidence

## Step-by-Step Process

### Before Court
1. Understand your legal position
2. Research applicable law
3. Prepare all documents
4. Organize your evidence
5. Practice your presentation
6. Know the court rules

### During Court
1. Arrive early
2. Check in with the court clerk
3. Observe other cases if possible
4. Present your case clearly
5. Listen carefully to the other side
6. Take notes
7. Be respectful at all times

### After Court
1. Understand the decision
2. Meet any deadlines set by the court
3. Consider whether to appeal (if unsuccessful)
4. Comply with court orders

## Common Mistakes to Avoid

1. **Missing deadlines**: Courts are strict about timelines
2. **Being unprepared**: Know your facts and the law
3. **Being emotional**: Stay calm and professional
4. **Ignoring evidence rules**: Learn what can be admitted
5. **Not listening**: Pay attention to the judge and other party
6. **Being disrespectful**: This never helps your case
    `,
    externalLinks: [
      { title: 'Steps to Justice (Ontario)', url: 'https://stepstojustice.ca/', type: 'guide' },
      { title: 'BC Self-Help Guide', url: 'https://www.clicklaw.bc.ca/', type: 'guide' },
      { title: 'Legal Aid Ontario', url: 'https://www.legalaid.on.ca/', type: 'official' },
    ],
  },
  {
    id: 'evidence-basics',
    title: 'Understanding Evidence in Court',
    description: 'Learn what evidence is admissible and how to present it effectively.',
    category: 'self_representation',
    type: 'tutorial',
    difficulty: 'intermediate',
    duration: '25 min read',
    topics: ['evidence', 'admissibility', 'documents', 'witnesses'],
    relatedResources: ['self-rep-basics', 'making-arguments'],
    lastUpdated: '2025-01-15',
    content: `
# Understanding Evidence in Court

## What is Evidence?

Evidence is information presented to the court to prove or disprove facts in issue. The party making a claim generally has the burden of proving it.

## Types of Evidence

### 1. Documentary Evidence
- Contracts and agreements
- Emails and text messages
- Photos and videos
- Medical records
- Financial documents
- Business records

### 2. Testimonial Evidence
- Witness testimony under oath
- Expert witness opinions
- Your own testimony

### 3. Physical Evidence
- Objects relevant to the case
- Original documents
- Physical items

## Rules of Evidence

### Relevance
Evidence must be relevant to an issue in the case. Irrelevant evidence is not admissible.

### Hearsay Rule
Generally, you cannot repeat what someone else said to prove the truth of what they said. There are many exceptions, including:
- Business records
- Statements against interest
- Dying declarations
- Statements of present intention

### Best Evidence Rule
The original document should be presented when possible. Copies may be acceptable if:
- Original is lost or destroyed
- Original is in possession of the other party
- Both parties agree

### Opinion Evidence
Generally, witnesses can only testify to facts they observed, not their opinions. Exceptions include:
- Expert witnesses (qualified by the court)
- Common sense observations ("he seemed drunk")

## Presenting Documentary Evidence

### Step 1: Identify the Document
"Your Honour, I am presenting Exhibit 1, a contract dated January 15, 2024."

### Step 2: Authenticate
Prove the document is what you say it is:
- Through a witness who created or received it
- Through business records procedures
- By the other party's admission

### Step 3: Establish Relevance
Explain why the document matters to your case.

### Step 4: Enter into Evidence
"Your Honour, I ask that this document be marked as Exhibit 1."

## Witness Examination

### Direct Examination (Your Witnesses)
- Ask open-ended questions
- Let the witness tell their story
- Don't lead the witness
- Example: "What did you see?" NOT "You saw the defendant hit the plaintiff, didn't you?"

### Cross-Examination (Other Party's Witnesses)
- Challenge the witness's credibility
- Highlight inconsistencies
- Leading questions ARE allowed
- Be respectful but firm

## Organizing Your Evidence

1. Create an exhibit list
2. Number all documents
3. Put documents in chronological order
4. Have copies for everyone
5. Know which witness will introduce each document
    `,
    externalLinks: [
      { title: 'Canada Evidence Act', url: 'https://laws-lois.justice.gc.ca/eng/acts/c-5/', type: 'official' },
    ],
  },

  // CHARTER RIGHTS
  {
    id: 'charter-overview',
    title: 'Your Charter Rights Explained',
    description: 'Understanding the Canadian Charter of Rights and Freedoms.',
    category: 'charter_rights',
    type: 'tutorial',
    difficulty: 'beginner',
    duration: '20 min read',
    topics: ['charter', 'rights', 'freedoms', 'constitution'],
    relatedResources: ['charter-violations', 'section-24'],
    lastUpdated: '2025-01-15',
    content: `
# Your Charter Rights Explained

## What is the Charter?

The Canadian Charter of Rights and Freedoms is part of Canada's Constitution. It guarantees fundamental rights and freedoms to everyone in Canada.

## Key Charter Rights

### Fundamental Freedoms (Section 2)
- Freedom of conscience and religion
- Freedom of thought, belief, opinion and expression (including freedom of the press)
- Freedom of peaceful assembly
- Freedom of association

### Democratic Rights (Sections 3-5)
- Right to vote
- Right to run for office
- Maximum 5-year term for legislatures
- Annual sittings of legislatures

### Mobility Rights (Section 6)
- Right to enter, remain in, and leave Canada
- Right to move and work in any province

### Legal Rights (Sections 7-14)

#### Section 7: Life, Liberty and Security
Everyone has the right to life, liberty and security of the person and the right not to be deprived thereof except in accordance with the principles of fundamental justice.

#### Section 8: Search and Seizure
Everyone has the right to be secure against unreasonable search or seizure.

#### Section 9: Detention
Everyone has the right not to be arbitrarily detained or imprisoned.

#### Section 10: Rights on Arrest
- To be informed promptly of reasons
- To retain and instruct counsel without delay
- To have validity of detention determined (habeas corpus)

#### Section 11: Criminal Proceedings
- To be informed of the specific offence
- To be tried within a reasonable time
- Not to be compelled to testify against yourself
- To be presumed innocent until proven guilty
- To be tried by jury (for serious offences)
- Not to be tried twice for the same offence
- Benefit of lesser punishment

#### Section 12: Cruel and Unusual Treatment
Everyone has the right not to be subjected to any cruel and unusual treatment or punishment.

### Equality Rights (Section 15)
Everyone is equal before and under the law and has the right to equal protection and benefit of the law without discrimination based on:
- Race, national or ethnic origin, colour
- Religion
- Sex, age
- Mental or physical disability

## When Does the Charter Apply?

The Charter applies to:
- Federal government and its agencies
- Provincial/territorial governments
- Municipalities
- Police
- Public schools
- Crown corporations

The Charter does NOT directly apply to:
- Private individuals
- Private businesses
- Private disputes (contract, tort)

## Section 1: Reasonable Limits

Rights are not absolute. Section 1 allows reasonable limits that:
- Are prescribed by law
- Can be demonstrably justified in a free and democratic society

The Oakes Test (from R v Oakes, [1986] 1 SCR 103):
1. Pressing and substantial objective
2. Proportionality:
   - Rational connection
   - Minimal impairment
   - Proportionate effects
    `,
    externalLinks: [
      { title: 'Full Charter Text', url: 'https://laws-lois.justice.gc.ca/eng/const/page-12.html', type: 'official' },
      { title: 'Charter Guide', url: 'https://www.justice.gc.ca/eng/csj-sjc/rfc-dlc/ccrf-ccdl/', type: 'guide' },
    ],
  },
  {
    id: 'charter-violations',
    title: 'When Your Charter Rights Are Violated',
    description: 'How to identify and respond to Charter violations.',
    category: 'charter_rights',
    type: 'guide',
    difficulty: 'intermediate',
    duration: '20 min read',
    topics: ['charter', 'violations', 'remedies', 'section 24'],
    relatedResources: ['charter-overview', 'section-24'],
    lastUpdated: '2025-01-15',
    content: `
# When Your Charter Rights Are Violated

## Identifying a Charter Violation

### Questions to Ask
1. Was the government involved? (Police, crown, government agency)
2. Which Charter right was affected?
3. Was there an actual interference with the right?
4. Can the government justify the interference under s. 1?

### Common Violations

#### Section 8 (Search and Seizure)
- Search without a warrant (when one was required)
- Warrant obtained with false information
- Search exceeding scope of warrant
- Unreasonable strip search
- Warrantless phone search

#### Section 9 (Arbitrary Detention)
- Stopped without reasonable suspicion
- Detained without grounds
- Investigative detention without articulable cause

#### Section 10 (Rights on Arrest)
- Not told reasons for arrest
- Denied access to counsel
- Not informed of right to counsel
- Police continuing questioning after request for lawyer

#### Section 11(b) (Trial Within Reasonable Time)
- Unreasonable delays in prosecution
- Generally 18 months (provincial) or 30 months (superior court)
- See R v Jordan, 2016 SCC 27

## Gathering Evidence of Violations

### Document Everything
- Dates, times, locations
- Names and badge numbers of officers
- What was said and done
- Names of witnesses
- Any injuries or damage

### Preserve Evidence
- Don't wash clothes (if relevant)
- Photograph injuries
- Save all documents
- Get medical attention if needed

### Written Records
- Write down events as soon as possible
- Include specific details
- Keep a copy in a safe place

## Raising Charter Issues

### Notice Requirements
In most jurisdictions, you must give notice if raising a constitutional question:
- Ontario: Form 4F (Notice of Constitutional Question)
- Federal: Rule 57
- Must serve Attorney General

### Timing
- Raise Charter issues as early as possible
- Pre-trial motions are common
- Some issues can be raised at trial

### Burden of Proof
1. **Applicant** proves prima facie violation on balance of probabilities
2. **Crown/Government** must justify under s. 1

## What Happens If Rights Were Violated?

### Section 24(1) Remedies
For any Charter violation, a court can grant such remedy as it considers appropriate and just:
- Declaration of violation
- Damages (rare)
- Stay of proceedings
- Injunction
- Costs

### Section 24(2) Exclusion of Evidence
Evidence obtained in violation of the Charter SHALL be excluded if admission would bring the administration of justice into disrepute.

Grant Test (R v Grant, 2009 SCC 32):
1. Seriousness of Charter-infringing state conduct
2. Impact on Charter-protected interests
3. Society's interest in adjudication on the merits
    `,
    externalLinks: [
      { title: 'R v Grant', url: 'https://www.canlii.org/en/ca/scc/doc/2009/2009scc32/2009scc32.html', type: 'official' },
      { title: 'R v Jordan', url: 'https://www.canlii.org/en/ca/scc/doc/2016/2016scc27/2016scc27.html', type: 'official' },
    ],
  },

  // CIVIL PROCEDURE
  {
    id: 'civil-action-steps',
    title: 'Steps in a Civil Lawsuit',
    description: 'Complete guide to the civil litigation process from start to finish.',
    category: 'civil_procedure',
    type: 'tutorial',
    difficulty: 'intermediate',
    duration: '35 min read',
    topics: ['civil', 'litigation', 'lawsuit', 'procedure'],
    relatedResources: ['filing-101', 'discovery-guide', 'trial-prep'],
    lastUpdated: '2025-01-15',
    content: `
# Steps in a Civil Lawsuit

## Overview

A civil lawsuit typically proceeds through these stages:
1. Pleadings
2. Discovery
3. Pre-Trial
4. Trial
5. Judgment and Costs
6. Appeal (if any)

## Stage 1: Pleadings

### Statement of Claim
The plaintiff starts the lawsuit by filing a Statement of Claim:
- Names the parties
- Describes the facts
- States the legal basis for the claim
- Specifies the relief sought

### Service
The plaintiff must serve the Statement of Claim on the defendant within a specified time (usually 6 months in Ontario).

### Statement of Defence
The defendant responds by filing a Statement of Defence:
- Admits or denies each allegation
- States defences
- May include counterclaim

### Reply (if needed)
If the defence raises new matters, the plaintiff may file a Reply.

## Stage 2: Discovery

### Documentary Discovery
Both parties must disclose relevant documents:
- Affidavit of Documents
- Production of documents
- Privilege claims

### Examinations for Discovery
Oral questioning of parties under oath:
- Questions about facts and evidence
- Answers can be used at trial
- Undertakings to provide information

### Motions
Either party may bring motions for:
- Production of documents
- Better affidavits
- Compelling answers
- Summary judgment

## Stage 3: Pre-Trial

### Mandatory Mediation
Many jurisdictions require mediation before trial.

### Pre-Trial Conference
Meeting with a judge to:
- Discuss settlement
- Identify issues
- Set trial schedule
- Make procedural orders

### Trial Management Conference
Final conference to:
- Confirm trial readiness
- Address last-minute issues
- Set time estimates

## Stage 4: Trial

### Opening Statements
Each party outlines their case.

### Plaintiff's Case
- Present evidence
- Examine witnesses
- Enter exhibits

### Defendant's Case
- Present evidence
- Examine witnesses
- Enter exhibits

### Closing Arguments
Each party summarizes the evidence and law.

### Judgment
The judge renders a decision, either:
- From the bench (immediately)
- Reserved (written decision later)

## Stage 5: Judgment and Costs

### Judgment
The successful party gets:
- Declaration of rights
- Damages award
- Other relief

### Costs
Usually the losing party pays some costs:
- Partial indemnity (typical)
- Substantial indemnity (misconduct)
- Full indemnity (rare)

## Stage 6: Appeal

### Notice of Appeal
Must be filed within strict time limits:
- Ontario: 30 days
- BC: 30 days

### Appeal Record
Compile all relevant documents from trial.

### Appeal Factum
Written argument for the appeal.

### Hearing
Oral argument before appeal judges.

## Timelines

Typical civil lawsuit timelines:
- Pleadings close: 2-4 months
- Discovery: 6-12 months
- Pre-trial: 12-18 months
- Trial: 18-36 months
- Appeal: 6-12 months after trial
    `,
    externalLinks: [
      { title: 'Ontario Rules of Civil Procedure', url: 'https://www.ontario.ca/laws/regulation/900194', type: 'official' },
      { title: 'BC Supreme Court Civil Rules', url: 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/168_2009_00', type: 'official' },
    ],
  },

  // SMALL CLAIMS
  {
    id: 'small-claims-guide',
    title: 'Small Claims Court Guide',
    description: 'How to navigate small claims court for monetary disputes.',
    category: 'small_claims',
    type: 'tutorial',
    difficulty: 'beginner',
    duration: '25 min read',
    topics: ['small claims', 'money', 'simplified'],
    relatedResources: ['filing-101', 'evidence-basics'],
    lastUpdated: '2025-01-15',
    content: `
# Small Claims Court Guide

## What is Small Claims Court?

Small Claims Court is a simpler, faster, and less expensive court for resolving smaller monetary disputes.

## Monetary Limits by Province

| Province | Limit |
|----------|-------|
| Ontario | $35,000 |
| British Columbia (CRT) | $5,000 |
| BC Small Claims | $35,000 |
| Alberta | $50,000 |
| Quebec | $15,000 |
| Manitoba | $15,000 |
| Saskatchewan | $30,000 |
| Nova Scotia | $25,000 |
| New Brunswick | $20,000 |
| Newfoundland | $25,000 |
| PEI | $16,000 |

## What Cases Are Heard?

### Appropriate for Small Claims
- Breach of contract
- Property damage
- Unpaid debts
- Faulty goods/services
- Return of personal property
- Bad cheques

### NOT Appropriate for Small Claims
- Defamation
- Malicious prosecution
- Family law matters
- Real property disputes
- Most landlord-tenant matters

## The Process

### Step 1: Demand Letter
Before suing, send a demand letter:
- Explain what you're owed
- Give a deadline to pay
- Warn about court action
- Keep a copy

### Step 2: File Your Claim
Complete the Plaintiff's Claim form:
- Identify all defendants
- Explain what happened
- State what you want
- Pay the filing fee

### Step 3: Serve the Defendant
Serve the claim on the defendant:
- Personal service, or
- Alternatives permitted by rules
- File proof of service

### Step 4: Wait for Response
The defendant may:
- Pay the claim
- File a defence
- Dispute part of the claim
- File a counterclaim
- Do nothing (default judgment possible)

### Step 5: Settlement Conference
Mandatory meeting to:
- Discuss settlement
- Identify issues
- Narrow disputes
- Schedule trial if needed

### Step 6: Trial
If not settled:
- Present your case
- Judge decides
- Judgment issued

## Tips for Success

### Preparation
1. Organize all documents chronologically
2. Make copies for everyone
3. Calculate damages precisely
4. Know the relevant law

### At the Hearing
1. Be brief and focused
2. Present evidence clearly
3. Ask relevant questions
4. Don't argue - present facts

### Collecting Your Judgment
If you win, you may need to:
- Garnish wages
- Seize assets
- Examine the debtor
- Renew the judgment
    `,
    externalLinks: [
      { title: 'Ontario Small Claims', url: 'https://www.ontario.ca/page/suing-someone-small-claims-court', type: 'official' },
      { title: 'BC Civil Resolution Tribunal', url: 'https://civilresolutionbc.ca/', type: 'official' },
    ],
  },

  // APPEALS
  {
    id: 'appeal-basics',
    title: 'How to Appeal a Court Decision',
    description: 'Understanding the appeals process in Canadian courts.',
    category: 'appeals',
    type: 'tutorial',
    difficulty: 'advanced',
    duration: '30 min read',
    topics: ['appeal', 'review', 'errors'],
    relatedResources: ['court-101', 'factum-writing'],
    lastUpdated: '2025-01-15',
    content: `
# How to Appeal a Court Decision

## What is an Appeal?

An appeal is NOT a new trial. It is a review of whether the lower court made an error.

## Grounds for Appeal

### Errors of Law
- Misapplied legal test
- Wrong legal standard
- Incorrect interpretation of statute
- Violation of natural justice/procedural fairness

### Errors of Fact (Limited)
Must show "palpable and overriding error":
- Clear mistake
- That affected the outcome

### Errors of Mixed Fact and Law
Application of legal standard to facts.

## NOT Grounds for Appeal

- You disagree with the decision
- You found new evidence (usually)
- You made better arguments
- The other side had a better lawyer

## Appeal Routes

### From Provincial Court
Usually to Superior Court

### From Superior Court
- To Court of Appeal (provincial)
- May need leave for interlocutory orders

### From Court of Appeal
- To Supreme Court of Canada
- Requires leave (permission) in most cases

### From Federal Court
- To Federal Court of Appeal

## The Appeal Process

### Step 1: Consider Carefully
- Is there a valid ground of appeal?
- Is it worth the cost and time?
- What's the chance of success?
- Get legal advice

### Step 2: File Notice of Appeal
**Strict time limits apply!**
- Usually 30 days from judgment
- Extensions rarely granted
- Pay filing fee

### Step 3: Order Transcripts
- Audio recordings of trial
- Usually your responsibility to order and pay

### Step 4: Prepare Appeal Record
Compile relevant documents:
- Notice of Appeal
- Pleadings
- Reasons for judgment
- Relevant transcripts
- Exhibits

### Step 5: Prepare Factum
Written argument:
- Part I: Statement of the Case
- Part II: Statement of Facts
- Part III: Issues and Law
- Part IV: Order Requested
- Schedule: Authorities

### Step 6: Hearing
Oral argument before appeal judges:
- Usually 3 judges
- Time limits apply
- Questions from the bench

### Step 7: Decision
- May be given immediately
- Often reserved for written reasons

## Standards of Review

### Correctness
For questions of law. Appeal court can substitute its own view.

### Palpable and Overriding Error
For questions of fact. Very high deference to trial judge.

### Reasonableness
For discretionary decisions. Must be within range of reasonable outcomes.

## Costs of Appeal

Be prepared for:
- Filing fees
- Transcript costs
- Printing/binding costs
- Legal fees (if any)
- Security for costs (may be required)
- Costs if you lose

## Word Limits

Factums typically have word limits:
- Ontario Court of Appeal: 10,000 words
- SCC: Appellant 10,000; Respondent 8,000
    `,
    externalLinks: [
      { title: 'Ontario Court of Appeal', url: 'https://www.ontariocourts.ca/coa/', type: 'official' },
      { title: 'SCC Rules', url: 'https://www.scc-csc.ca/unrep-nonrep/rules-regles-eng.aspx', type: 'official' },
    ],
  },
];

export function searchResources(
  query: string,
  category?: LearningCategory,
  difficulty?: string,
  type?: ResourceType
): LearningResource[] {
  return LEARNING_RESOURCES.filter((resource) => {
    const matchesQuery = !query ||
      resource.title.toLowerCase().includes(query.toLowerCase()) ||
      resource.description.toLowerCase().includes(query.toLowerCase()) ||
      resource.topics.some(t => t.toLowerCase().includes(query.toLowerCase()));
    const matchesCategory = !category || resource.category === category;
    const matchesDifficulty = !difficulty || difficulty === 'all' || resource.difficulty === difficulty;
    const matchesType = !type || resource.type === type;
    return matchesQuery && matchesCategory && matchesDifficulty && matchesType;
  });
}

export function getResourceById(id: string): LearningResource | undefined {
  return LEARNING_RESOURCES.find(r => r.id === id);
}

export function getResourcesByCategory(category: LearningCategory): LearningResource[] {
  return LEARNING_RESOURCES.filter(r => r.category === category);
}

export function getRelatedResources(resourceId: string): LearningResource[] {
  const resource = getResourceById(resourceId);
  if (!resource) return [];
  return resource.relatedResources
    .map(id => getResourceById(id))
    .filter((r): r is LearningResource => r !== undefined);
}
