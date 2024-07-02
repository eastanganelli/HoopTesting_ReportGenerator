import { FunctionComponent, useEffect, useState } from 'react';
import { Button, Form, Collapse, type FormProps, Input, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

type FieldType = {
    companyName?: string;
    temperatureColor?: any;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    try {
        let auxData = { pressureColor: values.companyName };
        localStorage.setItem('pdfConfig', JSON.stringify(auxData));
        message.success('Configuración guardada');
    } catch (error) { message.error('Error al guardar la configuración'); }
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const PDFConfiguration: FunctionComponent = () => {
    const [pdfConfig, setPDFConfig] = useState<{ companyName: string; }>({ companyName: '' });

    useEffect(() => {
        const storedConfig = JSON.parse(localStorage.getItem('pdfConfig') || '{}');
        if (storedConfig) {
            setPDFConfig({ companyName: storedConfig.companyName });
        }
    }, []);

    return (
        <>
            <Collapse defaultActiveKey={['1']} ghost items={[
                    {
                        label: 'PDF',
                        children: (
                            <Form layout="vertical" initialValues={pdfConfig} onFinish={onFinish} onFinishFailed={onFinishFailed} >
                                <Form.Item label="Nombre Empresa" name="companyName" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item><Button type="primary" icon={<SaveOutlined />} htmlType="submit" ghost>{/* {`Guardar`} */}</Button></Form.Item>
                            </Form>
                        )
                    }
                ]}
            />
        </>
    );
};

export default PDFConfiguration;