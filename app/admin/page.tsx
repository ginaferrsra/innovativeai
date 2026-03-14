'use client';

import { useAuth } from '@/app/providers';
import { LoginForm } from '@/components/login-form';
import { DashboardLayout } from '@/components/dashboard-layout';
import { AdminDashboard } from '@/components/admin-dashboard';

export default function AdminPage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => window.location.reload()} />;
  }

  if (user?.role !== 'admin') {
    return (
      <DashboardLayout currentPage="Dashboard">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            You do not have permission to access this page.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="Admin">
      <AdminDashboard />
    </DashboardLayout>
  );
}
