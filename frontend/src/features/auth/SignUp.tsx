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
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const onFinish = async (values: any) => {
        setLoading(true);
        setErrorMessage('');
        try {
            const res = await axios.post('https://financial-dashboard-z0nq.onrender.com/api/auth/signup', values);
            message.success(res.data.message);

            const loginRes = await axios.post('https://financial-dashboard-z0nq.onrender.com/api/auth/login', {
                email: values.email,
                password: values.password,
            });
            localStorage.setItem('token', loginRes.data.token);

            navigate('/dashboard');
            onClose();
            form.resetFields();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Signup failed';
            setErrorMessage(msg);
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={visible} onCancel={onClose} footer={null} destroyOnClose>
            <Title level={3}>Sign Up</Title>
            {errorMessage && (
                <div
                    style={{
                        background: '#fff1f0',
                        border: '1px solid #ffa39e',
                        padding: '8px 16px',
                        marginBottom: 16,
                        borderRadius: 4,
                        color: '#cf1322',
                    }}
                >
                    {errorMessage}
                </div>
            )}
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Email is required' },
                        { type: 'email', message: 'Enter a valid email address' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        { required: true, message: 'Password is required' },
                        {
                            validator: (_, value) =>
                                value && value.length > 6
                                    ? Promise.resolve()
                                    : Promise.reject(new Error('Password must be more than 6 characters')),
                        },
                    ]}
                    hasFeedback
                >
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
