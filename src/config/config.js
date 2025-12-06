require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/blogdb',
    dialect: 'postgres'
  },
  test: {
    url: process.env.TEST_DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/blogdb_test',
    dialect: 'postgres'
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  }
};
