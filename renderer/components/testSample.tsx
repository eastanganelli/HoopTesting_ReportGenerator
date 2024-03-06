import dynamic from 'next/dynamic';
import { CSSProperties, useState, FunctionComponent } from 'react';
import { Typography, Col, Row } from 'antd';
const PlotTestResult = dynamic(() => import('./plot'), { ssr: false });

import type { TestData, TestDataValues } from '../interfaces/query';

const { Paragraph } = Typography;

const textStyle: CSSProperties = {
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    fontFamily: 'Garamond',
};

const paragraphStyle: CSSProperties = {
    display: 'flex',
    textAlign: 'left',
    fontFamily: 'Garamond',
};

const paragraphEditableStyle: CSSProperties = {
    borderBottom: "2px solid black",
    display: 'flex',
    textAlign: 'left',
    fontFamily: 'Garamond',
};

interface Props { myTest: TestData; myData: TestDataValues[]; changesOnSpecimen: (testName: string, operator: string, fail: string, reMark: string) => void; }

const testSample: FunctionComponent<Props> = ({ myTest, myData, changesOnSpecimen }: Props) => {
    const [testName, setTestName] = useState<string>(myTest?.mySpecimen?.testName);
    const [operator, setOperator] = useState<string>(myTest?.mySpecimen?.operator);
    const [fail, setFail] = useState<string>(myTest?.mySpecimen?.fail);
    const [reMark, setReMark] = useState<string>(myTest?.mySpecimen?.remark);

    return (
        <div>
            {/* Datos iniciales del Informe */}
            <div>
                <Row gutter={[24, 24]}>
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>ID Prueba</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Paragraph style={paragraphStyle}>{myTest?.mySpecimen?.idSpecimen}</Paragraph>
                    </Col>
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Nombre de la Prueba</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Paragraph style={paragraphEditableStyle} editable={{
                            tooltip: "Click para editar", onChange: (e: string) => {
                                setTestName(e);
                                changesOnSpecimen(e, operator, fail, reMark);
                            }, triggerType: ['text'], maxLength: 150
                        }}>{testName}</Paragraph>
                    </Col>

                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Cantidad De Especimen</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Paragraph style={paragraphStyle}>{myTest?.mySpecimen?.counts < 2 ? 'Muestra' : 'Muestras'} {myTest?.mySpecimen?.counts}</Paragraph>
                    </Col>
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Estándar</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Paragraph style={paragraphStyle}>{myTest?.mySample?.standard}</Paragraph>
                    </Col>

                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Entorno</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Paragraph style={paragraphStyle}>{myTest?.mySpecimen?.enviroment}</Paragraph>
                    </Col>
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Tapa de Extremo</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Paragraph style={paragraphStyle}>{myTest?.mySpecimen?.endCap}</Paragraph>
                    </Col>

                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Operador</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Paragraph style={paragraphEditableStyle} editable={{
                            tooltip: "Click para editar", onChange: (e: string) => {
                                setOperator(e);
                                changesOnSpecimen(testName, e, fail, reMark);
                            }, triggerType: ['text'], maxLength: 40
                        }}>{operator}</Paragraph>
                    </Col>
                </Row>
            </div>

            {/* Datos Grilla del Informe */}
            <div style={{ paddingTop: "2.25em" }}>
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Typography.Text style={textStyle} strong>Test Nro: {myTest?.mySpecimen?.counts}</Typography.Text>
                    </Col>
                    {/* </Row>
                            <Row gutter={[16, 24]}> */}
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Material</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Typography.Text style={textStyle} strong>{myTest?.mySample?.material}</Typography.Text>
                    </Col>
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Especificacion</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Typography.Text style={textStyle} strong>{myTest?.mySample?.specification}</Typography.Text>
                    </Col>
                    {/* </Row>
                            <Row gutter={[16, 24]}> */}
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Diametro Real [mm]</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Typography.Text style={textStyle} strong>{myTest?.mySample?.diameterReal}</Typography.Text>
                    </Col>
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Diametro Normal [mm]</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Typography.Text style={textStyle} strong>{myTest?.mySample?.diameterNominal}</Typography.Text>
                    </Col>
                    {/* </Row>
                            <Row gutter={[16, 24]}> */}
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Longitud Libre [mm]</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Typography.Text style={textStyle} strong>{myTest?.mySample?.lengthFree}</Typography.Text>
                    </Col>
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Longitud Total [mm]</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Typography.Text style={textStyle} strong>{myTest?.mySample?.lengthTotal}</Typography.Text>
                    </Col>
                    {/* </Row>
                            <Row gutter={[16, 24]}> */}
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Tiempo de Prueba</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Typography.Text style={textStyle} strong>{myTest?.mySpecimen?.duration}</Typography.Text>
                    </Col>
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Temperatura [C]</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Typography.Text style={textStyle} strong>{myTest?.mySample?.targetTemperature}</Typography.Text>
                    </Col>
                    {/* </Row>
                            <Row gutter={[16, 24]}> */}
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Grosor Pared [mm]</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Typography.Text style={textStyle} strong>{myTest?.mySample?.wallThickness}</Typography.Text>
                    </Col>
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Período de Condicionamiento</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Typography.Text style={textStyle} strong>{myTest?.mySample?.conditionalPeriod}</Typography.Text>
                    </Col>
                    {/* </Row>
                            <Row gutter={[16, 24]}> */}
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Hoop Stress [Bar]</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Typography.Text style={textStyle} strong></Typography.Text>
                    </Col>
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Presión [Bar]</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Typography.Text style={textStyle} strong>{myTest?.mySample?.targetPressure}</Typography.Text>
                    </Col>
                    {/* </Row>
                            <Row gutter={[16, 24]}> */}
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Fecha de Inicio</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Typography.Text style={textStyle} strong>{myTest?.mySpecimen?.beginTime}</Typography.Text>
                    </Col>
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Fecha de Finalizacion</Typography.Text>
                    </Col>
                    <Col span={7}>
                        <Typography.Text style={textStyle} strong>{myTest?.mySpecimen?.endTime}</Typography.Text>
                    </Col>
                    {/* </Row>
                            <Row gutter={[16, 24]}> */}
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Tipo de falla</Typography.Text>
                    </Col>
                    <Col span={19}>
                        <Paragraph style={paragraphEditableStyle} editable={{
                            tooltip: "Click para editar", onChange: (e: string) => {
                                setFail(e);
                                changesOnSpecimen(testName, operator, e, reMark);
                            }, triggerType: ['text'], maxLength: 255
                        }}>{fail}</Paragraph>
                    </Col>
                    {/* </Row>
                            <Row gutter={[16, 24]}> */}
                    <Col span={5}>
                        <Typography.Text style={textStyle} strong>Observaciones</Typography.Text>
                    </Col>
                    <Col span={19}>
                        <Paragraph style={paragraphEditableStyle} editable={{
                            tooltip: "Click para editar", onChange: (e: string) => {
                                setReMark(e);
                                changesOnSpecimen(testName, operator, fail, e);
                            }, triggerType: ['text'], maxLength: 255
                        }}>{reMark == null ? 'Sin Observaciones' : reMark}</Paragraph>
                    </Col>
                </Row>
            </div>
            <PlotTestResult DataPlot={myData} />
        </div>
    );
}

export default testSample;