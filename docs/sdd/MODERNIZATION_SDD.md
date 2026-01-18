# Software Design Document: Job-Harmony Modernization

**Version:** 1.0.0
**Author:** Daniel Hernandez
**Created:** January 2026
**Status:** Draft - Awaiting Review

---

## 1. Executive Summary

This document outlines the modernization strategy for Job-Harmony, upgrading from 2019-era technologies to current LTS versions while adopting Tailwind v4 and Shadcn for styling.

### Current State
- **Node.js:** 12.7.0 (EOL)
- **React:** 16.9.0 (Legacy)
- **Build Tool:** Create React App 3.1.1 (Deprecated)
- **Styling:** CSS/SCSS
- **State Management:** Redux 4 + Thunk
- **Database:** MongoDB with Mongoose 5

### Target State
- **Node.js:** 22.x LTS
- **React:** 19.x
- **Build Tool:** Vite 6.x
- **Styling:** Tailwind CSS v4 + Shadcn
- **State Management:** Redux Toolkit or Zustand
- **Database:** MongoDB with Mongoose 8.x

---

## 2. Current Technology Audit

### Backend (Root package.json)

| Package | Current | LTS/Latest | Action | Breaking Changes |
|---------|---------|------------|--------|------------------|
| Node.js | 12.7.0 | 22.x | **Upgrade** | Major - async/ESM changes |
| express | 4.17.1 | 4.21.x | Upgrade | Minor |
| mongoose | 5.7.1 | 8.x | **Upgrade** | Major - query API changes |
| bcryptjs | 2.4.3 | 2.4.3 | Keep | None |
| jsonwebtoken | 8.5.1 | 9.x | Upgrade | Minor - algorithm defaults |
| passport | 0.4.0 | 0.7.x | Upgrade | Minor |
| passport-jwt | 4.0.0 | 4.0.1 | Keep | None |
| validator | 11.1.0 | 13.x | Upgrade | Minor |
| body-parser | 1.19.0 | Deprecated | **Remove** | Use express.json() |
| faker | 4.1.0 | Deprecated | **Replace** | Use @faker-js/faker |
| concurrently | 4.1.2 | 9.x | Upgrade | Minor |
| nodemon | 1.19.2 | 3.x | Upgrade | None |

### Frontend (frontend/package.json)

| Package | Current | LTS/Latest | Action | Breaking Changes |
|---------|---------|------------|--------|------------------|
| react | 16.9.0 | 19.x | **Upgrade** | Major - Hooks, Concurrent |
| react-dom | 16.9.0 | 19.x | **Upgrade** | Major |
| react-scripts | 3.1.1 | Deprecated | **Replace with Vite** | Major - Build config |
| react-router-dom | 5.0.1 | 7.x | **Upgrade** | Major - API changes |
| redux | 4.0.4 | 5.x | Upgrade | Minor |
| react-redux | 7.1.1 | 9.x | **Upgrade** | Major - hooks required |
| redux-thunk | 2.3.0 | 3.x | Upgrade or **Replace** | Consider RTK |
| redux-logger | 3.0.6 | 3.0.6 | Keep | None |
| axios | 0.19.0 | 1.7.x | **Upgrade** | Major - interceptors |
| jwt-decode | 2.2.0 | 4.x | **Upgrade** | Major - ESM only |

### New Dependencies to Add

| Package | Version | Purpose |
|---------|---------|---------|
| tailwindcss | 4.x | Styling |
| @shadcn/ui | latest | Component library |
| vite | 6.x | Build tool |
| @vitejs/plugin-react | 5.x | React plugin for Vite |
| typescript | 5.9.x | Type safety |
| vitest | 2.x | Testing |
| @testing-library/react | 16.x | Component testing |

---

## 3. Migration Strategy

### Phase 1: Backend Modernization (PR #1)
**Scope:** Node.js, Express, and database layer updates
**Breaking Changes:** Minimal - API contract unchanged

#### Steps:
1. Update `engines` in package.json to Node 22.x
2. Replace `body-parser` with `express.json()`
3. Upgrade Express to 4.21.x
4. Upgrade Mongoose to 8.x
   - Update query syntax (no more callbacks)
   - Update connection string format
5. Replace `faker` with `@faker-js/faker`
6. Upgrade `jsonwebtoken` to 9.x
7. Upgrade `passport` to 0.7.x
8. Add TypeScript support (optional, recommended)

