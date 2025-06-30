import React, { useEffect, useState } from 'react';
import { Card, Select, Row, Col } from 'antd';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

const { Option } = Select;

interface MonthlySummary {
    month: string;
    revenue: number;
    expense: number;
}

const RevenueChart: React.FC = () => {
    const [fullData, setFullData] = useState<MonthlySummary[]>([]);
    const [filteredData, setFilteredData] = useState<MonthlySummary[]>([]);
    const [filterRange, setFilterRange] = useState<number>(6); // default to last 6 months

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get<{ monthlyData: MonthlySummary[] }>(
                    'https://financial-dashboard-z0nq.onrender.com/api/transactions/summary',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const monthly = res.data.monthlyData || [];
                setFullData(monthly);
                setFilteredData(monthly.slice(-filterRange));
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchData();
    }, []);

    const handleFilterChange = (value: number) => {
        setFilterRange(value);
        setFilteredData(fullData.slice(-value));
    };

    return (
        <Card
            style={{ marginBottom: '24px' }}
            title={
                <Row justify="space-between" align="middle">
                    <Col>📊 Monthly Revenue vs Expense</Col>
                    <Col>
                        <Select
                            defaultValue={6}
                            style={{ width: 160 }}
                            onChange={handleFilterChange}
                        >
                            <Option value={3}>Last 3 Months</Option>
                            <Option value={6}>Last 6 Months</Option>
                            <Option value={12}>Last 12 Months</Option>
                        </Select>
                    </Col>
                </Row>
            }
        >
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
                    <Line type="monotone" dataKey="expense" stroke="#ff4d4f" name="Expense" />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default RevenueChart;
