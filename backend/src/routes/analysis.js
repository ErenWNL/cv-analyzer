const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAnalysisById,
  getUserAnalyses,
  getCVAnalyses,
  createAnalysis,
  updateAnalysisStatus,
  deleteAnalysis,
  getAnalysisStats
} = require('../controllers/analysisController');
const {
  validateAnalysisCreation,
  validateAnalysisUpdate,
  validateId,
  validatePagination
} = require('../middleware/validation');

/**
 * @route   GET /api/analysis
 * @desc    Get all analyses for authenticated user
 * @access  Private
 */
router.get('/', auth, validatePagination, getUserAnalyses);

/**
 * @route   GET /api/analysis/stats
 * @desc    Get analysis statistics for authenticated user
 * @access  Private
 */
router.get('/stats', auth, getAnalysisStats);

/**
 * @route   GET /api/analysis/:id
 * @desc    Get analysis by ID
 * @access  Private
 */
router.get('/:id', auth, validateId, getAnalysisById);

/**
 * @route   GET /api/analysis/cv/:cvId
 * @desc    Get all analyses for a specific CV
 * @access  Private
 */
router.get('/cv/:cvId', auth, validateId, validatePagination, getCVAnalyses);

/**
 * @route   POST /api/analysis
 * @desc    Create new analysis
 * @access  Private
 */
router.post('/', auth, validateAnalysisCreation, createAnalysis);

/**
 * @route   PUT /api/analysis/:id
 * @desc    Update analysis status
 * @access  Private
 */
router.put('/:id', auth, validateId, validateAnalysisUpdate, updateAnalysisStatus);

/**
 * @route   DELETE /api/analysis/:id
 * @desc    Delete analysis
 * @access  Private
 */
router.delete('/:id', auth, validateId, deleteAnalysis);

module.exports = router;
