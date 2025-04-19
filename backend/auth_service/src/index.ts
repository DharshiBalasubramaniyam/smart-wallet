import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from "./routes/auth";
import planRouter from "./routes/plan";
import { initSubscriptionJobs } from './jobs/subscription.job';
import { connectDatabase } from './config/database';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });
const PORT = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(express.json());
app.use(cookieParser());

// Connect to database
connectDatabase()
    .then(() => {
        // Routes
        app.use("/auth", authRouter);
        app.use("/plan", planRouter);

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
