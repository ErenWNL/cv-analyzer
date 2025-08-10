/**
 * Database Seeding Utility
 * Seeds the database with initial/sample data
 */

const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const { initializeDatabase, runQuery, getQuery, closeDatabase } = require('./database')

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Initialize database connection
    await initializeDatabase()
    
    // Check if admin user already exists
    const existingAdmin = await getQuery(
      'SELECT id FROM users WHERE email = ? AND role = ?',
      ['admin@cvanalyzer.com', 'admin']
    )
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists, skipping admin creation')
    } else {
      // Create admin user
      const adminId = uuidv4()
      const adminPassword = 'Admin123!' // Change this in production!
      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      
      await runQuery(
        `INSERT INTO users (id, email, password, first_name, last_name, role, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [adminId, 'admin@cvanalyzer.com', hashedPassword, 'System', 'Administrator', 'admin', true]
      )
      
      console.log('👑 Admin user created successfully')
      console.log('   Email: admin@cvanalyzer.com')
      console.log('   Password: Admin123!')
      console.log('   ⚠️  Please change the admin password after first login!')
    }
    
    // Check if sample user already exists
    const existingUser = await getQuery(
      'SELECT id FROM users WHERE email = ?',
      ['user@example.com']
    )
    
    if (existingUser) {
      console.log('ℹ️  Sample user already exists, skipping user creation')
    } else {
      // Create sample regular user
      const userId = uuidv4()
      const userPassword = 'User123!'
      const hashedUserPassword = await bcrypt.hash(userPassword, 12)
      
      await runQuery(
        `INSERT INTO users (id, email, password, first_name, last_name, role, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, 'user@example.com', hashedUserPassword, 'John', 'Doe', 'user', true]
      )
      
      console.log('👤 Sample user created successfully')
      console.log('   Email: user@example.com')
      console.log('   Password: User123!')
    }
    
    // Add sample environment check
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode detected')
      
      // Create additional sample users if needed
      const sampleUsers = [
        {
          email: 'jane@example.com',
          password: 'Jane123!',
          first_name: 'Jane',
          last_name: 'Smith',
          role: 'user'
        },
        {
          email: 'bob@example.com',
          password: 'Bob123!',
          first_name: 'Bob',
          last_name: 'Johnson',
          role: 'user'
        }
      ]
      
      for (const userData of sampleUsers) {
        const existing = await getQuery('SELECT id FROM users WHERE email = ?', [userData.email])
        
        if (!existing) {
          const userId = uuidv4()
          const hashedPassword = await bcrypt.hash(userData.password, 12)
          
          await runQuery(
            `INSERT INTO users (id, email, password, first_name, last_name, role, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, userData.email, hashedPassword, userData.first_name, userData.last_name, userData.role, true]
          )
          
          console.log(`👤 Created sample user: ${userData.email}`)
        }
      }
    }
    
    console.log('✅ Database seeding completed successfully')
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    throw error
  } finally {
    await closeDatabase()
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding script completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding script failed:', error)
      process.exit(1)
    })
}

module.exports = {
  seedDatabase
}