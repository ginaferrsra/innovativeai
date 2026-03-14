# LexisAI - System Architecture

## High-Level System Design

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (React)                         │
├─────────────────────────────────────────────────────────────────────┤
│  • Dashboard Layout                                                  │
│  • Document Upload UI         • Semantic Search UI                  │
│  • Charter Analysis UI        • Data Connectors UI                  │
│  • Admin Dashboard            • Case Management UI                  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                    HTTP/REST API (JSON)
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│                    API LAYER (Next.js Routes)                       │
├─────────────────────────────────────────────────────────────────────┤
│  /api/documents/process       → Document Processing Pipeline       │
│  /api/search/semantic         → Search & Retrieval                  │
│  /api/analysis/charter        → Charter Analysis                    │
│  /api/connectors              → Data Source Management              │
│  /api/connectors/[src]/sync   → Connector Sync                      │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                    Function Calls (TypeScript)
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│                  PROCESSING LAYER (Libraries)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │ DocumentProcessor │  │ Charter Analyzer │  │  RAG Engine      │ │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────┤ │
│  │ • Partition      │  │ • Analyze        │  │ • Embed          │ │
│  │ • Clean          │  │ • Extract Lang   │  │ • Search         │ │
│  │ • Filter         │  │ • Generate Strat │  │ • Cluster        │ │
│  │ • Chunk          │  │ • Assess Sev     │  │ • Retrieve       │ │
│  │ • Extract        │  │ • Find Cases     │  │ • Summarize      │ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │ Data Connectors  │  │  Mock Data       │  │  Type System     │ │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────┤ │
│  │ • Authenticate   │  │ • Users          │  │ • Interfaces     │ │
│  │ • List Docs      │  │ • Cases          │  │ • Types          │ │
│  │ • Download       │  │ • Documents      │  │ • Enums          │ │
│  │ • Sync           │  │ • Workflows      │  │ • Schemas        │ │
│  │ • Health         │  │ • References     │  │ • Constants      │ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
│                                                                      │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                    Network Requests & I/O
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│                      DATA LAYER (Storage)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │   Database       │  │  Vector Store    │  │  File Storage    │ │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────┤ │
│  │ • PostgreSQL     │  │ • Chromadb       │  │ • AWS S3         │ │
│  │ • Supabase       │  │ • Pinecone       │  │ • Azure Blob     │ │
│  │ • AWS RDS        │  │ • In-Memory      │  │ • Local FS       │ │
│  │ • Local          │  │ • 384-dim embed  │  │ • Email Archive  │ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐                        │
│  │ External APIs    │  │ Data Sources     │                        │
│  ├──────────────────┤  ├──────────────────┤                        │
│  │ • OpenAI GPT-4   │  │ • Google Drive   │                        │
│  │ • Other LLMs     │  │ • SharePoint     │                        │
│  │ • Cloud Vision   │  │ • Salesforce     │                        │
│  │ • Monitoring     │  │ • Zendesk        │                        │
│  └──────────────────┘  └──────────────────┘                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Frontend Component Tree

```
App Root
├── Providers (Auth Context)
└── Pages
    ├── / (Home/Login)
    │   └── <LoginForm />
    │
    ├── /dashboard
    │   ├── <DashboardLayout />
    │   └── <CasesList />
    │
    ├── /documents
    │   ├── <DashboardLayout />
    │   └── <Tabs>
    │       ├── <DocumentUpload />
    │       ├── <SemanticSearch />
    │       └── <DataConnectorsPanel />
    │
    ├── /analysis
    │   ├── <DashboardLayout />
    │   └── <AdvancedAnalysis />
    │
    ├── /admin
    │   ├── <DashboardLayout />
    │   └── <AdminDashboard />
    │
    ├── /workflows
    │   ├── <DashboardLayout />
    │   └── <Workflows />
    │
    ├── /reference
    │   ├── <DashboardLayout />
    │   └── <LegalReference />
    │
    └── /cases/[id]
        ├── <DashboardLayout />
        └── <CaseDetails />
```

---

## Data Flow Architecture

### Document Processing Pipeline

