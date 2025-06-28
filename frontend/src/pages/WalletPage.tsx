// src/pages/WalletPage.tsx
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, List, Avatar, Spin, Typography, Breadcrumb } from 'antd';
import moment from 'moment';
import axios from 'axios';

const { Title } = Typography;

const WalletPage: React.FC = () => {
    const [summary, setSummary] = useState<any>(null);
    const [recent, setRecent] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem('token');
                const [sumRes, trxRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/transactions/summary', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:5000/api/transactions', {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { page: 1, limit: 5 }
                    })
                ]);
                setSummary(sumRes.data);
                setRecent(trxRes.data.transactions);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <Spin style={{ marginTop: 100 }} />;

    return (
        <>
            {/* Custom Header */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Breadcrumb items={[{ title: 'Dashboard' }, { title: 'Wallet' }]} />
                    <Title level={3} style={{ margin: 0 }}>Wallet</Title>
                </Col>
            </Row>

            {/* Summary Stats */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic title="Balance" prefix="₹" value={summary.balance.toLocaleString()} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Revenue" prefix="₹" value={summary.totalRevenue.toLocaleString()} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Expense" prefix="₹" value={summary.totalExpense.toLocaleString()} />
                    </Card>
                </Col>
            </Row>

            {/* Latest Transactions */}
            <Card title="Latest Transactions">
                <List
                    itemLayout="horizontal"
                    dataSource={recent}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={item.user_profile} />}
                                title={<span>{item.category}</span>}
                                description={moment(item.date).format('LL')}
                            />
                            <div style={{ fontWeight: 500 }}>₹{item.amount.toLocaleString()}</div>
                        </List.Item>
                    )}
                />
            </Card>
        </>
    );
};

export default WalletPage;
