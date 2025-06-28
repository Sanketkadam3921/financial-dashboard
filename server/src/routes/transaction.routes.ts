import { Router, Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middlewares/auth.middleware';
import Transaction from '../models/transaction.model';
import { createCSV } from '../utils/csvExporter';

const router = Router();

// GET /api/transactions
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            category = '',
            status = '',
            sortBy = 'date',
            sortOrder = 'desc'
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        // Build filter object
        const filter: any = {};

        if (search) {
            filter.$or = [
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { user_id: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) filter.category = category;
        if (status) filter.status = status;

        // Build sort object
        const sort: any = {};
        sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

        const transactions = await Transaction.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        const total = await Transaction.countDocuments(filter);

        res.json({
            transactions,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalItems: total,
                itemsPerPage: limitNum
            }
        });
    } catch (err) {
        console.error('Fetch transactions error:', err);
        res.status(500).json({ message: 'Failed to fetch transactions' });
    }
});

// GET /api/transactions/summary
router.get('/summary', authenticate, async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const transactions = await Transaction.find();

        const totalRevenue = transactions
            .filter((t: { category: string; }) => t.category === 'Revenue')
            .reduce((sum: any, t: { amount: any; }) => sum + t.amount, 0);

        const totalExpense = transactions
            .filter((t: { category: string; }) => t.category === 'Expense')
            .reduce((sum: any, t: { amount: any; }) => sum + t.amount, 0);

        const totalInvestment = transactions
            .filter((t: { category: string; }) => t.category === 'Investment')
            .reduce((sum: any, t: { amount: any; }) => sum + t.amount, 0);

        const balance = totalRevenue - totalExpense - totalInvestment;

        // Monthly breakdown for charts
        const monthlyData: { month: string; revenue: number; expense: number; investment: number }[] = [];

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (let month = 0; month < 12; month++) {
            const monthRevenue = transactions.filter(
                (t) => new Date(t.date).getMonth() === month && t.category === 'Revenue'
            ).reduce((sum, t) => sum + t.amount, 0);

            const monthExpense = transactions.filter(
                (t) => new Date(t.date).getMonth() === month && t.category === 'Expense'
            ).reduce((sum, t) => sum + t.amount, 0);

            const monthInvestment = transactions.filter(
                (t) => new Date(t.date).getMonth() === month && t.category === 'Investment'
            ).reduce((sum, t) => sum + t.amount, 0);

            monthlyData.push({
                month: monthNames[month],
                revenue: monthRevenue,
                expense: monthExpense,
                investment: monthInvestment
            });
        }

        // Category breakdown for pie chart
        const categoryBreakdown = transactions.reduce((acc: any, transaction: { category: string | number; amount: any; }) => {
            if (!acc[transaction.category]) {
                acc[transaction.category] = 0;
            }
            acc[transaction.category] += transaction.amount;
            return acc;
        }, {});

        res.json({
            totalRevenue,
            totalExpense,
            totalInvestment,
            balance,
            monthlyData,
            categoryBreakdown
        });
    } catch (err) {
        console.error('Summary error:', err);
        res.status(500).json({ message: 'Failed to load summary' });
    }
});

// POST /api/transactions/export
router.post('/export', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { columns } = req.body;

        if (!columns || !Array.isArray(columns) || columns.length === 0) {
            res.status(400).json({ message: 'Invalid columns provided' });
            return;
        }

        // Validate columns
        const validColumns = ['date', 'amount', 'category', 'status', 'user_id', 'user_profile', 'description'];
        const invalidColumns = columns.filter(col => !validColumns.includes(col));

        if (invalidColumns.length > 0) {
            res.status(400).json({
                message: `Invalid columns: ${invalidColumns.join(', ')}`
            });
            return;
        }

        const transactions = await Transaction.find();
        const csvBuffer = await createCSV(transactions, columns);

        const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;

        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Length', csvBuffer.length);

        res.send(csvBuffer);
    } catch (err) {
        console.error('Export error:', err);
        res.status(500).json({ message: 'Export failed' });
    }
});

export default router;