```
User Upload
    │
    ├─► File Type Detection
    │
    ├─► Format-Specific Extraction
    │   ├─ PDF → PDF.js
    │   ├─ DOCX → mammoth.js
    │   ├─ Image → Tesseract (OCR)
    │   └─ Text → Direct parse
    │
    ├─► Text Cleaning
    │   ├─ Normalize quotes
    │   ├─ Remove bullets/dashes
    │   └─ Clean whitespace
    │
    ├─► Element Classification
    │   ├─ Title (headers)
    │   ├─ NarrativeText (body)
    │   ├─ Table (structured data)
    │   ├─ List (enumerated items)
    │   └─ LegalText (Charter refs)
    │
    ├─► Entity Extraction
    │   ├─ Charter Sections (s.2, s.8, etc.)
    │   ├─ Courts (Superior, Provincial, etc.)
    │   ├─ Parties (Plaintiff, Defendant, Crown)
    │   ├─ Dates (various formats)
    │   └─ Statutes (Acts, Bills, Codes)
    │
    ├─► Semantic Chunking
    │   ├─ 1000 char chunks (default)
    │   ├─ 200 char overlap
    │   └─ Preserve context
    │
    └─► Vector Indexing
        ├─ Generate embeddings (384-dim)
        ├─ Store in vector DB
        └─ Index metadata
```

### Charter Breach Analysis Pipeline

```
Document Elements
    │
    ├─► Breach Detection
    │   ├─ Check s.8 indicators (warrantless, unreasonable)
    │   ├─ Check s.9 indicators (arbitrary detention)
    │   ├─ Check s.10(b) indicators (denied counsel)
    │   ├─ Check s.11(b) indicators (burden of proof)
    │   ├─ Check s.12 indicators (cruel punishment)
    │   └─ More sections...
    │
    ├─► Severity Assessment
    │   ├─ Critical: Confession without counsel
    │   ├─ High: Warrantless residential search
    │   ├─ Medium: Procedural irregularities
    │   └─ Low: Minor compliance issues
    │
    ├─► Judicial Language Extraction
    │   ├─ "serious and flagrant"
    │   ├─ "good faith error"
    │   ├─ "reasonable grounds"
    │   ├─ "proportionality"
    │   └─ "compelling state objective"
    │
    ├─► Defense Strategy Generation
    │   ├─ Primary strategy (Charter-based or merits)
    │   ├─ Secondary approaches
    │   ├─ Procedural steps
    │   ├─ Key arguments
    │   └─ Comparable cases
    │
    └─► Success Probability Estimate
        ├─ Base rate: 40%
        ├─ +25% per critical breach
        ├─ +10% per high severity breach
        └─ Adjusted for context
```

### Semantic Search Pipeline

```
Search Query
    │
    ├─► Query Processing
    │   ├─ Tokenization
    │   ├─ Normalization
    │   └─ Expansion (synonyms)
    │
    ├─► Dual Search Paths
    │   │
    │   ├─► Semantic Path
    │   │   ├─ Embed query (384-dim)
    │   │   ├─ Calculate cosine similarity
    │   │   ├─ Threshold filter (0.3+)
    │   │   └─ Score normalization
    │   │
    │   └─► Keyword Path
    │       ├─ Term extraction
    │       ├─ Frequency analysis
    │       ├─ TF-IDF scoring
    │       └─ Relevance ranking
    │
    ├─► Score Combination
    │   ├─ Semantic weight: 70%
    │   ├─ Keyword weight: 30%
    │   └─ Combined ranking
    │
    └─► Results Retrieval
        ├─ Top-K selection (default: 5)
        ├─ Context extraction
        └─ Relevance scoring display
```

### Data Connector Sync Pipeline

