import { FunctionComponent, useState } from 'react';
import { Button, Form, Collapse, Divider, type FormProps, Input, Space, message } from 'antd';
import { ConsoleSqlOutlined, SaveOutlined } from '@ant-design/icons';
import DatabaseService from '../utils/database/database';

import type { DatabaseConfig } from '../../electron-src/service/database';

type FieldType = {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    DatabaseService.SAVE(values.host, values.port, values.username, values.password).then((response) => {
        message.success('Configuración guardada');
    }).catch((error) => {
        message.error('Error al guardar la configuración');
    });
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const DatabaseConfiguration: FunctionComponent = () => {
    const [dbConfig, setDBConfig] = useState<DatabaseConfig>(null);

    return (
        <div>
            <Divider orientation="left">{`Configuración`}</Divider>
            <Collapse
                defaultActiveKey={['1']}
                ghost
                items={[
                    {
                        label: 'Base de Datos',
                        children: (
                            <Form
                                name="basic"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Form.Item<FieldType>
                                    label="Host"
                                    name="host"
                                    rules={[{ required: true, message: 'Dirección del Host' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    label="Port"
                                    name="port"
                                    rules={[{ required: true, message: 'Puerto' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    label="Username"
                                    name="username"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    label="Password"
                                    name="password"
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item>
                                    <Space>
                                        <Button type="primary" icon={<SaveOutlined />} htmlType="submit" ghost>{/* {`Guardar`} */}</Button>
                                        <Button type="primary" icon={<ConsoleSqlOutlined />} htmlType="submit" ghost>{/* {`Conectar`} */}</Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        )
                    }
                ]}
            />
        </div>

    );
};

export default DatabaseConfiguration;