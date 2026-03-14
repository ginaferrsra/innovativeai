import { DocumentElement, ProcessedDocument, ExtractionResult } from './types';

/**
 * Document Processing Pipeline
 * Handles: Parsing, Cleaning, Chunking, and Extraction
 * Simulates Unstructured library functionality for document intelligence
 */

export class DocumentProcessor {
  private static readonly CHUNK_SIZE = 1000;
  private static readonly OVERLAP = 200;

  /**
   * Partition document into structured elements
   * Simulates: unstructured.partition.auto
   */
  static async partitionDocument(file: File): Promise<DocumentElement[]> {
    const text = await this.extractText(file);
    const elements = this.parseIntoElements(text, file.name);
    return elements;
  }

  /**
   * Clean extracted elements
   */
  static cleanElements(elements: DocumentElement[]): DocumentElement[] {
    return elements.map(el => ({
      ...el,
      text: this.cleanText(el.text),
    }));
  }

  /**
   * Extract specific content types (Title, NarrativeText)
   */
  static filterElements(
    elements: DocumentElement[],
    types: string[] = ['Title', 'NarrativeText', 'Table', 'List']
  ): DocumentElement[] {
    return elements.filter(el => types.includes(el.element_type));
  }

  /**
   * Chunk elements for RAG processing
   */
  static chunkElements(
    elements: DocumentElement[],
    chunkSize: number = this.CHUNK_SIZE,
    overlap: number = this.OVERLAP
  ): DocumentElement[] {
    const chunks: DocumentElement[] = [];
    let currentChunk = '';
    let elementIndex = 0;

    for (const el of elements) {
      if ((currentChunk + el.text).length > chunkSize && currentChunk) {
        chunks.push({
          id: `chunk-${chunks.length}`,
          element_type: 'ChunkedText',
          text: currentChunk,
          metadata: { element_index: elementIndex, chunk_size: currentChunk.length },
        });
        currentChunk = currentChunk.slice(-overlap) + el.text;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + el.text;
      }
      elementIndex++;
    }

    if (currentChunk) {
      chunks.push({
        id: `chunk-${chunks.length}`,
        element_type: 'ChunkedText',
        text: currentChunk,
        metadata: { element_index: elementIndex, chunk_size: currentChunk.length },
      });
    }

    return chunks;
  }

  /**
   * Extract text based on file type
   */
  private static async extractText(file: File): Promise<string> {
    const fileType = file.type;

    if (fileType === 'application/pdf') {
      return this.extractFromPDF(file);
    } else if (fileType.includes('word') || file.name.endsWith('.docx')) {
      return this.extractFromDocx(file);
    } else if (fileType.includes('text') || file.name.endsWith('.txt')) {
      return await file.text();
    } else if (fileType.includes('image')) {
      return this.extractFromImage(file);
    }

    return await file.text();
  }

