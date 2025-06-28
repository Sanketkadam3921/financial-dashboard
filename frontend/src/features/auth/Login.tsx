import React, { useState } from 'react';
import { Modal, Form, Input, Typography, Alert, Button } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface LoginModalProps {
    visible: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onFinish = async (values: any) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', values);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={visible} onCancel={onClose} footer={null}>
            <Title level={3}>Login</Title>
            {error && (
                <Alert message={error} type="error" closable onClose={() => setError(null)} />
            )}
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default LoginModal;
