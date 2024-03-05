import { CSSProperties, useState, useEffect, FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import { Layout, Typography, Col, Row } from 'antd';

import QueryService from '../utils/database/dbquery';
import PlotTestResult from './plot';

import type { TestData, TestDataValues } from '../interfaces/query';

const { Content } = Layout;
const { Paragraph } = Typography;

const contentStyle: CSSProperties = {
    margin: 'auto',
    color: 'black',
    width: "80vw",
};
const textStyle: CSSProperties = {
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    fontFamily: 'Garamond',
};
const paragraphStyle: CSSProperties = {
    borderBottom: "2px solid black",
    display: 'flex',
    textAlign: 'left',
    fontFamily: 'Garamond',
};

interface Props { idSpecimen: number }

const testSample: FunctionComponent<Props> = ({ idSpecimen }: Props) => {
    const { query, isReady } = useRouter();

    const [myTest, setMyTest] = useState<TestData>(null);
    const [testName, setTestName] = useState<string>("");
    const [operator, setOperator] = useState<string>("");
    const [fail, setFail] = useState<string>("");
    const [reMark, setReMark] = useState<string>("");

    const changeData = (parent: string, child: string, data: string) => {
        let auxData: TestData = myTest;
        auxData[parent][child] = data;
        setMyTest(auxData);
        QueryService.UPDATE.Specimen([idSpecimen, myTest['mySpecimen']['testName'], myTest['mySpecimen']['operator'], myTest['mySpecimen']['fail'], myTest['mySpecimen']['remark']]);
    };

    const openModalPlot = () => {
        /* QueryService.SELECT.TEST.Data([myTest['mySpecimen']['idSpecimen']]).then((data: TestDataValues[]) => {
            info({
                icon: <LineChartOutlined />,
                content: <PlotTestResult DataPlot={data} />,
                width: "80vw",
                okText: 'Cerrar',
                okType: 'primary',
                cancelButtonProps: {
                    hidden: true,
                },
                onOk() {
                    console.log('OK');
                },
            });
        }); */
    };

    useEffect((): void => {
            QueryService.SELECT.TEST.Test([idSpecimen]).then((data: TestData) => {
                setMyTest(data[0]);
            });
    }, [isReady]);

    return (
        <Layout style={{ padding: '12px', minHeight: "98vh", overflow: "auto" }}>
            <Content style={{ padding: 24, background: 'white', borderRadius: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: "1vw" }}>
                <Content style={contentStyle}>
                    {/* Datos iniciales del Informe */}
                    <Content>
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
                                <Paragraph style={paragraphStyle} editable={{
                                    tooltip: "Click para editar", onChange: (e: string) => {
                                        if (e.length > 0) {
                                            setTestName(e);
                                            changeData('mySpecimen', 'testName', e);
                                        }
                                    }, triggerType: ['text'], maxLength: 150
                                }}>{testName != '' ? testName : myTest?.mySpecimen?.testName}</Paragraph>
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
                                <Paragraph style={paragraphStyle} editable={{
                                    tooltip: "Click para editar", onChange: (e: string) => {
                                        if (e.length > 0) {
                                            setOperator(e);
                                            changeData('mySpecimen', 'operator', e);
                                        }
                                    }, triggerType: ['text'], maxLength: 40
                                }}>{operator != '' ? operator : myTest?.mySpecimen?.operator}</Paragraph>
                            </Col>
                        </Row>
                    </Content>
                    {/* Datos Grilla del Informe */}
                    <Content style={{ paddingTop: "2.25em" }}>
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
                                <Paragraph style={paragraphStyle} editable={{
                                    tooltip: "Click para editar", onChange: (e: string) => {
                                        if (e.length > 0) {
                                            setFail(e);
                                            changeData('mySpecimen', 'fail', e);
                                        }
                                    }, triggerType: ['text'], maxLength: 255
                                }}>{fail != '' ? fail : myTest?.mySpecimen?.fail}</Paragraph>
                            </Col>
                            {/* </Row>
                            <Row gutter={[16, 24]}> */}
                            <Col span={5}>
                                <Typography.Text style={textStyle} strong>Observaciones</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Paragraph style={paragraphStyle} editable={{
                                    tooltip: "Click para editar", onChange: (e: string) => {
                                        if (e.length > 0) {
                                            setReMark(e);
                                            changeData('mySpecimen', 'remark', e);
                                        }
                                    }, triggerType: ['text'], maxLength: 255
                                }}>{reMark != '' ? reMark : (myTest?.mySpecimen?.remark == null ? 'Sin Observaciones' : myTest?.mySpecimen?.remark)}</Paragraph>
                            </Col>
                        </Row>
                    </Content>
                </Content>
            </Content>
        </Layout>
    );
}

export default testSample;