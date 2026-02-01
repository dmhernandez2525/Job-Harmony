// Demo data for showcasing Job-Harmony features without authentication

// Check if demo mode is enabled via environment variable
export const isDemoModeEnabled = () => {
  return import.meta.env.VITE_DEMO_MODE === 'true';
};

// Demo user for Candidate/Job-Seeker role
export const demoCandidateUser = {
  id: 'demo-candidate-1',
  email: 'candidate@jobharmony.demo',
  fName: 'Alex',
  lName: 'Demo',
  role: 'Job-Seeker',
  zipCode: '10001',
  date: new Date().toISOString(),
  resume: [],
  preference: {
    jobField: 'Technology',
    location: 'Remote',
    salary: '120000'
  },
  pendingOnePages: []
};

// Demo user for Employer role
export const demoEmployerUser = {
  id: 'demo-employer-1',
  email: 'employer@jobharmony.demo',
  fName: 'Sarah',
  lName: 'Hiring',
  role: 'Employer',
  companyName: 'TechVentures Inc.',
  zipCode: '94102',
  date: new Date().toISOString(),
  jobListings: [],
  pendingOnePages: []
};

// Legacy export for backward compatibility
export const demoUser = demoCandidateUser;

export const demoResume = {
  _id: 'demo-resume-1',
  userId: 'demo-user-1',
  jobHistory: 'Senior Software Engineer at TechCorp (2020-2024)\nFull Stack Developer at StartupXYZ (2018-2020)\nJunior Developer at WebAgency (2016-2018)',
  jobField: 'Technology',
  jobSkills: 'JavaScript, React, Node.js, TypeScript, Python, AWS, Docker, PostgreSQL, MongoDB, Git'
};

export const demoJobListings = [
  {
    _id: 'demo-job-1',
    userId: 'employer-1',
    companyName: 'TechVentures Inc.',
    jobTitle: 'Senior Frontend Developer',
    jobField: 'Technology',
    jobSkills: 'React, TypeScript, GraphQL, CSS, Testing',
    description: 'Join our innovative team to build next-generation web applications. You will work on cutting-edge projects with modern technologies and collaborate with talented engineers.',
    type: 'Full Time',
    remote: true,
    benefits: 'Health insurance, 401k matching, unlimited PTO, equity options, learning budget',
    startingPay: '150000',
    catchPhrase: 'Build the future with us'
  },
  {
    _id: 'demo-job-2',
    userId: 'employer-2',
    companyName: 'DataDriven Solutions',
    jobTitle: 'Full Stack Engineer',
    jobField: 'Technology',
    jobSkills: 'Node.js, React, PostgreSQL, Docker, AWS',
    description: 'We are looking for a passionate full stack engineer to help scale our data analytics platform. Work on challenging problems and make a real impact.',
    type: 'Full Time',
    remote: true,
    benefits: 'Comprehensive health coverage, remote-first culture, annual bonus, stock options',
    startingPay: '140000',
    catchPhrase: 'Data-driven decisions, data-driven careers'
  },
  {
    _id: 'demo-job-3',
    userId: 'employer-3',
    companyName: 'HealthTech Innovations',
    jobTitle: 'React Native Developer',
    jobField: 'Technology',
    jobSkills: 'React Native, JavaScript, TypeScript, Mobile Development, REST APIs',
    description: 'Help us revolutionize healthcare through mobile technology. Build apps that improve lives and make healthcare more accessible.',
    type: 'Full Time',
    remote: false,
    benefits: 'Medical, dental, vision, gym membership, flexible hours, paid parental leave',
    startingPay: '135000',
    catchPhrase: 'Technology that heals'
  },
  {
    _id: 'demo-job-4',
    userId: 'employer-4',
    companyName: 'FinanceFlow',
    jobTitle: 'Backend Developer',
    jobField: 'Technology',
    jobSkills: 'Python, Django, PostgreSQL, Redis, Microservices',
    description: 'Join our fintech startup and help build secure, scalable payment systems. Work with a team of experts in a fast-paced environment.',
    type: 'Full Time',
    remote: true,
    benefits: 'Competitive salary, equity, 401k, health insurance, annual team retreats',
    startingPay: '145000',
    catchPhrase: 'Making finance flow'
  },
  {
    _id: 'demo-job-5',
    userId: 'employer-5',
    companyName: 'GreenEnergy Tech',
    jobTitle: 'DevOps Engineer',
    jobField: 'Technology',
    jobSkills: 'Kubernetes, Terraform, AWS, CI/CD, Linux, Docker',
    description: 'Help us build infrastructure for a sustainable future. We are looking for a DevOps engineer to manage our cloud infrastructure and deployment pipelines.',
    type: 'Full Time',
    remote: true,
    benefits: 'Full benefits package, remote work, carbon offset program, education stipend',
    startingPay: '155000',
    catchPhrase: 'Engineering a greener tomorrow'
  },
  {
    _id: 'demo-job-6',
    userId: 'employer-6',
    companyName: 'Creative Digital Agency',
    jobTitle: 'UI/UX Developer',
    jobField: 'Technology',
    jobSkills: 'React, CSS, Figma, JavaScript, Animation, Design Systems',
    description: 'Create beautiful, intuitive user experiences for our clients. Collaborate with designers and developers to bring creative visions to life.',
    type: 'Part Time',
    remote: true,
    benefits: 'Flexible schedule, creative freedom, portfolio projects, networking opportunities',
    startingPay: '75000',
    catchPhrase: 'Where creativity meets code'
  }
];

