import express, { Request, Response } from 'express';
import { sendEmail } from '../services/email.service';
import { MailOptions, MailRequest } from '../interfaces/requests';
import EmailHistory from '../models/email_history';

const emailRouter = express.Router();

emailRouter.post('/send/', async (req: Request, res: Response) => {
    try {
        const mailReq: MailRequest = req.body

        const response = await sendEmail(mailReq.mailOptions);

        if (response) {
            const emailHistory = await EmailHistory.create(mailReq);

            res.status(200).json({
                success: true,
                data: {
                    message: 'Email sent successfully',
                },
                error: null
            });
        } else {
            res.status(500).json({
                success: false,
                data: {
                    message: 'Failed to send email',
                },
                error: null
            });
        }
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error deleting space: ' + errorMessage },
            data: null
        });
    }

})

export default emailRouter;
