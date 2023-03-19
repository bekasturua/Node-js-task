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

export const forgotPassword = async (email: string) => {

    const db = getDb();
    try {
        const user: User | null = await db.collection("users").findOne<User>({ email });

        if (user === null) {
            throw new Error("User with this email not found!");
        }

        const forgotPasswordToken = jwt.sign({ email, purpose: "reset_password" }, process.env.JWT_TOKEN as string);

        return forgotPasswordToken;
    } catch (error) {
        throw error;

    }
}


export const resetPassword = async (forgotPasswordToken: string, password: string, repeatPassword: string) => {

    const db = getDb();
    try {
        jwt.verify(forgotPasswordToken, process.env.JWT_TOKEN as string);

        const decoded: any = jwt.decode(forgotPasswordToken);

        const email = decoded["email"];
        const purpose = decoded['purpose'];

        if (purpose !== 'reset_password') {
            throw new Error("Token purpose is not reset password");
        }
        if (password !== repeatPassword) {
            throw new Error("Password and repeatPassword are not same.");
        }

        const hashedPassword = await hash(password, 10);

        await db.collection("users").updateOne({ email }, { $set: { hashedPassword } });



    } catch (error) {
        throw error;

    }
}