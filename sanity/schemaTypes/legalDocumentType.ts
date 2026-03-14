import { defineField, defineType } from 'sanity';

export const legalDocumentType = defineType({
  name: 'legalDocument',
  title: 'Legal Document',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Document Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'documentType',
      title: 'Document Type',
      type: 'string',
      options: {
        list: [
          { title: 'Disclosure', value: 'disclosure' },
          { title: 'Affidavit', value: 'affidavit' },
          { title: 'Factum', value: 'factum' },
          { title: 'Motion Record', value: 'motion_record' },
          { title: 'Notice of Application', value: 'notice_application' },
          { title: 'Information/Indictment', value: 'information' },
          { title: 'Witness Statement', value: 'witness_statement' },
          { title: 'Officer Notes', value: 'officer_notes' },
          { title: 'Body Cam Transcript', value: 'body_cam' },
          { title: 'Expert Report', value: 'expert_report' },
          { title: 'Firearm Examination Report', value: 'firearm_exam' },
          { title: 'Court Form', value: 'court_form' },
          { title: 'Correspondence', value: 'correspondence' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
    }),
    defineField({
      name: 'extractedText',
      title: 'Extracted Text (OCR)',
      type: 'text',
    }),
    defineField({
      name: 'summary',
      title: 'AI Summary',
      type: 'text',
    }),
    defineField({
      name: 'entities',
      title: 'Extracted Entities',
      type: 'object',
      fields: [
        { name: 'parties', type: 'array', title: 'Parties', of: [{ type: 'string' }] },
        { name: 'dates', type: 'array', title: 'Dates', of: [{ type: 'string' }] },
        { name: 'locations', type: 'array', title: 'Locations', of: [{ type: 'string' }] },
        { name: 'legalConcepts', type: 'array', title: 'Legal Concepts', of: [{ type: 'string' }] },
      ],
    }),
    defineField({
      name: 'charterBreachesIdentified',
      title: 'Charter Breaches Identified',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'section', type: 'string', title: 'Section' },
            { name: 'description', type: 'text', title: 'Description' },
            { name: 'severity', type: 'string', title: 'Severity', options: { list: ['low', 'medium', 'high', 'critical'] } },
          ],
        },
      ],
    }),
    defineField({
      name: 'verifiedByLawyer',
      title: 'Verified by Lawyer',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'verifiedByName',
      title: 'Verified By (Name)',
      type: 'string',
    }),
    defineField({
      name: 'verifiedAt',
      title: 'Verified At',
      type: 'datetime',
    }),
    defineField({
      name: 'uploadedAt',
      title: 'Uploaded At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      documentType: 'documentType',
      verified: 'verifiedByLawyer',
    },
    prepare({ title, documentType, verified }) {
      return {
        title: title || 'Untitled Document',
        subtitle: `${documentType || 'Unknown type'}${verified ? ' - Verified' : ''}`,
      };
    },
  },
});
