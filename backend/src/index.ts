import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from "./routes/auth";
import spaceRouter from "./routes/space";
import planRouter from "./routes/plan";
import categoryRouter from "./routes/category";
import transactionRouter from "./routes/transaction";
import dashboardRouter from "./routes/dashboard";
import scheduleRouter from "./routes/schedule";
import { initSubscriptionJobs } from './jobs/subscription';
import { connectDatabase } from './config/database';
import path from 'path';
import { seedCategories } from './models/category';
import { initScheduleJobs } from './jobs/schedule';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });
const PORT = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
}));
app.use(express.json());
app.use(cookieParser());

// Connect to database
connectDatabase()
    .then(() => {
        // Routes
        app.use("/auth", authRouter);
        app.use("/space", spaceRouter);
        app.use("/plan", planRouter);
        app.use("/category", categoryRouter);
        app.use("/transaction", transactionRouter);
        app.use("/dashboard", dashboardRouter);
        app.use("/schedule", scheduleRouter);

        // Cron jobs
        initSubscriptionJobs();
        initScheduleJobs();

        // seedCategories();

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
