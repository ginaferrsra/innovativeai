# LexisAI - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Clone & Install
```bash
git clone https://github.com/lexisai/platform.git
cd lexisai
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your settings
```

### 3. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### 4. Login with Demo Credentials
```
Email: demo@lexisai.legal
Password: DemoPassword123!
```

---

## 📋 Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run linter
npm run type-check  # TypeScript checking
```

### Database
```bash
# Create database schema (Supabase)
psql -U postgres -d lexisai_db < scripts/01-initial-schema.sql

# Backup database
pg_dump lexisai_db > backup.sql

# Restore from backup
psql lexisai_db < backup.sql
```

### Deployment
```bash
# Vercel
vercel --prod

# Docker
docker build -t lexisai .
docker run -p 3000:3000 lexisai

# PM2 (Linux/macOS)
pm2 start "npm start" --name lexisai
pm2 logs lexisai
```

---

## 🔑 Key Features to Try

### 1. Document Processing
1. Go to `/documents` → Upload tab
2. Drag/drop a PDF or document
3. Check "Perform Charter Analysis"
4. Click "Process Document"
5. View extracted entities and breaches

### 2. Charter Analysis
1. Go to `/analysis` → Charter Analysis
2. Paste case document or disclosure
3. Enter case context (province, court)
4. Click "Analyze for Charter Breaches"
5. Review breaches and defense strategy

### 3. Semantic Search
1. Go to `/documents` → Semantic Search tab
2. Index some documents first
3. Search: "Charter s.8 breach warrantless search"
4. View ranked results with relevance scores

### 4. Data Connectors
1. Go to `/documents` → Data Sources tab
2. Click "Add Data Source"
3. Select connector (Google Drive, etc.)
4. Enter credentials
5. View synced documents

### 5. Admin Dashboard
1. Login as admin user
2. Go to `/admin`
3. View system health and metrics
4. Monitor connector status
5. Review activity logs

---

## 🗂️ File Structure Quick Reference

```
📁 App Pages
├── /               → Login/Home
├── /dashboard      → Cases
├── /documents      → Upload + Search + Connectors
├── /analysis       → Charter Analysis
├── /workflows      → Automation
├── /reference      → Legal Library
└── /admin          → Admin Panel

📁 Components
├── <DocumentUpload />
├── <SemanticSearch />
├── <AdvancedAnalysis />
├── <DataConnectorsPanel />
└── <AdminDashboard />

📁 Libraries
├── DocumentProcessor  → Parse documents
├── CharterAnalyzer   → Analyze breaches
├── RAGEngine        → Vector search
└── DataConnectors   → Enterprise sync

📁 Documentation
├── README.md              → Overview
├── API_DOCUMENTATION.md   → API Reference
├── DEPLOYMENT_GUIDE.md    → Setup & Deploy
├── PROJECT_SUMMARY.md     → What was built
└── QUICK_START.md         → This file
```

---

## 🔧 Configuration Quick Reference

### Environment Variables (.env.local)

**Database**
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/lexisai
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyxxxxx
```

**AI Services**
```bash
OPENAI_API_KEY=sk-xxxxx
OPENAI_ORG_ID=org-xxxxx
```

**Data Connectors**
```bash
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

**Monitoring**
```bash
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
POSTHOG_API_KEY=phc_xxxxx
```

---

## 🎯 API Quick Reference

### Process Document
```bash
curl -X POST http://localhost:3000/api/documents/process \
  -F "file=@document.pdf" \
  -F "caseId=CASE-2024-001" \
  -F "charterAnalysis=true"
```

### Semantic Search
```bash
curl -X POST http://localhost:3000/api/search/semantic \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Charter s.8 breach",
    "topK": 5,
    "searchType": "hybrid"
  }'
```

### Charter Analysis
```bash
curl -X POST http://localhost:3000/api/analysis/charter \
  -H "Content-Type: application/json" \
  -d '{
    "documentText": "...",
    "caseContext": {
      "case_id": "CASE-001",
      "province": "Ontario",
      "court": "Superior Court"
    }
  }'
```

### List Connectors
```bash
curl http://localhost:3000/api/connectors
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port
PORT=3001 npm run dev

# Or kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Error
```bash
# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Build Fails
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### Document Processing Slow
```bash
# Check memory usage
node --max-old-space-size=4096 node_modules/next/dist/bin/next dev

# Process fewer documents
# Increase server resources
```

---

## 📞 Support Resources

- **Documentation**: https://docs.lexisai.legal
- **GitHub Issues**: https://github.com/lexisai/platform/issues
- **API Docs**: See `API_DOCUMENTATION.md` in project root
- **Deployment Help**: See `DEPLOYMENT_GUIDE.md`

---

## 🚀 Next Steps After Setup

1. **Configure Database** → See `DEPLOYMENT_GUIDE.md` Database Setup section
2. **Add Data Connectors** → Configure credentials for cloud sources
3. **Upload Sample Documents** → Test document processing pipeline
4. **Run Charter Analysis** → Analyze sample case files
5. **Deploy to Production** → Choose hosting option and deploy

---

## ⭐ Pro Tips

- **Demo Mode**: Use mock data - no database needed initially
- **Local Testing**: Document processor works client-side for demo
- **Performance**: Enable browser caching for faster development
- **Mobile**: Responsive design works on tablets and phones
- **Keyboard Shortcuts**: Enter key submits forms, Escape closes modals

---

## 📊 System Health Check

Visit `/api/health` to check system status:
```bash
curl http://localhost:3000/api/health

# Returns:
{
  "status": "healthy",
  "uptime": 1234.56,
  "database": "connected",
  "vectorStore": "operational",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🎓 Learning Resources

### For Developers
- Next.js App Router: https://nextjs.org/docs
- TypeScript: https://typescriptlang.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Shadcn/ui: https://ui.shadcn.com/docs

### For Legal Users
- Canadian Charter: https://laws-lois.justice.gc.ca/eng/const/page-12.html
- Court Forms: Check provincial government websites
- Legal Research: Check CanLII.org

### For DevOps
- Vercel Deployment: https://vercel.com/docs
- Docker: https://docs.docker.com
- PostgreSQL: https://www.postgresql.org/docs

---

**Last Updated**: January 15, 2024  
**Version**: 1.0.0  
**Status**: Production Ready

Happy building! 🚀
