/**
 * CV Model
 * Database operations for CV management
 */

const { v4: uuidv4 } = require('uuid')
const path = require('path')
const fs = require('fs')
const { runQuery, getQuery, allQuery } = require('../utils/database')

class CV {
  constructor(data) {
    this.id = data.id
    this.user_id = data.user_id
    this.filename = data.filename
    this.original_name = data.original_name
    this.file_path = data.file_path
    this.file_size = data.file_size
    this.mime_type = data.mime_type
    this.status = data.status || 'pending'
    this.analysis_result = data.analysis_result ? JSON.parse(data.analysis_result) : null
    this.score = data.score
    this.keywords = data.keywords ? data.keywords.split(',') : []
    this.suggestions = data.suggestions ? JSON.parse(data.suggestions) : null
    this.uploaded_at = data.uploaded_at
    this.analyzed_at = data.analyzed_at
  }

  // Create new CV record
  static async create(cvData) {
    const {
      user_id,
      filename,
      original_name,
      file_path,
      file_size,
      mime_type,
      status = 'pending'
    } = cvData

    const cvId = uuidv4()
    const query = `
      INSERT INTO cvs (id, user_id, filename, original_name, file_path, file_size, mime_type, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    const result = await runQuery(query, [
      cvId,
      user_id,
      filename,
      original_name,
      file_path,
      file_size,
      mime_type,
      status
    ])

    if (result) {
      return await CV.findById(cvId)
    }

    throw new Error('Failed to create CV record')
  }

  // Find CV by ID
  static async findById(id) {
    const query = 'SELECT * FROM cvs WHERE id = ?'
    const cv = await getQuery(query, [id])
    
    if (cv) {
      return new CV(cv)
    }
    
    return null
  }

  // Find CV by ID and user ID (for authorization)
  static async findByIdAndUserId(id, userId) {
    const query = 'SELECT * FROM cvs WHERE id = ? AND user_id = ?'
    const cv = await getQuery(query, [id, userId])
    
    if (cv) {
      return new CV(cv)
    }
    
    return null
  }

  // Find all CVs for a user with pagination
  static async findByUserId(userId, page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit
    let query = 'SELECT * FROM cvs WHERE user_id = ?'
    let countQuery = 'SELECT COUNT(*) as total FROM cvs WHERE user_id = ?'
    const queryParams = [userId]

    // Apply filters
    if (filters.status) {
      query += ' AND status = ?'
      countQuery += ' AND status = ?'
      queryParams.push(filters.status)
    }

    if (filters.search) {
      query += ' AND original_name LIKE ?'
      countQuery += ' AND original_name LIKE ?'
      queryParams.push(`%${filters.search}%`)
    }

    // Add ordering and pagination
    query += ' ORDER BY uploaded_at DESC LIMIT ? OFFSET ?'
    
    const cvs = await allQuery(query, [...queryParams, limit, offset])
    const totalResult = await getQuery(countQuery, queryParams)
    
    return {
      cvs: cvs.map(cv => new CV(cv)),
      total: totalResult.total,
      page,
      limit,
      totalPages: Math.ceil(totalResult.total / limit)
    }
  }

  // Find all CVs with pagination (admin)
  static async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit
    let query = 'SELECT * FROM cvs WHERE 1=1'
    let countQuery = 'SELECT COUNT(*) as total FROM cvs WHERE 1=1'
    const queryParams = []

    // Apply filters
    if (filters.status) {
      query += ' AND status = ?'
      countQuery += ' AND status = ?'
      queryParams.push(filters.status)
    }

    if (filters.user_id) {
      query += ' AND user_id = ?'
      countQuery += ' AND user_id = ?'
      queryParams.push(filters.user_id)
    }

    if (filters.search) {
      query += ' AND original_name LIKE ?'
      countQuery += ' AND original_name LIKE ?'
      queryParams.push(`%${filters.search}%`)
    }

    // Add ordering and pagination
    query += ' ORDER BY uploaded_at DESC LIMIT ? OFFSET ?'
    
    const cvs = await allQuery(query, [...queryParams, limit, offset])
    const totalResult = await getQuery(countQuery, queryParams)
    
    return {
      cvs: cvs.map(cv => new CV(cv)),
      total: totalResult.total,
      page,
      limit,
      totalPages: Math.ceil(totalResult.total / limit)
    }
  }

  // Update CV
  async update(updates) {
    const allowedFields = [
      'status',
      'analysis_result',
      'score',
      'keywords',
      'suggestions'
    ]
    const fields = []
    const values = []

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        if (key === 'analysis_result' || key === 'suggestions') {
          fields.push(`${key} = ?`)
          values.push(JSON.stringify(updates[key]))
        } else if (key === 'keywords') {
          fields.push(`${key} = ?`)
          values.push(Array.isArray(updates[key]) ? updates[key].join(',') : updates[key])
        } else {
          fields.push(`${key} = ?`)
          values.push(updates[key])
        }
      }
    })

    if (fields.length === 0) {
      throw new Error('No valid fields to update')
    }

    // Add analyzed_at timestamp if status is completed
    if (updates.status === 'completed') {
      fields.push('analyzed_at = CURRENT_TIMESTAMP')
    }

    values.push(this.id)

    const query = `UPDATE cvs SET ${fields.join(', ')} WHERE id = ?`
    const result = await runQuery(query, values)

    if (result.changes > 0) {
      // Reload CV data
      const updatedCV = await CV.findById(this.id)
      Object.assign(this, updatedCV)
      return this
    }

    throw new Error('Failed to update CV')
  }

  // Update analysis status
  async updateStatus(status, analysisData = null) {
    const updates = { status }
    
    if (analysisData) {
      if (analysisData.result) updates.analysis_result = analysisData.result
      if (analysisData.score !== undefined) updates.score = analysisData.score
      if (analysisData.keywords) updates.keywords = analysisData.keywords
      if (analysisData.suggestions) updates.suggestions = analysisData.suggestions
    }

    return await this.update(updates)
  }

  // Delete CV
  async delete() {
    const query = 'DELETE FROM cvs WHERE id = ?'
    const result = await runQuery(query, [this.id])

    if (result.changes > 0) {
      // Delete file from filesystem
      try {
        if (fs.existsSync(this.file_path)) {
          fs.unlinkSync(this.file_path)
        }
      } catch (error) {
        console.error('Failed to delete file:', error)
      }
      
      return true
    }

    throw new Error('Failed to delete CV')
  }

  // Check if file exists
  fileExists() {
    return fs.existsSync(this.file_path)
  }

  // Get file stats
  getFileStats() {
    try {
      return fs.statSync(this.file_path)
    } catch (error) {
      return null
    }
  }

  // Get analysis summary
  getAnalysisSummary() {
    if (!this.analysis_result) {
      return null
    }

    return {
      score: this.score,
      status: this.status,
      keywords: this.keywords,
      analyzed_at: this.analyzed_at,
      suggestions_count: this.suggestions ? this.suggestions.length : 0,
      has_analysis: true
    }
  }

  // Get statistics for user's CVs
  static async getStatsForUser(userId) {
    const queries = [
      'SELECT COUNT(*) as total FROM cvs WHERE user_id = ?',
      'SELECT COUNT(*) as pending FROM cvs WHERE user_id = ? AND status = "pending"',
      'SELECT COUNT(*) as processing FROM cvs WHERE user_id = ? AND status = "processing"',
      'SELECT COUNT(*) as completed FROM cvs WHERE user_id = ? AND status = "completed"',
      'SELECT COUNT(*) as failed FROM cvs WHERE user_id = ? AND status = "failed"',
      'SELECT AVG(score) as avg_score FROM cvs WHERE user_id = ? AND score IS NOT NULL',
      'SELECT MAX(score) as max_score FROM cvs WHERE user_id = ? AND score IS NOT NULL',
      'SELECT SUM(file_size) as total_size FROM cvs WHERE user_id = ?'
    ]

    const results = await Promise.all(
      queries.map(query => getQuery(query, [userId]))
    )

    return {
      total: results[0].total || 0,
      pending: results[1].pending || 0,
      processing: results[2].processing || 0,
      completed: results[3].completed || 0,
      failed: results[4].failed || 0,
      avg_score: results[5].avg_score ? parseFloat(results[5].avg_score.toFixed(1)) : null,
      max_score: results[6].max_score ? parseFloat(results[6].max_score.toFixed(1)) : null,
      total_size: results[7].total_size || 0
    }
  }

  // Convert to JSON (for API responses)
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      filename: this.filename,
      original_name: this.original_name,
      file_size: this.file_size,
      mime_type: this.mime_type,
      status: this.status,
      analysis_result: this.analysis_result,
      score: this.score,
      keywords: this.keywords,
      suggestions: this.suggestions,
      uploaded_at: this.uploaded_at,
      analyzed_at: this.analyzed_at,
      file_exists: this.fileExists()
    }
  }

  // Get public data (exclude sensitive info)
  getPublicData() {
    return {
      id: this.id,
      original_name: this.original_name,
      file_size: this.file_size,
      mime_type: this.mime_type,
      status: this.status,
      score: this.score,
      uploaded_at: this.uploaded_at,
      analyzed_at: this.analyzed_at
    }
  }
}

module.exports = CV