import { ObjectId } from "mongodb";
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


export const deleteCategory = async (name: string, user: User) => {

    const db = getDb();

    try {
        const category = await db.collection("categories").findOne({ name, user_id: user._id });
        const defaultCategory = await db.collection("categories").findOne({ name: "default" });

        if (category === null) {
            throw new Error("Category not found");
        }
        const transactions = await db.collection("transactions").find({
            "category_ids": { $elemMatch: { $eq: category._id } }
        }).toArray();

        transactions.map(async (transaction) => {
            const categoryIds = transaction.category_ids.map((category_id: ObjectId) => category_id.toString())
            const categoryToDeleteIndex = categoryIds.indexOf(category._id.toString());

            transaction.category_ids.splice(categoryToDeleteIndex, 1);

            const defaultCategoryIndex = categoryIds.indexOf(defaultCategory?._id.toString());
            if (defaultCategoryIndex === -1) {
                transaction.category_ids.push(defaultCategory?._id);
            }
            await db.collection("transactions").updateOne({ _id: transaction._id }, { $set: { category_ids: transaction.category_ids } });
        })

        await db.collection("categories").deleteOne({ _id: category._id });



        return category;
    } catch (error) {
        throw error;
    }
}


