import { hash, compareSync } from "bcrypt";
import { getDb } from "../database";
import jwt from "jsonwebtoken";
import { User } from "../types/user.type";

export const register = async (name: string, email: string, password: string) => {
    const hashedPassword = await hash(password, 10);

    const db = getDb();
    try {
        await db.collection("users").insertOne({ name, email, hashedPassword });

        const token = jwt.sign({ email }, process.env.JWT_TOKEN as string);

        return token;
    } catch (error) {
        throw new Error("User with this email already exists");

    }
}

export const login = async (email: string, password: string) => {

    const db = getDb();
    try {
        const user: User | null = await db.collection("users").findOne<User>({ email });

        if (user === null || !compareSync(password, user.hashedPassword)) {
            throw new Error("User with this email or password not found!");
        }

        const token = jwt.sign({ email }, process.env.JWT_TOKEN as string);

        return token;
    } catch (error) {
        throw error;

    }
} 