'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/app/providers';
import { LoginForm } from '@/components/login-form';
import { DashboardLayout } from '@/components/dashboard-layout';
import { DynamicFormBuilder } from '@/components/dynamic-form-builder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CRIMINAL_INTAKE_FORM, CIVIL_INTAKE_FORM } from '@/lib/form-library';
import { COURT_FORMS, PROVINCES, searchForms, type CourtFormEntry } from '@/lib/canadian-court-forms';
import { Search, ExternalLink, Filter, FileText, Scale, Users, Briefcase, Building2, ClipboardList, MapPin } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  civil: Scale,
  criminal: Briefcase,
  family: Users,
  small_claims: ClipboardList,
  appeal: Building2,
  administrative: FileText,
};

const CATEGORY_COLORS: Record<string, string> = {
  civil: 'bg-blue-100 text-blue-800 border-blue-200',
  criminal: 'bg-red-100 text-red-800 border-red-200',
  family: 'bg-green-100 text-green-800 border-green-200',
  small_claims: 'bg-amber-100 text-amber-800 border-amber-200',
  appeal: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  administrative: 'bg-slate-100 text-slate-800 border-slate-200',
};

export default function FormsPage() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredForms = useMemo(
    () => searchForms(searchQuery, selectedProvince, selectedCategory),
    [searchQuery, selectedProvince, selectedCategory]
  );

  const provinceStats = useMemo(() => {
    const stats: Record<string, number> = {};
    for (const form of COURT_FORMS) {
      stats[form.province] = (stats[form.province] || 0) + 1;
    }
    return stats;
  }, []);

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => window.location.reload()} />;
  }

  return (
    <DashboardLayout currentPage="Court Forms">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Court Forms Library</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {COURT_FORMS.length} forms across all Canadian provinces, territories, and federal courts
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {PROVINCES.length} Jurisdictions
          </Badge>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-10">
            <TabsTrigger value="browse" className="text-xs">Browse Forms</TabsTrigger>
            <TabsTrigger value="criminal" className="text-xs">Criminal Intake</TabsTrigger>
            <TabsTrigger value="civil" className="text-xs">Civil Intake</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4 mt-4">
            {/* Search and Filters */}
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search forms by name, number, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">All Provinces</option>
                {PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name} ({provinceStats[p.code] || 0})
                  </option>
                ))}
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">All Categories</option>
                <option value="civil">Civil</option>
                <option value="criminal">Criminal</option>
                <option value="family">Family</option>
                <option value="small_claims">Small Claims</option>
                <option value="appeal">Appeal</option>
              </select>
            </div>

            {/* Province Quick Filters */}
            <div className="flex flex-wrap gap-1.5">
              <Button
                variant={selectedProvince === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedProvince('all')}
                className="text-xs h-7 px-2.5"
              >
                All
              </Button>
              {PROVINCES.slice(0, 10).map((p) => (
                <Button
                  key={p.code}
                  variant={selectedProvince === p.code ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedProvince(p.code)}
                  className="text-xs h-7 px-2.5"
                >
                  {p.code}
                </Button>
              ))}
            </div>

            {/* Results Count */}
            <p className="text-xs text-muted-foreground">
              Showing {filteredForms.length} of {COURT_FORMS.length} forms
            </p>

            {/* Forms Grid */}
            <div className="grid gap-3 lg:grid-cols-2">
              {filteredForms.map((form, index) => {
                const Icon = CATEGORY_ICONS[form.category] || FileText;
                const colorClass = CATEGORY_COLORS[form.category] || CATEGORY_COLORS.civil;
                return (
                  <Card
                    key={form.id}
                    className="border-border/60 hover:border-border hover:shadow-sm transition-all duration-200 animate-fade-in group"
                    style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">{form.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{form.formNumber}</p>
                            </div>
                            <Badge className={`${colorClass} border text-[10px] flex-shrink-0`}>
                              {form.category.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{form.description}</p>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="text-[11px] text-muted-foreground">{form.court}</span>
                            </div>
                            <a
                              href={form.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              Open <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredForms.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="w-8 h-8 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">No forms found</p>
                  <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="criminal" className="mt-4">
            <DynamicFormBuilder
              template={CRIMINAL_INTAKE_FORM}
              performAnalysis={true}
              onSubmit={(data) => {
                console.log('[v0] Criminal intake submitted:', data);
              }}
            />
          </TabsContent>

          <TabsContent value="civil" className="mt-4">
            <DynamicFormBuilder
              template={CIVIL_INTAKE_FORM}
              performAnalysis={true}
              onSubmit={(data) => {
                console.log('[v0] Civil intake submitted:', data);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
