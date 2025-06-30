import React, { useState } from 'react';
import { Row, Col, Card, Typography, Button } from 'antd';
import { Box } from '@mui/material';
import financebanner from '../assets/finance-banner.jpeg';
import LoginModal from '../features/auth/Login';
import SignupModal from '../features/auth/SignUp';

const { Title, Text } = Typography;

const HomePage: React.FC = () => {
    const [isLoginVisible, setLoginVisible] = useState(false);
    const [isSignupVisible, setSignupVisible] = useState(false);

    return (
        <Row style={{ minHeight: '100vh' }}>
            {/* Left Side Image */}
            <Col
                xs={0}
                md={12}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '24px',
                    backgroundColor: '#f5f5f5',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '90%',
                        backgroundImage: `url(${financebanner})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 16,
                        border: '2px solid #d9d9d9',
                        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
                    }}
                />
            </Col>

            {/* Right Side Auth Box */}
            <Col
                xs={24}
                md={12}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f0f2f5',
                    padding: '40px 24px',
                }}
            >
                <Card
                    style={{
                        width: '100%',
                        maxWidth: 420,
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                        borderRadius: 12,
                        background: '#fff',
                        padding: 24,
                    }}
                    bordered={false}
                >
                    <Box textAlign="center" mb={4}>
                        <Title level={2} style={{ marginBottom: 4, fontWeight: 600 }}>
                            Welcome to <span style={{ color: '#1890ff' }}>FinTrack</span>
                        </Title>
                        <Text type="secondary">
                            Visualize, track, and analyze your financial performance effortlessly.
                        </Text>
                    </Box>

                    {/* Info Message */}
                    <Box
                        mb={4}
                        p={2}
                        bgcolor="#fafafa"
                        border="1px solid #d9d9d9"
                        borderRadius={8}
                        fontSize="0.9rem"
                        color="#555"
                        textAlign="left"
                    >
                        <b>Demo Credentials:</b><br />
                        <span>Login with:</span><br />
                        <code>example@gmail.com</code><br />
                        <span>Password:</span> <code>12345678</code><br /><br />
                        Or sign up with your own email.
                    </Box>

                    <Button
                        type="primary"
                        block
                        size="large"
                        style={{ marginBottom: 16, fontWeight: 500 }}
                        onClick={() => setLoginVisible(true)}
                    >
                        Login
                    </Button>

                    <Button
                        block
                        size="large"
                        style={{ fontWeight: 500 }}
                        onClick={() => setSignupVisible(true)}
                    >
                        Sign Up
                    </Button>
                </Card>
            </Col>

            {/* Modals */}
            <LoginModal visible={isLoginVisible} onClose={() => setLoginVisible(false)} />
            <SignupModal visible={isSignupVisible} onClose={() => setSignupVisible(false)} />
        </Row>
    );
};

export default HomePage;
