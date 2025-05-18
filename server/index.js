import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import morgan from 'morgan';

// Configuration
import { env } from './config/env.js';
import logger, { stream } from './config/logger.js';

// Routes
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';
import billRoutes from './routes/bills.js';
import warrantyRoutes from './routes/warranties.js';

// Middleware
import { authenticateToken } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
// import { rateLimiter, authLimiter } from './middleware/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(morgan('combined', { stream }));
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Apply rate limiting
// app.use('/api/auth', authLimiter);
// app.use(rateLimiter);

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('MongoDB Connected');
  } catch (error) {
    logger.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', authenticateToken, expenseRoutes);
app.use('/api/bills', authenticateToken, billRoutes);
app.use('/api/warranties', authenticateToken, warrantyRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware
app.use(errorHandler);

app.listen(env.PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});