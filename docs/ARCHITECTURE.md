# Job Harmony - Architecture

**Version:** 1.0.0
**Last Updated:** January 2026

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │   React     │  │    Redux     │  │    Passport JWT     │ │
│  │   Router    │  │    Thunk     │  │   Authentication    │ │
│  └──────┬──────┘  └──────┬───────┘  └─────────────────────┘ │
│         │                │                                   │
│         └────────────────┼───────────────────────────────────┤
│                          │                                   │
│                    HTTP/REST API                             │
└──────────────────────────┼───────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                  BACKEND (Express)                           │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │   Routes    │  │   Passport   │  │     Validation      │ │
│  │   Layer     │  │  Middleware  │  │     Middleware      │ │
│  └──────┬──────┘  └──────────────┘  └─────────────────────┘ │
│         │                                                    │
└─────────┼────────────────────────────────────────────────────┘
          │
   ┌──────┴──────┐
   │  MongoDB    │
   │  (Atlas)    │
   └─────────────┘
```

---

## Data Models

### User
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  userType: 'jobseeker' | 'employer',
  createdAt: Date
}
```

### Resume
```javascript
{
  user: ObjectId,
  skills: [String],
  experience: [Object],
  education: [Object],
  location: Object
}
```

### OnePage (Job Posting)
```javascript
{
  employer: ObjectId,
  title: String,
  description: String,
  requirements: [String],
  salary: Object,
  location: Object
}
```

### Like / Match
```javascript
{
  fromUser: ObjectId,
  toItem: ObjectId,
  itemType: 'resume' | 'onepage',
  createdAt: Date
}
```

---

## Directory Structure

```
Job-Harmony/
├── frontend/               # React application
│   ├── src/
│   │   ├── actions/        # Redux actions
│   │   ├── reducers/       # Redux reducers
│   │   ├── components/     # React components
│   │   ├── util/           # API utilities
│   │   └── store/          # Redux store
│   └── package.json
├── routes/api/             # Express routes
│   ├── users.js
│   ├── resumes.js
│   ├── onePages.js
│   ├── likes.js
│   ├── matches.js
│   └── preferences.js
├── models/                 # Mongoose models
├── validations/            # Input validation
├── config/                 # Configuration
├── docs/                   # Documentation
└── package.json
```

---

## Matching Algorithm

```
1. User (Seeker/Employer) swipes right on profile
2. Like is recorded in database
3. Check if mutual like exists
4. If mutual: Create Match, notify both parties
5. Match enables direct messaging
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register user |
| POST | `/api/users/login` | Login |
| GET | `/api/resumes` | Get resumes |
| POST | `/api/likes` | Create like |
| GET | `/api/matches` | Get matches |
