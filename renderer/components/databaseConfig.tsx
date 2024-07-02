import { FunctionComponent, useEffect, useState } from 'react';
import { Button, Form, Collapse, type FormProps, Input, Space, message } from 'antd';
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
        DatabaseService.READ().then((response: DatabaseConfig) => { setDBConfig(response); }).catch(() => { setDBConfig(defaultConfig); })
    }, []);

    return (
        <>
            <Collapse defaultActiveKey={['1']} ghost items={[
                    {
                        label: 'Base de Datos',
                        children: (
                            <Form name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                                <Form.Item label="Host" name="host" rules={[{ required: true }]} initialValue={dbConfig['HOST'] as string}>
                                    <Input />
                                </Form.Item>

                                <Form.Item label="Puerto" name="port" rules={[{ required: true }]} initialValue={dbConfig['PORT'] as number}>
                                    <Input />
                                </Form.Item>

                                <Form.Item label="Usuario" name="username" rules={[{ required: true }]} initialValue={dbConfig['USER'] as string}>
                                    <Input />
                                </Form.Item>

                                <Form.Item label="Contraseña" name="password" rules={[{ required: true }]}>
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item>
                                    <Space>
                                        <Button type="primary" icon={<SaveOutlined />} htmlType="submit" ghost>{/* {`Guardar`} */}</Button>
                                        <Button type="primary" icon={<ConsoleSqlOutlined />} onClick={connectDatabase} ghost>{`Conectar`}</Button>
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