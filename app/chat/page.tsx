'use client';

import { useAuth } from '@/app/providers';
import { LoginForm } from '@/components/login-form';
import { DashboardLayout } from '@/components/dashboard-layout';
import { AILegalChat } from '@/components/ai-legal-chat';

export default function ChatPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => window.location.reload()} />;
  }

  return (
    <DashboardLayout currentPage="AI Chat">
      <div className="h-[calc(100vh-8rem)] -m-4 lg:-m-6">
        <AILegalChat />
      </div>
    </DashboardLayout>
  );
}