  /**
   * Simulate PDF extraction
   * In production: use PDF.js or similar
   */
  private static extractFromPDF(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = `[PDF Content from ${file.name}]\n\nExtracted text from PDF document. In production, use PDF.js library for full OCR capabilities.`;
        resolve(text);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Simulate DOCX extraction
   * In production: use mammoth.js or docx library
   */
  private static async extractFromDocx(file: File): Promise<string> {
    return `[DOCX Content from ${file.name}]\n\nExtracted text from Word document. In production, use mammoth.js for accurate extraction.`;
  }

  /**
   * Simulate image/OCR extraction
   * In production: use Tesseract.js or Cloud Vision API
   */
  private static extractFromImage(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = `[Image OCR Content from ${file.name}]\n\nExtracted text from scanned document. In production, use Tesseract.js or Google Cloud Vision for OCR.`;
        resolve(text);
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Parse text into structured elements
   */
  private static parseIntoElements(text: string, filename: string): DocumentElement[] {
    const elements: DocumentElement[] = [];
    const lines = text.split('\n');
    let elementId = 0;

    lines.forEach((line, idx) => {
      if (!line.trim()) return;

      let elementType = 'NarrativeText';

      // Simple heuristics for element classification
      if (line.length < 100 && (line.endsWith(':') || /^[A-Z][A-Z\s]+$/.test(line))) {
        elementType = 'Title';
      } else if (line.includes('|') || line.match(/^\s*[-*]\s/)) {
        elementType = 'Table';
      } else if (line.match(/^\d+\.\s/) || line.match(/^[-*]\s/)) {
        elementType = 'List';
      } else if (line.includes('Charter') || line.includes('Section') || line.includes('Court')) {
        elementType = 'LegalText';
      }

      elements.push({
        id: `${filename}-${elementId}`,
        element_type: elementType,
        text: line.trim(),
        metadata: {
          line_number: idx,
          source: filename,
          extraction_confidence: 0.95,
        },
      });

      elementId++;
    });

    return elements;
  }

  /**
   * Clean text: normalize quotes, remove bullets, clean whitespace
   */
  private static cleanText(text: string): string {
    return text
      .replace(/[""]/g, '"')
      .replace(/[']/g, "'")
      .replace(/^[-*•]\s+/, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Extract entities from text (Charter sections, court references, parties)
   */
  static extractEntities(text: string): ExtractionResult {
    const sections = this.extractCharterSections(text);
    const courts = this.extractCourts(text);
    const parties = this.extractParties(text);
    const dates = this.extractDates(text);
    const statutes = this.extractStatutes(text);

    return {
      charter_sections: sections,
      courts: courts,
      parties: parties,
      dates: dates,
      statutes: statutes,
      confidence_score: Math.min(
        0.98,
        (sections.length + courts.length + parties.length + dates.length + statutes.length) * 0.15 + 0.5
      ),
    };
  }

  private static extractCharterSections(text: string): string[] {
    const sections: Set<string> = new Set();
    const patterns = [
      /section\s+(\d+(?:\([a-z]\))?)/gi,
      /s\.\s*(\d+(?:\([a-z]\))?)/gi,
      /Charter.*?section\s+(\d+)/gi,
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        sections.add(`s.${match[1]}`);
      }
    });

    return Array.from(sections);
  }

  private static extractCourts(text: string): string[] {
    const courts: Set<string> = new Set();
    const courtPatterns = [
      /Supreme Court of Canada/gi,
      /Federal Court/gi,
      /Superior Court/gi,
      /Court of Appeal/gi,
      /Provincial Court/gi,
      /Court of King's Bench/gi,
      /Ontario Superior Court/gi,
      /BC Supreme Court/gi,
    ];

    courtPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(m => courts.add(m.toUpperCase()));
      }
    });

    return Array.from(courts);
  }

  private static extractParties(text: string): string[] {
    const parties: Set<string> = new Set();
    const patterns = [
      /(?:v\.|versus)\s+([A-Z][A-Za-z\s&,]+?)(?:\s*\(|$)/g,
      /(?:Plaintiff|Defendant|Crown|Accused):\s*([A-Z][A-Za-z\s&,]+?)$/gm,
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        parties.add(match[1].trim());
      }
    });

    return Array.from(parties);
  }

  private static extractDates(text: string): string[] {
    const dates: Set<string> = new Set();
    const datePatterns = [
      /\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/gi,
      /\d{4}-\d{2}-\d{2}/g,
      /\d{1,2}\/\d{1,2}\/\d{4}/g,
    ];

    datePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(m => dates.add(m));
      }
    });

    return Array.from(dates);
  }

  private static extractStatutes(text: string): string[] {
    const statutes: Set<string> = new Set();
    const patterns = [
      /Canadian Charter of Rights and Freedoms/gi,
      /Criminal Code/gi,
      /([A-Z][a-z\s]+)\s+Act(?:\s+(?:of|of|of)\s+)?(?:\d{4})?/gi,
      /Constitution Act/gi,
    ];

    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(m => statutes.add(m));
      }
    });

    return Array.from(statutes);
  }
}
