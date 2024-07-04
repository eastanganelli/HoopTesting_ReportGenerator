import dynamic from 'next/dynamic';
import { FunctionComponent } from 'react';
import { Form, FormInstance, Row, Col, Input, InputNumber } from 'antd';
const PlotTestResult = dynamic(() => import('./testPlot'), { ssr: false });

import type { TestDataValues } from '../interfaces/query';

interface specimenForm { operator: string; testName: string; standard: string; material: string; specification: string; endCap: string; enviroment: string; specimensCount: number; targetPressure: number; targetTemperature: number; lengthTotal: number; lengthFree: number; conditionalPeriod: number; diameterNominal: number; diameterReal: number; wallThickness: number; beginTime: string; endTime: string; duration: number; fail: string; remark: string; };

interface Props { myTestForm: FormInstance<specimenForm>; myData: TestDataValues[]; }

const testInformation: FunctionComponent<Props> = (Props: Props) => {
    const { myTestForm, myData } = Props;

    return (
        <>
            <Form form={myTestForm} layout='horizontal'>
                <Row gutter={[8, 8]}>
                    <Col span={16}><Form.Item label="Nombre de la Prueba" name='testName'><Input type='text'/></Form.Item></Col>
                    <Col span={8}><Form.Item  label="Operador"            name='operator'><Input type='text'/></Form.Item></Col>
                    {/* Sample Information */}
                    <Col span={8}><Form.Item label="Estándar"       name='standard'><Input type='text' disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Material"       name='material'><Input type='text' disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Especificación" name='specification'><Input type='text' disabled/></Form.Item></Col>
                    {/* Eviroment */}
                    <Col span={8}><Form.Item label="Tapa de Extremo"         name='endCap'><Input type='text' disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Entorno"                 name='enviroment'><Input type='text' disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Cantidad de Especimenes" name='specimensCount'><Input type='text' disabled/></Form.Item></Col>
                    {/* Target Data */}
                    <Col span={8}><Form.Item label="Hoop Stress"><Input type='text' addonAfter={'Bar'} disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Presión"     name='targetPressure'><Input type='text' addonAfter={'Bar'} disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Temperatura" name='targetTemperature'><Input type='text' addonAfter={'°C'} disabled/></Form.Item></Col>
                    {/* Length */}
                    <Col span={8}><Form.Item label="Longitud Total" name='lengthTotal'><Input type='text' addonAfter={'mm'} disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Longitud Libre" name='lengthFree'><Input type='text' addonAfter={'mm'} disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Período de Condicionamiento" name='conditionalPeriod'><Input type='text' disabled/></Form.Item></Col>
                    {/* Diameter */}
                    <Col span={8}><Form.Item label="Diámetro Nominal" name='diameterNominal'><Input type='text' addonAfter={'mm'} disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Diámetro Real"    name='diameterReal'><Input type='text' addonAfter={'mm'} disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Grosor Pared"     name='wallThickness'><Input type='text' addonAfter={'mm'} disabled/></Form.Item></Col>
                    {/* Time */}
                    <Col span={8}><Form.Item label="Fecha de Inicio"       name='beginTime'><Input disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Fecha de Finalización" name='endTime'><Input disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Tiempo de Prueba"      name='duration'><InputNumber disabled/></Form.Item></Col>
                    {/* State Information */}
                    <Col span={24}><Form.Item label="Tipo de Falla" name='fail'><Input type='text'/></Form.Item></Col>
                    <Col span={24}><Form.Item label="Observación"   name='remark'><Input type='text'/></Form.Item></Col>
                </Row>
            </Form>
            <PlotTestResult DataPlot={myData} />
        </>
    );
}
export default testInformation;