// User and Session Types
export interface User {
  id: string;
  email: string;
  fName: string;
  lName: string;
  role: 'employer' | 'employee';
  zipCode: string;
  date?: string;
  resume?: Resume[];
  preference?: Preference;
  pendingOnePages?: string[];
}

export interface CurrentUser extends User {
  iat?: number;
  exp?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  fName: string;
  lName: string;
  password2: string;
  zipCode: string;
  role: string;
}

// Resume Types
export interface Resume {
  _id: string;
  userId: string;
  jobHistory: string;
  jobField: string;
  jobSkills: string;
}

export interface ResumeFormData {
  _id?: string;
  userId?: string;
  jobHistory: string;
  jobField: string;
  jobSkills: string;
}

// OnePage Types
export interface OnePage {
  _id: string;
  userId: string;
  companyName: string;
  position: string;
  jobField: string;
  jobSkills: string;
  description: string;
  location: string;
}

export interface OnePageFormData {
  _id?: string;
  userId?: string;
  companyName: string;
  position: string;
  jobField: string;
  jobSkills: string;
  description: string;
  location: string;
}

// Preference Types
export interface Preference {
  _id?: string;
  id?: string;
  userId: string;
  jobField: string;
  location: string;
  salary?: string;
}

export interface PreferenceFormData {
  id?: string;
  userId?: string;
  jobField: string;
  location: string;
  salary?: string;
}

// Like Types
export interface Like {
  _id: string;
  userId: string;
  onePageId: string;
  onePage?: OnePage;
}

// Redux State Types
export interface SessionState {
  isAuthenticated: boolean;
  isSignedIn?: boolean;
  user: CurrentUser | Record<string, never>;
  onePage?: OnePage;
}

export interface EntitiesState {
  users: Record<string, User>;
  resumes: Record<string, Resume>;
  onePages: Record<string, OnePage>;
  likes: Record<string, OnePage>;
  preferences: Preference | Record<string, never>;
}

export interface UIState {
  modal: ModalType | null;
  currentMain: {
    currentMain: OnePage | null;
  };
}

export interface ErrorsState {
  session: SessionErrors;
  resumes: string[];
  onePages: string[];
}

export interface SessionErrors {
  email?: string;
  password?: string;
  password2?: string;
  fName?: string;
  lName?: string;
  zipCode?: string;
  role?: string;
}

export interface RootState {
  entities: EntitiesState;
  session: SessionState;
  ui: UIState;
  errors: ErrorsState;
}

// Modal Types
export type ModalType = 'login' | 'signup' | 'resume' | 'onepage' | 'preferences' | null;

// Action Types
export interface Action<T = string, P = unknown> {
  type: T;
  payload?: P;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
}

export interface AuthResponse {
  success: boolean;
  token: string;
}

// Component Props Types
export interface WithRouterProps {
  router: {
    location: Location;
    navigate: (to: string) => void;
    params: Record<string, string>;
  };
}
