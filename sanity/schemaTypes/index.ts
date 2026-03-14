import { type SchemaTypeDefinition } from 'sanity';
import { caseFileType } from './caseFileType';
import { legalDocumentType } from './legalDocumentType';
import { caseLawType } from './caseLawType';
import { courtFormType } from './courtFormType';
import { clientType } from './clientType';
import { legislationUpdateType } from './legislationUpdateType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    caseFileType,
    legalDocumentType,
    caseLawType,
    courtFormType,
    clientType,
    legislationUpdateType,
  ],
};
