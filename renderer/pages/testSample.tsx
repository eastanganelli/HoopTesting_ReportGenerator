'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout, Typography, Col, Row, FloatButton } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
const DualAxes = dynamic(() => import('@ant-design/plots').then((mod) => mod.DualAxes), { ssr: false });
import { ServiceTestData } from '../utils/database/dbquery';

import { TestData } from '../interfaces/data';

const { Content, Header } = Layout;
const { Title, Paragraph } = Typography;

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Garamond, SimSun',
    backgroundColor: 'white',
};
const contentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    margin: 'auto',
    color: 'black',
    // width: "80vw",
};
const textStyle: React.CSSProperties = {
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    fontFamily: 'Garamond, SimSun',
    fontSize: "1.2vmax",
};
import { CSSProperties } from 'react';
import dynamic from 'next/dynamic';

const paragraphStyle: CSSProperties = {
    borderBottom: "2px solid black",
    display: 'flex',
    textAlign: 'left',
    //width: "75%",
    fontFamily: 'Garamond, SimSun',
    fontSize: "1.1vmax",
};

const pageStyle: string = '@Page { size: A4, margin: 30mm 25mm 30mm 25mm }';

const testSample: React.FC = () => {
    const { query, isReady } = useRouter();
    const contentToPrint = useRef(null);

    const [SpecimenID, setSpecimenID] = useState<string>("");
    const [myTest, setMyTest] = useState<TestData>(null);

    const changeData = (parent: string, child: string, data: string) => {
        let auxData: TestData = myTest;
        auxData[parent][child] = data;
        setMyTest(auxData);
        console.log(myTest);
    };

    const mySpecimen = async () => {
        if (SpecimenID.length > 0) {
            setMyTest(await ServiceTestData([Number(SpecimenID)]));
        }
    };

    const handlePrint = useReactToPrint({
        documentTitle: "STEL_SA_Reporte_especimen_" + SpecimenID,
        pageStyle: pageStyle,
        onBeforePrint: () => { console.log("Printing..."); },
        removeAfterPrint: true,
        onAfterPrint: () => { console.log("Printed!"); }
    });

    useEffect(() => {
        // console.log("isReady: ", isReady);
        const id_specimen: string = query['idSpecimen'] as string;
        if (isReady) {
            setSpecimenID(id_specimen);
            mySpecimen();
        }
    }, [isReady, query, SpecimenID]);

    const data = [
        { year: '1991', value: 3, count: 10 },
        { year: '1992', value: 4, count: 4 },
        { year: '1993', value: 3.5, count: 5 },
        { year: '1994', value: 5, count: 5 },
        { year: '1995', value: 4.9, count: 4.9 },
        { year: '1996', value: 6, count: 35 },
        { year: '1997', value: 7, count: 7 },
        { year: '1998', value: 9, count: 1 },
        { year: '1999', value: 13, count: 20 },
    ];

    const configAxes = {
        data,
        xField: 'year',
        legend: true,
        children: [
            {
                type: 'line',
                yField: 'value',
                style: {
                    stroke: '#5B8FF9',
                    lineWidth: 2,
                },
                axis: {
                    y: {
                        title: 'value',
                        style: { titleFill: '#5B8FF9' },
                    },
                },
            },
            {
                type: 'line',
                yField: 'count',
                style: {
                    stroke: '#5AD8A6',
                    lineWidth: 2,
                },
                axis: {
                    y: {
                        position: 'right',
                        title: 'count',
                        style: { titleFill: '#5AD8A6' }
                    },
                },
            },
        ],
    };

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
                    onClick={
                        () => {
                            handlePrint(null, () => contentToPrint.current);
                        }
                    }
                >
                </FloatButton>
                <div ref={contentToPrint}>
                    <Content style={contentStyle}>
                        <Header style={headerStyle}>
                            <Title>STEL S.A.</Title>
                            <Title level={3}>Informe de prueba</Title>
                        </Header>
                        {/* Datos iniciales del Informe */}
                        <Content style={{ paddingTop: "6em" }}>
                            <Row gutter={[24, 24]}>
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>ID Prueba</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Paragraph style={paragraphStyle}>{SpecimenID}</Paragraph>
                                </Col>
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Nombre de la Prueba</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Paragraph style={paragraphStyle} editable={{ tooltip: "Click para editar", onChange: (e) => { changeData('mySpecimen', 'testName', e); }, triggerType: ['text'] }}>{myTest?.mySpecimen.testName}</Paragraph>
                                </Col>

                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Cantidad De Especimen</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Paragraph style={paragraphStyle}>{myTest?.mySpecimen?.counts < 2 ? 'Muestra' : 'Muestras'} {myTest?.mySpecimen?.counts}</Paragraph>
                                </Col>
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Standard</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Paragraph style={paragraphStyle}>{myTest?.mySample.standard}</Paragraph>
                                </Col>

                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Enviromental</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Paragraph style={paragraphStyle}>{myTest?.mySpecimen.environment}</Paragraph>
                                </Col>
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>End Cap</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Paragraph style={paragraphStyle}>{myTest?.mySpecimen.endCap}</Paragraph>
                                </Col>

                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Operador</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Paragraph style={paragraphStyle} editable={{ tooltip: "Click para editar", onChange: (e) => { changeData('mySpecimen', 'operator', e); }, triggerType: ['text'] }}>{myTest?.mySpecimen.operator}</Paragraph>
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
                                <Paragraph style={textStyle} editable={{ tooltip: "Click para editar", onChange: (e) => { e;/*  setMyTest(TestData); */ }, triggerType: ['text'] }}>{myTest?.mySpecimen?.fail}</Paragraph>
                                </Col>
                                {/* </Row>
                            <Row gutter={[16, 24]}> */}
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Observaciones</Typography.Text>
                                </Col>
                                <Col span={19}>
                                    <Paragraph style={textStyle} editable={{ tooltip: "Click para editar", onChange: (e) => { e;/*  setMyTest(TestData); */ }, triggerType: ['text'] }}>{myTest?.mySpecimen?.testName}</Paragraph>
                                </Col>
                            </Row>
                        </Content>
                    </Content>
                    <Content style={contentStyle}><DualAxes {...configAxes} /></Content>
                </div>
            </Content>
        </Layout>
    );
}

export default testSample;