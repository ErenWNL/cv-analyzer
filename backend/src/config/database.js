const path = require('path');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, '../../database/cv_analyzer.db')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, '../../database/migrations')
    },
    seeds: {
      directory: path.join(__dirname, '../../database/seeds')
    }
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, '../../database/migrations')
    },
    seeds: {
      directory: path.join(__dirname, '../../database/seeds')
    }
  }
};
