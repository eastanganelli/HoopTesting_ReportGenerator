import dynamic from 'next/dynamic';
import { FunctionComponent, useEffect, useState } from 'react';
import { Form, FormInstance, Row, Col, Input, InputNumber, Checkbox, Button, Radio, Divider, Select } from 'antd';
const PlotTestResult = dynamic(() => import('./testPlot'), { ssr: false });

import QueryDataService   from '../utils/database/query/data';
import QueryStaticService from '../utils/database/query/static';

import type { TestData, TestDataValues } from '../interfaces/query/data';

const { Option } = Select;

interface testForm { operator: string; testName: string; standard: string; material: string; specification: string; endCap: string; enviroment: string; specimensCount: number; targetPressure: number; targetTemperature: number; lengthTotal: number; lengthFree: number; conditionalPeriod: string; diameterNominal: number; diameterReal: number; wallThickness: number; beginTime: string; endTime: string; duration: string; fail: string; remark: string; };

interface Props { myTestForm: FormInstance<testForm>; idSpecimen: number; }

const testInformation: FunctionComponent<Props> = (Props: Props) => {
    const { myTestForm, idSpecimen }  = Props;
    const [editable, setEditable]     = useState<boolean>(true);
    const [plotForm]                  = Form.useForm();

    const loadStaticData = () => {
    };

    useEffect(() => {
        let formData: testForm | null = null;
        // QueryDataService.SELECT.TEST.Test([idSpecimen]).then((myTest: TestData) => {
        // });
        // myTestForm.setFieldsValue(formData);
    }, []);

    return (
        <>  
            <Checkbox checked={editable} onChange={(e) => { setEditable(e.target.checked); if(e.target.checked) { loadStaticData(); } }}>Editar</Checkbox>
            <Form form={myTestForm} layout='horizontal' disabled={editable}>
                <Row gutter={[8, 8]}>
                    <Col span={16}><Form.Item label="Nombre de la Prueba" name='testName'><Input type='text'/></Form.Item></Col>
                    <Col span={8}><Form.Item  label="Operador"            name='operator'><Input type='text'/></Form.Item></Col>
                    {/* Sample Information */}
                    <Col span={8}><Form.Item label="Estándar"       name='standard'>     <Input type='text'/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Material"       name='material'>     <Input type='text'/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Especificación" name='specification'><Input type='text'/></Form.Item></Col>
                    {/* Eviroment */}
                    <Col span={8}><Form.Item label="Tapa de Extremo"         name='endCap'>        <Input type='text'/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Entorno"                 name='enviroment'>    <Input type='text'/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Cantidad de Especimenes" name='specimensCount'><Input type='text'/></Form.Item></Col>
                    {/* Target Data */}
                    <Col span={8}><Form.Item label="Hoop Stress">                         <Input type='text' addonAfter={'Bar'} disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Presión"     name='targetPressure'>   <Input type='text' addonAfter={'Bar'}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Temperatura" name='targetTemperature'><Input type='text' addonAfter={'°C'}/></Form.Item></Col>
                    {/* Length */}
                    <Col span={8}><Form.Item label="Longitud Total"              name='lengthTotal'>      <Input type='text' addonAfter={'mm'}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Longitud Libre"              name='lengthFree'>       <Input type='text' addonAfter={'mm'}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Período de Condicionamiento" name='conditionalPeriod'><Input type='text' disabled/></Form.Item></Col>
                    {/* Diameter */}
                    <Col span={8}><Form.Item label="Diámetro Nominal" name='diameterNominal'><Input type='text' addonAfter={'mm'}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Diámetro Real"    name='diameterReal'>   <Input type='text' addonAfter={'mm'}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Grosor Pared"     name='wallThickness'>  <Input type='text' addonAfter={'mm'}/></Form.Item></Col>
                    {/* Time */}
                    <Col span={8}><Form.Item label="Fecha de Inicio"       name='beginTime'><Input disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Fecha de Finalización" name='endTime'>  <Input disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Tiempo de Prueba"      name='duration'> <InputNumber disabled/></Form.Item></Col>
                    {/* State Information */}
                    <Col span={24}><Form.Item label="Tipo de Falla" name='fail'>  <Input type='text'/></Form.Item></Col>
                    <Col span={24}><Form.Item label="Observación"   name='remark'><Input type='text'/></Form.Item></Col>
                </Row>
            </Form>
            <Divider/>
            <PlotTestResult idSpecimen={idSpecimen} plotForm={plotForm}/>
        </>
    );
}
export default testInformation;