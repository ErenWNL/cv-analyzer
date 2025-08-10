const path = require('path');

module.exports = {
  // File upload settings
  maxFileSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024, // 10MB
  allowedFileTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ],
  allowedExtensions: ['.pdf', '.doc', '.docx', '.txt'],
  
  // Upload directories
  uploadDir: path.join(__dirname, '../../uploads'),
  cvUploadDir: path.join(__dirname, '../../uploads/cvs'),
  tempDir: path.join(__dirname, '../../uploads/temp'),
  
  // File naming
  preserveOriginalName: false,
  generateUniqueNames: true,
  
  // Processing
  processImages: true,
  extractText: true,
  generateThumbnails: false,
  
  // Security
  scanForViruses: process.env.SCAN_FOR_VIRUSES === 'true',
  validateFileContent: true
};
