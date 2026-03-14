import { defineField, defineType } from 'sanity';

export const courtFormType = defineType({
  name: 'courtForm',
  title: 'Court Form',
  type: 'document',
  fields: [
    defineField({
      name: 'formNumber',
      title: 'Form Number',
      type: 'string',
      description: 'e.g., Form 14A, Form 4C',
    }),
    defineField({
      name: 'title',
      title: 'Form Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Criminal', value: 'criminal' },
          { title: 'Civil', value: 'civil' },
          { title: 'Family', value: 'family' },
          { title: 'Small Claims', value: 'small_claims' },
          { title: 'Estates', value: 'estates' },
          { title: 'Charter Motion', value: 'charter' },
          { title: 'Appeal', value: 'appeal' },
        ],
      },
    }),
    defineField({
      name: 'province',
      title: 'Province/Territory',
      type: 'string',
      options: {
        list: [
          { title: 'Federal', value: 'federal' },
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
      name: 'court',
      title: 'Court',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'instructions',
      title: 'Filing Instructions',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'formTemplate',
      title: 'Form Template (PDF/DOCX)',
      type: 'file',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'Link to official government form',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'relatedForms',
      title: 'Related Forms',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'courtForm' }] }],
    }),
  ],
  preview: {
    select: {
      formNumber: 'formNumber',
      title: 'title',
      province: 'province',
    },
    prepare({ formNumber, title, province }) {
      return {
        title: `${formNumber || ''} - ${title || 'Untitled Form'}`,
        subtitle: province || 'All Provinces',
      };
    },
  },
});
