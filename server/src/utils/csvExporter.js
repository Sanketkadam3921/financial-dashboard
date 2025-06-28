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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCSV = void 0;
const csv_writer_1 = require("csv-writer");
const createCSV = (transactions, columns) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const csvStringifier = (0, csv_writer_1.createObjectCsvStringifier)({
            header: columns.map((col) => ({
                id: col,
                title: col.charAt(0).toUpperCase() + col.slice(1).replace('_', ' ')
            })),
        });
        const records = transactions.map((transaction) => {
            const record = {};
            columns.forEach((col) => {
                let value = transaction[col];
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
    }
    catch (error) {
        console.error('Error creating CSV:', error);
        throw new Error('Failed to create CSV');
    }
});
exports.createCSV = createCSV;
