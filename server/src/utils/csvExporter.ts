import { createObjectCsvStringifier } from 'csv-writer';
import { ITransaction } from '../models/transaction.model';

export const createCSV = async (
    transactions: ITransaction[],
    columns: string[]
): Promise<Buffer> => {
    try {
        const csvStringifier = createObjectCsvStringifier({
            header: columns.map((col) => ({
                id: col,
                title: col.charAt(0).toUpperCase() + col.slice(1).replace('_', ' ')
            })),
        });

        const records = transactions.map((transaction) => {
            const record: Record<string, any> = {};
            columns.forEach((col) => {
                let value = (transaction as any)[col];

                // Format date fields
                if (col === 'date' && value instanceof Date) {
                    value = value.toISOString().split('T')[0];
                }

                // Format amount
                if (col === 'amount' && typeof value === 'number') {
                    value = value.toFixed(2);
                }

                record[col] = value || '';
            });
            return record;
        });

        const csvHeader = csvStringifier.getHeaderString();
        const csvBody = csvStringifier.stringifyRecords(records);
        const fullCSV = csvHeader + csvBody;

        return Buffer.from(fullCSV, 'utf-8');
    } catch (error) {
        console.error('Error creating CSV:', error);
        throw new Error('Failed to create CSV');
    }
};