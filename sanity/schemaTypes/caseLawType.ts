import { defineField, defineType } from 'sanity';

export const caseLawType = defineType({
  name: 'caseLaw',
  title: 'Case Law',
  type: 'document',
  fields: [
    defineField({
      name: 'caseName',
      title: 'Case Name',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'e.g., R. v. Grant',
    }),
    defineField({
      name: 'citation',
      title: 'Citation',
      type: 'string',
      description: 'e.g., [2009] 2 SCR 353',
    }),
    defineField({
      name: 'neutralCitation',
      title: 'Neutral Citation',
      type: 'string',
      description: 'e.g., 2009 SCC 32',
    }),
    defineField({
      name: 'canliiUrl',
      title: 'CanLII URL',
      type: 'url',
    }),
    defineField({
      name: 'court',
      title: 'Court',
      type: 'string',
      options: {
        list: [
          { title: 'Supreme Court of Canada', value: 'scc' },
          { title: 'Ontario Court of Appeal', value: 'onca' },
          { title: 'British Columbia Court of Appeal', value: 'bcca' },
          { title: 'Alberta Court of Appeal', value: 'abca' },
          { title: 'Quebec Court of Appeal', value: 'qcca' },
          { title: 'Ontario Superior Court', value: 'onsc' },
          { title: 'Ontario Court of Justice', value: 'oncj' },
          { title: 'Federal Court of Appeal', value: 'fca' },
          { title: 'Federal Court', value: 'fc' },
        ],
      },
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'legalAreas',
      title: 'Legal Areas',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Charter Rights', value: 'charter' },
          { title: 'Criminal Law', value: 'criminal' },
          { title: 'Evidence', value: 'evidence' },
          { title: 'Search and Seizure', value: 'search_seizure' },
          { title: 'Firearms', value: 'firearms' },
          { title: 'Detention', value: 'detention' },
          { title: 'Right to Counsel', value: 'counsel' },
          { title: 'Sentencing', value: 'sentencing' },
          { title: 'Constitutional', value: 'constitutional' },
        ],
      },
    }),
    defineField({
      name: 'charterSections',
      title: 'Charter Sections Discussed',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'headnote',
      title: 'Headnote / Summary',
      type: 'text',
    }),
    defineField({
      name: 'ratio',
      title: 'Ratio Decidendi',
      type: 'text',
      description: 'The binding legal principle established',
    }),
    defineField({
      name: 'keyPassages',
      title: 'Key Passages',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'paragraph', type: 'number', title: 'Paragraph Number' },
            { name: 'text', type: 'text', title: 'Quote' },
          ],
        },
      ],
    }),
    defineField({
      name: 'outcome',
      title: 'Outcome',
      type: 'string',
      options: {
        list: [
          { title: 'Appeal Allowed', value: 'allowed' },
          { title: 'Appeal Dismissed', value: 'dismissed' },
          { title: 'Evidence Excluded', value: 'evidence_excluded' },
          { title: 'Stay of Proceedings', value: 'stay' },
          { title: 'Conviction Upheld', value: 'conviction_upheld' },
          { title: 'Conviction Overturned', value: 'conviction_overturned' },
          { title: 'New Trial Ordered', value: 'new_trial' },
        ],
      },
    }),
    defineField({
      name: 'isGoodLaw',
      title: 'Is Good Law',
      type: 'boolean',
      description: 'Has not been overruled or distinguished',
      initialValue: true,
    }),
    defineField({
      name: 'distinguishedBy',
      title: 'Distinguished/Overruled By',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'caseLaw' }] }],
    }),
    defineField({
      name: 'citedBy',
      title: 'Cited By (Count)',
      type: 'number',
    }),
    defineField({
      name: 'vectorEmbedding',
      title: 'Vector Embedding ID',
      type: 'string',
      description: 'Reference to vector store for semantic search',
    }),
  ],
  preview: {
    select: {
      caseName: 'caseName',
      citation: 'citation',
      year: 'year',
      isGoodLaw: 'isGoodLaw',
    },
    prepare({ caseName, citation, year, isGoodLaw }) {
      return {
        title: caseName || 'Untitled Case',
        subtitle: `${citation || ''} (${year || 'Unknown year'})${!isGoodLaw ? ' - DISTINGUISHED' : ''}`,
      };
    },
  },
});
