import Validator from 'validator';
import validText from './valid-text';
import { LoginInput, ValidationResult } from '../types';

interface MutableLoginInput {
  email: string;
  password: string;
}

export default function validateLoginInput(data: LoginInput): ValidationResult {
  const errors: Record<string, string> = {};
  const mutableData: MutableLoginInput = {
    email: validText(data.email) ? data.email : '',
    password: validText(data.password) ? data.password : ''
  };

  if (!Validator.isEmail(mutableData.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(mutableData.email)) {
    errors.email = 'Email field is required';
  }

  if (Validator.isEmpty(mutableData.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
}
