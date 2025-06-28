// src/layouts/MainLayout.tsx
import React from 'react';
import { Layout } from 'antd';
import Sidebar from '../components/Sidebar/Sidebar';
import HeaderBar from '../components/Header/HeaderBar';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const MainLayout: React.FC = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar />
            <Layout>
                <HeaderBar onSearch={(val) => console.log('Search:', val)} />
                <Content style={{ padding: '24px' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
