import express, { Request, Response } from 'express';
import Category from '../models/category';
import { authenticate } from '../middlewares/auth';

const categoryRouter = express.Router();

categoryRouter.get('/', authenticate, async (req: Request, res: Response) => {
    try {
        const userId: string = (req as any).user.id;
        const categories = await Category.find();
        res.status(200).json({
            success: true,
            data: {
                object: categories,
                message: 'Categories retrived successfully!'
            },
            error: null
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error finding categories: ' + errorMessage },
            data: null
        });
    }
})

export default categoryRouter;
