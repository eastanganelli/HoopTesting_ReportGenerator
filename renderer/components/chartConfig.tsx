import { FunctionComponent, useEffect, useState } from 'react';
import { Button, Form, Collapse, type FormProps, ColorPicker, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

type FieldType = {
    pressureColor?: any;
    temperatureColor?: any;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    try {
        let auxData = { pressureColor: values.pressureColor.toHexString(), temperatureColor: values.temperatureColor.toHexString() };
        localStorage.setItem('chartConfig', JSON.stringify(auxData));
        message.success('Configuración guardada');
    } catch (error) { message.error('Error al guardar la configuración'); }
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const ChartConfiguration: FunctionComponent = () => {
    const [chartConfig, setChartConfig] = useState<{ pressureColor: string; temperatureColor: string; }>({ pressureColor: '00ff00', temperatureColor: 'ff0000' });

    useEffect(() => {
        const storedConfig = JSON.parse(localStorage.getItem('chartConfig') || '{}');
        if (storedConfig) {
            setChartConfig({ pressureColor: storedConfig.pressureColor, temperatureColor: storedConfig.temperatureColor });
        }
    }, []);

    return (
        <>
            <Collapse defaultActiveKey={['1']} ghost items={[
                    {
                        label: 'Gráfico',
                        children: (
                            <Form labelCol={{ span: 14 }} initialValues={chartConfig} onFinish={onFinish} onFinishFailed={onFinishFailed} >
                                <Form.Item label="Color Presión" name="pressureColor" rules={[{ required: true }]}>
                                    <ColorPicker showText format='hex'/>
                                </Form.Item>
                                <Form.Item label="Color Temperatura" name="temperatureColor" rules={[{ required: true }]}>
                                    <ColorPicker showText format='hex'/>
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

export default ChartConfiguration;