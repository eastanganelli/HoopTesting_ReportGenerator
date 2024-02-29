import { CSSProperties, useState, useRef, useEffect, FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import { Layout, Typography, Col, Row, FloatButton } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, Label, Legend, ResponsiveContainer } from 'recharts';

import QueryService from '../utils/database/dbquery';

import type { TestData } from '../interfaces/data';

const { Content } = Layout;
const { Paragraph } = Typography;

const contentStyle: CSSProperties = {
    backgroundColor: 'white',
    margin: 'auto',
    color: 'black',
    width: "80vw",
};
const textStyle: CSSProperties = {
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    fontFamily: 'Garamond, SimSun',
    //fontSize: "1.2vmax",
};
const paragraphStyle: CSSProperties = {
    borderBottom: "2px solid black",
    display: 'flex',
    textAlign: 'left',
    width: "80%",
    fontFamily: 'Garamond, SimSun',
    //fontSize: "1.1vmax",
};

const testSample: FunctionComponent = () => {
    const { query, isReady } = useRouter();
    const contentToPrint = useRef(null);

    const [SpecimenID, setSpecimenID] = useState<number>(-1);
    const [myTest, setMyTest] = useState<TestData>(null);
    const [testName, setTestName] = useState<string>("");
    const [operator, setOperator] = useState<string>("");
    const [fail, setFail] = useState<string>("");
    const [reMark, setReMark] = useState<string>("");

    const changeData = (parent: string, child: string, data: string) => {
        let auxData: TestData = myTest;
        auxData[parent][child] = data;
        setMyTest(auxData);
        QueryService.UPDATE.Specimen([myTest['mySpecimen']['idSpecimen'], myTest['mySpecimen']['testName'], myTest['mySpecimen']['operator'], myTest['mySpecimen']['fail'], myTest['mySpecimen']['remark']]);
    };

    useEffect(() => {
        const id_specimen: number = Number(query['idSpecimen']) as number;
        if (isReady && id_specimen > 0) {
            QueryService.SELECT.Test([id_specimen]).then((data: TestData) => {
                console.log(data);
                setMyTest(data);
            });
            setSpecimenID(id_specimen);
        }
    }, [isReady]);

    return (
        <Layout style={{ padding: '24px 24px 24px' }}>
            <Content
                className="site-layout-background"
                style={{
                    padding: 24,
                    background: 'white',
                    borderRadius: 25,
                    alignContent: 'center',
                }}
            >
                <FloatButton
                    icon={<PrinterOutlined />}
                    shape="square"
                    style={{ right: 32 }}
                /* onClick={
                    () => {
                        handlePrint(null, () => contentToPrint.current);
                    }
                } */
                >
                </FloatButton>
                <div ref={contentToPrint}>
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
                                    <Paragraph style={paragraphStyle}>{myTest?.mySample.standard}</Paragraph>
                                </Col>

                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Entorno</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Paragraph style={paragraphStyle}>{myTest?.mySpecimen.environment}</Paragraph>
                                </Col>
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Tapa de Extremo</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Paragraph style={paragraphStyle}>{myTest?.mySpecimen.endCap}</Paragraph>
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
                                    <Typography.Text style={textStyle} strong>Test Nro: {myTest?.mySpecimen.counts}</Typography.Text>
                                </Col>
                                {/* </Row>
                            <Row gutter={[16, 24]}> */}
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Material</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Typography.Text style={textStyle} strong>{myTest?.mySample.material}</Typography.Text>
                                </Col>
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Especificacion</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Typography.Text style={textStyle} strong>{myTest?.mySample.specification}</Typography.Text>
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
                                    <Typography.Text style={textStyle} strong>{myTest?.mySpecimen?.initTime}</Typography.Text>
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
                                    }}>{reMark != '' ? reMark : myTest?.mySpecimen?.remark}</Paragraph>
                                </Col>
                            </Row>
                        </Content>
                    </Content>
                    <Content style={contentStyle}>
                        <ResponsiveContainer height={700}>
                            <LineChart data={myTest?.myData}>
                                <XAxis dataKey="key" interval="preserveEnd" name="Tiempo [s]">
                                    <Label value="Tiempo [s]" offset={0} position="insideBottom" />
                                </XAxis>
                                <YAxis yAxisId="left">
                                    <Label value="Presión [Bar]" angle={-90} position="insideLeft" />
                                </YAxis>
                                <YAxis yAxisId="right" orientation="right">
                                    <Label value="Temperatura [°C]" angle={90} position="insideRight" />
                                </YAxis>
                                <Legend verticalAlign="top" />
                                <Line yAxisId="left" type="monotone" dataKey="pressure" name="Presion" stroke="#8884d8" scale='identity' dot={false}/>
                                <Line yAxisId="right" type="monotone" dataKey="temperature" name="Temperatura" scale='identity' stroke="#82ca9d" dot={false}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </Content>
                </div>
            </Content>
        </Layout>
    );
}

export default testSample;