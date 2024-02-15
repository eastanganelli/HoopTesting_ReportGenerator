import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Layout, Typography, Col, Row, FloatButton } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useReactToPrint } from 'react-to-print';

const { Content, Header } = Layout;
const { Title, Paragraph } = Typography;

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export interface specimen {
    idSpecimen: number;
    operator: string;
    initDate: string;
    endDate: string;
};

export class specimen {
    idSpecimen: number;
    operator: string;
    initDate: string;
    endDate: string;

    constructor() {
        //...
    }

    linechart() {
        return (<p>some contents...</p>);
    }
}

const options = {
    responsive: true,
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
    redraw: false,
    stacked: false,
    scales: {
        x: {
            ticks: {
                font: {
                    size: 20,
                }
            }
        },
        y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            title: {
                text: "Presión [bar]",
                display: true,
                font: {
                    size: 22,
                }
            },
            ticks: {
                font: {
                    size: 20,
                }
            }
        },
        y1: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            title: {
                text: "Temperatura [C]",
                display: true,
                font: {
                    size: 22,
                }
            },
            grid: {
                drawOnChartArea: false,
            },
            ticks: {
                font: {
                    size: 20,
                }
            }
        },
    },
    plugins: {
        legend: {
            display: true,
            position: 'top' as const,
            labels: {
                font: {
                    size: 20,
                }
            }
        }
    },
};

const data = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    datasets: [
        {
            label: 'Temperatura',
            data: [24, 24.3, 24.3, 24.2, 24.2, 24.0, 24.2, 24.4, 24.1],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            yAxisID: 'y1',
        },
        {
            label: 'Presion',
            data: [1, 2.5, 4.7, 7, 7.7, 8, 8.1, 8, 7.9],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            yAxisID: 'y',
            display: false
        },
    ],
};

