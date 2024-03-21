import { FunctionComponent, useEffect, useState } from 'react';
import { Button, Form, Collapse, Divider, type FormProps, Input, Space, message } from 'antd';
import { ConsoleSqlOutlined, SaveOutlined } from '@ant-design/icons';
import DatabaseService from '../utils/database/database';

import type { DatabaseConfig } from '../../electron-src/service/database';
import { set } from 'electron-settings';

type FieldType = {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    DatabaseService.SAVE(values.host, values.port, values.username, values.password).then((response) => {
        message.success(response);
    }).catch((error) => {
        message.error(error);
    });
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const defaultConfig: DatabaseConfig = { HOST: '', PORT: 0, USER: '', PASSWORD : '', DATABASE: '' };

const DatabaseConfiguration: FunctionComponent = () => {
    const [dbConfig, setDBConfig] = useState<DatabaseConfig>(defaultConfig);

    const connectDatabase = () => {
        DatabaseService.CONNECT(true).then((response) => { message.success(response); }).catch((error) => { message.error(error); });
    };

    useEffect(() => {
        DatabaseService.READ().then((response: DatabaseConfig) => { setDBConfig(response); }).catch((error) => { setDBConfig(defaultConfig); })
    }, []);

    return (
        <>
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
                                    initialValue={dbConfig['HOST'] as string}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    label="Puerto"
                                    name="port"
                                    rules={[{ required: true, message: 'Puerto' }]}
                                    initialValue={dbConfig['PORT'] as number}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    label="Usuario"
                                    name="username"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                    initialValue={dbConfig['USER'] as string}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    label="Contraseña"
                                    name="password"
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item>
                                    <Space>
                                        <Button type="primary" icon={<SaveOutlined />} htmlType="submit" ghost>{/* {`Guardar`} */}</Button>
                                        <Button type="primary" icon={<ConsoleSqlOutlined />} onClick={connectDatabase} ghost>{/* {`Conectar`} */}</Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        )
                    }
                ]}
            />
        </>

    );
};

export default DatabaseConfiguration;