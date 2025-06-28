// src/features/dashboard/DashboardLayout.tsx
import React from 'react';
import { Row, Col } from 'antd';
import SummaryCards from './SummaryCards';
import RevenueChart from './RevenueChart';
import TransactionsTable from './TransactionsTable';
import ExportModal from '../export/ExportModal';
import RecentTransactions from './RecentTransactions';

const DashboardLayout: React.FC = () => {
    return (
        <>
            <SummaryCards />

            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={16}>
                    <RevenueChart />
                </Col>
                <Col span={8}>
                    <RecentTransactions />
                </Col>
            </Row>

            <ExportModal />
            <TransactionsTable />
        </>
    );
};

export default DashboardLayout;
