// User roles for the legal system
export type UserRole = 'lawyer' | 'paralegal' | 'client' | 'self-represented' | 'admin';

// Case types
export type CaseType = 
  | 'criminal_defence' 
  | 'criminal_prosecution' 
  | 'civil_lawsuit' 
  | 'family_law' 
  | 'corporate' 
  | 'intellectual_property' 
  | 'employment' 
  | 'immigration' 
  | 'real_estate' 
  | 'other';

export type CaseStatus = 'active' | 'pending' | 'closed' | 'settled' | 'archived';
export type DocumentType = 'contract' | 'motion' | 'brief' | 'affidavit' | 'form' | 'correspondence' | 'evidence' | 'other';
export type WorkflowStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'pending_review';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  jurisdiction?: string[];
  firm?: string;
  licenseNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  type: CaseType;
  status: CaseStatus;
  jurisdiction: string; // e.g., "Ontario", "British Columbia"
  courtLevel: 'provincial' | 'superior' | 'appellate' | 'supreme';
  createdBy: string; // User ID
  assignedTo: string[]; // User IDs
  clients: string[]; // User IDs of clients involved
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface Document {
  id: string;
  caseId: string;
  title: string;
  type: DocumentType;
  content: string;
  extractedData?: Record<string, any>;
  sourceUrl?: string;
  uploadedBy: string; // User ID
  uploadedAt: Date;
  processedAt?: Date;
  status: 'pending' | 'processing' | 'processed' | 'failed';
}

export interface WorkflowTask {
  id: string;
  caseId: string;
  title: string;
  description: string;
  type: 'document_analysis' | 'legal_research' | 'risk_assessment' | 'form_generation' | 'correspondence' | 'case_strategy';
  status: WorkflowStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string; // User ID
  createdAt: Date;
  scheduledFor?: Date;
  completedAt?: Date;
  result?: {
    analysis: string;
    recommendations: string[];
    confidence: number;
  };
}

export interface LegalAnalysis {
  id: string;
  caseId: string;
  documentId?: string;
  analysisType: 'risk_assessment' | 'legal_opinion' | 'strategy_recommendation' | 'compliance_check' | 'precedent_analysis';
  result: {
    summary: string;
    keyFindings: string[];
    risks: { level: 'low' | 'medium' | 'high'; description: string }[];
    recommendations: string[];
    applicableLaw: {
      statute?: string;
      charter?: string;
      precedent?: string;
    };
  };
  createdAt: Date;
  relevantCaselaw: {
    citation: string;
    url?: string;
    relevance: 'highly_relevant' | 'relevant' | 'reference';
  }[];
}

export interface CourtForm {
  id: string;
  jurisdiction: string; // "Ontario", "British Columbia", etc.
  city?: string;
  court: string; // "Superior Court", "Provincial Court", etc.
  formName: string;
  formNumber: string;
  description: string;
  url: string;
  lastUpdated: Date;
  category: string;
}

export interface CanadianCharter {
  section: number;
  title: string;
  text: string;
  applicableCourts: string[];
}

export interface AgentWorkflow {
  id: string;
  name: string;
  caseId: string;
  createdAt: Date;
  tasks: WorkflowTask[];
  status: 'active' | 'paused' | 'completed';
  nextTaskScheduledFor?: Date;
}

export interface ExtractedData {
  documentId: string;
  rawContent: string;
  entities: {
    parties: string[];
    dates: { label: string; date: string }[];
    amounts: { description: string; value: number; currency: string }[];
    clauses: string[];
  };
  normalizedData: Record<string, any>;
  confidence: number;
}

// Document Processing Types
export interface DocumentElement {
  id: string;
  element_type: 'Title' | 'NarrativeText' | 'Table' | 'List' | 'LegalText' | 'ChunkedText';
  text: string;
  metadata?: Record<string, any>;
}

export interface ProcessedDocument {
  id: string;
  original_filename: string;
  elements: DocumentElement[];
  extraction_timestamp: Date;
  total_elements: number;
  processing_time_ms: number;
}

export interface ExtractionResult {
  charter_sections: string[];
  courts: string[];
  parties: string[];
  dates: string[];
  statutes: string[];
  confidence_score: number;
}

// Charter Analyzer Types
export interface CharterBreach {
  section: string;
  title: string;
  description: string;
  indicator: string;
  context: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence_score: number;
  recommendations: string[];
}

export interface DefenseStrategy {
  primary_strategy: string;
  secondary_strategies: string[];
  evidential_gaps: string[];
  jurisdictional_considerations: string[];
  key_arguments: string[];
  procedural_steps: string[];
  estimated_success_probability: number;
  comparable_cases: string[];
}

export interface CaseAnalysis {
  case_id: string;
  breaches: CharterBreach[];
  judicial_language: string[];
  defense_strategy: DefenseStrategy;
  analysis_timestamp: string;
  confidence_score: number;
}

// RAG Types
export interface VectorMetadata {
  id: string;
  element_type: string;
  text: string;
  metadata?: Record<string, any>;
  indexed_at: Date;
  index_position: number;
}

export interface VectorStore {
  vectors: Array<{ id: string; embedding: number[]; similarity_score: number }>;
  metadata: VectorMetadata[];
  indexed_at: Date;
}

export interface RAGResult {
  id: string;
  text: string;
  element_type: string;
  similarity_score: number;
  metadata?: Record<string, any>;
}

// Data Connector Types
export interface ConnectorConfig {
  provider: string;
  auth_type: 'OAuth2' | 'API_Key' | 'AWS_Credentials' | 'Connection_String';
  base_url: string;
  supported_formats: string[];
  scopes: string[];
}

export interface ConnectorStatus {
  source: string;
  authenticated: boolean;
  auth_type: string;
  connected_at: Date;
  last_sync: Date;
  status: 'connected' | 'synced' | 'syncing' | 'error' | 'disconnected';
  data_sources_found: number;
  documents_indexed: number;
  sync_frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

export interface DataSource {
  id: string;
  source: string;
  name: string;
  type: 'document' | 'folder' | 'database' | 'email' | 'other';
  path: string;
  size_bytes: number;
  created_at: Date;
  modified_at: Date;
  sync_status: 'synced' | 'pending' | 'syncing' | 'error';
}
