import express, { Request, Response } from 'express';
import Transaction from '../models/transaction';
import { authenticate } from '../middlewares/auth';

const transactionRouter = express.Router();

transactionRouter.post('/', authenticate, async (req: Request, res: Response) => {
    try {
        const userId: string = (req as any).user.id;

        const transaction = await Transaction.create({ ...req.body, userId: userId })

        res.status(201).json({
            success: true,
            data: {
                object: transaction,
                message: 'Transaction created successfully'
            },
            error: null
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error creating transaction: ' + errorMessage },
            data: null
        });
    }

})

transactionRouter.put('/:id', authenticate, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId: string = (req as any).user.id;

        const existingTransaction = await Transaction.findOne({ _id: id, userId: userId });

        if (!existingTransaction) {
            res.status(404).json({
                success: false,
                error: { message: 'Transation not Found' },
                data: null
            });
            return;
        }

        const transaction = await Transaction.updateOne({ _id: id }, { $set: { ...req.body, userId: userId } })

        res.status(200).json({
            success: true,
            data: {
                object: transaction,
                message: 'Transaction updated successfully'
            },
            error: null
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error updating transaction: ' + errorMessage },
            data: null
        });
    }

})

transactionRouter.delete('/:id', authenticate, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId: string = (req as any).user.id;

        const existingTransaction = await Transaction.findOne({ _id: id, userId: userId });

        if (!existingTransaction) {
            res.status(404).json({
                success: false,
                error: { message: 'Transaction not Found' },
                data: null
            });
            return;
        }

        await Transaction.deleteOne({ _id: id });

        res.status(200).json({ success: true, message: "Transaction deleted successfully" });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error deleting transaction: ' + errorMessage },
            data: null
        });
    }
})

transactionRouter.get('/user/:spaceid/:limit/:skip', authenticate, async (req: Request, res: Response) => {
    try {
        const userId: string = (req as any).user.id;
        const { spaceid, skip, limit } = req.params;
        const transactions = await Transaction.find({
            $and: [
                { userId: userId },
                {
                    $or: [
                        { from: spaceid },
                        { to: spaceid }
                    ]
                }
            ]
        })
            .skip(Number.parseInt(skip))
            .limit(Number.parseInt(limit))
            .sort({ date: -1 });

        const total = await Transaction.countDocuments({
            $and: [
                { userId: userId },
                {
                    $or: [
                        { from: spaceid },
                        { to: spaceid }
                    ]
                }
            ]
        });
        res.status(200).json({
            success: true,
            data: {
                object: {
                    transactions, total
                },
                message: 'Transactions retrieved successfully!'
            },
            error: null
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error finding transactions: ' + errorMessage },
            data: null
        });
    }
})

export default transactionRouter;
