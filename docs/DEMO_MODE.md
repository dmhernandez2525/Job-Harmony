# Demo Mode

Job-Harmony supports an environment-based demo mode that allows showcasing the application without requiring authentication or a live database.

## Overview

When demo mode is enabled, users can experience the full application functionality using mock data. This is useful for:
- Portfolio demonstrations
- Quick feature showcases
- Development/testing without backend dependencies

## Architecture

```
Marketing Pages (/)
    |
    v
Auth Modal (Login/Signup)
    |
    |-- VITE_DEMO_MODE=false --> Real Auth (MongoDB + JWT)
    |
    +-- VITE_DEMO_MODE=true  --> Demo Role Selector
                                    |
                                    v
                              Demo Experience
                              (/demo/*, /demo/employer/*)
```

## Environment Variable

```env
# Enable demo mode
VITE_DEMO_MODE=true

# Disable demo mode (default)
VITE_DEMO_MODE=false
```

## Demo Roles

### Job Seeker (Candidate)
- Browse curated job listings
- Swipe to express interest in jobs
- View matches with employers
- Track application status
- Manage resume and profile

### Employer
- View incoming applications
- Review candidate profiles
- Track matched candidates
- Manage job listings

## Demo Routes

### Job Seeker Routes
| Route | Description |
|-------|-------------|
| `/demo` | Main job browsing page |
| `/demo/matches` | View job matches |
| `/demo/applications` | Track applications |
| `/demo/profile` | View/edit profile |
| `/demo/resume` | View/edit resume |

### Employer Routes
| Route | Description |
|-------|-------------|
| `/demo/employer` | Employer dashboard |
| `/demo/employer/applications` | Review received applications |
| `/demo/employer/candidates` | Browse candidate pool |

## Demo Data

Demo data is stored in `/frontend/src/demo/demoData.js` and includes:

- **Mock Users**: Job seeker and employer profiles
- **Job Listings**: 6 sample tech job listings
- **Applications**: Sample application statuses
- **Matches**: Pre-populated match data
- **Candidates**: Sample candidate profiles for employer view

## Implementation Details

### Key Files
- `frontend/src/demo/DemoContext.jsx` - Demo state management
- `frontend/src/demo/demoData.js` - Mock data definitions
- `frontend/src/demo/components/` - Demo-specific UI components
- `frontend/src/demo/pages/` - Demo page components

### Context Provider

The `DemoProvider` wraps the entire app and provides:
- `isDemoMode` - Whether demo mode is active
- `isEnvDemoMode` - Whether VITE_DEMO_MODE is set
- `demoRole` - Current selected role (candidate/employer)
- `selectRole(role)` - Function to select a demo role
- `exitDemo()` - Function to exit demo mode

### Modal Integration

When demo mode is enabled, the login/signup modal automatically shows the DemoRoleSelector instead of the real auth forms.

## Local Development

```bash
# Run with demo mode enabled
VITE_DEMO_MODE=true npm run dev

# Run with demo mode disabled (real auth)
npm run dev
```

## Render Deployment

Demo mode is enabled by default on Render via `render.yaml`:

```yaml
envVars:
  - key: VITE_DEMO_MODE
    value: "true"
```

To disable demo mode in production, either:
1. Remove or set `VITE_DEMO_MODE` to `"false"` in render.yaml
2. Override in Render Dashboard > Service > Environment

## Testing Demo Mode

```bash
# Verify demo works without backend
unset VITE_API_URL
VITE_DEMO_MODE=true npm run dev
```

Navigate to the app, click Login/Signup, and you should see the role selector instead of auth forms.
