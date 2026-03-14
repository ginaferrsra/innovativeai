import { defineField, defineType } from 'sanity';

export const caseFileType = defineType({
  name: 'caseFile',
  title: 'Case File',
  type: 'document',
  fields: [
    defineField({
      name: 'caseNumber',
      title: 'Case Number',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Case Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caseType',
      title: 'Case Type',
      type: 'string',
      options: {
        list: [
          { title: 'Criminal Defence', value: 'criminal_defence' },
          { title: 'Criminal Prosecution', value: 'criminal_prosecution' },
          { title: 'Civil Litigation', value: 'civil' },
          { title: 'Family Law', value: 'family' },
          { title: 'Firearms Offence', value: 'firearms' },
          { title: 'Charter Application', value: 'charter' },
          { title: 'Immigration', value: 'immigration' },
          { title: 'Employment', value: 'employment' },
        ],
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Pending', value: 'pending' },
          { title: 'Discovery', value: 'discovery' },
          { title: 'Trial', value: 'trial' },
          { title: 'Appeal', value: 'appeal' },
          { title: 'Closed', value: 'closed' },
        ],
      },
    }),
    defineField({
      name: 'court',
      title: 'Court',
      type: 'string',
      options: {
        list: [
          { title: 'Ontario Court of Justice', value: 'ocj' },
          { title: 'Ontario Superior Court', value: 'osc' },
          { title: 'Ontario Court of Appeal', value: 'onca' },
          { title: 'Federal Court', value: 'fc' },
          { title: 'Supreme Court of Canada', value: 'scc' },
        ],
      },
    }),
    defineField({
      name: 'province',
      title: 'Province/Territory',
      type: 'string',
      options: {
        list: [
          { title: 'Ontario', value: 'ON' },
          { title: 'British Columbia', value: 'BC' },
          { title: 'Alberta', value: 'AB' },
          { title: 'Quebec', value: 'QC' },
          { title: 'Manitoba', value: 'MB' },
          { title: 'Saskatchewan', value: 'SK' },
          { title: 'Nova Scotia', value: 'NS' },
          { title: 'New Brunswick', value: 'NB' },
          { title: 'Newfoundland and Labrador', value: 'NL' },
          { title: 'Prince Edward Island', value: 'PE' },
          { title: 'Northwest Territories', value: 'NT' },
          { title: 'Yukon', value: 'YT' },
          { title: 'Nunavut', value: 'NU' },
        ],
      },
    }),
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
    }),
    defineField({
      name: 'client',
      title: 'Client Reference',
      type: 'reference',
      to: [{ type: 'client' }],
    }),
    defineField({
      name: 'chargesOrClaims',
      title: 'Charges / Claims',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'charterSectionsAtIssue',
      title: 'Charter Sections at Issue',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Section 7 - Life, Liberty, Security', value: 's7' },
          { title: 'Section 8 - Search and Seizure', value: 's8' },
          { title: 'Section 9 - Arbitrary Detention', value: 's9' },
          { title: 'Section 10(a) - Reasons for Arrest', value: 's10a' },
          { title: 'Section 10(b) - Right to Counsel', value: 's10b' },
          { title: 'Section 11(b) - Trial in Reasonable Time', value: 's11b' },
          { title: 'Section 11(d) - Presumption of Innocence', value: 's11d' },
          { title: 'Section 12 - Cruel and Unusual Treatment', value: 's12' },
          { title: 'Section 24(2) - Exclusion of Evidence', value: 's24_2' },
        ],
      },
    }),
    defineField({
      name: 'importantDates',
      title: 'Important Dates',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'date', type: 'datetime', title: 'Date' },
          ],
        },
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Case Notes',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'documents',
      title: 'Attached Documents',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'legalDocument' }] }],
    }),
    defineField({
      name: 'relatedCaseLaw',
      title: 'Related Case Law',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'caseLaw' }] }],
    }),
    defineField({
      name: 'disclosureComplete',
      title: 'Disclosure Complete',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'stinchcombeAuditStatus',
      title: 'Stinchcombe Audit Status',
      type: 'string',
      options: {
        list: [
          { title: 'Not Started', value: 'not_started' },
          { title: 'In Progress', value: 'in_progress' },
          { title: 'Issues Found', value: 'issues_found' },
          { title: 'Complete', value: 'complete' },
        ],
      },
    }),
    defineField({
      name: 'assignedLawyer',
      title: 'Assigned Lawyer',
      type: 'string',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      caseNumber: 'caseNumber',
      status: 'status',
    },
    prepare({ title, caseNumber, status }) {
      return {
        title: title || 'Untitled Case',
        subtitle: `${caseNumber || 'No number'} - ${status || 'Unknown status'}`,
      };
    },
  },
});