const testSample: React.FC = () => {
    const contentToPrint = useRef(null);

    const handlePrint = useReactToPrint({
        documentTitle: "Prueba de reporte de prueba",
        onBeforePrint: () => { console.log("Printing...") },
        removeAfterPrint: true,
        onAfterPrint: () => { console.log("Printed!") },
        copyStyles: true,
        pageStyle: '@Page { size: A4, margin: 257mm 257mm 257mm 257mm }'
    });

    const router = useRouter();
    let idSpecimen = router.query['idSpecimen'] == undefined ? -2 : router.query['idSpecimen'];

    const [editableIDTest,   setEditableIDTest]   = useState<string>(idSpecimen as string);
    const [editableTestName, setEditableTestName] = useState<string>("Prueba de resistencia con presión constante");
    const [editableOperator, setEditableOperator] = useState<string>("STEL S.A.");
    const [editableRemark,   setEditableRemark]   = useState<string>("Sin Observaciones");

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
        // height: "100vh",
        // maxWidth: "80vw",
    };
    const textStyle: React.CSSProperties = {
        display: 'flex',
        textAlign: 'left',
        alignItems: 'center',
        fontFamily: 'Garamond, SimSun',
        fontSize: "1.2vmax",
    };
    const paragraphStyle: React.CSSProperties = {
        borderBottom: "2px solid black",
        display: 'flex',
        textAlign: 'left',
        //width: "75%",
        fontFamily: 'Garamond, SimSun',
        fontSize: "1.1vmax",
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
                    }>
                    </FloatButton>
                <div ref={contentToPrint}>
                    <Content style={contentStyle}>
                        <Header style={headerStyle}>
                            <Title /* style={{ fontSize: "2.9vw" }} */>STEL S.A.</Title>
                            <Title level={3}/* style={{ paddingTop: "1.5em", fontSize: "2.2vw" }} */>Informe de prueba</Title>
                        </Header>
                        {/* Datos iniciales del Informe */}
                        <Content style={{ paddingTop: "9em" }}>
                            <Row gutter={[16, 20]}>
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>ID Prueba</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Paragraph style={paragraphStyle}>{editableIDTest}</Paragraph>
                                </Col>
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Nombre de la Prueba</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Paragraph style={paragraphStyle} editable={{ tooltip: "Click para editar", onChange: setEditableTestName, triggerType: ['text'] }}>{editableTestName}</Paragraph>
                                </Col>

                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Cantidad De Especimen</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Paragraph style={paragraphStyle}>{/* {countSpecimens} */} 3</Paragraph>
                                </Col>
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Standard</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Paragraph style={paragraphStyle}>{/* {countSpecimens} */} ISO1167-1996</Paragraph>
                                </Col>

                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Enviromental</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Paragraph style={paragraphStyle}>{/* {countSpecimens} */} Agua</Paragraph>
                                </Col>
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>End Cap</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Paragraph style={paragraphStyle}>{/* {countSpecimens} */} Tipo A</Paragraph>
                                </Col>

                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Operador</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Paragraph style={paragraphStyle} editable={{ tooltip: "Click para editar", onChange: setEditableOperator, triggerType: ['text'] }}>{editableOperator}</Paragraph>
                                </Col>
                            </Row>
                        </Content>
                        {/* Datos Grilla del Informe */}
                        <Content style={{ paddingTop: "4.5em" }}>
                            <Row gutter={[16, 32]}>
                                <Col span={24}>
                                    <Typography.Text style={textStyle} strong>Test Nro: XXXXXXXXXX</Typography.Text>
                                </Col>
                                {/* </Row>
                            <Row gutter={[16, 24]}> */}
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Material</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Typography.Text style={textStyle} strong>PE</Typography.Text>
                                </Col>
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Especificacion</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Typography.Text style={textStyle} strong>PE80</Typography.Text>
                                </Col>
                                {/* </Row>
                            <Row gutter={[16, 24]}> */}
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Diametro Real [mm]</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Typography.Text style={textStyle} strong>180</Typography.Text>
                                </Col>
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Diametro Normal [mm]</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Typography.Text style={textStyle} strong>180</Typography.Text>
                                </Col>
                                {/* </Row>
                            <Row gutter={[16, 24]}> */}
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Longitud Libre [mm]</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Typography.Text style={textStyle} strong>540</Typography.Text>
                                </Col>
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Longitud Total [mm]</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Typography.Text style={textStyle} strong>750</Typography.Text>
                                </Col>
                                {/* </Row>
                            <Row gutter={[16, 24]}> */}
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Tiempo de Prueba</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Typography.Text style={textStyle} strong>100h 00m 00s</Typography.Text>
                                </Col>
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Temperatura [C]</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Typography.Text style={textStyle} strong>20</Typography.Text>
                                </Col>
                                {/* </Row>
                            <Row gutter={[16, 24]}> */}
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Grosor Pared [mm]</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Typography.Text style={textStyle} strong>16</Typography.Text>
                                </Col>
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Período de Condicionamiento</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Typography.Text style={textStyle} strong>6 h + 30 min</Typography.Text>
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
                                    <Typography.Text style={textStyle} strong>21</Typography.Text>
                                </Col>
                                {/* </Row>
                            <Row gutter={[16, 24]}> */}
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Fecha de Inicio</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Typography.Text style={textStyle} strong>2019-05-20 09:36:51 a.m.</Typography.Text>
                                </Col>
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Fecha de Finalizacion</Typography.Text>
                                </Col>
                                <Col span={7}>
                                    <Typography.Text style={textStyle} strong>24/05/2019 01:40:44 p.m.</Typography.Text>
                                </Col>
                                {/* </Row>
                            <Row gutter={[16, 24]}> */}
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Tipo de falla</Typography.Text>
                                </Col>
                                <Col span={19}>
                                    <Typography.Text style={textStyle} strong>Sin fallas</Typography.Text>
                                </Col>
                                {/* </Row>
                            <Row gutter={[16, 24]}> */}
                                <Col span={5}>
                                    <Typography.Text style={textStyle} strong>Observaciones</Typography.Text>
                                </Col>
                                <Col span={19}>
                                    <Paragraph style={textStyle} editable={{ tooltip: "Click para editar", onChange: setEditableRemark, triggerType: ['text'] }}>{editableRemark}</Paragraph>
                                </Col>
                            </Row>
                        </Content>
                    </Content>
                    <Line style={{ height: "60vmax", width: "auto" }} options={options} data={data} />
                </div>
            </Content>
        </Layout>
    );
}

export default testSample;