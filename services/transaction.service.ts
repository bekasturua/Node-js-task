import { getDb } from "../database";
import { User } from "../types/user.type";

export const createTransaction = async (categories: string[] = [], type: string, amount: number, description: string, user: User, status?: string) => {

    const db = getDb();

    try {
        let fetchedCategories = await db.collection("categories").find({

            name: { $in: categories },
            user_id: user._id
        }).toArray();

        if (categories.length !== fetchedCategories.length) {
            throw new Error("This user does not have this categories.");
        }

        if (status && type === 'income') {
            throw new Error("Income should not have status.");
        }

        if (!status && type === 'expense') {
            throw new Error("Expense should have a status.");
        }

        if (fetchedCategories.length === 0) {
            fetchedCategories = await db.collection("categories").find({
                name: { $in: ["default"] },
                user_id: user._id
            }).toArray();
        }



        const transaction = await db.collection("transactions").insertOne({ amount, type, description, status, user_id: user._id, category_ids: fetchedCategories.map(fetchCategory => fetchCategory._id) });


        return transaction;

    } catch (error) {
        throw error;
    }
}

