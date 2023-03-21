import { getDb } from "../database";
import { User } from "../types/user.type";

export const createCategory = async (name: string, user: User) => {

    const db = getDb();

    try {
        const category = await db.collection("categories").insertOne({ name, user_id: user._id });

        return category;
    } catch (error) {
        throw new Error("Category already exists");
    }
}

export const updateCategory = async (name: string, newName: string, user: User) => {

    const db = getDb();

    try {
        const category = await db.collection("categories").updateOne({ name, user_id: user._id }, { $set: { name: newName } });

        if (category.modifiedCount === 0) {
            throw new Error("Can not find category with the name or it does not belong to this user. ");
        }

        return category;
    } catch (error) {
        throw error;
    }
}