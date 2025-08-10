/**
 * CV Analyzer Backend Server
 * Main entry point for the application
 */

const dotenv = require('dotenv')
const path = require('path')

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
dotenv.config({ path: path.join(__dirname, envFile) })

const app = require('./src/app')
const { initializeDatabase } = require('./src/utils/database')

// Configuration
const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'

// Start server
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase()
    console.log('📊 Database initialized successfully')

    // Start the server
    const server = app.listen(PORT, () => {
      console.log('\n🚀 CV Analyzer Backend Server Started!')
      console.log(`📍 Environment: ${NODE_ENV}`)
      console.log(`🌐 Server URL: http://localhost:${PORT}`)
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`)
      console.log(`📝 Health Check: http://localhost:${PORT}/api/health`)
      console.log(`⏰ Started at: ${new Date().toISOString()}`)
      console.log('================================================\n')
      
      if (NODE_ENV === 'development') {
        console.log('💡 Development Tips:')
        console.log('   - API docs available at /api/docs (when implemented)')
        console.log('   - Upload endpoint: POST /api/cv/upload')
        console.log('   - Auth endpoint: POST /api/auth/login')
        console.log('   - Use tools like Postman to test APIs\n')
      }
    })

    // Graceful shutdown handling
    const gracefulShutdown = (signal) => {
      console.log(`\n🛑 ${signal} received. Starting graceful shutdown...`)
      
      server.close((err) => {
        if (err) {
          console.error('❌ Error during server shutdown:', err)
          process.exit(1)
        }
        
        console.log('✅ Server closed gracefully')
        console.log('👋 Goodbye!')
        process.exit(0)
      })

      // Force close after 30 seconds
      setTimeout(() => {
        console.error('⚠️  Forcing server shutdown after 30s timeout')
        process.exit(1)
      }, 30000)
    }

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error)
      gracefulShutdown('UNCAUGHT_EXCEPTION')
    })

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
      gracefulShutdown('UNHANDLED_REJECTION')
    })

  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Only start server if this file is run directly
if (require.main === module) {
  startServer()
}

module.exports = app