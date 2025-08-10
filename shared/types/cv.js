/**
 * CV-related type definitions
 */

export const CVStatus = {
  UPLOADED: 'uploaded',
  PROCESSING: 'processing',
  ANALYZED: 'analyzed',
  FAILED: 'failed',
  ARCHIVED: 'archived'
};

export const CVFormat = {
  PDF: 'pdf',
  DOC: 'doc',
  DOCX: 'docx',
  TXT: 'txt'
};

export const CVCategory = {
  TECHNICAL: 'technical',
  CREATIVE: 'creative',
  SALES: 'sales',
  MANAGEMENT: 'management',
  ACADEMIC: 'academic',
  OTHER: 'other'
};

export const AnalysisStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

/**
 * CV object structure
 */
export const CVSchema = {
  id: 'string',
  userId: 'string',
  filename: 'string',
  originalName: 'string',
  format: 'CVFormat',
  size: 'number',
  status: 'CVStatus',
  category: 'CVCategory',
  uploadDate: 'Date',
  processedDate: 'Date?',
  analysisId: 'string?',
  metadata: 'object?',
  tags: 'string[]',
  isPublic: 'boolean',
  createdAt: 'Date',
  updatedAt: 'Date'
};

/**
 * CV Analysis result structure
 */
export const CVAnalysisSchema = {
  id: 'string',
  cvId: 'string',
  userId: 'string',
  status: 'AnalysisStatus',
  overallScore: 'number',
  skills: 'SkillScore[]',
  experience: 'ExperienceScore',
  education: 'EducationScore',
  recommendations: 'Recommendation[]',
  analysisDate: 'Date',
  processingTime: 'number',
  aiModel: 'string',
  confidence: 'number'
};

/**
 * Skill score structure
 */
export const SkillScore = {
  name: 'string',
  score: 'number',
  level: 'string',
  relevance: 'number',
  category: 'string'
};

/**
 * Experience score structure
 */
export const ExperienceScore = {
  years: 'number',
  relevance: 'number',
  quality: 'number',
  diversity: 'number'
};

/**
 * Education score structure
 */
export const EducationScore = {
  level: 'string',
  relevance: 'number',
  quality: 'number',
  certifications: 'string[]'
};

/**
 * Recommendation structure
 */
export const Recommendation = {
  type: 'string',
  title: 'string',
  description: 'string',
  priority: 'number',
  actionable: 'boolean'
};

/**
 * CV upload data
 */
export const CVUploadData = {
  file: 'File',
  category: 'CVCategory',
  tags: 'string[]',
  isPublic: 'boolean',
  description: 'string?'
};
