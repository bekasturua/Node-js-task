import { ObjectId } from 'mongodb';

export interface Transaction {
  _id: ObjectId;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  status: 'processing' | 'completed' | null;
  user_id: ObjectId;
  category_ids: Array<ObjectId>;
  created_at: Date;
}
