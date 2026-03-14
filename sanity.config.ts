import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schema } from './sanity/schemaTypes';

export default defineConfig({
  name: 'lexisai-studio',
  title: 'LexisAI Content Studio',
  
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  
  basePath: '/studio',
  
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Legal Content')
          .items([
            S.listItem()
              .title('Cases')
              .child(
                S.list()
                  .title('Case Management')
                  .items([
                    S.listItem()
                      .title('All Cases')
                      .child(S.documentTypeList('caseFile').title('All Cases')),
                    S.listItem()
                      .title('Active Cases')
                      .child(
                        S.documentList()
                          .title('Active Cases')
                          .filter('_type == "caseFile" && status == "active"')
                      ),
                    S.listItem()
                      .title('Charter Applications')
                      .child(
                        S.documentList()
                          .title('Charter Applications')
                          .filter('_type == "caseFile" && caseType == "charter"')
                      ),
                    S.listItem()
                      .title('Firearms Cases')
                      .child(
                        S.documentList()
                          .title('Firearms Cases')
                          .filter('_type == "caseFile" && caseType == "firearms"')
                      ),
                  ])
              ),
            S.divider(),
            S.listItem()
              .title('Documents')
              .child(S.documentTypeList('legalDocument').title('Legal Documents')),
            S.listItem()
              .title('Case Law Library')
              .child(
                S.list()
                  .title('Case Law')
                  .items([
                    S.listItem()
                      .title('All Case Law')
                      .child(S.documentTypeList('caseLaw').title('All Case Law')),
                    S.listItem()
                      .title('Supreme Court Decisions')
                      .child(
                        S.documentList()
                          .title('SCC Decisions')
                          .filter('_type == "caseLaw" && court == "scc"')
                      ),
                    S.listItem()
                      .title('Charter Cases')
                      .child(
                        S.documentList()
                          .title('Charter Cases')
                          .filter('_type == "caseLaw" && "charter" in legalAreas')
                      ),
                    S.listItem()
                      .title('Firearms Cases')
                      .child(
                        S.documentList()
                          .title('Firearms Cases')
                          .filter('_type == "caseLaw" && "firearms" in legalAreas')
                      ),
                  ])
              ),
            S.divider(),
            S.listItem()
              .title('Court Forms')
              .child(S.documentTypeList('courtForm').title('Court Forms')),
            S.listItem()
              .title('Clients')
              .child(S.documentTypeList('client').title('Clients')),
            S.divider(),
            S.listItem()
              .title('Legislation Updates')
              .child(
                S.list()
                  .title('Legislation')
                  .items([
                    S.listItem()
                      .title('All Updates')
                      .child(S.documentTypeList('legislationUpdate').title('All Updates')),
                    S.listItem()
                      .title('Breaking Changes')
                      .child(
                        S.documentList()
                          .title('Breaking Changes')
                          .filter('_type == "legislationUpdate" && isBreakingChange == true')
                      ),
                    S.listItem()
                      .title('Firearms Act Updates')
                      .child(
                        S.documentList()
                          .title('Firearms Act')
                          .filter('_type == "legislationUpdate" && legislationType == "firearms_act"')
                      ),
                  ])
              ),
          ]),
    }),
    visionTool(),
  ],
  
  schema,
});
