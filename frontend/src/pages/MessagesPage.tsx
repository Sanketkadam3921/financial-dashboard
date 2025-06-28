// src/pages/MessagesPage.tsx
import React, { useState, useEffect } from 'react';
import { Card, List, Typography, Tag, Avatar, Input, Space, Divider } from 'antd';
import { BellOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Search } = Input;

interface Message {
    id: string;
    title: string;
    content: string;
    date: string;
    read: boolean;
    senderAvatar: string;
}

const mockMessages: Message[] = [
    {
        id: '1',
        title: 'Transaction Alert',
        content: '₹2100 paid successfully on 23 Dec 2024.',
        date: '2024-12-23T17:05:03.000Z',
        read: false,
        senderAvatar: 'https://thispersondoesnotexist.com/',
    },
    {
        id: '2',
        title: 'Reminder: Pending Transaction',
        content: '₹3200 still pending. Please confirm payment.',
        date: '2024-12-16T10:04:21.000Z',
        read: true,
        senderAvatar: 'https://thispersondoesnotexist.com/',
    },
    {
        id: '3',
        title: 'Weekly Summary Ready',
        content: 'Your weekly finance summary is available in Dashboard.',
        date: '2024-12-15T12:04:51.000Z',
        read: false,
        senderAvatar: 'https://thispersondoesnotexist.com/',
    }
];

const MessagesPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Simulate fetch from backend
        setMessages(mockMessages);
    }, []);

    const filtered = messages.filter(msg =>
        msg.title.toLowerCase().includes(search.toLowerCase()) ||
        msg.content.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <Title level={3}><BellOutlined /> Messages</Title>

            <Divider />

            <Space direction="vertical" style={{ width: '100%' }}>
                <Search
                    placeholder="Search messages"
                    enterButton={<SearchOutlined />}
                    onSearch={(value) => setSearch(value)}
                    allowClear
                />

                <Card>
                    <List
                        itemLayout="horizontal"
                        dataSource={filtered}
                        renderItem={item => (
                            <List.Item
                                style={{
                                    backgroundColor: item.read ? '#f9f9f9' : '#e6f7ff',
                                    borderRadius: '8px',
                                    marginBottom: '12px',
                                    padding: '16px'
                                }}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.senderAvatar} />}
                                    title={
                                        <Space>
                                            <Text strong>{item.title}</Text>
                                            {!item.read && <Tag color="blue">New</Tag>}
                                        </Space>
                                    }
                                    description={
                                        <>
                                            <Text>{item.content}</Text><br />
                                            <Text type="secondary">{moment(item.date).fromNow()}</Text>
                                        </>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </Space>
        </div>
    );
};

export default MessagesPage;
