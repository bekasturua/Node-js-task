import express, { Request, Response } from 'express';
import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from '../services/auth.service';
import { body, validationResult } from 'express-validator';

const authRouter = express.Router();

authRouter.post(
  '/register',
  [
    body('name').isString().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      const token = await register(name, email, password);

      res.status(200).send({ token });
    } catch (error: any) {
      res.status(409).send(error.message);
    }
  },
);

authRouter.post(
  '/login',
  [body('email').isEmail(), body('password').isLength({ min: 6 })],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const token = await login(email, password);

      res.status(200).send({ token });
    } catch (error: any) {
      res.status(404).send(error.message);
    }
  },
);

authRouter.post(
  '/forgot-password',
  [body('email').isEmail()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;

      const forgotPasswordToken = await forgotPassword(email);

      res.status(200).send({ forgotPasswordToken });
    } catch (error: any) {
      res.status(404).send(error.message);
    }
  },
);

authRouter.post(
  '/reset-password',
  [
    body('forgotPasswordToken').isString().notEmpty(),
    body('password').isLength({ min: 6 }),
    body('repeatPassword').isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { forgotPasswordToken, password, repeatPassword } = req.body;

      await resetPassword(forgotPasswordToken, password, repeatPassword);

      res.status(200).send('Password reseted succesfully');
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  },
);

export default authRouter;
