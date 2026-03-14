'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  Database,
  Shield,
  Users,
  FileText,
  Activity,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SystemStats {
  total_cases: number;
  total_users: number;
  total_documents: number;
  active_workflows: number;
  vector_store_size: number;
  connected_sources: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats>({
    total_cases: 1247,
    total_users: 89,
    total_documents: 15643,
    active_workflows: 23,
    vector_store_size: 52842,
    connected_sources: 6,
  });
  const [connectorHealth, setConnectorHealth] = useState<Record<string, any>>({});

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Simulate loading stats
      const response = await fetch('/api/connectors');
      const data = await response.json();
      setConnectorHealth(data.health_status || {});
    } catch (error) {
      console.log('[v0] Stats load attempt (demo mode)');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">System Administration</h1>
        <p className="text-muted-foreground mt-1">
          Monitor system health, user activity, and resource utilization
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Cases</p>
              <p className="text-xl font-bold">{stats.total_cases}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Users</p>
              <p className="text-xl font-bold">{stats.total_users}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Documents</p>
              <p className="text-xl font-bold">{stats.total_documents.toLocaleString()}</p>
            </div>
            <Database className="h-8 w-8 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Active Workflows</p>
              <p className="text-xl font-bold">{stats.active_workflows}</p>
            </div>
            <Activity className="h-8 w-8 text-orange-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Vector Store</p>
              <p className="text-xl font-bold">{(stats.vector_store_size / 1000).toFixed(1)}K</p>
            </div>
            <BarChart3 className="h-8 w-8 text-cyan-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Data Sources</p>
              <p className="text-xl font-bold">{stats.connected_sources}</p>
            </div>
            <Shield className="h-8 w-8 text-red-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* System Health */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">System Health</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* AI Performance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium">AI Analysis Engine</p>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                Operational
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Charter Analysis</span>
                <span className="font-medium">98.5% accuracy</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Avg response time</span>
                <span>245ms</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Requests/hour</span>
                <span>12,483</span>
              </div>
            </div>
          </div>

          {/* Vector Store */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium">Vector Database</p>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                Healthy
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Indexed Documents</span>
                <span className="font-medium">{stats.total_documents.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Search Performance</span>
                <span>847ms avg</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Storage Used</span>
                <span>2.3 GB</span>
              </div>
            </div>
          </div>

          {/* Data Connectors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium">Data Connectors</p>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                {stats.connected_sources} Connected
              </span>
            </div>
            <div className="space-y-2 text-sm">
              {Object.entries(connectorHealth).length > 0 ? (
                Object.entries(connectorHealth).map(([source, health]: [string, any]) => (
                  <div key={source} className="flex justify-between">
                    <span className="capitalize">{source.replace('_', ' ')}</span>
                    <span className="font-medium text-green-600">
                      {health.status === 'synced' ? 'Synced' : 'Connected'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No active connectors</p>
              )}
            </div>
          </div>

          {/* Workflow Engine */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium">Workflow Automation</p>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                {stats.active_workflows} Active
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Completed Tasks</span>
                <span className="font-medium">8,947</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Success Rate</span>
                <span>99.2%</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Pending Queue</span>
                <span>142 tasks</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Metrics */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Trends
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* API Response Times */}
          <div>
            <p className="font-medium text-sm mb-3">API Response Times (ms)</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Document Processing</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-blue-500" />
                  </div>
                  <span className="font-mono text-xs">245ms</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Charter Analysis</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-green-500" />
                  </div>
                  <span className="font-mono text-xs">189ms</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Semantic Search</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-purple-500" />
                  </div>
                  <span className="font-mono text-xs">325ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Processing */}
          <div>
            <p className="font-medium text-sm mb-3">Data Processing Volume</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Documents/day</span>
                <span className="font-semibold">2,847</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Chunks indexed/hour</span>
                <span className="font-semibold">34,582</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Analyses performed/day</span>
                <span className="font-semibold">1,243</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Data synced/day</span>
                <span className="font-semibold">8.4 GB</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-3 bg-muted rounded">
            <div>
              <p className="font-medium">Charter Analysis Completed</p>
              <p className="text-xs text-muted-foreground">Case R v. Smith (s.8, s.10(b))</p>
            </div>
            <span className="text-xs text-muted-foreground">2 min ago</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded">
            <div>
              <p className="font-medium">Google Drive Sync</p>
              <p className="text-xs text-muted-foreground">347 documents indexed</p>
            </div>
            <span className="text-xs text-muted-foreground">15 min ago</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded">
            <div>
              <p className="font-medium">Semantic Search Query</p>
              <p className="text-xs text-muted-foreground">"Charter s.8 breach patterns"</p>
            </div>
            <span className="text-xs text-muted-foreground">32 min ago</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded">
            <div>
              <p className="font-medium">Document Processing</p>
              <p className="text-xs text-muted-foreground">45 PDFs processed and indexed</p>
            </div>
            <span className="text-xs text-muted-foreground">1 hour ago</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
