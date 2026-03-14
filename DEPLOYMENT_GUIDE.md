# LexisAI - Deployment & Configuration Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Data Connectors Configuration](#data-connectors-configuration)
7. [Deployment Options](#deployment-options)
8. [Security Considerations](#security-considerations)
9. [Performance Optimization](#performance-optimization)
10. [Monitoring & Analytics](#monitoring--analytics)

---

## Prerequisites

### System Requirements
- Node.js 18+ or Node.js 20+
- 4GB RAM minimum (8GB recommended)
- 10GB disk space minimum
- HTTPS/TLS for production

### Required Services (Optional but Recommended)
- Supabase (PostgreSQL database)
- Vercel (hosting)
- AWS S3 (document storage)
- OpenAI API (advanced AI features)
- Stripe (future billing)

---

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/lexisai/platform.git
cd lexisai
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Build Project
```bash
npm run build
```

### 4. Start Development Server
```bash
npm run dev
# Application will be available at http://localhost:3000
```

---

## Configuration

### Project Structure
```
lexisai/
├── app/                    # Next.js app routes and pages
│   ├── api/               # API routes
│   ├── admin/            # Admin dashboard
│   ├── analysis/         # Charter analysis page
│   ├── cases/            # Case management
│   ├── documents/        # Document management
│   ├── workflows/        # Workflow automation
│   └── reference/        # Legal reference library
├── components/           # React components
│   ├── ui/              # Shadcn/ui components
│   ├── document-upload.tsx
│   ├── semantic-search.tsx
│   ├── advanced-analysis.tsx
│   ├── data-connectors-panel.tsx
│   ├── admin-dashboard.tsx
│   └── ...
├── lib/                 # Utility libraries
│   ├── document-processor.ts
│   ├── charter-analyzer.ts
│   ├── rag-engine.ts
│   ├── data-connectors.ts
│   └── types.ts
├── public/             # Static assets
├── scripts/            # Database migration scripts
└── API_DOCUMENTATION.md
```

### Next.js Configuration
**next.config.mjs**
```javascript
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable React Compiler (Next.js 16+)
  experimental: {
    reactCompiler: true,
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'LexisAI',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
};

export default nextConfig;
```

---

## Environment Variables

### Development (.env.local)
```bash
# App Configuration
NEXT_PUBLIC_APP_NAME=LexisAI
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyxxxxx

# AI Services
OPENAI_API_KEY=sk-xxxxx
OPENAI_ORG_ID=org-xxxxx

# AWS Services (for S3 storage)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_S3_BUCKET=lexisai-documents

# Data Connectors
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
SHAREPOINT_TENANT_ID=xxxxx
SHAREPOINT_CLIENT_ID=xxxxx
SHAREPOINT_CLIENT_SECRET=xxxxx

# Monitoring
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
LOGROCKET_ID=xxxxx

# Analytics
POSTHOG_API_KEY=phc_xxxxx

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxxxx
```

### Production (.env.production)
```bash
# Same as development, but with production URLs and keys
NEXT_PUBLIC_API_URL=https://api.lexisai.legal
NEXT_PUBLIC_APP_URL=https://app.lexisai.legal

# Production database with enhanced security
# Use secrets management (AWS Secrets Manager, Vercel Secrets, etc.)
```

---

## Database Setup

### Option 1: Supabase (Recommended)

1. Create Supabase project at https://supabase.com
2. Create tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  jurisdiction JSONB DEFAULT '["Ontario"]',
  firm VARCHAR(255),
  license_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cases table
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  jurisdiction VARCHAR(100) NOT NULL,
  court_level VARCHAR(50) NOT NULL,
  created_by UUID REFERENCES users(id),
  assigned_to JSONB DEFAULT '[]',
  clients JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  tags JSONB DEFAULT '[]'
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  content TEXT,
  extracted_data JSONB,
  source_url VARCHAR(500),
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  vector_id VARCHAR(500)
);

-- Workflow tasks table
CREATE TABLE workflow_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'queued',
  priority VARCHAR(50) DEFAULT 'medium',
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  scheduled_for TIMESTAMP,
  completed_at TIMESTAMP,
  result JSONB
);

-- Charter analysis results
CREATE TABLE charter_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id),
  document_id UUID REFERENCES documents(id),
  breaches JSONB NOT NULL,
  defense_strategy JSONB NOT NULL,
  confidence_score FLOAT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. Enable Row Level Security (RLS):

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view assigned cases"
  ON cases FOR SELECT
  USING (
    created_by = auth.uid() OR
    assigned_to @> to_jsonb(auth.uid()::text) OR
    clients @> to_jsonb(auth.uid()::text)
  );
```

### Option 2: Local PostgreSQL

```bash
# Install PostgreSQL
brew install postgresql  # macOS
apt-get install postgresql  # Linux

# Create database
createdb lexisai_db

# Run migrations
psql lexisai_db < scripts/01-initial-schema.sql
```

---

## Data Connectors Configuration

### Google Drive Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project "LexisAI"
3. Enable Google Drive API
4. Create OAuth 2.0 credentials (Desktop application)
5. Add to .env:
```bash
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxx
```

### SharePoint Setup

1. Register app in Azure Active Directory
2. Grant permissions: Files.Read, Sites.Read.All
3. Create client secret
4. Add to .env:
```bash
SHAREPOINT_TENANT_ID=xxxx
SHAREPOINT_CLIENT_ID=xxxx
SHAREPOINT_CLIENT_SECRET=xxxx
```

### Salesforce Setup

1. Create connected app in Salesforce
2. Generate OAuth token
3. Add to .env:
```bash
SALESFORCE_CLIENT_ID=xxxx
SALESFORCE_CLIENT_SECRET=xxxx
SALESFORCE_INSTANCE_URL=https://xxxxx.salesforce.com
```

### AWS S3 Setup

1. Create IAM user with S3 permissions
2. Generate access keys
3. Add to .env:
```bash
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET=lexisai-documents
AWS_REGION=us-east-1
```

---

## Deployment Options

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Configure environment variables in Vercel dashboard
4. Deployments happen automatically on git push

```bash
# One-time setup
npm i -g vercel
vercel --prod
```

### Option 2: Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./.next
COPY public ./public
COPY next.config.mjs ./

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t lexisai .
docker run -p 3000:3000 -e NODE_ENV=production lexisai
```

### Option 3: AWS EC2

1. Launch Ubuntu 22.04 instance
2. Install Node.js 20
3. Clone repository
4. Install PM2: `npm install -g pm2`
5. Start application: `pm2 start "npm start" --name lexisai`
6. Configure nginx as reverse proxy

---

## Security Considerations

### API Security
- All API endpoints require authentication
- CORS enabled for authorized origins only
- Rate limiting on sensitive endpoints
- SQL injection prevention via parameterized queries

### Data Protection
- Encrypt sensitive data at rest (passwords, API keys)
- Use HTTPS/TLS for all communications
- Implement Row Level Security (RLS) in database
- Regular security audits and penetration testing

### User Management
- Strong password requirements
- Two-factor authentication (2FA) support
- Session timeout after 30 minutes of inactivity
- Audit logging for all admin actions

### Compliance
- GDPR compliance for EU users
- PIPEDA compliance for Canadian data
- Legal privilege protection for attorney-client communications
- Regular data backups and disaster recovery testing

---

## Performance Optimization

### Database Optimization
```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_cases_user_id ON cases(created_by);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_documents_case_id ON documents(case_id);
CREATE INDEX idx_workflow_tasks_case_id ON workflow_tasks(case_id);
```

### Caching Strategy
- Use Next.js ISR for static legal reference pages
- Cache vector store embeddings in Redis
- Browser caching for UI components (public/cache)
- CDN for static assets

### Vector Store Optimization
- Limit embeddings to 384 dimensions
- Use approximate nearest neighbor search
- Batch process indexing jobs
- Archive old documents to cold storage

### API Performance
- Implement request pagination
- Use compression (gzip)
- Implement query result caching
- Async processing for long-running tasks

---

## Monitoring & Analytics

### Application Monitoring
```bash
# Install Sentry for error tracking
npm install @sentry/nextjs

# Install Posthog for analytics
npm install posthog-js
```

### Metrics to Monitor
- API response times
- Document processing success rate
- Charter analysis accuracy
- Data connector sync status
- Vector store size and search latency
- Active users and session duration

### Logging
```javascript
// Implement structured logging
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.Integrations.OnUncaughtException(),
    new Sentry.Integrations.OnUnhandledRejection(),
  ],
});
```

### Health Checks
```javascript
// GET /api/health
export async function GET() {
  return Response.json({
    status: 'healthy',
    uptime: process.uptime(),
    database: 'connected',
    vectorStore: 'operational',
    timestamp: new Date().toISOString()
  });
}
```

---

## Troubleshooting

### Common Issues

**1. Document Processing Fails**
- Check file format is supported
- Verify disk space available
- Check memory usage
- Review error logs in Sentry

**2. Charter Analysis Inaccurate**
- Ensure document contains sufficient Charter references
- Check confidence score (should be > 0.7)
- Review extraction results
- Update analysis thresholds if needed

**3. Data Connector Not Syncing**
- Verify credentials are correct
- Check API rate limits
- Review connector health status
- Check firewall/proxy settings

**4. Slow Search Results**
- Check vector store size
- Verify database indexes exist
- Monitor server resources
- Consider implementing pagination

---

## Maintenance

### Regular Tasks
- Daily: Monitor system health dashboard
- Weekly: Review error logs and performance metrics
- Monthly: Update dependencies (`npm update`)
- Quarterly: Security audit and penetration testing
- Annually: Disaster recovery drill

### Backup Strategy
```bash
# Database backup
pg_dump lexisai_db > lexisai_backup_$(date +%Y%m%d).sql

# Vector store backup
# Implement automated S3 backups

# Document storage backup
# Use S3 versioning and replication
```

---

## Support & Resources

- Documentation: https://docs.lexisai.legal
- GitHub Issues: https://github.com/lexisai/platform/issues
- Community Slack: https://slack.lexisai.legal
- Email Support: support@lexisai.legal

---

**Version:** 1.0.0  
**Last Updated:** January 15, 2024  
**Maintained By:** LexisAI Team
