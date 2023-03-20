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


