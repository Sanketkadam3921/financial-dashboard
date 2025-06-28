// src/pages/AnalyticsPage.tsx
import React, { useEffect, useState } from 'react';
import {
    Card,
    Spin,
    Row,
    Col,
    Typography,
    Breadcrumb,
    Statistic,
    List,
    Select,
    Button,
    Modal,
    message
} from 'antd';
import {
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import { DownloadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const COLORS = ['#00C49F', '#FF6B6B', '#8884d8'];

const AnalyticsPage: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState('2024');
    const [monthFilter, setMonthFilter] = useState<string | undefined>(undefined);
    const [category, setCategory] = useState<'All' | 'Revenue' | 'Expense' | 'Investment'>('All');
    const [isExportModalVisible, setIsExportModalVisible] = useState(false);


    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/transactions/summary', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { year }
                });
                setSummary(res.data);
                setData(res.data.monthlyData || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [year]);

    const filteredData = data
        .filter(d => !monthFilter || d.month === monthFilter)
        .map(d => ({
            ...d,
            revenue: category === 'Revenue' || category === 'All' ? d.revenue : 0,
            expense: category === 'Expense' || category === 'All' ? d.expense : 0,
            investment: category === 'Investment' || category === 'All' ? d.investment : 0,
        }));

    if (loading) return <Spin style={{ marginTop: 100 }} />;

    // Monthly KPI stats
    const avgRevenue = summary.totalRevenue / 12;
    const avgExpense = summary.totalExpense / 12;

    // Balance trend data
    const balanceTrend = filteredData.map(item => ({
        month: item.month,
        balance: item.revenue - item.expense - item.investment
    }));

    // Category breakdown pie chart
    const categoryData = [
        { name: 'Revenue', value: summary?.categoryBreakdown?.Revenue || 0 },
        { name: 'Expense', value: summary?.categoryBreakdown?.Expense || 0 },
        { name: 'Investment', value: summary?.categoryBreakdown?.Investment || 0 },
    ];

    // Top spending months
    const topSpending = [...data].sort((a, b) => b.expense - a.expense).slice(0, 3);

    // Revenue growth comparison
    const growthData = data.map((curr, idx, arr) => {
        const prev = arr[idx - 1];
        if (!prev || prev.revenue === 0) return { month: curr.month, growth: 0 };
        const change = ((curr.revenue - prev.revenue) / prev.revenue) * 100;
        return { month: curr.month, growth: Math.round(change) };
    });

    // Forecasting future revenue using linear regression
    const forecast = () => {
        const x = data.map((_, i) => i + 1); // 1 to 12
        const y = data.map(d => d.revenue);
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
        const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return [1, 2, 3].map(i => ({
            month: `Month ${12 + i}`,
            revenue: parseFloat((intercept + slope * (12 + i)).toFixed(2)),
            forecast: true,
        }));
    };

    const forecastedData = forecast();

    const forecastChartData = [...data.map(d => ({
        month: d.month,
        revenue: d.revenue,
        forecast: false,
    })), ...forecastedData];

    const downloadJSON = () => {
        const jsonData = JSON.stringify(summary, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${year}.json`;
        a.click();
        URL.revokeObjectURL(url);
        message.success('JSON download started');
    };

    const downloadCSV = () => {
        const headers = ['Month', 'Revenue', 'Expense', 'Investment'];
        const rows = data.map(d => [d.month, d.revenue, d.expense, d.investment]);
        const csvContent =
            [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${year}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        message.success('CSV download started');
    };
    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Breadcrumb items={[{ title: 'Dashboard' }, { title: 'Analytics' }]} />
                    <Title level={3} style={{ margin: 0 }}>Analytics</Title>
                </Col>
                <Col>
                    <Select value={year} onChange={val => setYear(val)} style={{ width: 100, marginRight: 8 }}>
                        {[2024, 2023, 2022].map(y => (
                            <Option key={y} value={y.toString()}>{y}</Option>
                        ))}
                    </Select>
                    <Select
                        allowClear
                        placeholder="Month"
                        value={monthFilter}
                        onChange={val => setMonthFilter(val)}
                        style={{ width: 120, marginRight: 8 }}
                    >
                        {data.map(d => <Option key={d.month} value={d.month}>{d.month}</Option>)}
                    </Select>
                    <Select value={category} onChange={val => setCategory(val)} style={{ width: 150, marginRight: 8 }}>
                        <Option value="All">All Categories</Option>
                        <Option value="Revenue">Revenue</Option>
                        <Option value="Expense">Expense</Option>
                        <Option value="Investment">Investment</Option>
                    </Select>
                    <Button icon={<DownloadOutlined />} onClick={() => setIsExportModalVisible(true)}>Export</Button>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={12}><Statistic title="Avg. Monthly Revenue" prefix="₹" value={avgRevenue.toFixed(2)} /></Col>
                <Col span={12}><Statistic title="Avg. Monthly Expense" prefix="₹" value={avgExpense.toFixed(2)} /></Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title="Monthly Revenue vs Expense">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={filteredData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                                <Bar dataKey="expense" fill="#ff7675" name="Expense" />
                                <Bar dataKey="investment" fill="#8884d8" name="Investment" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="Balance Over Time">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={balanceTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="balance" stroke="#1890ff" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="Revenue vs Expense Breakdown">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="Top Spending Months">
                        <List
                            dataSource={topSpending}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.month}
                                        description={`Expense: ₹${item.expense.toLocaleString()}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="Monthly Revenue Growth (%)">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="growth" stroke="#fa541c" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title="Forecasted Revenue (Next 3 Months)">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={forecastChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#00c853"
                                    strokeDasharray="5 5"
                                    dot={{ r: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
            <Modal
                title="Export Analytics"
                open={isExportModalVisible}
                onCancel={() => setIsExportModalVisible(false)}
                footer={[
                    <Button key="json" onClick={downloadJSON}>Download JSON</Button>,
                    <Button key="csv" type="primary" onClick={downloadCSV}>Download CSV</Button>
                ]}
            >
                <p>You can download the analytics summary as JSON or CSV for reporting.</p>
            </Modal>
        </>
    );
};

export default AnalyticsPage;
