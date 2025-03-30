import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from "./routes/auth";
import { initSubscriptionJobs } from './jobs/subscription.job';
import { connectDatabase } from './config/database';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });
const PORT = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDatabase()
    .then(() => {
        // Root route
        app.use("/auth", authRouter);

        // Cron jobs
        initSubscriptionJobs();

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });

// Handle unexpected errors
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
