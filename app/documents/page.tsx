'use client';

import { useState } from 'react';
import { useAuth } from '@/app/providers';
import { LoginForm } from '@/components/login-form';
import { DashboardLayout } from '@/components/dashboard-layout';
import { DocumentUpload } from '@/components/document-upload';
import { SemanticSearch } from '@/components/semantic-search';
import { DataConnectorsPanel } from '@/components/data-connectors-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DocumentsPage() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('upload');

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => window.location.reload()} />;
  }

  return (
    <DashboardLayout currentPage="Documents">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground mt-1">
            Upload documents, search semantic indexes, and manage data sources
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Documents</TabsTrigger>
            <TabsTrigger value="search">Semantic Search</TabsTrigger>
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <DocumentUpload
              caseId=""
              performCharterAnalysis={true}
              onSuccess={(result) => {
                console.log('[v0] Document processing complete:', result);
              }}
            />
          </TabsContent>

          <TabsContent value="search">
            <SemanticSearch />
          </TabsContent>

          <TabsContent value="sources">
            <DataConnectorsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
