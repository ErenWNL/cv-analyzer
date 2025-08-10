/**
 * CV Controller
 * Handles CV upload, analysis, and management operations
 */

const path = require('path')
const { StatusCodes } = require('http-status-codes')
const { query, validationResult } = require('express-validator')
const CV = require('../models/CV')
const User = require('../models/User')
const { moveToStorage, cleanupFile, cvsDir } = require('../middleware/upload')

// Mock AI analysis function (replace with actual AI service)
const analyzeCV = async (filePath, originalName) => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Mock analysis results
  const mockResults = {
    score: Math.floor(Math.random() * 40) + 60, // Score between 60-99
    keywords: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
    suggestions: [
      'Add more quantifiable achievements',
      'Include relevant certifications',
      'Improve formatting and structure',
      'Add more technical skills'
    ],
    sections: {
      personal_info: { score: 85, feedback: 'Contact information is complete' },
      experience: { score: 75, feedback: 'Add more quantifiable achievements' },
      education: { score: 90, feedback: 'Education section is well structured' },
      skills: { score: 70, feedback: 'Include more technical skills' }
    },
    ats_compatibility: 85,
    readability: 80
  }

  return mockResults
}

// Upload CV validation
const uploadValidation = [
  // Any additional validation can be added here
]

// List validation
const listValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['pending', 'processing', 'completed', 'failed']).withMessage('Invalid status'),
  query('search').optional().isLength({ max: 100 }).withMessage('Search term too long')
]

// Upload CV
const uploadCV = async (req, res, next) => {
  let tempPath = null
  
  try {
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      })
    }

    // File should be available from upload middleware
    if (!req.fileMetadata) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'No file uploaded',
          code: 'NO_FILE'
        }
      })
    }

    const { originalName, filename, size, mimetype, path: uploadPath } = req.fileMetadata
    tempPath = uploadPath

    // Move file to permanent storage
    const permanentPath = path.join(cvsDir, filename)
    await moveToStorage(tempPath, permanentPath)

    // Create CV record in database
    const cv = await CV.create({
      user_id: req.user.id,
      filename,
      original_name: originalName,
      file_path: permanentPath,
      file_size: size,
      mime_type: mimetype,
      status: 'pending'
    })

    // Start analysis in background (don't await)
    processCV(cv.id).catch(error => {
      console.error('CV processing error:', error)
    })

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'CV uploaded successfully. Analysis in progress.',
      data: {
        cv: cv.toJSON()
      }
    })

  } catch (error) {
    // Cleanup temporary file if upload failed
    if (tempPath) {
      await cleanupFile(tempPath)
    }
    next(error)
  }
}

// Process CV (background analysis)
const processCV = async (cvId) => {
  try {
    const cv = await CV.findById(cvId)
    if (!cv) {
      throw new Error('CV not found')
    }

    // Update status to processing
    await cv.updateStatus('processing')

    // Perform analysis
    const analysisResult = await analyzeCV(cv.file_path, cv.original_name)

    // Update CV with analysis results
    await cv.updateStatus('completed', {
      result: analysisResult,
      score: analysisResult.score,
      keywords: analysisResult.keywords,
      suggestions: analysisResult.suggestions
    })

    console.log(`CV ${cvId} analysis completed`)

  } catch (error) {
    console.error(`CV ${cvId} analysis failed:`, error)
    
    try {
      const cv = await CV.findById(cvId)
      if (cv) {
        await cv.updateStatus('failed', {
          result: { error: error.message }
        })
      }
    } catch (updateError) {
      console.error('Failed to update CV status:', updateError)
    }
  }
}

// List user's CVs
const listCVs = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      })
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const filters = {
      status: req.query.status,
      search: req.query.search
    }

    const result = await CV.findByUserId(req.user.id, page, limit, filters)

    res.json({
      success: true,
      data: {
        cvs: result.cvs.map(cv => cv.toJSON()),
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
          hasNext: result.page < result.totalPages,
          hasPrev: result.page > 1
        }
      }
    })

  } catch (error) {
    next(error)
  }
}

// Get CV details
const getCVDetails = async (req, res, next) => {
  try {
    const { id } = req.params

    const cv = await CV.findByIdAndUserId(id, req.user.id)
    if (!cv) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: {
          message: 'CV not found',
          code: 'CV_NOT_FOUND'
        }
      })
    }

    res.json({
      success: true,
      data: {
        cv: cv.toJSON()
      }
    })

  } catch (error) {
    next(error)
  }
}

// Get CV analysis
const getCVAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params

    const cv = await CV.findByIdAndUserId(id, req.user.id)
    if (!cv) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: {
          message: 'CV not found',
          code: 'CV_NOT_FOUND'
        }
      })
    }

    if (cv.status !== 'completed') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          message: `CV analysis is ${cv.status}. Please wait for completion.`,
          code: 'ANALYSIS_NOT_READY'
        }
      })
    }

    res.json({
      success: true,
      data: {
        analysis: {
          id: cv.id,
          original_name: cv.original_name,
          status: cv.status,
          score: cv.score,
          keywords: cv.keywords,
          suggestions: cv.suggestions,
          analysis_result: cv.analysis_result,
          analyzed_at: cv.analyzed_at,
          uploaded_at: cv.uploaded_at
        }
      }
    })

  } catch (error) {
    next(error)
  }
}

// Delete CV
const deleteCV = async (req, res, next) => {
  try {
    const { id } = req.params

    const cv = await CV.findByIdAndUserId(id, req.user.id)
    if (!cv) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: {
          message: 'CV not found',
          code: 'CV_NOT_FOUND'
        }
      })
    }

    await cv.delete()

    res.json({
      success: true,
      message: 'CV deleted successfully'
    })

  } catch (error) {
    next(error)
  }
}

// Reprocess CV
const reprocessCV = async (req, res, next) => {
  try {
    const { id } = req.params

    const cv = await CV.findByIdAndUserId(id, req.user.id)
    if (!cv) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: {
          message: 'CV not found',
          code: 'CV_NOT_FOUND'
        }
      })
    }

    if (cv.status === 'processing') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'CV is already being processed',
          code: 'ALREADY_PROCESSING'
        }
      })
    }

    // Reset CV status and start reprocessing
    await cv.updateStatus('pending')

    // Start analysis in background
    processCV(cv.id).catch(error => {
      console.error('CV reprocessing error:', error)
    })

    res.json({
      success: true,
      message: 'CV reprocessing started',
      data: {
        cv: cv.toJSON()
      }
    })

  } catch (error) {
    next(error)
  }
}

// Get CV statistics for user
const getCVStats = async (req, res, next) => {
  try {
    const stats = await CV.getStatsForUser(req.user.id)

    res.json({
      success: true,
      data: {
        stats: {
          ...stats,
          total_size_mb: (stats.total_size / (1024 * 1024)).toFixed(2)
        }
      }
    })

  } catch (error) {
    next(error)
  }
}

// Admin: List all CVs
const adminListCVs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const filters = {
      status: req.query.status,
      user_id: req.query.user_id,
      search: req.query.search
    }

    const result = await CV.findAll(page, limit, filters)

    res.json({
      success: true,
      data: {
        cvs: result.cvs.map(cv => cv.toJSON()),
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
          hasNext: result.page < result.totalPages,
          hasPrev: result.page > 1
        }
      }
    })

  } catch (error) {
    next(error)
  }
}

module.exports = {
  uploadCV,
  listCVs,
  getCVDetails,
  getCVAnalysis,
  deleteCV,
  reprocessCV,
  getCVStats,
  adminListCVs,
  uploadValidation,
  listValidation
}