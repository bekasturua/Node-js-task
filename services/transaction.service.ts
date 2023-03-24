import { getDb } from '../database';
import { Search } from '../types/search.type';
import { User } from '../types/user.type';

export const createTransaction = async (
  categories: string[] = [],
  type: string,
  amount: number,
  description: string,
  user: User,
  status?: string,
) => {
  const db = getDb();

  try {
    let fetchedCategories = await db
      .collection('categories')
      .find({
        name: { $in: categories },
        user_id: user._id,
      })
      .toArray();

    if (categories.length !== fetchedCategories.length) {
      throw new Error('This user does not have this categories.');
    }

    if (status && type === 'income') {
      throw new Error('Income should not have status.');
    }

    if (!status && type === 'expense') {
      throw new Error('Expense should have a status.');
    }

    if (fetchedCategories.length === 0) {
      fetchedCategories = await db
        .collection('categories')
        .find({
          name: { $in: ['default'] },
        })
        .toArray();
    }

    const transaction = await db
      .collection('transactions')
      .insertOne({
        amount,
        type,
        description,
        status,
        user_id: user._id,
        category_ids: fetchedCategories.map(
          (fetchCategory) => fetchCategory._id,
        ),
        created_at: new Date(),
      });

    return transaction;
  } catch (error) {
    throw error;
  }
};

export const getTransactions = async (
  user: User,
  type?: string,
  amount?: string,
  order?: string,
  orderBy?: string,
  status?: string,
  from?: string,
  to?: string,
) => {
  const db = getDb();

  try {
    const search: Search = {};

    if (from) {
      search.created_at = { $gte: new Date(from) };
    }

    if (to) {
      search.created_at = { ...search.created_at, $lte: new Date(to) };
    }

    if (type && (type === 'income' || type === 'expense')) {
      search.type = type;
    }

    if (status && (status === 'processing' || status === 'completed')) {
      search.status = status;
    }

    if (amount) {
      search.amount = Number(amount);
    }

    const sort: any = {};
    if (orderBy) {
      if (order && (order === 'asc' || order === 'desc')) {
        const ord = order === 'asc' ? 1 : -1;
        sort[orderBy] = ord;
      }
    }

    return await db
      .collection('transactions')
      .find(search)
      .sort(sort)
      .toArray();
  } catch (error) {}
};
