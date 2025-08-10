/**
 * File Upload Middleware
 * Handles CV file uploads with validation
 */

const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const { StatusCodes } = require('http-status-codes')

// Define upload directories
const uploadsDir = path.join(__dirname, '../../uploads')
const cvsDir = path.join(uploadsDir, 'cvs')
const tempDir = path.join(uploadsDir, 'temp')

// Ensure upload directories exist
const createDirectories = () => {
  [uploadsDir, cvsDir, tempDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })
}

createDirectories()

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir) // Store in temp first, move to cvs after processing
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}_${Date.now()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

// File filter for CV uploads
const fileFilter = (req, file, cb) => {
  // Allowed MIME types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/rtf'
  ]

  // Allowed extensions
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf']
  const fileExtension = path.extname(file.originalname).toLowerCase()

  if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
    cb(null, true)
  } else {
    const error = new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, and RTF files are allowed.')
    error.code = 'INVALID_FILE_TYPE'
    cb(error, false)
  }
}

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 1 // Only one file at a time
  }
})

// Single file upload middleware
const uploadSingle = upload.single('cv')

// Enhanced upload middleware with error handling
const handleUpload = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        let message = 'File upload error'
        let statusCode = StatusCodes.BAD_REQUEST

        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            message = 'File too large. Maximum size is 10MB.'
            break
          case 'LIMIT_FILE_COUNT':
            message = 'Too many files. Only one file allowed.'
            break
          case 'LIMIT_UNEXPECTED_FILE':
            message = 'Unexpected file field. Use "cv" field name.'
            break
          case 'LIMIT_PART_COUNT':
            message = 'Too many parts in the form.'
            break
          default:
            message = err.message || 'File upload error'
        }

        return res.status(statusCode).json({
          success: false,
          error: {
            message,
            code: err.code || 'UPLOAD_ERROR'
          }
        })
      }

      // Handle custom file filter errors
      if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          error: {
            message: err.message,
            code: 'INVALID_FILE_TYPE',
            allowedTypes: ['PDF', 'DOC', 'DOCX', 'TXT', 'RTF'],
            maxSize: '10MB'
          }
        })
      }

      // Handle other errors
      console.error('Upload error:', err)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: {
          message: 'Internal upload error',
          code: 'UPLOAD_INTERNAL_ERROR'
        }
      })
    }

    // Validate that file was uploaded
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'No file uploaded. Please select a CV file.',
          code: 'NO_FILE'
        }
      })
    }

    // Add file metadata to request
    req.fileMetadata = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path,
      destination: req.file.destination
    }

    next()
  })
}

// Utility function to move file from temp to permanent storage
const moveToStorage = (tempPath, permanentPath) => {
  return new Promise((resolve, reject) => {
    fs.rename(tempPath, permanentPath, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(permanentPath)
      }
    })
  })
}

// Utility function to clean up uploaded file
const cleanupFile = (filePath) => {
  return new Promise((resolve) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Failed to cleanup file:', err)
      }
      resolve()
    })
  })
}

// Get file info without uploading
const getFileInfo = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(err)
      } else {
        resolve({
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          isFile: stats.isFile(),
          isDirectory: stats.isDirectory()
        })
      }
    })
  })
}

module.exports = {
  handleUpload,
  moveToStorage,
  cleanupFile,
  getFileInfo,
  uploadsDir,
  cvsDir,
  tempDir
}