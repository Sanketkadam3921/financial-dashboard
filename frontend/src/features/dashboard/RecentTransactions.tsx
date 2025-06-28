import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Avatar, Spin } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ Add this

const { Text } = Typography;

interface Transaction {
    _id: string;
    amount: number;
    status: string;
    user_id: string;
    user_profile: string;
    category: string;
}

const RecentTransactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // ✅ Hook for navigation

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/transactions', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        page: 1,
                        limit: 5,
                    },
                });
                setTransactions(res.data.transactions);
            } catch (err) {
                console.error('Error fetching recent transactions:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecent();
    }, []);

    if (loading) return <Spin />;

    return (
        <Card
            title="Recent Transactions"
            extra={
                <a onClick={() => navigate('/transactions')} style={{ cursor: 'pointer' }}>
                    See all
                </a>
            }
            style={{ height: '100%' }}
        >
            <List
                itemLayout="horizontal"
                dataSource={transactions.slice(0, 5)}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={item.user_profile} />}
                            title={
                                <Text strong>
                                    {item.category === 'Expense'
                                        ? 'Transfers to'
                                        : 'Transfers from'}
                                </Text>
                            }
                            description={<Text type="secondary">{item.user_id}</Text>}
                        />
                        <div>
                            <Text style={{ color: item.status === 'Paid' ? '#00C853' : '#FF5252' }}>
                                {item.status === 'Paid' ? '+' : '-'}₹{item.amount}
                            </Text>
                        </div>
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default RecentTransactions;
