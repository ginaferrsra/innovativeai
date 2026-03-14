'use client';

import { useState, useEffect } from 'react';
import { Cloud, RefreshCw, Loader2, Check, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ConnectorStatus {
  source: string;
  authenticated: boolean;
  status: string;
  documents_indexed: number;
  last_sync: string;
  sync_frequency: string;
}

export function DataConnectorsPanel() {
  const [connectors, setConnectors] = useState<ConnectorStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSource, setSelectedSource] = useState('');
  const [credentials, setCredentials] = useState<Record<string, string>>({});

  useEffect(() => {
    loadConnectors();
  }, []);

  const loadConnectors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/connectors');
      const data = await response.json();

      if (data.active_connections) {
        setConnectors(data.active_connections);
      }
    } catch (error) {
      console.error('[v0] Failed to load connectors:', error);
    } finally {
      setLoading(false);
    }
  };

  const addConnector = async () => {
    if (!selectedSource) return;

    try {
      setSyncing(new Set([...syncing, selectedSource]));

      const response = await fetch('/api/connectors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: selectedSource,
          credentials: credentials,
        }),
      });

      if (response.ok) {
        await loadConnectors();
        setShowAddForm(false);
        setSelectedSource('');
        setCredentials({});
      }
    } catch (error) {
      console.error('[v0] Failed to add connector:', error);
    } finally {
      setSyncing(new Set([...syncing].filter(s => s !== selectedSource)));
    }
  };

  const syncConnector = async (source: string) => {
    try {
      setSyncing(new Set([...syncing, source]));

      const response = await fetch(`/api/connectors/${source}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxDocuments: 100 }),
      });

      if (response.ok) {
        await loadConnectors();
      }
    } catch (error) {
      console.error('[v0] Sync failed:', error);
    } finally {
      setSyncing(new Set([...syncing].filter(s => s !== source)));
    }
  };

  if (loading) {
    return (
      <Card className="p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading connectors...</span>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Connector Form */}
      {showAddForm ? (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Connect Data Source</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Source</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="">Choose a source...</option>
                <option value="sharepoint">SharePoint</option>
                <option value="google_drive">Google Drive</option>
                <option value="salesforce">Salesforce</option>
                <option value="zendesk">Zendesk</option>
                <option value="aws_s3">Amazon S3</option>
                <option value="azure_blob">Azure Blob Storage</option>
                <option value="email">Email (IMAP)</option>
              </select>
            </div>

            {selectedSource && (
              <div className="bg-muted p-4 rounded text-sm">
                <p className="text-muted-foreground mb-3">Enter your credentials:</p>
                {selectedSource === 'google_drive' && (
                  <>
                    <Input
                      placeholder="Client ID"
                      value={credentials.client_id || ''}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          client_id: e.target.value,
                        })
                      }
                      className="mb-2"
                    />
                    <Input
                      placeholder="Client Secret"
                      type="password"
                      value={credentials.client_secret || ''}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          client_secret: e.target.value,
                        })
                      }
                    />
                  </>
                )}
                {selectedSource === 'zendesk' && (
                  <Input
                    placeholder="API Key"
                    type="password"
                    value={credentials.api_key || ''}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        api_key: e.target.value,
                      })
                    }
                  />
                )}
                {selectedSource === 'aws_s3' && (
                  <>
                    <Input
                      placeholder="Access Key ID"
                      value={credentials.access_key_id || ''}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          access_key_id: e.target.value,
                        })
                      }
                      className="mb-2"
                    />
                    <Input
                      placeholder="Secret Access Key"
                      type="password"
                      value={credentials.secret_access_key || ''}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          secret_access_key: e.target.value,
                        })
                      }
                    />
                  </>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={addConnector}
                disabled={!selectedSource || syncing.has(selectedSource)}
              >
                {syncing.has(selectedSource) ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedSource('');
                  setCredentials({});
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Button onClick={() => setShowAddForm(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Data Source
        </Button>
      )}

      {/* Active Connectors */}
      <div className="space-y-3">
        <h3 className="font-semibold">Active Connections</h3>
        {connectors.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            <Cloud className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No connected data sources</p>
          </Card>
        ) : (
          connectors.map((connector) => (
            <Card key={connector.source} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium capitalize">{connector.source.replace('_', ' ')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {connector.status === 'connected' ? (
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 bg-green-500 rounded-full" />
                          Connected
                        </span>
                      ) : connector.status === 'synced' ? (
                        <span className="flex items-center gap-1">
                          <Check className="h-3 w-3 text-green-600" />
                          Last synced: {new Date(connector.last_sync).toLocaleDateString()}
                        </span>
                      ) : (
                        'Disconnected'
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => syncConnector(connector.source)}
                  disabled={syncing.has(connector.source)}
                >
                  {syncing.has(connector.source) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Documents Indexed</p>
                  <p className="font-semibold">{connector.documents_indexed}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sync Frequency</p>
                  <p className="font-semibold capitalize">{connector.sync_frequency}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
