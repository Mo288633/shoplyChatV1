export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => boolean;
  message?: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export function validateField(value: any, rules: ValidationRule): string | null {
  if (rules.required && !value) {
    return rules.message || 'This field is required';
  }

  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return rules.message || `Minimum length is ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return rules.message || `Maximum length is ${rules.maxLength} characters`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message || 'Invalid format';
    }
  }

  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      return rules.message || `Minimum value is ${rules.min}`;
    }

    if (rules.max !== undefined && value > rules.max) {
      return rules.message || `Maximum value is ${rules.max}`;
    }
  }

  if (rules.custom && !rules.custom(value)) {
    return rules.message || 'Invalid value';
  }

  return null;
}

export function validateForm<T extends object>(
  data: T,
  rules: ValidationRules
): ValidationErrors {
  const errors: ValidationErrors = {};

  Object.keys(rules).forEach((field) => {
    const value = data[field as keyof T];
    const error = validateField(value, rules[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
}

export const commonValidationRules = {
  email: {
    required: true,
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character'
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s-']+$/,
    message: 'Please enter a valid name'
  },
  phone: {
    pattern: /^\+?[\d\s-()]{10,}$/,
    message: 'Please enter a valid phone number'
  }
};