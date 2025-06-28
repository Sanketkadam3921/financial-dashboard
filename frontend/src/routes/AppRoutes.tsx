import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../features/dashboard/DashboardLayout';
import TransactionsPage from '../pages/TransactionsPage';
import WalletPage from '../pages/WalletPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import PersonalPage from '../pages/PersonalPage';
import MessagesPage from '../pages/MessagesPage';
import SettingsPage from '../pages/SettingsPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/" element={<MainLayout />}>
                <Route path="dashboard" element={<DashboardLayout />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="personal" element={<PersonalPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
