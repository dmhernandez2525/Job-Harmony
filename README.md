# Job Harmony

A job matching application inspired by dating apps, connecting job seekers with employers through mutual interest-based matching.

---

## Overview

Job Harmony reimagines the job search experience by removing initial bias from the hiring process. Employers and job seekers are matched based purely on qualifications, skills, and job requirements - no names or photos until both parties express mutual interest.

### Key Features

- **Anonymous Matching**: Initial profiles show only qualifications and job requirements
- **Two-Way Interest**: Both employers and job seekers must "like" each other to match
- **Resume Builder**: Job seekers create structured, searchable resumes
- **Job Listings**: Employers create "One Pages" with job details
- **Match Notifications**: Instant alerts when mutual interest is detected
- **Messaging**: Direct communication after matching

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 16, Redux, React Router |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT, bcrypt |
| Styling | CSS3, SCSS |

---

## Project Structure

```
Job-Harmony/
├── frontend/               # React application
│   ├── src/
│   │   ├── actions/        # Redux action creators
│   │   ├── components/     # React components
│   │   ├── reducers/       # Redux reducers
│   │   ├── store/          # Redux store configuration
│   │   └── util/           # API utilities
├── models/                 # Mongoose schemas
├── routes/                 # Express API routes
│   └── api/
├── validation/             # Input validation
├── config/                 # Database & environment config
├── docs/                   # Documentation
└── app.js                  # Express server entry
```

---

## Getting Started

### Prerequisites

- Node.js 12.x or higher
- MongoDB (local or Atlas cluster)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Job-Harmony.git
cd Job-Harmony

# Install dependencies
npm install

# Set up environment variables
cp config/keys_dev.example.js config/keys_dev.js
# Edit keys_dev.js with your MongoDB URI and JWT secret
```

### Running the Application

```bash
# Development mode (with nodemon)
npm run dev

# Frontend development
npm run frontend

# Both together
npm run start-dev
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | Login user |

### Resumes (Job Seekers)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resumes` | Get all resumes |
| POST | `/api/resumes` | Create resume |
| GET | `/api/resumes/:id` | Get resume by ID |

### One Pages (Employers)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/onepages` | Get all job listings |
| POST | `/api/onepages` | Create job listing |
| GET | `/api/onepages/:id` | Get listing by ID |

### Matches
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/matches` | Create match |
| GET | `/api/matches/user/:id` | Get user's matches |
| DELETE | `/api/matches/:id` | Remove match |

---

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](./docs/ARCHITECTURE.md) | System design and patterns |
| [Roadmap](./docs/ROADMAP.md) | Modernization backlog |
| [Coding Standards](./docs/CODING_STANDARDS.md) | Code style guidelines |

---

## Status

**Current State**: Requires modernization

This project was built in 2019 as a group project. It requires:
- MongoDB Atlas cluster recreation
- Node.js dependency updates
- React modernization (16 → 18)
- Testing infrastructure setup

See [ROADMAP.md](./docs/ROADMAP.md) for detailed modernization plan.

---

## Original Team

- Daniel Hernandez
- Chas
- Luke
- Donnie

---

## License

MIT License
