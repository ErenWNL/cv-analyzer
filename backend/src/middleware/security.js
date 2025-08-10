/**
 * Additional Security Middleware
 * Custom security measures beyond helmet
 */

const { StatusCodes } = require('http-status-codes')

const securityMiddleware = (req, res, next) => {
  // Remove sensitive headers
  res.removeHeader('X-Powered-By')
  res.removeHeader('Server')

  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')

  // Block suspicious user agents
  const userAgent = req.get('User-Agent')
  const suspiciousAgents = [
    /sqlmap/i,
    /nikto/i,
    /nessus/i,
    /nmap/i,
    /masscan/i,
    /zap/i
  ]

  if (userAgent && suspiciousAgents.some(pattern => pattern.test(userAgent))) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      error: {
        message: 'Access denied',
        code: 'SUSPICIOUS_USER_AGENT'
      }
    })
  }

  // Block requests with suspicious headers
  const suspiciousHeaders = [
    'X-Originating-IP',
    'X-Forwarded-Host',
    'X-Remote-IP'
  ]

  for (const header of suspiciousHeaders) {
    if (req.get(header)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        error: {
          message: 'Access denied',
          code: 'SUSPICIOUS_HEADER'
        }
      })
    }
  }

  // Validate Content-Type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type')
    
    if (!contentType) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'Content-Type header required',
          code: 'MISSING_CONTENT_TYPE'
        }
      })
    }

    // Allow only specific content types
    const allowedTypes = [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data'
    ]

    const isValidType = allowedTypes.some(type => 
      contentType.toLowerCase().includes(type)
    )

    if (!isValidType) {
      return res.status(StatusCodes.UNSUPPORTED_MEDIA_TYPE).json({
        success: false,
        error: {
          message: 'Unsupported Content-Type',
          code: 'INVALID_CONTENT_TYPE',
          allowed: allowedTypes
        }
      })
    }
  }

  // Add request ID for tracking
  req.requestId = require('uuid').v4()
  res.setHeader('X-Request-ID', req.requestId)

  next()
}

module.exports = securityMiddleware