import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import Route Handlers
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import countryRoutes from './routes/countryRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import quizRoutes from './routes/quizRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in development for seamless local pair-programming
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP logger in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'WORLDLY Global Explorer & Atlas Backend',
    version: '1.0.0',
  });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the WORLDLY REST API',
    docs: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        profile: 'PUT /api/auth/profile',
      },
      tasks: {
        list: 'GET /api/tasks',
        create: 'POST /api/tasks',
        get: 'GET /api/tasks/:id',
        update: 'PUT /api/tasks/:id',
        delete: 'DELETE /api/tasks/:id',
      },
      countries: {
        list: 'GET /api/countries',
        get: 'GET /api/countries/:id',
      },
      bookmarks: {
        list: 'GET /api/bookmarks',
        toggle: 'POST /api/bookmarks/:countryId',
        remove: 'DELETE /api/bookmarks/:countryId',
      },
      quiz: {
        daily: 'GET /api/quiz/daily',
        answer: 'POST /api/quiz/answer',
      },
    },
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/quiz', quizRoutes);

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found`,
  });
});

// Central Error Handler
app.use(errorHandler);

// Start Server and Connect DB
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 WORLDLY Backend server is running on http://localhost:${PORT}`);
      console.log(`🌐 API documentation available at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

