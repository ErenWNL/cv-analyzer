/**
 * Health Check Routes
 * Routes for application health monitoring and status
 */

const express = require('express')
const router = express.Router()
const { StatusCodes } = require('http-status-codes')
const { getDatabase } = require('../utils/database')

// Basic health check
router.get('/', async (req, res) => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'CV Analyzer Backend',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      checks: {
        database: 'unknown',
        filesystem: 'unknown',
        environment: 'unknown'
      }
    }

    // Database health check
    try {
      const db = getDatabase()
      if (db) {
        // Simple query to test database connection
        const testQuery = new Promise((resolve, reject) => {
          db.get('SELECT 1 as test', [], (err, row) => {
            if (err) reject(err)
            else resolve(row)
          })
        })
        
        await testQuery
        healthStatus.checks.database = 'healthy'
      } else {
        healthStatus.checks.database = 'unhealthy - no connection'
      }
    } catch (error) {
      healthStatus.checks.database = `unhealthy - ${error.message}`
    }

    // Filesystem health check (uploads directory)
    try {
      const fs = require('fs')
      const path = require('path')
      const uploadsDir = path.join(__dirname, '../../uploads')
      
      if (fs.existsSync(uploadsDir)) {
        const stats = fs.statSync(uploadsDir)
        if (stats.isDirectory()) {
          healthStatus.checks.filesystem = 'healthy'
        } else {
          healthStatus.checks.filesystem = 'unhealthy - uploads path is not a directory'
        }
      } else {
        healthStatus.checks.filesystem = 'unhealthy - uploads directory does not exist'
      }
    } catch (error) {
      healthStatus.checks.filesystem = `unhealthy - ${error.message}`
    }

    // Environment variables check
    try {
      const requiredEnvVars = ['JWT_SECRET']
      const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
      
      if (missingVars.length === 0) {
        healthStatus.checks.environment = 'healthy'
      } else {
        healthStatus.checks.environment = `unhealthy - missing: ${missingVars.join(', ')}`
      }
    } catch (error) {
      healthStatus.checks.environment = `unhealthy - ${error.message}`
    }

    // Determine overall health status
    const unhealthyChecks = Object.values(healthStatus.checks).filter(
      check => check.startsWith('unhealthy')
    )

    if (unhealthyChecks.length > 0) {
      healthStatus.status = 'unhealthy'
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        success: false,
        data: healthStatus
      })
    }

    res.json({
      success: true,
      data: healthStatus
    })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'CV Analyzer Backend',
        error: error.message,
        uptime: process.uptime()
      }
    })
  }
})

// Detailed health check (more comprehensive)
router.get('/detailed', async (req, res) => {
  try {
    const detailedHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'CV Analyzer Backend',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: {
        seconds: process.uptime(),
        human: formatUptime(process.uptime())
      },
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        memory: {
          ...process.memoryUsage(),
          free: require('os').freemem(),
          total: require('os').totalmem()
        },
        cpuUsage: process.cpuUsage(),
        loadAverage: require('os').loadavg()
      },
      database: {
        status: 'unknown',
        stats: null
      },
      filesystem: {
        uploads: 'unknown'
      },
      configuration: {
        jwtSecret: !!process.env.JWT_SECRET,
        port: process.env.PORT || 5000,
        nodeEnv: process.env.NODE_ENV || 'development'
      }
    }

    // Database detailed check
    try {
      const db = getDatabase()
      if (db) {
        // Get database statistics
        const { allQuery } = require('../utils/database')
        
        const [userCount, cvCount, sessionCount] = await Promise.all([
          allQuery('SELECT COUNT(*) as count FROM users').then(rows => rows[0].count),
          allQuery('SELECT COUNT(*) as count FROM cvs').then(rows => rows[0].count),
          allQuery('SELECT COUNT(*) as count FROM sessions').then(rows => rows[0].count)
        ])

        detailedHealth.database = {
          status: 'healthy',
          stats: {
            users: userCount,
            cvs: cvCount,
            sessions: sessionCount
          }
        }
      } else {
        detailedHealth.database.status = 'unhealthy - no connection'
      }
    } catch (error) {
      detailedHealth.database.status = `unhealthy - ${error.message}`
    }

    // Filesystem detailed check
    try {
      const fs = require('fs')
      const path = require('path')
      const uploadsDir = path.join(__dirname, '../../uploads')
      
      if (fs.existsSync(uploadsDir)) {
        const stats = fs.statSync(uploadsDir)
        const files = fs.readdirSync(uploadsDir, { withFileTypes: true })
        
        detailedHealth.filesystem.uploads = {
          status: 'healthy',
          path: uploadsDir,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          fileCount: files.filter(f => f.isFile()).length,
          dirCount: files.filter(f => f.isDirectory()).length
        }
      } else {
        detailedHealth.filesystem.uploads = {
          status: 'unhealthy',
          error: 'uploads directory does not exist'
        }
      }
    } catch (error) {
      detailedHealth.filesystem.uploads = {
        status: 'unhealthy',
        error: error.message
      }
    }

    res.json({
      success: true,
      data: detailedHealth
    })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        message: 'Health check failed',
        details: error.message
      }
    })
  }
})

// Readiness probe (for container orchestration)
router.get('/ready', async (req, res) => {
  try {
    // Check if critical services are ready
    const db = getDatabase()
    
    if (!db) {
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        success: false,
        ready: false,
        message: 'Database not ready'
      })
    }

    // Test database connection
    const testQuery = new Promise((resolve, reject) => {
      db.get('SELECT 1 as test', [], (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })
    
    await testQuery

    res.json({
      success: true,
      ready: true,
      message: 'Service is ready'
    })

  } catch (error) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      success: false,
      ready: false,
      message: 'Service not ready',
      error: error.message
    })
  }
})

// Liveness probe (for container orchestration)
router.get('/live', (req, res) => {
  res.json({
    success: true,
    alive: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Helper function to format uptime in human readable format
function formatUptime(uptimeSeconds) {
  const days = Math.floor(uptimeSeconds / 86400)
  const hours = Math.floor((uptimeSeconds % 86400) / 3600)
  const minutes = Math.floor((uptimeSeconds % 3600) / 60)
  const seconds = Math.floor(uptimeSeconds % 60)

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0) parts.push(`${seconds}s`)

  return parts.join(' ') || '0s'
}

module.exports = router