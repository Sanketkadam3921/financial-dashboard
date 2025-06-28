"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const csvExporter_1 = require("../utils/csvExporter");
const router = (0, express_1.Router)();
// GET /api/transactions
router.get('/', auth_middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, search = '', category = '', status = '', sortBy = 'date', sortOrder = 'desc' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Build filter object
        const filter = {};
        if (search) {
            filter.$or = [
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { user_id: { $regex: search, $options: 'i' } }
            ];
        }
        if (category)
            filter.category = category;
        if (status)
            filter.status = status;
        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const transactions = yield transaction_model_1.default.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNum);
        const total = yield transaction_model_1.default.countDocuments(filter);
        res.json({
            transactions,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalItems: total,
                itemsPerPage: limitNum
            }
        });
    }
    catch (err) {
        console.error('Fetch transactions error:', err);
        res.status(500).json({ message: 'Failed to fetch transactions' });
    }
}));
// GET /api/transactions/summary
router.get('/summary', auth_middleware_1.authenticate, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield transaction_model_1.default.find();
        const totalRevenue = transactions
            .filter((t) => t.category === 'Revenue')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions
            .filter((t) => t.category === 'Expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalInvestment = transactions
            .filter((t) => t.category === 'Investment')
            .reduce((sum, t) => sum + t.amount, 0);
        const balance = totalRevenue - totalExpense - totalInvestment;
        // Monthly breakdown for charts
        const monthlyData = [];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let month = 0; month < 12; month++) {
            const monthRevenue = transactions.filter((t) => new Date(t.date).getMonth() === month && t.category === 'Revenue').reduce((sum, t) => sum + t.amount, 0);
            const monthExpense = transactions.filter((t) => new Date(t.date).getMonth() === month && t.category === 'Expense').reduce((sum, t) => sum + t.amount, 0);
            const monthInvestment = transactions.filter((t) => new Date(t.date).getMonth() === month && t.category === 'Investment').reduce((sum, t) => sum + t.amount, 0);
            monthlyData.push({
                month: monthNames[month],
                revenue: monthRevenue,
                expense: monthExpense,
                investment: monthInvestment
            });
        }
        // Category breakdown for pie chart
        const categoryBreakdown = transactions.reduce((acc, transaction) => {
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
    }
    catch (err) {
        console.error('Summary error:', err);
        res.status(500).json({ message: 'Failed to load summary' });
    }
}));
// POST /api/transactions/export
router.post('/export', auth_middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const transactions = yield transaction_model_1.default.find();
        const csvBuffer = yield (0, csvExporter_1.createCSV)(transactions, columns);
        const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Length', csvBuffer.length);
        res.send(csvBuffer);
    }
    catch (err) {
        console.error('Export error:', err);
        res.status(500).json({ message: 'Export failed' });
    }
}));
exports.default = router;