export const demoLikedJobs = [
  demoJobListings[0], // TechVentures - Senior Frontend Developer
  demoJobListings[1], // DataDriven - Full Stack Engineer
];

export const demoMatches = [
  {
    _id: 'demo-match-1',
    jobListing: demoJobListings[0],
    matchScore: 95,
    matchedSkills: ['React', 'TypeScript', 'CSS', 'Testing'],
    status: 'mutual_interest'
  },
  {
    _id: 'demo-match-2',
    jobListing: demoJobListings[1],
    matchScore: 88,
    matchedSkills: ['Node.js', 'React', 'PostgreSQL', 'Docker'],
    status: 'employer_interested'
  }
];

export const demoApplications = [
  {
    _id: 'demo-app-1',
    jobListing: demoJobListings[0],
    status: 'interview_scheduled',
    appliedDate: '2024-01-15',
    interviewDate: '2024-01-25',
    notes: 'Technical interview with the frontend team'
  },
  {
    _id: 'demo-app-2',
    jobListing: demoJobListings[2],
    status: 'application_reviewed',
    appliedDate: '2024-01-10',
    notes: 'Application under review by hiring manager'
  },
  {
    _id: 'demo-app-3',
    jobListing: demoJobListings[4],
    status: 'pending',
    appliedDate: '2024-01-18',
    notes: 'Application submitted'
  }
];

// --- Employer Demo Data ---

// Candidates that have applied to the employer's job listings
export const demoCandidates = [
  {
    _id: 'candidate-1',
    fName: 'Jordan',
    lName: 'Smith',
    email: 'jordan.smith@email.com',
    resume: {
      jobHistory: 'Software Engineer at Google (2021-2024)\nJunior Developer at Startup (2019-2021)',
      jobField: 'Technology',
      jobSkills: 'React, TypeScript, Node.js, GraphQL, AWS'
    },
    matchScore: 92
  },
  {
    _id: 'candidate-2',
    fName: 'Morgan',
    lName: 'Chen',
    email: 'morgan.chen@email.com',
    resume: {
      jobHistory: 'Full Stack Developer at Amazon (2020-2024)\nWeb Developer at Agency (2018-2020)',
      jobField: 'Technology',
      jobSkills: 'JavaScript, React, Python, PostgreSQL, Docker'
    },
    matchScore: 87
  },
  {
    _id: 'candidate-3',
    fName: 'Taylor',
    lName: 'Johnson',
    email: 'taylor.j@email.com',
    resume: {
      jobHistory: 'Frontend Engineer at Meta (2022-2024)\nUI Developer at Design Studio (2020-2022)',
      jobField: 'Technology',
      jobSkills: 'React, Vue, CSS, Figma, TypeScript'
    },
    matchScore: 85
  }
];

// Applications received by the employer
export const demoReceivedApplications = [
  {
    _id: 'recv-app-1',
    candidate: demoCandidates[0],
    jobListing: demoJobListings[0],
    status: 'interview_scheduled',
    appliedDate: '2024-01-12',
    interviewDate: '2024-01-22',
    notes: 'Strong candidate, scheduled technical interview'
  },
  {
    _id: 'recv-app-2',
    candidate: demoCandidates[1],
    jobListing: demoJobListings[0],
    status: 'application_reviewed',
    appliedDate: '2024-01-14',
    notes: 'Good experience, reviewing portfolio'
  },
  {
    _id: 'recv-app-3',
    candidate: demoCandidates[2],
    jobListing: demoJobListings[0],
    status: 'pending',
    appliedDate: '2024-01-16',
    notes: 'New application'
  }
];

// Employer's job listings (subset they own)
export const demoEmployerJobListings = [
  demoJobListings[0], // Senior Frontend Developer at TechVentures Inc.
];

// Employer matches (candidates who matched with their listings)
export const demoEmployerMatches = [
  {
    _id: 'emp-match-1',
    candidate: demoCandidates[0],
    jobListing: demoJobListings[0],
    matchScore: 92,
    matchedSkills: ['React', 'TypeScript', 'GraphQL'],
    status: 'mutual_interest'
  },
  {
    _id: 'emp-match-2',
    candidate: demoCandidates[1],
    jobListing: demoJobListings[0],
    matchScore: 87,
    matchedSkills: ['React', 'JavaScript', 'Docker'],
    status: 'employer_interested'
  }
];
