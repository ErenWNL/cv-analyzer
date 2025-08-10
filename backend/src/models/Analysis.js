const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  cvId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CV',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  analysisType: {
    type: String,
    enum: ['skills', 'experience', 'education', 'overall'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  parameters: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  results: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  error: {
    type: String,
    default: null
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  processingTime: {
    type: Number, // in milliseconds
    default: null
  },
  metadata: {
    version: {
      type: String,
      default: '1.0.0'
    },
    algorithm: {
      type: String,
      default: 'default'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: null
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ cvId: 1, createdAt: -1 });
analysisSchema.index({ status: 1, createdAt: -1 });
analysisSchema.index({ analysisType: 1, userId: 1 });

// Virtual for processing duration
analysisSchema.virtual('duration').get(function() {
  if (this.startedAt && this.completedAt) {
    return this.completedAt - this.startedAt;
  }
  return null;
});

// Method to mark analysis as processing
analysisSchema.methods.startProcessing = function() {
  this.status = 'processing';
  this.startedAt = new Date();
  return this.save();
};

// Method to mark analysis as completed
analysisSchema.methods.complete = function(results, confidence = null) {
  this.status = 'completed';
  this.results = results;
  this.completedAt = new Date();
  this.processingTime = this.completedAt - this.startedAt;
  if (confidence !== null) {
    this.metadata.confidence = confidence;
  }
  return this.save();
};

// Method to mark analysis as failed
analysisSchema.methods.fail = function(error) {
  this.status = 'failed';
  this.error = error;
  this.completedAt = new Date();
  this.processingTime = this.completedAt - this.startedAt;
  return this.save();
};

// Static method to get analysis statistics
analysisSchema.statics.getStats = function(userId) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgProcessingTime: { $avg: '$processingTime' }
      }
    }
  ]);
};

// Static method to get recent analyses
analysisSchema.statics.getRecent = function(userId, limit = 10) {
  return this.find({ userId })
    .populate('cvId', 'filename originalName')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get analyses by type
analysisSchema.statics.getByType = function(userId, analysisType) {
  return this.find({ userId, analysisType })
    .populate('cvId', 'filename originalName')
    .sort({ createdAt: -1 });
};

// Pre-save middleware to update processing time
analysisSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && this.startedAt) {
    this.processingTime = Date.now() - this.startedAt;
  }
  next();
});

// Pre-remove middleware to clean up related data
analysisSchema.pre('remove', function(next) {
  // Clean up any related data if needed
  next();
});

module.exports = mongoose.model('Analysis', analysisSchema);
