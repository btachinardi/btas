# Bruno Tachinardi -- Portfolio & Professional Hub

## Overview

Personal portfolio and professional tooling for Bruno Tachinardi, a Software Engineer & Technical Founder with 15+ years of experience across healthcare, AI, and enterprise applications. Built with React + Vite + TypeScript, deployed on Vercel.

**Live site**: [btachinardi.com](https://btachinardi.com)

## Architecture

```
App.tsx (React Router)
├── /* ............... Portfolio (public site)
│   ├── /cv .......... CV viewer + PDF download
│   └── /cover-letter  Cover letter + PDF download
└── /dashboard/* ..... Internal command center
    ├── / ............ Mission Overview
    ├── /research .... Research Hub (5 tabs, 8 visualizations)
    ├── /pipeline .... Job Pipeline (Kanban)
    ├── /training .... Training Module (Monaco editor, sandboxed execution)
    ├── /brand ....... Brand Assets (placeholder)
    ├── /analytics ... Analytics (placeholder)
    └── /actions ..... Action Center
```

### Key Directories

| Path | Purpose |
|------|---------|
| `data/portfolio.json` | Structured portfolio data (experiences, awards, education, skills) |
| `data/translations/{en,pt,es}.json` | Translation files (key-based system) |
| `types/portfolio-data.types.ts` | TypeScript type definitions for portfolio data |
| `data/research-data.ts` | Job search strategy data (platforms, metrics, roadmap) |
| `data/training-problems.ts` | 11 coding challenge problems |
| `contexts/` | React contexts (dashboard state, React Query provider) |
| `components/dashboard/` | Dashboard layout components |
| `components/research/` | 8 research visualization components |
| `components/training/` | 7 training module components |
| `src/api/` | Pomy API layer (React Query hooks, mock/real switching) |
| `scripts/email/` | Gmail CLI (OAuth, sync, send, reply, attachments) |
| `scripts/jobs/` | SQLite job tracking (schema, CRUD, seed) |
| `scripts/pdf/` | PDF generation helper |

### Translation System

The portfolio uses a key-based translation system:
- `portfolio.json` contains data with translation keys (e.g., `"profile.title"`)
- `translations/{locale}.json` contains actual text per locale
- Document variants: `cv`, `coverLetter`, `portfolio` -- use `cv` variant for LinkedIn
- Supported locales: `en` (primary), `pt`, `es`

## Commands

```bash
pnpm dev              # Dev server on port 3000
pnpm build            # Production build
pnpm preview          # Preview production build
pnpm type-check       # TypeScript validation
pnpm lint             # ESLint

pnpm email auth       # Gmail OAuth setup
pnpm email sync       # Sync emails from Gmail
pnpm email list       # List emails
pnpm email send       # Send email (--to, --subject, --body, --signature, --attachment)
pnpm email reply      # Reply to email

node scripts/jobs/seed.mjs      # Seed job database
node scripts/pdf/generate.mjs cv  # PDF generation
```

## Current Status

### Complete
- Portfolio site (deployed, multilingual en/pt/es)
- Dashboard with 6 views (Mission, Research, Pipeline, Training, Actions + 2 placeholders)
- Training module (11 problems, Monaco editor, sandboxed execution, localStorage sessions)
- Research hub (8 visualization components, data-driven)
- Job pipeline (6-column Kanban, mock data)
- Job database (SQLite with full CRUD)
- Email CLI (Gmail OAuth, sync, send, reply, attachments, signature)
- PDF generation (CV + cover letter)
- Pomy API layer (18 React Query hooks, mock/real switching)

### Pending
- Brand Assets and Analytics pages (placeholders)
- Dashboard real data integration (currently all mock)
- Production build optimization for Vercel

## Available Agents

### Email Management

CLI tool at `scripts/email/cli.mjs` for managing brunotachinardi@gmail.com.

**Capabilities**: Sync/read Gmail, prioritize and summarize emails, send with HTML signature, reply with threading, track AI processing status.

**Priority levels**: URGENT (5), IMPORTANT (4), NORMAL (3), LOW (1-2)

**Safety rules**:
1. NEVER send emails without explicit user confirmation
2. Always present draft before sending
3. Plain text (`--body`) is safer; for complex HTML, create a dedicated `.mjs` script
4. NEVER add backslashes before punctuation in email HTML
5. Test emails before sending to final recipients

**Prerequisites**: OAuth credentials in `data/email/credentials.json`, run `pnpm email auth` first.

### LinkedIn Sync

Skill at `.claude/skills/linkedin-sync.md` for synchronizing portfolio data with LinkedIn via browser automation.

**Prerequisites**: User must be logged into LinkedIn in Chrome; Chrome MCP tools must be enabled. All edit operations require explicit user confirmation.

## CV and Cover Letter PDF Generation

**Always generate a fresh PDF before sending via email.**

**Option 1 -- Browser automation (recommended)**:
1. Ensure dev server is running (`pnpm dev`)
2. Navigate to `http://localhost:3000/cv` or `/cover-letter`
3. Click "Download PDF"

**Option 2 -- CLI helper**:
```bash
node scripts/pdf/generate.mjs cv
node scripts/pdf/generate.mjs cover-letter
```

**Sending workflow**:
1. Generate fresh PDF
2. Copy to `references/`
3. Send: `pnpm email send --to <email> --subject <subj> --body <text> --signature --attachment <path>`

**PDF locations**:
- Downloads: `~/Downloads/Bruno_Tachinardi_CV*.pdf`
- Reference: `references/Bruno_Tachinardi_CV_EN_Latest.pdf`
