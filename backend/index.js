/**
 * Lambda entrypoint and local fallback for backend
 */

const serverless = require('serverless-http');
const app = require('./src/app');
const db = require('./src/config/db');

const handler = serverless(app);
let lambdaInitialized = false;

const startServer = async () => {
  try {
    console.log('Initializing database...')
    await db.initializeDB()
    console.log('Database initialized')

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

if (require.main === module) {
  startServer()
}

module.exports.handler = async (event, context) => {
  if (!lambdaInitialized) {
    await db.initializeDB()
    lambdaInitialized = true
  }
  return handler(event, context)
}
