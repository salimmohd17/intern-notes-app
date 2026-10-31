import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import notesRoutes from './routes/notes.js';
import { runMigrations } from '../database/migrate.js';
import { checkDatabaseConnection, pool } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*', // Allow frontend development port & preview
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/notes', notesRoutes);

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'MY LIFE NOTES Backend API',
    health: '/api/health',
    notes: '/api/notes',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  checkDatabaseConnection()
    .then(() => {
      res.json({
        status: 'OK',
        database: 'connected',
        service: 'Notes App Backend API',
        timestamp: new Date().toISOString()
      });
    })
    .catch((error) => {
      console.error('Database health check failed:', error);
      res.status(503).json({
        status: 'ERROR',
        database: 'disconnected',
        service: 'Notes App Backend API',
        timestamp: new Date().toISOString()
      });
    });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

async function startServer() {
  try {
    await runMigrations();
    app.listen(PORT, () => {
      console.log(`Notes API Server is running on port ${PORT}`);
      console.log(`Health check available at /api/health`);
    });
  } catch (error) {
    console.error('Backend startup failed:', error);
    await pool.end();
    process.exit(1);
  }
}

startServer();
