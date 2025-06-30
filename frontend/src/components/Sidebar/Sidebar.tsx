import React from 'react';
import { Layout, Menu } from 'antd';
import {
    PieChartOutlined,
    TableOutlined,
    WalletOutlined,
    AreaChartOutlined,
    UserOutlined,
    MessageOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = ({ key }: { key: string }) => {
        if (key === 'logout') {
            localStorage.removeItem('token');
            navigate('/login');
        } else {
            navigate(`/${key}`);
        }
    };

    const menuItems = [
        {
            key: 'dashboard',
            icon: <PieChartOutlined />,
            label: 'Dashboard',
        },
        {
            key: 'transactions',
            icon: <TableOutlined />,
            label: 'Transactions',
        },
        {
            key: 'wallet',
            icon: <WalletOutlined />,
            label: 'Wallet',
        },
        {
            key: 'analytics',
            icon: <AreaChartOutlined />,
            label: 'Analytics',
        },
        {
            key: 'personal',
            icon: <UserOutlined />,
            label: 'Personal',
        },
        {
            key: 'messages',
            icon: <MessageOutlined />,
            label: 'Messages',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
        },
    ];

    return (
        <Sider
            width={220}
            style={{
                background: '#f0f5ff',
                boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
                minHeight: '100vh',
            }}
        >
            <div
                style={{
                    padding: '24px 16px',
                    fontWeight: 700,
                    fontSize: '20px',
                    color: '#003a8c',
                    textAlign: 'center',
                    letterSpacing: '0.5px',
                    borderBottom: '1px solid #d6e4ff',
                }}
            >
                FinanceApp
            </div>

            <Menu
                mode="inline"
                defaultSelectedKeys={['dashboard']}
                onClick={handleClick}
                style={{
                    background: 'transparent',
                    paddingTop: '16px',
                }}
                items={menuItems.map((item) => ({
                    ...item,
                    label: (
                        <span style={{ fontWeight: 500, fontSize: '15px', color: '#003a8c' }}>
                            {item.label}
                        </span>
                    ),
                }))}
                theme="light"
            />
        </Sider>
    );
};

export default Sidebar;
