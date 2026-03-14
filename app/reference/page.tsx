'use client';

import { useAuth } from '@/app/providers';
import { LoginForm } from '@/components/login-form';
import { DashboardLayout } from '@/components/dashboard-layout';
import { LegalReference } from '@/components/legal-reference';

export default function ReferencePage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => window.location.reload()} />;
  }

  return (
    <DashboardLayout currentPage="Legal Reference">
      <LegalReference />
    </DashboardLayout>
  );
}