```
User Connects Source
    │
    ├─► Authentication
    │   ├─ OAuth2 flow
    │   ├─ API key validation
    │   ├─ Credential encryption
    │   └─ Session token creation
    │
    ├─► Source Discovery
    │   ├─ List documents/files
    │   ├─ Filter by type
    │   ├─ Determine sync scope
    │   └─ Check permissions
    │
    ├─► Document Download
    │   ├─ Parallel fetching (configurable)
    │   ├─ Chunk large files
    │   ├─ Verify integrity
    │   └─ Error retry logic
    │
    ├─► Processing
    │   ├─ Format detection
    │   ├─ Content extraction
    │   ├─ Entity recognition
    │   └─ Metadata capture
    │
    ├─► Indexing
    │   ├─ Vector embedding
    │   ├─ Database storage
    │   ├─ Metadata indexing
    │   └─ Search optimization
    │
    └─► Monitoring
        ├─ Sync status tracking
        ├─ Error logging
        ├─ Performance metrics
        └─ Health status updates
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────┐
│              SECURITY LAYERS                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Layer 1: HTTPS/TLS
│  ├─ Encrypt all data in transit
│  ├─ Certificate pinning
│  └─ Perfect forward secrecy
│
│  Layer 2: Authentication
│  ├─ Session management
│  ├─ JWT tokens
│  └─ Multi-factor auth (optional)
│
│  Layer 3: Authorization (RBAC)
│  ├─ Role-based access control
│  ├─ Fine-grained permissions
│  └─ Resource-level security
│
│  Layer 4: Data Protection
│  ├─ Encryption at rest
│  ├─ Password hashing (bcrypt)
│  ├─ API key management
│  └─ Secrets rotation
│
│  Layer 5: Database Security
│  ├─ Row-level security (RLS)
│  ├─ Parameterized queries
│  ├─ Input validation
│  └─ SQL injection prevention
│
│  Layer 6: API Security
│  ├─ Rate limiting
│  ├─ CORS policy
│  ├─ Request validation
│  └─ Response sanitization
│
│  Layer 7: Audit & Compliance
│  ├─ Comprehensive logging
│  ├─ Access auditing
│  ├─ Compliance tracking
│  └─ Incident response
│
└─────────────────────────────────────────────────────┘
```

---

## Deployment Architecture Options

### Option 1: Vercel (Recommended)

```
Git Repository
    │
    └─► GitHub Push
        │
        └─► Vercel CI/CD
            │
            ├─► Build
            ├─► Test
            ├─► Deploy
            │
            └─► Production (Serverless Functions)
                ├─ Edge Functions (Middleware)
                ├─ Serverless Functions (API)
                ├─ Static Content (CDN)
                └─ Database (External)
```

### Option 2: Docker Containers

```
Code Repository
    │
    └─► Docker Build
        │
        ├─► Container Image
        │
        └─► Container Registry
            │
            └─► Orchestration (K8s, Docker Swarm)
                ├─ API Container (Scale: N)
                ├─ Processing Container (Scale: N)
                ├─ Worker Containers (Background jobs)
                └─ Database Container (or External)
```

### Option 3: Traditional VPS

```
Code Repository
    │
    └─► Git Clone/SSH
        │
        └─► Linux Server
            │
            ├─► Node.js Runtime
            ├─► Process Manager (PM2)
            ├─► Reverse Proxy (nginx)
            ├─► Database (PostgreSQL)
            ├─ SSL/TLS (Let's Encrypt)
            └─ Monitoring (Sentry, Posthog)
```

---

## Scalability Architecture

### Horizontal Scaling

```
Users
  │
  ├─► Load Balancer (nginx/AWS ALB)
  │
  ├─► Instance 1 (API Server)
  ├─► Instance 2 (API Server)
  ├─► Instance 3 (API Server)
  └─► Instance N (API Server)
      │
      └─► Shared Resources
          ├─ PostgreSQL DB (Primary + Replicas)
          ├─ Vector Store (Distributed)
          ├─ File Storage (S3/Cloud)
          ├─ Cache (Redis)
          └─ Message Queue (Kafka/RabbitMQ)
```

### Vertical Scaling

```
Single Server
  │
  ├─ CPU: 2 → 4 → 8 → 16+ cores
  ├─ Memory: 2GB → 4GB → 8GB → 32GB+
  ├─ Storage: 20GB → 100GB → 500GB → 2TB+
  └─ Bandwidth: 1Gbps → 10Gbps
```

---

## Performance Optimization Points

