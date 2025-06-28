import React, { useState } from 'react';
import { Modal, Form, Input, Typography, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface SignupModalProps {
    visible: boolean;
    onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ visible, onClose }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // 👈 Add this

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/signup', values);
            message.success(res.data.message);

            // Optional: Log them in directly after signup
            const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
                email: values.email,
                password: values.password,
            });
            localStorage.setItem('token', loginRes.data.token);

            navigate('/dashboard'); // 👈 Redirect to dashboard
            onClose();
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={visible} onCancel={onClose} footer={null}>
            <Title level={3}>Sign Up</Title>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Sign Up
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SignupModal;
