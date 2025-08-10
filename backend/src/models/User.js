/**
 * User Model
 * Database operations for user management
 */

const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const { runQuery, getQuery, allQuery } = require('../utils/database')

class User {
  constructor(data) {
    this.id = data.id
    this.email = data.email
    this.password = data.password
    this.first_name = data.first_name
    this.last_name = data.last_name
    this.role = data.role || 'user'
    this.is_active = data.is_active !== undefined ? data.is_active : true
    this.created_at = data.created_at
    this.updated_at = data.updated_at
  }

  // Create new user
  static async create(userData) {
    const { email, password, first_name, last_name, role = 'user' } = userData

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const userId = uuidv4()
    const query = `
      INSERT INTO users (id, email, password, first_name, last_name, role, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `

    const result = await runQuery(query, [
      userId,
      email.toLowerCase(),
      hashedPassword,
      first_name,
      last_name,
      role
    ])

    if (result) {
      return await User.findById(userId)
    }

    throw new Error('Failed to create user')
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?'
    const user = await getQuery(query, [id])
    
    if (user) {
      return new User(user)
    }
    
    return null
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?'
    const user = await getQuery(query, [email.toLowerCase()])
    
    if (user) {
      return new User(user)
    }
    
    return null
  }

  // Find all users with pagination
  static async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit
    let query = 'SELECT * FROM users WHERE 1=1'
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1'
    const queryParams = []

    // Apply filters
    if (filters.role) {
      query += ' AND role = ?'
      countQuery += ' AND role = ?'
      queryParams.push(filters.role)
    }

    if (filters.is_active !== undefined) {
      query += ' AND is_active = ?'
      countQuery += ' AND is_active = ?'
      queryParams.push(filters.is_active)
    }

    if (filters.search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)'
      countQuery += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)'
      const searchTerm = `%${filters.search}%`
      queryParams.push(searchTerm, searchTerm, searchTerm)
    }

    // Add ordering and pagination
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    
    const users = await allQuery(query, [...queryParams, limit, offset])
    const totalResult = await getQuery(countQuery, queryParams)
    
    return {
      users: users.map(user => new User(user)),
      total: totalResult.total,
      page,
      limit,
      totalPages: Math.ceil(totalResult.total / limit)
    }
  }

  // Update user
  async update(updates) {
    const allowedFields = ['first_name', 'last_name', 'role', 'is_active']
    const fields = []
    const values = []

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        fields.push(`${key} = ?`)
        values.push(updates[key])
      }
    })

    if (fields.length === 0) {
      throw new Error('No valid fields to update')
    }

    // Add updated_at timestamp
    fields.push('updated_at = CURRENT_TIMESTAMP')
    values.push(this.id)

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`
    const result = await runQuery(query, values)

    if (result.changes > 0) {
      // Reload user data
      const updatedUser = await User.findById(this.id)
      Object.assign(this, updatedUser)
      return this
    }

    throw new Error('Failed to update user')
  }

  // Change password
  async changePassword(newPassword) {
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    const query = 'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    const result = await runQuery(query, [hashedPassword, this.id])

    if (result.changes === 0) {
      throw new Error('Failed to change password')
    }

    this.password = hashedPassword
    return true
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password)
  }

  // Deactivate user (soft delete)
  async deactivate() {
    const query = 'UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    const result = await runQuery(query, [this.id])

    if (result.changes > 0) {
      this.is_active = false
      return true
    }

    throw new Error('Failed to deactivate user')
  }

  // Reactivate user
  async reactivate() {
    const query = 'UPDATE users SET is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    const result = await runQuery(query, [this.id])

    if (result.changes > 0) {
      this.is_active = true
      return true
    }

    throw new Error('Failed to reactivate user')
  }

  // Get user's CVs
  async getCVs() {
    const query = 'SELECT * FROM cvs WHERE user_id = ? ORDER BY uploaded_at DESC'
    return await allQuery(query, [this.id])
  }

  // Get user statistics
  async getStats() {
    const queries = [
      'SELECT COUNT(*) as total_cvs FROM cvs WHERE user_id = ?',
      'SELECT COUNT(*) as analyzed_cvs FROM cvs WHERE user_id = ? AND status = "completed"',
      'SELECT AVG(score) as avg_score FROM cvs WHERE user_id = ? AND score IS NOT NULL',
      'SELECT COUNT(*) as recent_uploads FROM cvs WHERE user_id = ? AND uploaded_at >= date("now", "-30 days")'
    ]

    const results = await Promise.all(
      queries.map(query => getQuery(query, [this.id]))
    )

    return {
      total_cvs: results[0].total_cvs || 0,
      analyzed_cvs: results[1].analyzed_cvs || 0,
      avg_score: results[2].avg_score ? parseFloat(results[2].avg_score.toFixed(1)) : null,
      recent_uploads: results[3].recent_uploads || 0
    }
  }

  // Convert to JSON (exclude sensitive data)
  toJSON() {
    const { password, ...userWithoutPassword } = this
    return userWithoutPassword
  }

  // Get public profile
  getPublicProfile() {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      role: this.role,
      created_at: this.created_at
    }
  }
}

module.exports = User