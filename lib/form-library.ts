// Advanced Form Library for LexisAI
// Comprehensive form system for all legal document types, intake forms, and dynamic workflows

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'number'
  | 'currency'
  | 'address'
  | 'signature'
  | 'conditional'
  | 'repeater'
  | 'table'
  | 'rich_text';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  description?: string;
  placeholder?: string;
  value?: any;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => boolean | string;
  };
  conditional?: {
    field: string;
    operator: 'equals' | 'contains' | 'greater' | 'less';
    value: any;
  };
  options?: Array<{ label: string; value: string | number }>;
  dependencies?: string[];
  helpText?: string;
}

export interface FormTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  jurisdiction: string[];
  fields: FormField[];
  sections: FormSection[];
  metadata: {
    version: string;
    createdAt: Date;
    updatedAt: Date;
    author: string;
  };
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: string[]; // field IDs
  collapsible: boolean;
  defaultOpen: boolean;
}

export interface FormSubmission {
  id: string;
  templateId: string;
  userId: string;
  caseId: string;
  data: Record<string, any>;
  status: 'draft' | 'submitted' | 'validated' | 'error';
  validationErrors?: Record<string, string>;
  submittedAt?: Date;
  extractedData?: Record<string, any>;
}

// Legal Document Forms
export const CRIMINAL_INTAKE_FORM: FormTemplate = {
  id: 'criminal-intake-001',
  name: 'Criminal Case Intake Form',
  category: 'Criminal Defense',
  description: 'Comprehensive intake form for criminal defense cases',
  jurisdiction: ['ON', 'BC', 'AB', 'QC', 'MB'],
  sections: [
    {
      id: 'personal-info',
      title: 'Personal Information',
      fields: ['firstName', 'lastName', 'dob', 'email', 'phone'],
      collapsible: false,
      defaultOpen: true,
    },
    {
      id: 'case-details',
      title: 'Case Details',
      fields: ['chargeType', 'chargeDescription', 'arrestDate', 'court'],
      collapsible: false,
      defaultOpen: true,
    },
    {
      id: 'legal-issues',
      title: 'Legal Issues & Charter Considerations',
      fields: ['charterConcerns', 'searchDetails', 'interrogationCircumstances'],
      collapsible: true,
      defaultOpen: true,
    },
    {
      id: 'representation',
      title: 'Representation & Financial',
      fields: ['representationType', 'legalAidApproval', 'retainer'],
      collapsible: true,
      defaultOpen: false,
    },
  ],
  fields: [
    {
      id: 'firstName',
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      validation: { minLength: 2, maxLength: 50 },
    },
    {
      id: 'lastName',
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      validation: { minLength: 2, maxLength: 50 },
    },
    {
      id: 'dob',
      name: 'dob',
      label: 'Date of Birth',
      type: 'date',
      required: true,
    },
    {
      id: 'email',
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
    },
    {
      id: 'phone',
      name: 'phone',
      label: 'Phone Number',
      type: 'phone',
      required: true,
      validation: { pattern: '^[0-9-()+ ]{10,}$' },
    },
    {
      id: 'chargeType',
      name: 'chargeType',
      label: 'Type of Charge',
      type: 'select',
      required: true,
      options: [
        { label: 'Assault', value: 'assault' },
        { label: 'DUI/DWI', value: 'dui' },
        { label: 'Drug Offense', value: 'drug' },
        { label: 'Theft', value: 'theft' },
        { label: 'Fraud', value: 'fraud' },
        { label: 'Violence', value: 'violence' },
        { label: 'Sexual Offense', value: 'sexual' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      id: 'chargeDescription',
      name: 'chargeDescription',
      label: 'Charge Description',
      type: 'textarea',
      required: true,
      validation: { maxLength: 1000 },
    },
    {
      id: 'arrestDate',
      name: 'arrestDate',
      label: 'Date of Arrest',
      type: 'date',
      required: true,
    },
    {
      id: 'court',
      name: 'court',
      label: 'Court Level',
      type: 'select',
      required: true,
      options: [
        { label: 'Provincial/District Court', value: 'provincial' },
        { label: 'Superior Court', value: 'superior' },
        { label: 'Court of Appeal', value: 'appeal' },
        { label: 'Supreme Court of Canada', value: 'supreme' },
      ],
    },
    {
      id: 'charterConcerns',
      name: 'charterConcerns',
      label: 'Charter Concerns (if any)',
      type: 'multiselect',
      required: false,
      options: [
        { label: 'Unreasonable Search & Seizure (S.8)', value: 's8' },
        { label: 'Right to Counsel (S.10)', value: 's10' },
        { label: 'Self-incrimination (S.7)', value: 's7' },
        { label: 'Fair Trial (S.11)', value: 's11' },
        { label: 'Cruel & Unusual Punishment (S.12)', value: 's12' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      id: 'searchDetails',
      name: 'searchDetails',
      label: 'Search & Seizure Details',
      type: 'textarea',
      required: false,
      conditional: {
        field: 'charterConcerns',
        operator: 'contains',
        value: 's8',
      },
    },
    {
      id: 'interrogationCircumstances',
      name: 'interrogationCircumstances',
      label: 'Interrogation Circumstances',
      type: 'textarea',
      required: false,
      conditional: {
        field: 'charterConcerns',
        operator: 'contains',
        value: 's10',
      },
    },
    {
      id: 'representationType',
      name: 'representationType',
      label: 'Type of Representation',
      type: 'select',
      required: true,
      options: [
        { label: 'Retained Counsel', value: 'retained' },
        { label: 'Legal Aid', value: 'legal_aid' },
        { label: 'Self-Represented', value: 'self_rep' },
      ],
    },
    {
      id: 'legalAidApproval',
      name: 'legalAidApproval',
      label: 'Legal Aid Approval Number',
      type: 'text',
      required: false,
      conditional: {
        field: 'representationType',
        operator: 'equals',
        value: 'legal_aid',
      },
    },
    {
      id: 'retainer',
      name: 'retainer',
      label: 'Retainer Amount (if applicable)',
      type: 'currency',
      required: false,
    },
  ],
  metadata: {
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    author: 'LexisAI System',
  },
};

// Civil Litigation Form
export const CIVIL_INTAKE_FORM: FormTemplate = {
  id: 'civil-intake-001',
  name: 'Civil Litigation Intake Form',
  category: 'Civil Law',
  description: 'Intake form for civil litigation matters',
  jurisdiction: ['ON', 'BC', 'AB', 'QC', 'MB'],
  sections: [
    {
      id: 'party-info',
      title: 'Party Information',
      fields: ['partyType', 'partyName', 'partyContact'],
      collapsible: false,
      defaultOpen: true,
    },
    {
      id: 'claim-details',
      title: 'Claim Details',
      fields: ['claimType', 'claimAmount', 'claimDescription', 'damagesBreakdown'],
      collapsible: false,
      defaultOpen: true,
    },
    {
      id: 'defendants',
      title: 'Defendants/Respondents',
      fields: ['defendantList', 'defendantAddresses'],
      collapsible: true,
      defaultOpen: true,
    },
  ],
  fields: [
    {
      id: 'partyType',
      name: 'partyType',
      label: 'Party Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Plaintiff', value: 'plaintiff' },
        { label: 'Defendant', value: 'defendant' },
        { label: 'Third Party', value: 'third_party' },
      ],
    },
    {
      id: 'partyName',
      name: 'partyName',
      label: 'Party Name',
      type: 'text',
      required: true,
    },
    {
      id: 'partyContact',
      name: 'partyContact',
      label: 'Contact Information',
      type: 'address',
      required: true,
    },
    {
      id: 'claimType',
      name: 'claimType',
      label: 'Type of Claim',
      type: 'select',
      required: true,
      options: [
        { label: 'Contract Dispute', value: 'contract' },
        { label: 'Personal Injury', value: 'personal_injury' },
        { label: 'Property Damage', value: 'property_damage' },
        { label: 'Negligence', value: 'negligence' },
        { label: 'Defamation', value: 'defamation' },
        { label: 'Employment', value: 'employment' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      id: 'claimAmount',
      name: 'claimAmount',
      label: 'Claimed Amount',
      type: 'currency',
      required: true,
    },
    {
      id: 'claimDescription',
      name: 'claimDescription',
      label: 'Description of Claim',
      type: 'rich_text',
      required: true,
      validation: { maxLength: 5000 },
    },
    {
      id: 'damagesBreakdown',
      name: 'damagesBreakdown',
      label: 'Damages Breakdown',
      type: 'table',
      required: false,
    },
    {
      id: 'defendantList',
      name: 'defendantList',
      label: 'List of Defendants',
      type: 'repeater',
      required: true,
    },
    {
      id: 'defendantAddresses',
      name: 'defendantAddresses',
      label: 'Defendant Addresses',
      type: 'repeater',
      required: true,
    },
  ],
  metadata: {
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    author: 'LexisAI System',
  },
};

// Form Validation and Processing
export class FormValidator {
  static validateField(field: FormField, value: any): { valid: boolean; error?: string } {
    if (field.required && (!value || value === '')) {
      return { valid: false, error: `${field.label} is required` };
    }

    if (!value) return { valid: true };

    if (field.validation?.pattern) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        return { valid: false, error: `${field.label} format is invalid` };
      }
    }

    if (field.validation?.minLength && value.length < field.validation.minLength) {
      return { valid: false, error: `${field.label} must be at least ${field.validation.minLength} characters` };
    }

    if (field.validation?.maxLength && value.length > field.validation.maxLength) {
      return { valid: false, error: `${field.label} must not exceed ${field.validation.maxLength} characters` };
    }

    if (field.validation?.custom) {
      const result = field.validation.custom(value);
      if (result !== true) {
        return { valid: false, error: typeof result === 'string' ? result : `${field.label} validation failed` };
      }
    }

    return { valid: true };
  }

  static validateForm(template: FormTemplate, data: Record<string, any>): Record<string, string> {
    const errors: Record<string, string> = {};

    for (const field of template.fields) {
      const validation = this.validateField(field, data[field.name]);
      if (!validation.valid) {
        errors[field.name] = validation.error || 'Invalid field';
      }
    }

    return errors;
  }

  static checkConditionals(template: FormTemplate, data: Record<string, any>): string[] {
    const requiredFields: string[] = [];

    for (const field of template.fields) {
      if (field.conditional) {
        const conditionValue = data[field.conditional.field];
        let shouldRequire = false;

        switch (field.conditional.operator) {
          case 'equals':
            shouldRequire = conditionValue === field.conditional.value;
            break;
          case 'contains':
            shouldRequire = Array.isArray(conditionValue) && conditionValue.includes(field.conditional.value);
            break;
          case 'greater':
            shouldRequire = conditionValue > field.conditional.value;
            break;
          case 'less':
            shouldRequire = conditionValue < field.conditional.value;
            break;
        }

        if (shouldRequire) {
          requiredFields.push(field.name);
        }
      }
    }

    return requiredFields;
  }
}

// Form Templates Registry
export const FORM_TEMPLATES: Record<string, FormTemplate> = {
  'criminal-intake': CRIMINAL_INTAKE_FORM,
  'civil-intake': CIVIL_INTAKE_FORM,
};

export function getFormTemplate(templateId: string): FormTemplate | null {
  return FORM_TEMPLATES[templateId] || null;
}
