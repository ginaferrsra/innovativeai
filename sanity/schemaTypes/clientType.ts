import { defineField, defineType } from 'sanity';

export const clientType = defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'clientType',
      title: 'Client Type',
      type: 'string',
      options: {
        list: [
          { title: 'Individual', value: 'individual' },
          { title: 'Corporation', value: 'corporation' },
          { title: 'Self-Represented', value: 'self_rep' },
        ],
      },
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
    }),
    defineField({
      name: 'palNumber',
      title: 'PAL Number',
      type: 'string',
      description: 'Possession and Acquisition License number (if applicable)',
    }),
    defineField({
      name: 'palExpiryDate',
      title: 'PAL Expiry Date',
      type: 'date',
    }),
    defineField({
      name: 'rpalHolder',
      title: 'RPAL Holder',
      type: 'boolean',
      description: 'Restricted Possession and Acquisition License',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'conflictCheckCompleted',
      title: 'Conflict Check Completed',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'conflictCheckDate',
      title: 'Conflict Check Date',
      type: 'datetime',
    }),
    defineField({
      name: 'retainerSigned',
      title: 'Retainer Signed',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      name: 'name',
      clientType: 'clientType',
      palExpiry: 'palExpiryDate',
    },
    prepare({ name, clientType, palExpiry }) {
      const today = new Date();
      const expiryDate = palExpiry ? new Date(palExpiry) : null;
      const isExpiringSoon = expiryDate && expiryDate < new Date(today.setMonth(today.getMonth() + 3));
      
      return {
        title: name || 'Unnamed Client',
        subtitle: `${clientType || 'Unknown'}${isExpiringSoon ? ' - PAL EXPIRING SOON' : ''}`,
      };
    },
  },
});
