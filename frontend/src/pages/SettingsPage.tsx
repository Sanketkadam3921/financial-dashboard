// src/pages/SettingsPage.tsx
import React, { useEffect, useState } from 'react';
import {
    Card,
    Switch,
    Typography,
    Divider,
    Row,
    Col,
    Select,
    message,
} from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const SettingsPage: React.FC = () => {
    const [themeDark, setThemeDark] = useState(false);
    const [animations, setAnimations] = useState(true);
    const [compactLayout, setCompactLayout] = useState(false);
    const [currency, setCurrency] = useState('INR');

    useEffect(() => {
        const saved = localStorage.getItem('app_settings');
        if (saved) {
            const parsed = JSON.parse(saved);
            setThemeDark(parsed.themeDark);
            setAnimations(parsed.animations);
            setCompactLayout(parsed.compactLayout);
            setCurrency(parsed.currency);
        }
    }, []);

    const saveSettings = (newSettings: any) => {
        const settings = {
            themeDark,
            animations,
            compactLayout,
            currency,
            ...newSettings
        };
        localStorage.setItem('app_settings', JSON.stringify(settings));
        message.success('Settings saved');
    };

    return (
        <div>
            <Title level={3}><SettingOutlined /> Settings</Title>
            <Divider />

            <Row gutter={[24, 24]}>
                <Col span={12}>
                    <Card title="Appearance">
                        <div style={{ marginBottom: 16 }}>
                            <Text>Dark Theme</Text>
                            <Switch
                                checked={themeDark}
                                onChange={(checked) => {
                                    setThemeDark(checked);
                                    saveSettings({ themeDark: checked });
                                }}
                                style={{ marginLeft: 12 }}
                            />
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <Text>Enable Animations</Text>
                            <Switch
                                checked={animations}
                                onChange={(checked) => {
                                    setAnimations(checked);
                                    saveSettings({ animations: checked });
                                }}
                                style={{ marginLeft: 12 }}
                            />
                        </div>

                        <div>
                            <Text>Compact Layout</Text>
                            <Switch
                                checked={compactLayout}
                                onChange={(checked) => {
                                    setCompactLayout(checked);
                                    saveSettings({ compactLayout: checked });
                                }}
                                style={{ marginLeft: 12 }}
                            />
                        </div>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="Preferences">
                        <div style={{ marginBottom: 16 }}>
                            <Text>Select Currency Format</Text>
                            <br />
                            <Select
                                value={currency}
                                style={{ width: 200, marginTop: 8 }}
                                onChange={(val) => {
                                    setCurrency(val);
                                    saveSettings({ currency: val });
                                }}
                            >
                                <Option value="INR">₹ - Indian Rupee</Option>
                                <Option value="USD">$ - US Dollar</Option>
                                <Option value="EUR">€ - Euro</Option>
                                <Option value="JPY">¥ - Japanese Yen</Option>
                            </Select>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SettingsPage;
