import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://financial-dashboard-frontend-mocha.vercel.app'
        : 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/', (_req, res) => {
    res.json({ message: 'Financial Analytics API is running' });
});

// 404 fallback
app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

export default app;