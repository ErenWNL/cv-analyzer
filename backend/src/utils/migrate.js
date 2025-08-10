/**
 * Database Migration Utility
 * Handles database migrations and schema updates
 */

const fs = require('fs')
const path = require('path')
const { initializeDatabase, runQuery, closeDatabase } = require('./database')

const SCHEMA_FILE = path.join(__dirname, '../../database/schema.sql')

const runMigrations = async () => {
  try {
    console.log('🔄 Starting database migration...')
    
    // Initialize database connection
    await initializeDatabase()
    
    // Check if schema file exists
    if (!fs.existsSync(SCHEMA_FILE)) {
      throw new Error(`Schema file not found: ${SCHEMA_FILE}`)
    }
    
    // Read schema file
    const schemaSql = fs.readFileSync(SCHEMA_FILE, 'utf8')
    
    // Split into individual statements (basic split on semicolon)
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📋 Executing ${statements.length} SQL statements...`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      if (statement.trim()) {
        try {
          await runQuery(statement)
          console.log(`✅ Statement ${i + 1}/${statements.length} executed successfully`)
        } catch (error) {
          console.error(`❌ Error executing statement ${i + 1}:`, error.message)
          console.error(`Statement: ${statement}`)
          throw error
        }
      }
    }
    
    console.log('✅ Database migration completed successfully')
    
  } catch (error) {
    console.error('❌ Database migration failed:', error)
    throw error
  } finally {
    await closeDatabase()
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('🎉 Migration script completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error)
      process.exit(1)
    })
}

module.exports = {
  runMigrations
}