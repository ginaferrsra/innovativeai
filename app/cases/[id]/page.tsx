'use client';

import { useAuth } from '@/app/providers';
import { LoginForm } from '@/components/login-form';
import { DashboardLayout } from '@/components/dashboard-layout';
import { CaseDetails } from '@/components/case-details';

export default function CasePage({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => window.location.reload()} />;
  }

  return (
    <DashboardLayout currentPage="Case Details">
      <CaseDetails caseId={params.id} />
    </DashboardLayout>
  );
}
