'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  FileText,
  Search,
  Plus,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
} from 'lucide-react';
import type { Document } from '@/lib/types';
import { mockDocuments } from '@/lib/mock-data';

const documentTypeIcons = {
  contract: '📋',
  motion: '⚖️',
  brief: '📑',
  affidavit: '✍️',
  form: '📝',
  correspondence: '✉️',
  evidence: '📸',
  other: '📄',
};

const statusIcons = {
  pending: Clock,
  processing: Zap,
  processed: CheckCircle2,
  failed: AlertCircle,
};

export function Documents() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const processingDocs = documents.filter((d) => d.status === 'processing' || d.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground">Manage, analyze, and extract data from legal documents</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors bg-secondary/30">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center cursor-pointer">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Drag and drop documents here</p>
              <p className="text-xs text-muted-foreground">
                or click to browse • PDF, Word, Images • Max 50MB
              </p>
            </div>
            <Button variant="outline" size="sm">
              Browse Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      {processingDocs.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Documents Being Processed</CardTitle>
            <CardDescription>{processingDocs.length} document(s) in queue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {processingDocs.map((doc) => (
              <div key={doc.id} className="space-y-1">
                <p className="text-sm font-medium text-foreground">{doc.title}</p>
                <Progress value={65} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'processed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('processed')}
          >
            Processed
          </Button>
          <Button
            variant={filterStatus === 'processing' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('processing')}
          >
            Processing
          </Button>
          <Button
            variant={filterStatus === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </Button>
        </div>
      </div>

      {/* Documents List */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredDocs.map((doc) => {
          const StatusIcon = statusIcons[doc.status as keyof typeof statusIcons];

          return (
            <Card key={doc.id} className="border-border/50 hover:border-border transition-colors flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-3xl">{documentTypeIcons[doc.type as keyof typeof documentTypeIcons]}</span>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base line-clamp-2">{doc.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} • {doc.caseId}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {StatusIcon && <StatusIcon className="h-4 w-4 text-primary" />}
                    <Badge
                      className={`text-xs capitalize ${
                        doc.status === 'processed'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : doc.status === 'processing'
                            ? 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse'
                            : doc.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                              : 'bg-red-100 text-red-800 border-red-300'
                      } border`}
                    >
                      {doc.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                <p className="text-sm text-foreground line-clamp-2">{doc.content}</p>

                {doc.extractedData && (
                  <div className="bg-secondary/30 rounded-md p-3 space-y-2 border border-border/50">
                    <p className="text-xs font-semibold text-foreground">Extracted Data:</p>
                    <div className="space-y-1">
                      {Object.entries(doc.extractedData).map(([key, value]) => (
                        <div key={key} className="text-xs text-foreground flex justify-between">
                          <span className="text-muted-foreground capitalize">{key}:</span>
                          <span className="font-semibold">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                  {doc.processedAt && ` • Processed ${new Date(doc.processedAt).toLocaleDateString()}`}
                </div>
              </CardContent>

              <div className="flex gap-2 p-4 border-t border-border/50">
                <Button variant="ghost" size="sm" className="flex-1 gap-2 text-primary">
                  <Eye className="h-3 w-3" />
                  View
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 gap-2">
                  <Download className="h-3 w-3" />
                  Download
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredDocs.length === 0 && (
        <Card className="border-dashed border-border/50 bg-secondary/30">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-foreground font-semibold mb-2">No documents found</p>
            <p className="text-muted-foreground text-sm">Upload your first document to get started</p>
          </CardContent>
        </Card>
      )}

      {/* Document Processing Features */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-secondary/30 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">OCR Scanning</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground">Extract text from scanned PDFs and images with 99% accuracy</CardContent>
        </Card>

        <Card className="bg-secondary/30 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Data Extraction</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground">Automatically identify and extract key legal entities, dates, and clauses</CardContent>
        </Card>

        <Card className="bg-secondary/30 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Auto-Classification</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground">Intelligent categorization of document types and legal significance</CardContent>
        </Card>
      </div>
    </div>
  );
}
