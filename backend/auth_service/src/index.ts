import express from 'express';
import cors from 'cors';
import authRouter from "./routes/auth"
import { initSubscriptionJobs } from './jobs/subscription.job';

const PORT = 8080;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.use("/fs", authRouter);

// Cron jobs
initSubscriptionJobs();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
