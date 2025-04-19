import express, { Request, Response } from 'express';
import Plan from '../models/plan';

const planRouter = express.Router();

planRouter.get('/all', async (req: Request, res: Response) => {
    try {
        // Get all active plans, sorted by price
        const plans = await Plan.find({ active: true })
            .sort({ price: 1 }) // 1 for ascending order
            .select('-createdAt -updatedAt -__v');

        if (!plans || plans.length === 0) {
            res.status(404).json({
                success: false,
                error: { message: 'No active plans found' },
                data: null
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: {
                object: plans,
                count: plans.length,
                message: 'Plans retrieved successfully'
            },
            error: null
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error retrieving plans: ' + errorMessage },
            data: null
        });
    }
});


export default planRouter;