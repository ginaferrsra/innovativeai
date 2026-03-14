'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Case } from '@/lib/types';
import { mockCases } from '@/lib/mock-data';

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-300',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  closed: 'bg-gray-100 text-gray-800 border-gray-300',
  settled: 'bg-blue-100 text-blue-800 border-blue-300',
  archived: 'bg-slate-100 text-slate-800 border-slate-300',
};

export function CasesList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [caseTypeFilter, setCaseTypeFilter] = useState<string>('all');

  const filteredCases = mockCases.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesType = caseTypeFilter === 'all' || c.type === caseTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cases</h1>
          <p className="text-muted-foreground">Manage and analyze your legal cases</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          New Case
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground mb-2 block">Search Cases</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50"
            />
          </div>
        </div>

        <div className="w-full lg:w-48">
          <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="settled">Settled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full lg:w-48">
          <label className="text-sm font-medium text-foreground mb-2 block">Case Type</label>
          <Select value={caseTypeFilter} onValueChange={setCaseTypeFilter}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="criminal_defence">Criminal Defence</SelectItem>
              <SelectItem value="civil_lawsuit">Civil Lawsuit</SelectItem>
              <SelectItem value="family_law">Family Law</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredCases.map((caseItem) => (
          <Card
            key={caseItem.id}
            className="border-border/50 hover:border-border hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {caseItem.title}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {caseItem.jurisdiction} • {caseItem.courtLevel === 'superior' ? 'Superior Court' : 'Provincial Court'}
                  </CardDescription>
                </div>
                <Badge className={`${statusColors[caseItem.status as keyof typeof statusColors]} border`}>
                  {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-foreground line-clamp-2">{caseItem.description}</p>

              <div className="flex flex-wrap gap-1">
                {caseItem.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground">
                  Created {new Date(caseItem.createdAt).toLocaleDateString()}
                </span>
                <Link href={`/cases/${caseItem.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
                    View <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <Card className="border-dashed border-border/50 bg-secondary/30">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">No cases found matching your filters</p>
            <Button variant="outline">Create First Case</Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Footer */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="bg-secondary/30 border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{mockCases.length}</p>
              <p className="text-sm text-muted-foreground">Total Cases</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30 border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{mockCases.filter((c) => c.status === 'active').length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30 border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{mockCases.filter((c) => c.status === 'settled').length}</p>
              <p className="text-sm text-muted-foreground">Settled</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30 border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">{mockCases.filter((c) => c.status === 'closed').length}</p>
              <p className="text-sm text-muted-foreground">Closed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
