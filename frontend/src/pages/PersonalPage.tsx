// src/pages/PersonalPage.tsx
import React, { useEffect, useState } from 'react';
import {
    Card, Avatar, Typography, Row, Col, Divider, Spin,
    List, Form, Input, Button, message
} from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Title, Text } = Typography;

const PersonalPage: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem('token');
                const trxRes = await axios.get('https://financial-dashboard-z0nq.onrender.com/api/transactions', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page: 1, limit: 5 }
                });

                const trxList = trxRes.data.transactions;
                const fallback = trxList[0];

                setProfile({
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    user_id: fallback?.user_id || 'N/A',
                    avatar: fallback?.user_profile || 'https://thispersondoesnotexist.com/',
                    createdAt: moment(fallback?.date).subtract(2, 'months').toISOString()
                });

                setTransactions(trxList);

                form.setFieldsValue({
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                });
            } catch (err) {
                console.error(err);
                message.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const onFinish = (values: any) => {
        message.success('Profile updated (frontend only)');
        setProfile((prev: any) => ({
            ...prev,
            name: values.name,
            email: values.email,
        }));
    };

    if (loading || !profile) return <Spin style={{ marginTop: 100 }} />;

    return (
        <>
            <Title level={3}>Personal Information</Title>

            <Row gutter={24}>
                {/* Profile Card */}
                <Col span={8}>
                    <Card>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar size={100} src={profile.avatar} />
                            <Title level={4} style={{ marginTop: 16 }}>{profile.name}</Title>
                            <Text type="secondary">{profile.email}</Text>
                            <Divider />
                            <Text>User ID: <strong>{profile.user_id}</strong></Text><br />
                            <Text>Member since: <strong>{moment(profile.createdAt).format('LL')}</strong></Text>
                        </div>
                    </Card>
                </Col>

                {/* Edit Form */}
                <Col span={16}>
                    <Card title="Edit Personal Info">
                        <Form layout="vertical" form={form} onFinish={onFinish}>
                            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">Update (Mock)</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>

            <Divider />

            {/* Recent Transactions */}
            <Card title="Recent Transactions" style={{ marginTop: 24 }}>
                <List
                    dataSource={transactions}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={<span>{item.category} — <strong>₹{item.amount}</strong></span>}
                                description={`${item.status} on ${moment(item.date).format('LL')}`}
                            />
                            <Avatar src={item.user_profile} />
                        </List.Item>
                    )}
                />
            </Card>
        </>
    );
};

export default PersonalPage;
