'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, FileText, Users, Calendar, MapPin, Scale, Zap, Plus } from 'lucide-react';
import { mockCases, mockDocuments, mockWorkflowTasks } from '@/lib/mock-data';

export function CaseDetails({ caseId }: { caseId: string }) {
  const caseData = mockCases.find((c) => c.id === caseId);
  const caseDocs = mockDocuments.filter((d) => d.caseId === caseId);
  const caseTasks = mockWorkflowTasks.filter((t) => t.caseId === caseId);

  if (!caseData) {
    return <div>Case not found</div>;
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    closed: 'bg-gray-100 text-gray-800',
    settled: 'bg-blue-100 text-blue-800',
    archived: 'bg-slate-100 text-slate-800',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{caseData.title}</h1>
            <p className="text-muted-foreground mt-1">{caseData.description}</p>
          </div>
          <Badge className={`${statusColors[caseData.status as keyof typeof statusColors]} border text-sm`}>
            {caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}
          </Badge>
        </div>

        {/* Quick Info */}
        <div className="grid gap-4 lg:grid-cols-4">
          <Card className="bg-secondary/30 border-border/50">
            <CardContent className="pt-4 flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Jurisdiction</p>
                <p className="font-semibold text-foreground">{caseData.jurisdiction}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/30 border-border/50">
            <CardContent className="pt-4 flex items-start gap-3">
              <Scale className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Court Level</p>
                <p className="font-semibold text-foreground capitalize">{caseData.courtLevel} Court</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/30 border-border/50">
            <CardContent className="pt-4 flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="font-semibold text-foreground">{new Date(caseData.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/30 border-border/50">
            <CardContent className="pt-4 flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Documents</p>
                <p className="font-semibold text-foreground">{caseDocs.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <Zap className="h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">Case Documents</h3>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Document
            </Button>
          </div>

          <div className="space-y-2">
            {caseDocs.map((doc) => (
              <Card key={doc.id} className="border-border/50 hover:border-border transition-colors">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">{doc.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`text-xs capitalize ${
                          doc.status === 'processed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {doc.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">Workflow Tasks</h3>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>

          <div className="space-y-2">
            {caseTasks.map((task) => (
              <Card key={task.id} className="border-border/50 hover:border-border transition-colors">
                <CardContent className="pt-4 pb-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-foreground">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-xs capitalize ${
                            task.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : task.status === 'processing'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {task.status}
                        </Badge>
                      </div>
                    </div>

                    {task.result && (
                      <div className="bg-secondary/30 p-2 rounded text-xs text-foreground border border-border/50">
                        <p className="font-semibold mb-1">Result:</p>
                        <p>{task.result.analysis}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">Team Members</h3>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </div>

          <div className="space-y-2">
            {caseData.assignedTo.map((userId) => (
              <Card key={userId} className="border-border/50">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      {userId[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Assigned Lawyer</p>
                      <p className="text-sm text-muted-foreground">{userId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>

          <div className="space-y-2">
            <Card className="border-border/50 bg-secondary/30">
              <CardContent className="pt-4 pb-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Case Created</p>
                    <p className="text-sm text-muted-foreground">{new Date(caseData.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