#### Mongoose 8 Migration Notes:
```javascript
// OLD (Mongoose 5)
User.findOne({ email }, callback);

// NEW (Mongoose 8)
const user = await User.findOne({ email });
```

---

### Phase 2: Frontend Build System (PR #2)
**Scope:** Replace CRA with Vite, add TypeScript
**Breaking Changes:** Build configuration only

#### Steps:
1. Create new Vite project structure
2. Move components to new structure
3. Configure Vite for React
4. Add TypeScript configuration
5. Update import paths
6. Remove react-scripts
7. Update npm scripts

#### New Project Structure:
```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── store/
│   ├── services/
│   ├── types/
│   └── main.tsx
├── public/
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

---

### Phase 3: React & Router Upgrade (PR #3)
**Scope:** React 19, React Router 7
**Breaking Changes:** Component patterns, routing API

#### React 19 Migration:
```jsx
// No changes needed for most components
// New features available: Actions, use() hook
```

#### React Router 7 Migration:
```jsx
// OLD (v5)
import { Switch, Route } from 'react-router-dom';
<Switch>
  <Route path="/login" component={Login} />
</Switch>

// NEW (v7)
import { Routes, Route } from 'react-router-dom';
<Routes>
  <Route path="/login" element={<Login />} />
</Routes>
```

---

### Phase 4: State Management (PR #4)
**Scope:** Migrate Redux to Redux Toolkit or Zustand
**Breaking Changes:** Store configuration, action patterns

#### Option A: Redux Toolkit (Recommended for existing Redux)
```typescript
// OLD
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
  }
};

// NEW (RTK)
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});
```

#### Option B: Zustand (Simpler alternative)
```typescript
const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

**Recommendation:** Redux Toolkit - less migration effort

---

### Phase 5: Styling Migration (PR #5)
**Scope:** Replace CSS/SCSS with Tailwind v4 + Shadcn
**Breaking Changes:** All component styles

#### Steps:
1. Install Tailwind v4 and configure
2. Install Shadcn CLI and initialize
3. Add base Shadcn components
4. Migrate components one by one
5. Remove old CSS files

#### Tailwind v4 Configuration:
```typescript
// tailwind.config.ts
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

#### Component Migration Example:
```jsx
// OLD
<button className="login-button">Login</button>
// .login-button { background: blue; padding: 10px; }

// NEW (Shadcn)
import { Button } from '@/components/ui/button';
<Button variant="default">Login</Button>
```

---

### Phase 6: Testing Infrastructure (PR #6)
**Scope:** Add Vitest, React Testing Library
**Breaking Changes:** None

#### Configuration:
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      thresholds: { global: { lines: 85 } },
    },
  },
});
```

---

## 4. Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Mongoose 8 query breaks | High | Medium | Comprehensive testing |
| React Router API changes | Medium | High | Incremental migration |
| Build time regressions | Low | Low | Vite is faster |
| Styling inconsistencies | Medium | Medium | Component-by-component migration |
| MongoDB connection issues | High | Low | Test with staging DB |

---

## 5. Dependencies & Prerequisites

### Development Environment
- Node.js 22.x LTS installed
- MongoDB 6.x+ available
- pnpm or npm 10.x

### External Dependencies
- MongoDB Atlas cluster (existing or new)
- Environment variables configured

---

## 6. Success Criteria

- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Lighthouse performance score > 90
- [ ] Bundle size < 500KB
- [ ] 85% test coverage
- [ ] All features functional

---

## 7. Rollback Plan

Each PR can be reverted independently. If critical issues arise:
1. Revert the specific PR
2. Document the issue
3. Fix in a new branch
4. Re-attempt migration

---

## 8. Timeline Estimate

| Phase | Estimated Effort |
|-------|------------------|
| Phase 1: Backend | 4-6 hours |
| Phase 2: Build System | 6-8 hours |
| Phase 3: React/Router | 4-6 hours |
| Phase 4: State Management | 4-6 hours |
| Phase 5: Styling | 8-12 hours |
| Phase 6: Testing | 4-6 hours |
| **Total** | **30-44 hours** |

---

## 9. Open Questions for Review

1. **State Management:** Redux Toolkit or Zustand?
2. **MongoDB:** Keep Atlas or switch to local Docker?
3. **TypeScript:** Strict mode from start or gradual?
4. **Testing:** Unit-first or E2E-first approach?
