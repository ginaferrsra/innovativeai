'use client';

import { useAuth } from '@/app/providers';
import { LoginForm } from '@/components/login-form';
import { DashboardLayout } from '@/components/dashboard-layout';
import { AdvancedAnalysis } from '@/components/advanced-analysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AnalysisPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => window.location.reload()} />;
  }

  return (
    <DashboardLayout currentPage="Analysis">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Legal Analysis Engine</h1>
          <p className="text-muted-foreground mt-1">
            Charter breach analysis, defense strategies, and comprehensive case evaluation
          </p>
        </div>

        <Tabs defaultValue="charter" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="charter">Charter Analysis</TabsTrigger>
            <TabsTrigger value="strategy">Defense Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="charter">
            <AdvancedAnalysis />
          </TabsContent>

          <TabsContent value="strategy">
            <AdvancedAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
