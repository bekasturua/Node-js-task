import express, { Request, Response } from 'express';
import { mongoConnect } from './database';
import authRouter from './routers/auth.router';
import dotenv from "dotenv";
import categoryRouter from './routers/category,router';

const app = express();
dotenv.config();

app.use(express.json());


app.use(authRouter);

app.use(categoryRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

mongoConnect(() => {
    app.listen(3000);
});