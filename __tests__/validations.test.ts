import validateLoginInput from '../validations/login_input';
import validateSignupInput from '../validations/signup_input';
import validatesResumeInput from '../validations/resume_input';
import validText from '../validations/valid-text';

describe('Validation Functions', () => {
  describe('validText', () => {
    it('should return true for non-empty string', () => {
      expect(validText('hello')).toBe(true);
      expect(validText('test string')).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(validText('')).toBe(false);
      expect(validText('   ')).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(validText(null)).toBe(false);
      expect(validText(undefined)).toBe(false);
      expect(validText(123)).toBe(false);
      expect(validText({})).toBe(false);
    });
  });

  describe('validateLoginInput', () => {
    it('should validate correct login input', () => {
      const input = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = validateLoginInput(input);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('should invalidate empty email', () => {
      const input = {
        email: '',
        password: 'password123'
      };

      const result = validateLoginInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('email');
    });

    it('should invalidate invalid email format', () => {
      const input = {
        email: 'invalid-email',
        password: 'password123'
      };

      const result = validateLoginInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('email');
    });

    it('should invalidate empty password', () => {
      const input = {
        email: 'test@example.com',
        password: ''
      };

      const result = validateLoginInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('password');
    });
  });

  describe('validateSignupInput', () => {
    const validInput = {
      email: 'test@example.com',
      password: 'password123',
      password2: 'password123',
      fName: 'John',
      lName: 'Doe',
      zipCode: '12345',
      role: 'employee'
    };

    it('should validate correct signup input', () => {
      const result = validateSignupInput(validInput);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('should invalidate mismatched passwords', () => {
      const input = {
        ...validInput,
        password2: 'differentpassword'
      };

      const result = validateSignupInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('password2');
    });

    it('should invalidate short password', () => {
      const input = {
        ...validInput,
        password: '123',
        password2: '123'
      };

      const result = validateSignupInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('password');
    });

    it('should invalidate invalid zipcode length', () => {
      const input = {
        ...validInput,
        zipCode: '123'
      };

      const result = validateSignupInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('zipCode');
    });

    it('should invalidate empty first name', () => {
      const input = {
        ...validInput,
        fName: ''
      };

      const result = validateSignupInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('fName');
    });

    it('should invalidate empty last name', () => {
      const input = {
        ...validInput,
        lName: ''
      };

      const result = validateSignupInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('lName');
    });

    it('should invalidate "Please select a role" as role', () => {
      const input = {
        ...validInput,
        role: 'Please select a role'
      };

      const result = validateSignupInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('role');
    });
  });

  describe('validatesResumeInput', () => {
    it('should validate correct resume input', () => {
      const input = {
        userId: 'user123',
        jobHistory: 'Software Engineer for 5 years',
        jobField: 'Technology',
        jobSkills: 'JavaScript, Python, React'
      };

      const result = validatesResumeInput(input);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('should invalidate empty job history', () => {
      const input = {
        userId: 'user123',
        jobHistory: '',
        jobField: 'Technology',
        jobSkills: 'JavaScript'
      };

      const result = validatesResumeInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('jobHistory');
    });

    it('should invalidate empty job field', () => {
      const input = {
        userId: 'user123',
        jobHistory: 'Engineer for 5 years',
        jobField: '',
        jobSkills: 'JavaScript'
      };

      const result = validatesResumeInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('jobField');
    });

    it('should invalidate empty job skills', () => {
      const input = {
        userId: 'user123',
        jobHistory: 'Engineer for 5 years',
        jobField: 'Technology',
        jobSkills: ''
      };

      const result = validatesResumeInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('jobSkills');
    });
  });
});
