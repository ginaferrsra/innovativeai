import { DocumentElement, VectorStore, RAGResult } from './types';

/**
 * RAG (Retrieval-Augmented Generation) Engine
 * Simulates vector store operations: embedding, storage, retrieval, and synthesis
 * Production: Integrate with Chroma, Pinecone, or Supabase pgvector
 */

export class RAGEngine {
  private static vectorStore: VectorStore = {
    vectors: [],
    metadata: [],
    indexed_at: new Date(),
  };

  /**
   * Simple embedding function (production: use sentence-transformers or OpenAI)
   * Creates pseudo-embeddings for demonstration
   */
  static generateEmbedding(text: string): number[] {
    // Simulate embedding by hashing text into vector space
    const embedding = new Array(384).fill(0);

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      embedding[i % 384] += Math.sin(charCode * (i + 1)) * 100;
    }

    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? embedding.map(v => v / magnitude) : embedding;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private static cosineSimilarity(vec1: number[], vec2: number[]): number {
    let dotProduct = 0;
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
    }
    return dotProduct;
  }

  /**
   * Index documents into vector store
   */
  static indexDocuments(elements: DocumentElement[]): void {
    console.log('[v0] Indexing', elements.length, 'document elements');

    elements.forEach((element, index) => {
      const embedding = this.generateEmbedding(element.text);

      this.vectorStore.vectors.push({
        id: element.id,
        embedding: embedding,
        similarity_score: 0,
      });

      this.vectorStore.metadata.push({
        id: element.id,
        element_type: element.element_type,
        text: element.text,
        metadata: element.metadata,
        indexed_at: new Date(),
        index_position: index,
      });
    });

    this.vectorStore.indexed_at = new Date();
    console.log('[v0] Vector store now contains', this.vectorStore.vectors.length, 'vectors');
  }

  /**
   * Semantic search in vector store
   */
  static semanticSearch(
    query: string,
    topK: number = 5,
    similarityThreshold: number = 0.3
  ): RAGResult[] {
    const queryEmbedding = this.generateEmbedding(query);
    const results: RAGResult[] = [];

    this.vectorStore.vectors.forEach((vector, index) => {
      const similarity = this.cosineSimilarity(queryEmbedding, vector.embedding);

      if (similarity > similarityThreshold) {
        const metadata = this.vectorStore.metadata[index];
        results.push({
          id: metadata.id,
          text: metadata.text,
          element_type: metadata.element_type,
          similarity_score: Math.max(0, Math.min(1, (similarity + 1) / 2)), // Normalize to 0-1
          metadata: metadata.metadata,
        });
      }
    });

    // Sort by similarity and return top K
    return results.sort((a, b) => b.similarity_score - a.similarity_score).slice(0, topK);
  }

  /**
   * Hybrid search combining keyword and semantic search
   */
  static hybridSearch(
    query: string,
    topK: number = 5,
    keywordWeight: number = 0.3,
    semanticWeight: number = 0.7
  ): RAGResult[] {
    // Semantic search
    const semanticResults = this.semanticSearch(query, topK * 2, 0.2);

    // Keyword search
    const queryTerms = query.toLowerCase().split(/\s+/);
    const keywordScores: Map<string, number> = new Map();

    this.vectorStore.metadata.forEach((metadata, index) => {
      let keywordScore = 0;
      const textLower = metadata.text.toLowerCase();

      queryTerms.forEach(term => {
        const matches = (textLower.match(new RegExp(term, 'g')) || []).length;
        keywordScore += matches / metadata.text.length;
      });

      if (keywordScore > 0) {
        keywordScores.set(metadata.id, keywordScore);
      }
    });

    // Combine scores
    const combinedScores: Map<string, number> = new Map();

    semanticResults.forEach(result => {
      const keywordScore = keywordScores.get(result.id) || 0;
      const combined = result.similarity_score * semanticWeight + keywordScore * keywordWeight;
      combinedScores.set(result.id, combined);
    });

    // Return top results
    return semanticResults
      .sort((a, b) => (combinedScores.get(b.id) || 0) - (combinedScores.get(a.id) || 0))
      .slice(0, topK);
  }

  /**
   * Retrieve context for a specific query
   */
  static retrieveContext(query: string, contextSize: number = 3): string {
    const results = this.hybridSearch(query, contextSize * 2);

    if (results.length === 0) {
      return 'No relevant context found in documents.';
    }

    return results
      .map(
        (result, idx) =>
          `[${idx + 1}] (${result.element_type}, similarity: ${(result.similarity_score * 100).toFixed(1)}%)\n${result.text}`
      )
      .join('\n\n');
  }

  /**
   * Query multiple documents with context
   */
  static queryWithContext(queries: string[]): Map<string, string> {
    const contextMap = new Map<string, string>();

    queries.forEach(query => {
      const context = this.retrieveContext(query, 5);
      contextMap.set(query, context);
    });

    return contextMap;
  }

  /**
   * Get similar documents for a given element
   */
  static findSimilarDocuments(elementId: string, topK: number = 5): RAGResult[] {
    const sourceElement = this.vectorStore.metadata.find(m => m.id === elementId);
    if (!sourceElement) return [];

    const sourceVector = this.vectorStore.vectors.find(v => v.id === elementId);
    if (!sourceVector) return [];

    const results: RAGResult[] = [];

    this.vectorStore.vectors.forEach((vector, index) => {
      if (vector.id === elementId) return; // Skip self

      const similarity = this.cosineSimilarity(sourceVector.embedding, vector.embedding);
      const metadata = this.vectorStore.metadata[index];

      results.push({
        id: metadata.id,
        text: metadata.text,
        element_type: metadata.element_type,
        similarity_score: Math.max(0, Math.min(1, (similarity + 1) / 2)),
        metadata: metadata.metadata,
      });
    });

    return results.sort((a, b) => b.similarity_score - a.similarity_score).slice(0, topK);
  }

  /**
   * Cluster documents by semantic similarity
   */
  static clusterDocuments(numClusters: number = 5): Map<number, RAGResult[]> {
    const clusters: Map<number, RAGResult[]> = new Map();

    // Initialize clusters
    for (let i = 0; i < numClusters; i++) {
      clusters.set(i, []);
    }

    // Simple k-means clustering
    this.vectorStore.metadata.forEach((metadata, index) => {
      const vector = this.vectorStore.vectors[index];
      let closestCluster = 0;
      let maxSimilarity = -Infinity;

      // Find nearest cluster centroid
      for (let i = 0; i < numClusters; i++) {
        const clusterDocs = clusters.get(i) || [];
        if (clusterDocs.length === 0) {
          closestCluster = i;
          break;
        }

        const similarity = clusterDocs.reduce((sum, doc) => {
          const docVector = this.vectorStore.vectors.find(
            v => v.id === doc.id
          );
          return docVector ? sum + this.cosineSimilarity(vector.embedding, docVector.embedding) : sum;
        }, 0) / clusterDocs.length;

        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
          closestCluster = i;
        }
      }

      clusters.get(closestCluster)?.push({
        id: metadata.id,
        text: metadata.text,
        element_type: metadata.element_type,
        similarity_score: 0,
        metadata: metadata.metadata,
      });
    });

    return clusters;
  }

  /**
   * Generate summary from retrieved context
   */
  static generateSummary(query: string, maxLength: number = 500): string {
    const context = this.retrieveContext(query, 5);
    const lines = context.split('\n').filter(line => line.trim());

    if (lines.length === 0) return 'No summary available.';

    // Simple summarization: take key sentences
    const summary = lines
      .filter((_, idx) => idx % 2 === 0) // Take every other line
      .join(' ')
      .substring(0, maxLength);

    return summary + (summary.length >= maxLength ? '...' : '');
  }

  /**
   * Export vector store for persistence
   */
  static exportVectorStore(): string {
    return JSON.stringify({
      vector_count: this.vectorStore.vectors.length,
      metadata_count: this.vectorStore.metadata.length,
      indexed_at: this.vectorStore.indexed_at,
      sample_vectors: this.vectorStore.vectors.slice(0, 3),
    });
  }

  /**
   * Clear vector store
   */
  static clearVectorStore(): void {
    this.vectorStore = {
      vectors: [],
      metadata: [],
      indexed_at: new Date(),
    };
    console.log('[v0] Vector store cleared');
  }

  /**
   * Get vector store statistics
   */
  static getVectorStoreStats() {
    return {
      total_vectors: this.vectorStore.vectors.length,
      total_metadata: this.vectorStore.metadata.length,
      indexed_at: this.vectorStore.indexed_at,
      element_types: Array.from(
        new Set(this.vectorStore.metadata.map(m => m.element_type))
      ),
    };
  }
}
