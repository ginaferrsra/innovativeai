'use client';

import React from "react"

import { useState } from 'react';
import { Upload, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DocumentUploadProps {
  caseId?: string;
  onSuccess?: (result: any) => void;
  performCharterAnalysis?: boolean;
}

export function DocumentUpload({
  caseId = '',
  onSuccess,
  performCharterAnalysis = true,
}: DocumentUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<Map<string, any>>(new Map());
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles([...files, ...droppedFiles]);
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(f => {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/vnd.ms-excel'];
      return validTypes.includes(f.type) || f.name.match(/\.(pdf|docx?|txt|xlsx?)$/i);
    });
    setFiles([...files, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setResults(new Map([...results]));
    setErrors(new Map([...errors]));
  };

  const uploadFiles = async () => {
    setUploading(true);
    const newResults = new Map(results);
    const newErrors = new Map(errors);

    for (const file of files) {
      try {
        console.log('[v0] Uploading:', file.name);

        const formData = new FormData();
        formData.append('file', file);
        if (caseId) formData.append('caseId', caseId);
        formData.append('charterAnalysis', String(performCharterAnalysis));

        const response = await fetch('/api/documents/process', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        newResults.set(file.name, data);
        newErrors.delete(file.name);

        console.log('[v0] Processing complete for:', file.name);
      } catch (error) {
        newErrors.set(file.name, String(error));
        console.error('[v0] Upload error:', error);
      }
    }

    setResults(newResults);
    setErrors(newErrors);
    setUploading(false);

    if (onSuccess) {
      onSuccess({
        results: Object.fromEntries(newResults),
        errors: Object.fromEntries(newErrors),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card
        className="border-2 border-dashed p-8 text-center cursor-pointer hover:bg-muted transition"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-semibold mb-2">Drop documents here or click to browse</p>
        <p className="text-sm text-muted-foreground">
          Supports PDF, Word, Excel, and text files
        </p>
        <input
          id="file-input"
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(Array.from(e.target.files || []))}
          accept=".pdf,.docx,.doc,.txt,.xlsx,.xls"
        />
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Files to Process ({files.length})</h3>
          <div className="space-y-2">
            {files.map((file, idx) => {
              const result = results.get(file.name);
              const error = errors.get(file.name);

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  {result ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-xs">Processed</span>
                    </div>
                  ) : error ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-5 w-5" />
                      <span className="text-xs">Error</span>
                    </div>
                  ) : uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  ) : null}

                  <button
                    onClick={() => removeFile(idx)}
                    className="ml-2 p-1 hover:bg-background rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Results */}
      {results.size > 0 && (
        <Card className="p-6 bg-green-50 border-green-200">
          <h3 className="font-semibold text-green-900 mb-4">Processing Results</h3>
          <div className="space-y-4">
            {Array.from(results.entries()).map(([filename, data]) => (
              <div key={filename} className="bg-white p-4 rounded border">
                <p className="font-medium text-sm mb-2">{filename}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Elements Extracted</p>
                    <p className="font-semibold">{data.document?.elements_extracted}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Elements Indexed</p>
                    <p className="font-semibold">{data.document?.elements_indexed}</p>
                  </div>
                  {data.extraction && (
                    <>
                      <div>
                        <p className="text-muted-foreground">Charter Sections Found</p>
                        <p className="font-semibold">{data.extraction.charter_sections?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Parties Identified</p>
                        <p className="font-semibold">{data.extraction.parties?.length || 0}</p>
                      </div>
                    </>
                  )}
                </div>

                {data.charter_analysis && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="font-medium text-sm mb-2">Charter Analysis</p>
                    <div className="bg-red-50 p-2 rounded text-xs">
                      <p className="text-red-900">
                        {data.charter_analysis.breaches?.length || 0} potential breaches identified
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Errors */}
      {errors.size > 0 && (
        <Card className="p-6 bg-red-50 border-red-200">
          <h3 className="font-semibold text-red-900 mb-4">Processing Errors</h3>
          <div className="space-y-2">
            {Array.from(errors.entries()).map(([filename, error]) => (
              <div key={filename} className="text-sm text-red-700">
                <p className="font-medium">{filename}</p>
                <p className="text-xs text-red-600">{error}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Upload Button */}
      <Button
        onClick={uploadFiles}
        disabled={files.length === 0 || uploading}
        size="lg"
        className="w-full"
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Documents...
          </>
        ) : (
          `Process ${files.length} Document${files.length !== 1 ? 's' : ''}`
        )}
      </Button>
    </div>
  );
}
