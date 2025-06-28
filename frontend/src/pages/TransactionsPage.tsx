// src/pages/TransactionsPage.tsx
import React from 'react';
import { Card, Row, Col, Typography, Breadcrumb } from 'antd';
import TransactionsTable from '../features/dashboard/TransactionsTable';

const { Title } = Typography;

const TransactionsPage: React.FC = () => (
    <>
        {/* Page Header Replacement */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
            <Col>
                <Breadcrumb items={[{ title: 'Dashboard' }, { title: 'Transactions' }]} />
                <Title level={3} style={{ margin: 0 }}>Transactions</Title>
            </Col>
        </Row>

        <Card>
            <TransactionsTable />
        </Card>
    </>
);

export default TransactionsPage;
