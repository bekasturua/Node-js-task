import { hash } from "bcrypt";
import { getDb } from "../database";

export const register = async (name: string, email: string, password: string) => {
    const hashedPassword = await hash(password, 10);

    const db = getDb();
    try {
        await db.collection("users").insertOne({ name, email, hashedPassword })
    } catch (error) {
        throw new Error("User with this email already exists");

    }
} 