'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Play, Pause, Zap, CheckCircle2, Clock, AlertCircle, Activity } from 'lucide-react';
import type { WorkflowTask } from '@/lib/types';
import { mockWorkflowTasks } from '@/lib/mock-data';

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 border-blue-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  critical: 'bg-red-100 text-red-800 border-red-300',
};

const statusIcons = {
  queued: Clock,
  processing: Activity,
  completed: CheckCircle2,
  failed: AlertCircle,
  pending_review: Clock,
};

export function Workflows() {
  const [tasks, setTasks] = useState<WorkflowTask[]>(mockWorkflowTasks);
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulate autonomous workflow execution
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.status === 'processing') {
            // 50% chance to complete a processing task
            if (Math.random() > 0.5) {
              return {
                ...task,
                status: 'completed' as const,
                completedAt: new Date(),
                result: {
                  analysis: 'Automated analysis completed successfully.',
                  recommendations: ['Recommendation 1', 'Recommendation 2', 'Recommendation 3'],
                  confidence: 0.95,
                },
              };
            }
          } else if (task.status === 'queued' && Math.random() > 0.7) {
            // Move some queued tasks to processing
            return {
              ...task,
              status: 'processing' as const,
            };
          }
          return task;
        }),
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const getStatusIcon = (status: WorkflowTask['status']) => {
    const Icon = statusIcons[status];
    return <Icon className="h-4 w-4" />;
  };

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agentic Workflows</h1>
          <p className="text-muted-foreground">Autonomous task execution and document processing</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isSimulating ? 'destructive' : 'default'}
            className="gap-2"
            onClick={() => setIsSimulating(!isSimulating)}
          >
            {isSimulating ? (
              <>
                <Pause className="h-4 w-4" />
                Pause Workflows
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Automation
              </>
            )}
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Overall Progress */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Workflow Status</CardTitle>
              <CardDescription>
                {completedCount} of {totalCount} tasks completed
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{Math.round(progress)}%</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2" />
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {tasks.filter((t) => t.status === 'queued').length}
              </p>
              <p className="text-xs text-muted-foreground">Queued</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {tasks.filter((t) => t.status === 'processing').length}
              </p>
              <p className="text-xs text-muted-foreground">Processing</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {tasks.filter((t) => t.status === 'completed').length}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {tasks.filter((t) => t.status === 'failed').length}
              </p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <Card key={task.id} className="border-border/50 hover:border-border transition-colors">
            <CardContent className="pt-6 pb-4">
              <div className="flex items-start gap-4">
                <Checkbox className="mt-1" checked={task.status === 'completed'} disabled />

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <Badge
                        className={`capitalize border ${task.status === 'processing' ? 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse' : 'bg-secondary text-secondary-foreground'}`}
                      >
                        {task.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <Badge variant="outline" className="text-xs">
                      {task.type.replace(/_/g, ' ').charAt(0).toUpperCase() + task.type.replace(/_/g, ' ').slice(1)}
                    </Badge>
                    <Badge className={`capitalize border text-xs ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                      {task.priority}
                    </Badge>
                    {task.scheduledFor && (
                      <span className="text-muted-foreground">
                        Scheduled: {new Date(task.scheduledFor).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {task.result && (
                    <div className="mt-3 bg-secondary/30 rounded-md p-3 border border-border/50">
                      <p className="text-xs font-semibold text-foreground mb-1">Analysis Result:</p>
                      <p className="text-xs text-foreground mb-2">{task.result.analysis}</p>
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-1">Recommendations:</p>
                        <ul className="text-xs text-foreground space-y-1">
                          {task.result.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-primary">✓</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Confidence: {(task.result.confidence * 100).toFixed(0)}%</span>
                        <Progress value={task.result.confidence * 100} className="w-20 h-1" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Features */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-secondary/30 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Document Extraction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground mb-3">
              Automatically extracts key data from uploaded documents and normalizes it for analysis.
            </p>
            <Button variant="ghost" size="sm" className="w-full justify-start text-primary">
              Configure →
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-secondary/30 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Task Routing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground mb-3">
              Intelligent routing of tasks based on complexity, jurisdiction, and case type.
            </p>
            <Button variant="ghost" size="sm" className="w-full justify-start text-primary">
              Configure →
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-secondary/30 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Automated Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground mb-3">
              Real-time notifications for task completion, errors, or decisions requiring review.
            </p>
            <Button variant="ghost" size="sm" className="w-full justify-start text-primary">
              Configure →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
