const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which level to log based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define different log formats
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define file format (without colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: logFormat
  }),
  
  // Error log file
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5
  }),
  
  // Combined log file
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/combined.log'),
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5
  })
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format: fileFormat,
  transports,
  exitOnError: false
});

// Create a stream object for Morgan HTTP logging
logger.stream = {
  write: (message) => logger.http(message.trim())
};

// Helper methods for different log types
const logMethods = {
  error: (message, meta = {}) => {
    logger.error(message, meta);
  },

  warn: (message, meta = {}) => {
    logger.warn(message, meta);
  },

  info: (message, meta = {}) => {
    logger.info(message, meta);
  },

  http: (message, meta = {}) => {
    logger.http(message, meta);
  },

  debug: (message, meta = {}) => {
    logger.debug(message, meta);
  },

  // Log API requests
  api: (req, res, responseTime) => {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id || 'anonymous'
    };
    
    if (res.statusCode >= 400) {
      logger.warn('API Request', logData);
    } else {
      logger.info('API Request', logData);
    }
  },

  // Log database operations
  db: (operation, table, duration, success = true) => {
    const level = success ? 'info' : 'error';
    logger[level]('Database Operation', {
      operation,
      table,
      duration: `${duration}ms`,
      success
    });
  },

  // Log file operations
  file: (operation, filename, size, success = true) => {
    const level = success ? 'info' : 'error';
    logger[level]('File Operation', {
      operation,
      filename,
      size: `${size} bytes`,
      success
    });
  },

  // Log authentication events
  auth: (event, userId, success = true, details = {}) => {
    const level = success ? 'info' : 'warn';
    logger[level]('Authentication Event', {
      event,
      userId,
      success,
      ...details
    });
  }
};

module.exports = {
  logger,
  logMethods
};
