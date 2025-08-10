const Analysis = require('../models/Analysis');
const CV = require('../models/CV');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Get analysis by ID
 */
const getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await Analysis.findById(id).populate('cvId', 'filename originalName');
    
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.json(analysis);
  } catch (error) {
    logger.error('Error getting analysis by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get all analyses for a user
 */
const getUserAnalyses = async (req, res) => {
  try {
    const userId = req.user.id;
    const analyses = await Analysis.find({ userId })
      .populate('cvId', 'filename originalName')
      .sort({ createdAt: -1 });

    res.json(analyses);
  } catch (error) {
    logger.error('Error getting user analyses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get all analyses for a specific CV
 */
const getCVAnalyses = async (req, res) => {
  try {
    const { cvId } = req.params;
    const userId = req.user.id;

    // Verify CV belongs to user
    const cv = await CV.findOne({ _id: cvId, userId });
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    const analyses = await Analysis.find({ cvId, userId })
      .sort({ createdAt: -1 });

    res.json(analyses);
  } catch (error) {
    logger.error('Error getting CV analyses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Create new analysis
 */
const createAnalysis = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cvId, analysisType, parameters } = req.body;
    const userId = req.user.id;

    // Verify CV belongs to user
    const cv = await CV.findOne({ _id: cvId, userId });
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    const analysis = new Analysis({
      cvId,
      userId,
      analysisType,
      parameters,
      status: 'pending'
    });

    await analysis.save();

    // TODO: Trigger analysis processing
    // await analysisService.processAnalysis(analysis._id);

    res.status(201).json(analysis);
  } catch (error) {
    logger.error('Error creating analysis:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update analysis status
 */
const updateAnalysisStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, results, error } = req.body;
    const userId = req.user.id;

    const analysis = await Analysis.findOne({ _id: id, userId });
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    analysis.status = status;
    if (results) analysis.results = results;
    if (error) analysis.error = error;
    analysis.completedAt = status === 'completed' ? new Date() : null;

    await analysis.save();

    res.json(analysis);
  } catch (error) {
    logger.error('Error updating analysis status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete analysis
 */
const deleteAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const analysis = await Analysis.findOne({ _id: id, userId });
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    await Analysis.findByIdAndDelete(id);

    res.json({ message: 'Analysis deleted successfully' });
  } catch (error) {
    logger.error('Error deleting analysis:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get analysis statistics
 */
const getAnalysisStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Analysis.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalAnalyses = await Analysis.countDocuments({ userId });
    const completedAnalyses = await Analysis.countDocuments({ userId, status: 'completed' });
    const pendingAnalyses = await Analysis.countDocuments({ userId, status: 'pending' });
    const failedAnalyses = await Analysis.countDocuments({ userId, status: 'failed' });

    res.json({
      total: totalAnalyses,
      completed: completedAnalyses,
      pending: pendingAnalyses,
      failed: failedAnalyses,
      byStatus: stats
    });
  } catch (error) {
    logger.error('Error getting analysis stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAnalysisById,
  getUserAnalyses,
  getCVAnalyses,
  createAnalysis,
  updateAnalysisStatus,
  deleteAnalysis,
  getAnalysisStats
};
