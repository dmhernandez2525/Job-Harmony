# Competitive Research Prompt: Job-Harmony

## Instructions for Research Agent

You are conducting competitive research to build a comprehensive feature backlog for **Job-Harmony**, a job search and career management platform. Your goal is to identify 200-500+ features by analyzing competitors and industry best practices.

---

## Project Overview

**Job-Harmony** is a full-stack job search platform that helps users:
- Search and apply for jobs
- Track job applications and interview progress
- Manage resumes and cover letters
- Connect with recruiters and employers

**Current Tech Stack:**
- Frontend: React (upgrading to 19.x)
- Backend: Node.js/Express, MongoDB
- State: Redux
- Auth: JWT + Passport

---

## Research Categories

Analyze competitors and identify features in these categories:

### 1. Job Search & Discovery
- Search functionality (filters, saved searches, alerts)
- Job recommendations (AI-powered, preference-based)
- Company profiles and reviews
- Salary information and comparison
- Remote/hybrid job filtering

### 2. Application Management
- Application tracking (kanban, list, calendar views)
- Status updates and reminders
- Application analytics (success rates, patterns)
- Auto-fill applications
- Application templates

### 3. Resume & Profile
- Resume builder with templates
- AI resume optimization
- ATS compatibility checking
- Multiple resume versions
- Cover letter generator
- LinkedIn import/export

### 4. Interview Preparation
- Interview scheduling integration
- Interview question database
- Mock interview tools
- Company research aggregation
- Interview feedback tracking

### 5. Networking Features
- Recruiter messaging
- Company following
- Alumni connections
- Referral tracking
- Network analytics

### 6. Career Development
- Skill gap analysis
- Learning recommendations
- Career path visualization
- Salary negotiation tools
- Industry trend insights

### 7. Notifications & Alerts
- New job alerts
- Application deadline reminders
- Interview reminders
- Recruiter activity alerts
- Market trend notifications

### 8. Analytics & Insights
- Application success rates
- Time-to-response metrics
- Market demand analysis
- Personal progress tracking
- Competitive benchmarking

### 9. Integrations
- LinkedIn integration
- Google Calendar sync
- Email integration (Gmail, Outlook)
- Job board aggregation (Indeed, Glassdoor, etc.)
- ATS integrations

### 10. Mobile Experience
- Progressive Web App
- Mobile app features
- Push notifications
- Offline capability

---

## Competitors to Analyze

### Primary Competitors (Job Platforms)
1. **LinkedIn Jobs** - Professional network + job platform
2. **Indeed** - Job aggregator and application platform
3. **Glassdoor** - Company reviews + job listings
4. **ZipRecruiter** - AI-powered job matching
5. **Hired** - Tech-focused job marketplace

### Application Trackers
6. **Huntr** - Job application tracker
7. **Teal** - Job search + resume builder
8. **JobScan** - ATS optimization tool
9. **Careerflow** - All-in-one career platform
10. **Simplify** - Auto-fill applications

### Resume Builders
11. **Resume.io** - Modern resume builder
12. **Canva** - Design-focused resumes
13. **Novoresume** - ATS-friendly templates
14. **Kickresume** - AI resume writer

### Career Platforms
15. **The Muse** - Career advice + jobs
16. **Handshake** - College career platform
17. **AngelList/Wellfound** - Startup jobs
18. **Built In** - Tech job platform

---

## Output Format

Provide your research in this format:

### Feature Backlog Structure

```markdown
## Category X: [Category Name] (X features)

### P0 - Critical (MVP Required)
| ID | Feature | Description | Effort | Competitors |
|----|---------|-------------|--------|-------------|
| FX.X.X | Feature Name | What it does | Low/Med/High | LinkedIn, Indeed |

### P1 - High Priority (Competitive Parity)
[Same table format]

### P2 - Medium Priority (Differentiation)
[Same table format]

### P3 - Future (Nice to Have)
[Same table format]
```

### Priority Definitions
- **P0 Critical**: Core features needed for MVP launch
- **P1 High**: Features that major competitors all have
- **P2 Medium**: Features that differentiate from competitors
- **P3 Future**: Advanced features for long-term roadmap

### Effort Definitions
- **Low**: 1-2 days implementation
- **Medium**: 3-5 days implementation
- **High**: 1-2 weeks implementation

---

## Research Questions to Answer

1. What features do ALL major job platforms have? (P0/P1 candidates)
2. What unique features differentiate the top 3 platforms?
3. What are users complaining about on existing platforms? (Opportunity areas)
4. What emerging trends in job search technology should we consider?
5. What AI/ML features are competitors implementing?
6. What integrations are most requested by users?
7. What mobile-specific features are important?
8. What accessibility features are required/recommended?

---

## Expected Deliverable

A comprehensive FEATURE_BACKLOG.md file with:
- 200-500 features organized by category
- Priority levels (P0-P3) for each feature
- Effort estimates
- Competitor references
- Phase recommendations (which quarter to build)

Reference the SpecTree FEATURE_BACKLOG.md format for structure inspiration.
