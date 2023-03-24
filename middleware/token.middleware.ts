import jwt from 'jsonwebtoken';
import { getDb } from '../database';
import { User } from '../types/user.type';

export function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.JWT_TOKEN as string,
    async (err: any, user: any) => {
      if (err) return res.sendStatus(403);

      const db = getDb();

      const fetchedUser = await db
        .collection('users')
        .findOne<User>({ email: user.email });

      if (fetchedUser === null) {
        return res.sendStatus(404);
      }

      req.user = fetchedUser;

      next();
    },
  );
}
