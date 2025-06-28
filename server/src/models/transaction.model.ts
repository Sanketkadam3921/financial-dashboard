import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
    date: Date;
    amount: number;
    category: string;
    status: 'Paid' | 'Pending';
    user_id: string;
    user_profile?: string;
    description?: string;
}

const TransactionSchema = new Schema<ITransaction>(
    {
        date: {
            type: Date,
            required: [true, 'Date is required']
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount cannot be negative']
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['Revenue', 'Expense', 'Investment', 'Other']
        },
        status: {
            type: String,
            enum: ['Paid', 'Pending'],
            required: [true, 'Status is required']
        },
        user_id: {
            type: String,
            required: [true, 'User ID is required']
        },
        user_profile: {
            type: String
        },
        description: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
