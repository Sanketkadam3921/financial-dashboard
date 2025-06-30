import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Table,
    Input,
    Select,
    Tag,
    Spin,
    Row,
    Col,
    Button,
    Space,
    Typography,
    Alert
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import debounce from 'lodash.debounce';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

interface Transaction {
    _id: string;
    id: number;
    date: string;
    amount: number;
    category: string;
    status: string;
    user_id: string;
    user_profile: string;
}

const TransactionsTable: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterLoading, setFilterLoading] = useState(false); // Separate loading state for filters
    const [searchText, setSearchText] = useState(''); // This is for API calls
    const [inputValue, setInputValue] = useState(''); // This is for immediate UI updates
    const [statusFilter, setStatusFilter] = useState<string | undefined>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10,
    });

    const fetchTransactions = async (isFilterChange = false) => {
        // Only show spinner for initial load, not for filter changes
        if (isFilterChange) {
            setFilterLoading(true);
        } else {
            setLoading(true);
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://financial-dashboard-z0nq.onrender.com/api/transactions', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    page: pagination.currentPage,
                    limit: pagination.itemsPerPage,
                    search: searchText,
                    status: statusFilter,
                },
            });

            const fetched = res.data.transactions;
            setTransactions(fetched);
            setPagination((prev) => ({
                ...prev,
                totalItems: res.data.pagination.totalItems,
            }));

            if (fetched.length === 0) {
                setErrorMessage('✖ No transactions found for the current filters.');
            } else {
                setErrorMessage(null);
            }
        } catch (err) {
            console.error('Failed to fetch transactions');
            setErrorMessage('✖ Failed to fetch transactions. Please try again.');
        } finally {
            setLoading(false);
            setFilterLoading(false);
        }
    };

    const debouncedSearch = useMemo(
        () => debounce((val: string) => {
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
            setSearchText(val);
        }, 500),
        []
    );


    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        debouncedSearch(value);
    }, [debouncedSearch]);

    const handleSearchSubmit = useCallback((val: string) => {
        setInputValue(val);
        setSearchText(val);
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
        debouncedSearch.cancel();
    }, [debouncedSearch]);

    useEffect(() => {
        fetchTransactions();
    }, [pagination.currentPage, pagination.itemsPerPage, searchText, statusFilter]);

    // Cleanup debounced function on unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleReset = useCallback(() => {
        setInputValue('');
        setSearchText('');
        setStatusFilter(undefined);
        setPagination((prev) => ({
            ...prev,
            currentPage: 1,
        }));
        debouncedSearch.cancel();
    }, [debouncedSearch]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: (a: Transaction, b: Transaction) => a.id - b.id,
        },
        {
            title: 'Date',
            dataIndex: 'date',
            render: (date: string) => moment(date).format('DD MMM YYYY'),
            sorter: (a: Transaction, b: Transaction) =>
                new Date(a.date).getTime() - new Date(b.date).getTime(),
        },
        {
            title: 'Amount (₹)',
            dataIndex: 'amount',
            sorter: (a: Transaction, b: Transaction) => a.amount - b.amount,
        },
        {
            title: 'Category',
            dataIndex: 'category',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status: string) => (
                <Tag color={status === 'Paid' ? 'green' : 'orange'}>{status}</Tag>
            ),
            filters: [
                { text: 'Paid', value: 'Paid' },
                { text: 'Pending', value: 'Pending' },
            ],
            onFilter: (value: any, record: Transaction) => record.status === value,
        },
        {
            title: 'User',
            dataIndex: 'user_id',
        },
        {
            title: 'Profile',
            dataIndex: 'user_profile',
            render: (url: string) => (
                <img
                    src={url}
                    alt="profile"
                    style={{ width: 32, height: 32, borderRadius: '50%' }}
                />
            ),
        },
    ];

    return (
        <div style={{ minHeight: '80vh' }}>
            <Row justify="space-between" style={{ marginBottom: '1rem' }}>
                <Col>
                    <Title level={4}>Transactions</Title>
                </Col>
                <Col>
                    <Space>
                        <Search
                            placeholder="Search by ID, category..."
                            allowClear
                            value={inputValue}
                            onChange={handleInputChange}
                            onSearch={handleSearchSubmit}
                            style={{ width: 200 }}
                        />
                        <Select
                            allowClear
                            placeholder="Filter by status"
                            style={{ width: 160 }}
                            onChange={(val) => {
                                setPagination((prev) => ({
                                    ...prev,
                                    currentPage: 1,
                                }));
                                setStatusFilter(val);
                            }}
                            value={statusFilter}
                        >
                            <Option value="Paid">Paid</Option>
                            <Option value="Pending">Pending</Option>
                        </Select>
                        <Button onClick={handleReset}>
                            Reset
                        </Button>
                    </Space>
                </Col>
            </Row>

            {errorMessage && (
                <Alert
                    message={errorMessage}
                    type="error"
                    showIcon
                    closable
                    style={{ marginBottom: '1rem' }}
                    onClose={() => setErrorMessage(null)}
                />
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <div style={{ position: 'relative' }}>
                    {filterLoading && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                zIndex: 10,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Spin />
                        </div>
                    )}
                    <Table
                        rowKey="_id"
                        columns={columns}
                        dataSource={transactions}
                        pagination={{
                            current: pagination.currentPage,
                            pageSize: pagination.itemsPerPage,
                            total: pagination.totalItems,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            onChange: (page, pageSize) => {
                                setPagination({
                                    ...pagination,
                                    currentPage: page,
                                    itemsPerPage: pageSize,
                                });
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default TransactionsTable;