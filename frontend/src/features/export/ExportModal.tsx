import React, { useState } from 'react';
import { Button, Modal, Checkbox, Alert, Divider, Typography, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Text, Title } = Typography;

const fieldOptions = [
    { label: 'Date', value: 'date' },
    { label: 'Amount', value: 'amount' },
    { label: 'Category', value: 'category' },
    { label: 'Status', value: 'status' },
    { label: 'User ID', value: 'user_id' },
    { label: 'User Profile', value: 'user_profile' },
    { label: 'Description', value: 'description' }
];

const ExportModal: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleExport = async () => {
        if (selectedFields.length === 0) {
            setErrorMessage('Please select at least one column.');
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        try {
            const token = localStorage.getItem('token');

            const res = await axios.post(
                'http://localhost:5000/api/transactions/export',
                { columns: selectedFields },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: 'blob',
                }
            );

            const blob = new Blob([res.data], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            const filename = `transactions_export_${new Date().toISOString().split('T')[0]}.csv`;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success('✅ CSV exported successfully');
            setIsModalOpen(false);
            setSelectedFields([]);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || '❌ Export failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                icon={<DownloadOutlined />}
                type="primary"
                onClick={() => setIsModalOpen(true)}
                style={{ marginBottom: '1rem' }}
            >
                Export CSV
            </Button>

            <Modal
                title={<Title level={4} style={{ marginBottom: 0 }}>📤 Export Transactions</Title>}
                open={isModalOpen}
                onOk={handleExport}
                onCancel={() => {
                    setIsModalOpen(false);
                    setErrorMessage(null);
                    setSelectedFields([]);
                }}
                okText="Export"
                confirmLoading={loading}
            >
                <Divider orientation="left" style={{ fontSize: 13, marginBottom: 10 }}>Choose Columns</Divider>

                {errorMessage && (
                    <Alert
                        message={errorMessage}
                        type="error"
                        showIcon
                        closable
                        onClose={() => setErrorMessage(null)}
                        style={{ marginBottom: 16 }}
                    />
                )}

                <Checkbox.Group
                    options={fieldOptions}
                    value={selectedFields}
                    onChange={(checked) => setSelectedFields(checked as string[])}
                    style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}
                />

                <Divider style={{ marginTop: 16 }} />
                <Space direction="vertical" size={2}>
                    <Text type="secondary">💡 Tip: You can choose any combination of fields.</Text>
                    <Text type="secondary">File will be saved as `.csv` format automatically.</Text>
                </Space>
            </Modal>

            <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme="colored" />
        </>
    );
};

export default ExportModal;
