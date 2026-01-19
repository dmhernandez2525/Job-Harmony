import Validator from 'validator';
import validText from './valid-text';
import { SignupInput, ValidationResult } from '../types';

interface MutableSignupInput {
  email: string;
  password: string;
  password2: string;
  fName: string;
  lName: string;
  zipCode: string;
  role: string;
}

export default function validateSignupInput(data: SignupInput): ValidationResult {
  const errors: Record<string, string> = {};
  const mutableData: MutableSignupInput = {
    email: validText(data.email) ? data.email : '',
    password: validText(data.password) ? data.password : '',
    password2: validText(data.password2) ? data.password2 : '',
    fName: validText(data.fName) ? data.fName : '',
    lName: validText(data.lName) ? data.lName : '',
    zipCode: validText(data.zipCode) ? data.zipCode : '',
    role: validText(data.role) ? data.role : ''
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

  if (mutableData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(mutableData.password2)) {
    errors.password2 = 'Please re-enter password';
  }

  if (mutableData.password2 !== mutableData.password) {
    errors.password2 = 'Passwords must match';
  }

  if (Validator.isEmpty(mutableData.zipCode)) {
    errors.zipCode = 'zipCode field is required';
  }

  if (mutableData.zipCode.length !== 5) {
    errors.zipCode = 'Please enter a valid zipcode';
  }

  if (Validator.isEmpty(mutableData.fName)) {
    errors.fName = 'first name field is required';
  }

  if (Validator.isEmpty(mutableData.lName)) {
    errors.lName = 'Last name name field is required';
  }

  if (mutableData.role === 'Please select a role') {
    errors.role = 'Please select a role';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
}
