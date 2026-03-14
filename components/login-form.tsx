'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/providers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Scale, ArrowRight, Shield, Users, Gavel } from 'lucide-react';

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('sarah.chen@torontolawfirm.ca');
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Shield, label: 'Charter Analysis', desc: 'Automated breach detection' },
    { icon: Users, label: 'Multi-Agent AI', desc: '7 specialized legal agents' },
    { icon: Gavel, label: 'Court Forms', desc: 'All Canadian jurisdictions' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar text-sidebar-foreground flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-sidebar-primary rounded-xl flex items-center justify-center animate-pulse-glow">
              <Scale className="w-6 h-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">LexisAI</h1>
              <p className="text-xs text-sidebar-accent-foreground">Canadian Legal Intelligence</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-bold leading-tight text-balance">AI-powered legal analysis for Canadian law</h2>
            <p className="text-sidebar-accent-foreground mt-3 text-sm leading-relaxed max-w-md">
              Multi-agent reasoning, Charter breach detection, automated disclosure audits, and defense strategy generation -- all grounded in real Canadian case law.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature, i) => (
              <div
                key={feature.label}
                className="flex items-center gap-4 animate-slide-left"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-sidebar-accent/60 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-sidebar-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{feature.label}</p>
                  <p className="text-xs text-sidebar-accent-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-[11px] text-sidebar-accent-foreground">
          Powered by GPT-4, Claude, and Canadian case law databases
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">LexisAI</h1>
              <p className="text-xs text-muted-foreground">Canadian Legal AI</p>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Sign in to access your workspace</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 animate-scale-in">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@firm.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-10"
              />
            </div>

            <Button type="submit" className="w-full h-10 gap-2" disabled={isLoading}>
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground font-medium mb-3">Demo Credentials</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => { setEmail('sarah.chen@torontolawfirm.ca'); setPassword('demo'); }}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-left group"
              >
                <div>
                  <p className="text-xs font-medium text-foreground">Sarah Chen</p>
                  <p className="text-[11px] text-muted-foreground">Lawyer - Toronto Legal Associates</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
              <button
                type="button"
                onClick={() => { setEmail('james.smith@example.ca'); setPassword('demo'); }}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-left group"
              >
                <div>
                  <p className="text-xs font-medium text-foreground">James Smith</p>
                  <p className="text-[11px] text-muted-foreground">Self-Represented Litigant</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
