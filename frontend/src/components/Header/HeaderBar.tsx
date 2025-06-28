import React, { useState } from 'react';
import { Input, Avatar, Badge, Typography, Space, Row, Col } from 'antd';
import { BellOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface HeaderBarProps {
    onSearch: (val: string) => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ onSearch }) => {
    const [value, setValue] = useState('');
    const navigate = useNavigate();

    const handleSearch = debounce((val: string) => {
        onSearch(val.trim());
    }, 500);

    const handleNotificationsClick = () => {
        navigate('/messages');
    };

    return (
        <div
            style={{
                backgroundColor: '#ffffff',
                padding: '16px 24px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                marginBottom: '24px',
            }}
        >
            <Row justify="space-between" align="middle">
                <Col>
                    <Title level={3} style={{ margin: 0, color: '#1f1f1f' }}>Dashboard</Title>
                </Col>
                <Col>
                    <Space size="large">
                        <Input
                            placeholder="Search..."
                            prefix={<SearchOutlined />}
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                handleSearch(e.target.value);
                            }}
                            style={{
                                width: 240,
                                borderRadius: 8,
                            }}
                        />
                        <Badge count={3} offset={[0, 5]}>
                            <BellOutlined
                                style={{ fontSize: 20, color: '#1f1f1f', cursor: 'pointer' }}
                                onClick={handleNotificationsClick}
                            />
                        </Badge>
                        <Avatar icon={<UserOutlined />} />
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default HeaderBar;
