const Joi = require('joi');

// User validation schemas
const userValidation = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  update: Joi.object({
    firstName: Joi.string().min(2).max(50),
    lastName: Joi.string().min(2).max(50),
    email: Joi.string().email()
  })
};

// CV validation schemas
const cvValidation = {
  upload: Joi.object({
    file: Joi.object({
      mimetype: Joi.string().valid(
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ).required(),
      size: Joi.number().max(10 * 1024 * 1024).required() // 10MB max
    }).required()
  }),

  analysis: Joi.object({
    templateId: Joi.number().integer().min(1).optional(),
    customCriteria: Joi.object().optional()
  })
};

// Analysis validation schemas
const analysisValidation = {
  create: Joi.object({
    cvId: Joi.number().integer().min(1).required(),
    templateId: Joi.number().integer().min(1).optional(),
    customCriteria: Joi.object().optional()
  }),

  update: Joi.object({
    overallScore: Joi.number().min(0).max(100).optional(),
    technicalScore: Joi.number().min(0).max(100).optional(),
    experienceScore: Joi.number().min(0).max(100).optional(),
    educationScore: Joi.number().min(0).max(100).optional(),
    communicationScore: Joi.number().min(0).max(100).optional(),
    analysisData: Joi.object().optional()
  })
};

// File validation helpers
const fileValidation = {
  isValidFileType: (mimetype) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    return allowedTypes.includes(mimetype);
  },

  isValidFileSize: (size, maxSize = 10 * 1024 * 1024) => {
    return size <= maxSize;
  },

  getFileExtension: (filename) => {
    return filename.split('.').pop().toLowerCase();
  }
};

// Email validation
const emailValidation = {
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isBusinessEmail: (email) => {
    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1];
    return !personalDomains.includes(domain);
  }
};

// Password validation
const passwordValidation = {
  isStrongPassword: (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && 
           hasUpperCase && 
           hasLowerCase && 
           hasNumbers && 
           hasSpecialChar;
  },

  getPasswordStrength: (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 3) return 'medium';
    if (score <= 4) return 'strong';
    return 'very-strong';
  }
};

module.exports = {
  userValidation,
  cvValidation,
  analysisValidation,
  fileValidation,
  emailValidation,
  passwordValidation
};
