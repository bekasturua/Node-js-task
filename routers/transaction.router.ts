
import express, { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { verifyToken } from '../middleware/token.middleware';
import { createTransaction } from '../services/transaction.service';
import { User } from '../types/user.type';


const transactionRouter = express.Router();



transactionRouter.post("/transactions", [
    body('categories').optional().isArray(),
    body('categories.*').isString().notEmpty(),
    body('type').isString().isIn(['income', 'expense']).notEmpty(),
    body('amount').isNumeric().notEmpty(),
    body('description').isString().notEmpty(),
    body('status').optional().isString().isIn(['processing', 'completed'])

], verifyToken, async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { categories, type, amount, description, status } = req.body;

        const transaction = await createTransaction(categories, type, amount, description, (req as any).user as User, status)

        res.status(200).send({ transaction })
    } catch (error: any) {
        res.status(400).send(error.message)
    }
});

export default transactionRouter;
