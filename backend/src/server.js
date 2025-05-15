import app from './app.js';
import connectDB from './config/db.js';

// Get port from environment variable or use default
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Log CORS configuration
console.log(`CORS configured to allow origin: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export default server;