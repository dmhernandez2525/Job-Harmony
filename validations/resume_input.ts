import Validator from 'validator';
import validText from './valid-text';
import { ResumeInput, ValidationResult } from '../types';

interface MutableResumeInput {
  userId: string;
  jobHistory: string;
  jobField: string;
  jobSkills: string;
}

export default function validatesResumeInput(data: ResumeInput): ValidationResult {
  const errors: Record<string, string> = {};
  const mutableData: MutableResumeInput = {
    userId: validText(data.userId) ? data.userId! : '',
    jobHistory: validText(data.jobHistory) ? data.jobHistory : '',
    jobField: validText(data.jobField) ? data.jobField : '',
    jobSkills: validText(data.jobSkills) ? data.jobSkills : ''
  };

  if (Validator.isEmpty(mutableData.jobHistory)) {
    errors.jobHistory = 'Job History is required';
  }

  if (Validator.isEmpty(mutableData.jobField)) {
    errors.jobField = 'Job Field is required';
  }

  if (Validator.isEmpty(mutableData.jobSkills)) {
    errors.jobSkills = 'Job Skills is required';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
}
