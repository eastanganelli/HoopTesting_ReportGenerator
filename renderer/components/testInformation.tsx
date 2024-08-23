import dynamic from 'next/dynamic';
import { FunctionComponent, useEffect, useState } from 'react';
import { Form, FormInstance, Row, Col, Input, InputNumber, Checkbox, Divider, Select } from 'antd';
const PlotTestResult = dynamic(() => import('./testPlot'), { ssr: false });

import QueryDataService   from '../utils/database/query/data';
import QueryStaticService from '../utils/database/query/static';

import type { QueryTest } from '../interfaces/query/data';

const { Option } = Select;

interface Props { myTestForm: FormInstance<QueryTest>; idSpecimen: number; }

const testInformation: FunctionComponent<Props> = (Props: Props) => {
    const { myTestForm, idSpecimen }  = Props;
    const [editable, setEditable]     = useState<boolean>(true);
    const [plotForm]                  = Form.useForm();

    const loadStaticData = () => {
    };

    useEffect(() => {
        QueryDataService.SELECT.TEST.Test(idSpecimen).then((testData: QueryTest) => {
            const myData = {...testData[0]};
            myTestForm.setFieldsValue(myData);
        });
        // QueryDataService.SELECT.TEST.Test(idSpecimen).then((response: QueryTest) => {
            // myTestForm.setFieldsValue(response[0][0]);
            // console.log(response[0][0]);
            // setMyTest(response[0][0]);
        // });
    }, []);

    return (
        <>  
            <Checkbox checked={editable} onChange={(e) => { setEditable(e.target.checked); if(e.target.checked) { loadStaticData(); } }}>Editar</Checkbox>
            <Form form={myTestForm} layout='horizontal' disabled={editable}>
                <Row gutter={[8, 8]}>
                    <Col span={16}><Form.Item label="Nombre de la Prueba" name='testName'><Input type='text'/></Form.Item></Col>
                    <Col span={8}><Form.Item  label="Operador"            name='operator'><Input type='text'/></Form.Item></Col>
                    {/* Sample Information */}
                    <Col span={8}><Form.Item label="Estándar"       name='standard'><Input type='text'/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Material"       name='material'><Input type='text'/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Especificación" name='specification'><Input type='text'/></Form.Item></Col>
                    {/* Eviroment */}
                    <Col span={8}><Form.Item label="Tapa de Extremo"         name='endCap'><Input type='text'/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Entorno"                 name='enviroment'><Input type='text'/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Cantidad de Especimenes" name='specimensCount'><InputNumber disabled/></Form.Item></Col>
                    {/* Target Data */}
                    <Col span={8}><Form.Item label="Hoop Stress"><Input type='text' addonAfter={'Bar'} disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Presión"     name='targetPressure'><InputNumber addonAfter={'Bar'}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Temperatura" name='targetTemperature'><InputNumber addonAfter={'°C'}/></Form.Item></Col>
                    {/* Length */}
                    <Col span={8}><Form.Item label="Longitud Total"              name='lengthTotal'><InputNumber addonAfter={'mm'}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Longitud Libre"              name='lengthFree'><InputNumber addonAfter={'mm'}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Período de Condicionamiento" name='conditionalPeriod'><Input type='text' disabled/></Form.Item></Col>
                    {/* Diameter */}
                    <Col span={8}><Form.Item label="Diámetro Nominal" name='diameterNominal'><InputNumber addonAfter={'mm'}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Diámetro Real"    name='diameterReal'><InputNumber addonAfter={'mm'}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Grosor Pared"     name='wallThickness'><InputNumber addonAfter={'mm'}/></Form.Item></Col>
                    {/* Time */}
                    <Col span={8}><Form.Item label="Fecha de Inicio"       name='beginTime'><Input type='text' disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Fecha de Finalización" name='endTime'><Input type='text' disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Tiempo de Prueba"      name='duration'><InputNumber disabled/></Form.Item></Col>
                    {/* State Information */}
                    <Col span={24}><Form.Item label="Tipo de Falla" name='failText'><Input type='text'/></Form.Item></Col>
                    <Col span={24}><Form.Item label="Observación"   name='remark'><Input type='text'/></Form.Item></Col>
                </Row>
            </Form>
            <Divider/>
            <PlotTestResult idSpecimen={idSpecimen} plotForm={plotForm}/>
        </>
    );
}
export default testInformation;