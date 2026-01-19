import { Document, Types } from 'mongoose';
import { Request } from 'express';

// User Document Interface
export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  fName: string;
  lName: string;
  zipCode: string;
  date: Date;
  role: 'employer' | 'employee';
  pendingOnePages: Types.ObjectId[];
  resume: Types.ObjectId[];
  preference: Types.ObjectId[];
}

// Resume Document Interface
export interface IResume extends Document {
  _id: Types.ObjectId;
  userId: string;
  jobHistory: string;
  jobField: string;
  jobSkills: string;
}

// OnePage Document Interface
export interface IOnePage extends Document {
  _id: Types.ObjectId;
  userId: string;
  companyName: string;
  position: string;
  jobField: string;
  jobSkills: string;
  description: string;
  location: string;
}

// Preference Document Interface
export interface IPreference extends Document {
  _id: Types.ObjectId;
  userId: string;
  jobField: string;
  location: string;
  salary?: string;
}

// Like Document Interface
export interface ILike extends Document {
  _id: Types.ObjectId;
  userId: string;
  onePageId: string;
}

// Match Document Interface
export interface IMatch extends Document {
  _id: Types.ObjectId;
  employerId: string;
  employeeId: string;
  onePageId: string;
  status: string;
}

// JWT Payload Interface
export interface IJwtPayload {
  id: string;
  email: string;
  role: string;
  fName: string;
  lName: string;
  resume?: IResume[];
  preference?: IPreference | string;
  pendingOnePages?: Types.ObjectId[];
  iat?: number;
  exp?: number;
}

// Request with User
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// Validation Result Interface
export interface ValidationResult {
  errors: Record<string, string>;
  isValid: boolean;
}

// Login Input Interface
export interface LoginInput {
  email: string;
  password: string;
}

// Signup Input Interface
export interface SignupInput {
  email: string;
  password: string;
  password2: string;
  fName: string;
  lName: string;
  zipCode: string;
  role: string;
}

// Resume Input Interface
export interface ResumeInput {
  userId?: string;
  jobHistory: string;
  jobField: string;
  jobSkills: string;
}

// OnePage Input Interface
export interface OnePageInput {
  userId?: string;
  companyName: string;
  position: string;
  jobField: string;
  jobSkills: string;
  description: string;
  location: string;
}

// Preference Input Interface
export interface PreferenceInput {
  userId?: string;
  jobField: string;
  location: string;
  salary?: string;
}

// Keys Configuration Interface
export interface KeysConfig {
  mongoURI: string;
  secretOrKey: string;
}
