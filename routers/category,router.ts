import express, { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { verifyToken } from '../middleware/token.middleware';
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '../services/category.service';
import { User } from '../types/user.type';

const categoryRouter = express.Router();

categoryRouter.post(
  '/categories',
  [body('name').isString().notEmpty()],
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name } = req.body;

      const category = await createCategory(name, (req as any).user as User);

      res.status(200).send({ category });
    } catch (error: any) {
      res.status(409).send(error.message);
    }
  },
);

categoryRouter.put(
  '/categories/:name',
  [param('name').isString().notEmpty(), body('newName').isString().notEmpty()],
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name } = req.params;
      const { newName } = req.body;

      const updatedCategory = await updateCategory(
        name,
        newName,
        (req as any).user as User,
      );

      res.status(200).send({ updatedCategory });
    } catch (error: any) {
      res.status(409).send(error.message);
    }
  },
);

categoryRouter.delete(
  '/categories/:name',
  [param('name').isString().notEmpty()],
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name } = req.params;

      const result = await deleteCategory(name, (req as any).user as User);

      res.status(200).send({ message: 'Category deleted successfully' });
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  },
);

export default categoryRouter;
