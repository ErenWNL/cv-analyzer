/**
 * Database Utilities
 * SQLite database initialization and management
 */

const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')

let db = null

const DATABASE_PATH = path.join(__dirname, '../../database/cv_analyzer.db')

const initializeDatabase = async () => {
  try {
    // Ensure database directory exists
    const dbDir = path.dirname(DATABASE_PATH)
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }

    // Create database connection
    db = new sqlite3.Database(DATABASE_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message)
        throw err
      }
      console.log('Connected to SQLite database')
    })

    // Enable foreign keys
    await runQuery('PRAGMA foreign_keys = ON')

    // Create tables
    await createTables()

    return db
  } catch (error) {
    console.error('Database initialization failed:', error)
    throw error
  }
}

const createTables = async () => {
  // Users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `

  // CVs table
  const createCVsTable = `
    CREATE TABLE IF NOT EXISTS cvs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      mime_type TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
      analysis_result TEXT,
      score REAL,
      keywords TEXT,
      suggestions TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      analyzed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `

  // User sessions table (for auth tokens)
  const createSessionsTable = `
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `

  // Execute table creation
  await runQuery(createUsersTable)
  await runQuery(createCVsTable)
  await runQuery(createSessionsTable)

  // Create indexes for better performance
  await runQuery('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
  await runQuery('CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs(user_id)')
  await runQuery('CREATE INDEX IF NOT EXISTS idx_cvs_status ON cvs(status)')
  await runQuery('CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)')
  await runQuery('CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)')

  console.log('Database tables created successfully')
}

const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) {
        console.error('Database query error:', err.message)
        reject(err)
      } else {
        resolve({ id: this.lastID, changes: this.changes })
      }
    })
  })
}

const getQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        console.error('Database query error:', err.message)
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}

const allQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Database query error:', err.message)
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

const closeDatabase = () => {
  return new Promise((resolve) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message)
        } else {
          console.log('Database connection closed')
        }
        resolve()
      })
    } else {
      resolve()
    }
  })
}

const getDatabase = () => db

module.exports = {
  initializeDatabase,
  runQuery,
  getQuery,
  allQuery,
  closeDatabase,
  getDatabase
}