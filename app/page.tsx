'use client';

import { useState } from 'react';
import { useAuth } from '@/app/providers';
import { LoginForm } from '@/components/login-form';
import { DashboardLayout } from '@/components/dashboard-layout';
import { CasesList } from '@/components/cases-list';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [currentPage] = useState('Cases');

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => window.location.reload()} />;
  }

  return (
    <DashboardLayout currentPage={currentPage}>
      <CasesList />
    </DashboardLayout>
  );
}
