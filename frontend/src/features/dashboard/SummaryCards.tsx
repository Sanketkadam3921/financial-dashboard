import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Spin, Space } from 'antd';
import {
    RiseOutlined,
    FallOutlined,
    DollarCircleOutlined,
    AccountBookOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

interface SummaryData {
    totalRevenue: number;
    totalExpense: number;
    balance: number;
}

const SummaryCards: React.FC = () => {
    const [data, setData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get<SummaryData>(
                    'https://financial-dashboard-z0nq.onrender.com/api/transactions/summary',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setData(res.data);
            } catch (error) {
                console.error('Error fetching summary cards:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading || !data) return <Spin />;

    const savings = data.totalRevenue - data.totalExpense;

    const cardStyle: React.CSSProperties = {
        borderRadius: 12,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    };

    const amountStyle: React.CSSProperties = {
        fontSize: '1.8rem',
        fontWeight: 600,
    };

    const iconStyle = {
        fontSize: '2rem',
        marginRight: '8px',
    };

    return (
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
            <Col xs={24} sm={12} md={6}>
                <Card style={cardStyle}>
                    <Space direction="vertical" align="center">
                        <RiseOutlined style={{ ...iconStyle, color: '#52c41a' }} />
                        <Title level={4} style={{ margin: 0 }}>Total Revenue</Title>
                        <Text type="success" style={amountStyle}>
                            ₹ {data.totalRevenue.toLocaleString()}
                        </Text>
                    </Space>
                </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
                <Card style={cardStyle}>
                    <Space direction="vertical" align="center">
                        <FallOutlined style={{ ...iconStyle, color: '#ff4d4f' }} />
                        <Title level={4} style={{ margin: 0 }}>Total Expense</Title>
                        <Text type="danger" style={amountStyle}>
                            ₹ {data.totalExpense.toLocaleString()}
                        </Text>
                    </Space>
                </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
                <Card style={cardStyle}>
                    <Space direction="vertical" align="center">
                        <DollarCircleOutlined style={{ ...iconStyle, color: '#389e0d' }} />
                        <Title level={4} style={{ margin: 0 }}>Savings</Title>
                        <Text style={{ ...amountStyle, color: '#52c41a' }}>
                            ₹ {savings.toLocaleString()}
                        </Text>
                    </Space>
                </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
                <Card style={cardStyle}>
                    <Space direction="vertical" align="center">
                        <AccountBookOutlined style={{ ...iconStyle, color: '#1890ff' }} />
                        <Title level={4} style={{ margin: 0 }}>Balance</Title>
                        <Text style={{ ...amountStyle, color: '#1890ff' }}>
                            ₹ {data.balance.toLocaleString()}
                        </Text>
                    </Space>
                </Card>
            </Col>
        </Row>
    );
};

export default SummaryCards;
