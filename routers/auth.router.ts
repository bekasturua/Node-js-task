
import express, { Request, Response } from 'express';
import { login, register } from '../services/auth.service.';
import { body, validationResult } from 'express-validator';


const authRouter = express.Router();


authRouter.post("/register", [
    body('name').isString().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        const token = await register(name, email, password)

        res.status(200).send({ token })
    } catch (error: any) {
        res.status(409).send(error.message)
    }
});

authRouter.post("/login", [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const token = await login(email, password)

        res.status(200).send({ token })
    } catch (error: any) {
        res.status(404).send(error.message)
    }
});

export default authRouter;