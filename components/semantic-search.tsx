'use client';

import React from "react"

import { useState } from 'react';
import { Search, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface SearchResult {
  id: string;
  text: string;
  element_type: string;
  similarity_score: number;
}

export function SemanticSearch() {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchType, setSearchType] = useState<'semantic' | 'hybrid'>('hybrid');
  const [context, setContext] = useState('');

  const performSearch = async () => {
    if (!query.trim()) return;

    try {
      setSearching(true);
      console.log('[v0] Performing', searchType, 'search');

      const response = await fetch('/api/search/semantic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          topK: 5,
          searchType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
        setContext(data.context);
      }
    } catch (error) {
      console.error('[v0] Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !searching) {
      performSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Semantic Document Search</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Search Type</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="semantic"
                  checked={searchType === 'semantic'}
                  onChange={(e) =>
                    setSearchType(e.target.value as 'semantic' | 'hybrid')
                  }
                />
                <span className="text-sm">Semantic Only</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="hybrid"
                  checked={searchType === 'hybrid'}
                  onChange={(e) =>
                    setSearchType(e.target.value as 'semantic' | 'hybrid')
                  }
                />
                <span className="text-sm">Hybrid (Recommended)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Query</label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Search for Charter sections, court procedures, legal concepts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={performSearch}
                disabled={!query.trim() || searching}
              >
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Context */}
      {context && (
        <Card className="p-6 bg-blue-50">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Retrieved Context
          </h4>
          <div className="bg-white p-4 rounded text-sm whitespace-pre-wrap font-mono text-xs">
            {context}
          </div>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Search Results ({results.length})</h4>

          <div className="space-y-3">
            {results.map((result, idx) => (
              <div
                key={result.id}
                className="p-4 border rounded hover:bg-muted transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">
                      {idx + 1}. {result.element_type}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {result.text}
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Relevance</p>
                      <div className="mt-1 flex items-center gap-1">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600"
                            style={{
                              width: `${Math.round(
                                result.similarity_score * 100
                              )}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs font-semibold">
                          {Math.round(result.similarity_score * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {result.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {searching && (
        <Card className="p-6 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Searching documents...</span>
        </Card>
      )}
    </div>
  );
}
