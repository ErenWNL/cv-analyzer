/**
 * CV Routes
 * Routes for CV upload, analysis, and management
 */

const express = require('express')
const router = express.Router()

const {
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
} = require('../controllers/cvController')

const { authenticate, authorize } = require('../middleware/auth')
const { handleUpload } = require('../middleware/upload')

// Apply authentication middleware to all routes
router.use(authenticate)

// CV management routes
router.post('/upload', handleUpload, uploadValidation, uploadCV)
router.get('/list', listValidation, listCVs)
router.get('/stats', getCVStats)
router.get('/:id', getCVDetails)
router.get('/:id/analysis', getCVAnalysis)
router.delete('/:id', deleteCV)
router.post('/:id/reprocess', reprocessCV)

// Admin routes (require admin role)
router.get('/admin/list', authorize('admin'), listValidation, adminListCVs)

module.exports = router