'use client';

import { useAuth } from '@/app/providers';
import { LoginForm } from '@/components/login-form';
import { DashboardLayout } from '@/components/dashboard-layout';
import { LegalToolsSuite } from '@/components/legal-tools-suite';

export default function ToolsPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => window.location.reload()} />;
  }

  return (
    <DashboardLayout currentPage="Legal Tools">
      <LegalToolsSuite />
    </DashboardLayout>
  );
}
