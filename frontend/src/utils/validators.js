// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
  if (!/(?=.*[@$!%*?&])/.test(password)) return 'Password must contain at least one special character (@$!%*?&)';
  return null;
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

// Name validation
export const validateName = (name, fieldName = 'Name') => {
  if (!name) return `${fieldName} is required`;
  if (name.length < 2) return `${fieldName} must be at least 2 characters long`;
  if (name.length > 50) return `${fieldName} must be less than 50 characters long`;
  if (!/^[a-zA-Z\s'-]+$/.test(name)) return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  return null;
};

// Phone number validation
export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return 'Please enter a valid phone number';
  }
  return null;
};

// Required field validation
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

// File validation
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    maxFileNameLength = 255
  } = options;

  if (!file) return 'Please select a file';

  if (file.size > maxSize) {
    return `File size must be less than ${(maxSize / (1024 * 1024)).toFixed(1)}MB`;
  }

  if (!allowedTypes.includes(file.type)) {
    return 'File type not supported. Please upload a supported file format.';
  }

  if (file.name.length > maxFileNameLength) {
    return `Filename is too long. Please use a shorter name.`;
  }

  return null;
};

// URL validation
export const validateURL = (url) => {
  if (!url) return null; // URL is optional
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

// Number validation
export const validateNumber = (value, fieldName, options = {}) => {
  const { min, max, required = false } = options;
  
  if (!value && !required) return null;
  if (!value && required) return `${fieldName} is required`;
  
  const num = Number(value);
  if (isNaN(num)) return `${fieldName} must be a valid number`;
  
  if (min !== undefined && num < min) {
    return `${fieldName} must be at least ${min}`;
  }
  
  if (max !== undefined && num > max) {
    return `${fieldName} must be no more than ${max}`;
  }
  
  return null;
};

// Date validation
export const validateDate = (date, fieldName, options = {}) => {
  const { minDate, maxDate, required = false } = options;
  
  if (!date && !required) return null;
  if (!date && required) return `${fieldName} is required`;
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return `${fieldName} must be a valid date`;
  
  if (minDate) {
    const minDateObj = new Date(minDate);
    if (dateObj < minDateObj) {
      return `${fieldName} must be after ${minDateObj.toLocaleDateString()}`;
    }
  }
  
  if (maxDate) {
    const maxDateObj = new Date(maxDate);
    if (dateObj > maxDateObj) {
      return `${fieldName} must be before ${maxDateObj.toLocaleDateString()}`;
    }
  }
  
  return null;
};

// Form validation helper
export const validateForm = (values, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const value = values[field];
    const rules = validationRules[field];
    
    for (const rule of rules) {
      const error = rule(value, values);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Async validation helper
export const validateFormAsync = async (values, asyncValidationRules) => {
  const errors = {};
  
  const validationPromises = Object.keys(asyncValidationRules).map(async (field) => {
    const value = values[field];
    const validator = asyncValidationRules[field];
    
    try {
      const error = await validator(value, values);
      if (error) {
        return { field, error };
      }
    } catch (err) {
      return { field, error: 'Validation failed' };
    }
    
    return null;
  });
  
  const results = await Promise.all(validationPromises);
  
  results.forEach(result => {
    if (result) {
      errors[result.field] = result.error;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