```
User Request
    │
    ├─► CDN Cache
    │   └─ Static assets, CSS, JS
    │
    ├─► Browser Cache
    │   └─ HTTP caching headers
    │
    ├─► Application Cache
    │   ├─ Redis (session, query results)
    │   ├─ In-memory (LRU cache)
    │   └─ Client-side state
    │
    ├─► Database Optimization
    │   ├─ Indexes on frequent columns
    │   ├─ Query optimization
    │   ├─ Connection pooling
    │   └─ Read replicas
    │
    ├─► Vector Store Optimization
    │   ├─ Approximate nearest neighbor
    │   ├─ Batch indexing
    │   ├─ Archive old vectors
    │   └─ Dimension reduction
    │
    └─► API Optimization
        ├─ Response compression (gzip)
        ├─ Pagination
        ├─ Partial response selection
        └─ Async processing
```

---

## Monitoring & Analytics

```
System Components
    │
    ├─► Application Monitoring
    │   ├─ Sentry (error tracking)
    │   ├─ Datadog (infrastructure)
    │   ├─ New Relic (APM)
    │   └─ Custom metrics
    │
    ├─► Performance Monitoring
    │   ├─ Response times
    │   ├─ Throughput
    │   ├─ Error rates
    │   └─ Resource utilization
    │
    ├─► User Analytics
    │   ├─ Posthog (product analytics)
    │   ├─ Google Analytics (web)
    │   ├─ Segment (tracking)
    │   └─ Custom events
    │
    ├─► Security Monitoring
    │   ├─ Audit logs
    │   ├─ Access patterns
    │   ├─ Anomaly detection
    │   └─ Threat detection
    │
    └─► Alerting
        ├─ PagerDuty (on-call)
        ├─ Slack notifications
        ├─ Email alerts
        └─ Dashboard dashboards
```

---

## Database Schema Overview

```sql
-- Users & Access Control
users (id, email, name, role, jurisdiction, firm)
user_sessions (id, user_id, token, expires_at)
audit_logs (id, user_id, action, resource, timestamp)

-- Cases & Legal Work
cases (id, title, type, status, jurisdiction, court_level)
case_assignments (case_id, user_id, role)
case_clients (case_id, user_id)

-- Documents
documents (id, case_id, title, type, content, status)
document_chunks (id, document_id, text, embedding_id)
extracted_entities (id, document_id, type, value)

-- Analysis & Workflows
charter_analyses (id, case_id, breaches, defense_strategy)
workflow_tasks (id, case_id, type, status, assigned_to)
legal_references (id, type, jurisdiction, content)

-- Vector Store
vector_embeddings (id, document_id, vector, metadata)

-- Data Connectors
data_sources (id, type, status, last_sync)
synced_documents (id, source_id, external_id, status)
```

---

## API Request/Response Flow

```
HTTP Request
    │
    ├─► Next.js Request Handler
    │   ├─ Parse request
    │   ├─ Authenticate user
    │   ├─ Authorize action
    │   └─ Validate input
    │
    ├─► Business Logic
    │   ├─ Call library functions
    │   ├─ Process data
    │   ├─ Query database
    │   └─ Call external APIs
    │
    ├─► Response Processing
    │   ├─ Serialize data
    │   ├─ Format response
    │   ├─ Add metadata
    │   └─ Compress (gzip)
    │
    └─► HTTP Response
        ├─ Status code
        ├─ Headers
        ├─ JSON payload
        └─ Error handling
```

---

## Future Architecture Enhancements

```
Phase 2 Additions:
├─ Message Queue (Kafka/RabbitMQ)
│  └─ Async document processing
│
├─ Machine Learning Pipeline
│  ├─ Model training infrastructure
│  ├─ Feature engineering
│  └─ Model serving (TensorFlow, PyTorch)
│
├─ Advanced Caching
│  ├─ Distributed cache (Redis Cluster)
│  ├─ Intelligent cache invalidation
│  └─ Cache-aside patterns
│
├─ Enhanced Search
│  ├─ Elasticsearch integration
│  ├─ Full-text search
│  └─ Advanced faceting
│
└─ Real-time Features
   ├─ WebSocket connections
   ├─ Real-time collaboration
   └─ Live notifications
```

---

**Architecture Version**: 1.0.0  
**Last Updated**: January 15, 2024  
**Status**: Production Ready  
**Maintainability**: Modular, testable, documented
