/**
 * Request Logger Middleware
 * Custom logging for API requests
 */

const fs = require('fs')
const path = require('path')

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

const requestLogger = (req, res, next) => {
  const startTime = Date.now()
  const timestamp = new Date().toISOString()
  
  // Log request details
  const requestLog = {
    timestamp,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    referer: req.get('Referer'),
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
    sessionId: req.sessionID,
    userId: req.user?.id || null
  }

  // Override res.end to capture response details
  const originalEnd = res.end
  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime
    
    const responseLog = {
      ...requestLog,
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      duration: `${duration}ms`,
      responseSize: res.get('Content-Length') || (chunk ? chunk.length : 0)
    }

    // Console logging based on environment
    if (process.env.NODE_ENV === 'development') {
      const statusColor = res.statusCode >= 400 ? '\x1b[31m' : 
                         res.statusCode >= 300 ? '\x1b[33m' : '\x1b[32m'
      const resetColor = '\x1b[0m'
      
      console.log(
        `${timestamp} ${statusColor}${res.statusCode}${resetColor} ${req.method} ${req.originalUrl} - ${duration}ms`
      )
    }

    // File logging for production and errors
    if (process.env.NODE_ENV === 'production' || res.statusCode >= 400) {
      const logFile = res.statusCode >= 400 ? 'error.log' : 'access.log'
      const logPath = path.join(logsDir, logFile)
      
      fs.appendFile(logPath, JSON.stringify(responseLog) + '\n', (err) => {
        if (err) {
          console.error('Failed to write log:', err)
        }
      })
    }

    // Call original end method
    originalEnd.call(this, chunk, encoding)
  }

  next()
}

module.exports = requestLogger