import React from 'react';
import { Space, Layout, Button, Typography, Col, Row, Input } from 'antd';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

const { Content } = Layout;
const { Title } = Typography;

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

export const options = {
    responsive: true,
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
    redraw: false,
    stacked: false,
    scales: {
        y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
        },
        y1: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            grid: {
                drawOnChartArea: false,
            },
        },
    },
};

export const data = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    datasets: [
        {
            label: 'Dataset 1',
            data: [12, 23, 45, 123, 456, 67, 123, -345, -234],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            yAxisID: 'y',
        },
        {
            label: 'Dataset 2',
            data: [-12, 23, 45, 123, -456, -67, -123, +345, -234],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            yAxisID: 'y1',
        },
    ],
};

const testSample = (props: any) => {
    //console.log(props);
    const { editableTestName, setEditableTestName } = props;
    let testName = editableTestName;
    const headerStyle: React.CSSProperties = {
        textAlign: 'center',
        color: 'black',
        // height: 80,
        // paddingInline: 48,
        // lineHeight: 'auto',
        backgroundColor: 'white',
    };

    const contentStyle: React.CSSProperties = {
        backgroundColor: 'white',
        textAlign: 'left',
        color: 'black',
        fontSize: 16,
        marginTop: "20px",
    };

    const inputStyle: React.CSSProperties = {
        borderBottom: "3px solid black",
        borderTop: "0px",
        borderLeft: "0px",
        borderRight: "0px",
        marginRight: "30px",
        width: "75%",
        /* textAlign: "center" */
    };

    const textStyle: React.CSSProperties = {
        textAlign: 'left',
    };

    const action = () => { console.log("Hello from render modal"); };

    return (
        <Layout  style={{ height: "100vh", background: "white" }}>
            {/* <Button onClick={action}>Imprimir</Button> */}
            <Space direction='vertical' style={{ display: 'flex' }}>
                <Layout style={headerStyle}>
                    <Title>STEL S.A.</Title>
                    <Title style={{ marginTop: "-10px" }} level={3}>Informe de prueba</Title>
                </Layout>
                <Layout>
                    <Content style={contentStyle}>
                        {/* Datos iniciales del Informe */}
                        <Content style={{ marginTop: "20px" }}>
                            <Row gutter={[16, 24]}>
                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>ID Prueba</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Input
                                        style={inputStyle}
                                        onChange={(e) => setEditableTestName(e.target.value)}
                                        defaultValue={2342342}
                                        readOnly={true}
                                    />
                                </Col>
                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Nombre de la Prueba</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Input
                                        style={inputStyle}
                                        onChange={(e) => setEditableTestName(e.target.value)}
                                        defaultValue={editableTestName}
                                        readOnly={true}
                                    />
                                    {/* <Paragraph editable={{ onChange: (value) => { console.log(value); setEditableTestName(value); testName = value; } }}>{testName}</Paragraph> */}
                                </Col>

                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Cantidad De Especimen</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Input
                                        style={inputStyle}
                                        onChange={(e) => setEditableTestName(e.target.value)}
                                        defaultValue={3}
                                        readOnly={true}
                                    />
                                </Col>
                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Standard</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Input
                                        style={inputStyle}
                                        onChange={(e) => setEditableTestName(e.target.value)}
                                        defaultValue={"ISO1167-1996"}
                                        readOnly={true}
                                    />
                                </Col>

                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Enviromental</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Input
                                        style={inputStyle}
                                        onChange={(e) => setEditableTestName(e.target.value)}
                                        defaultValue={"Agua"}
                                        readOnly={true}
                                    />
                                </Col>
                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>End Cap</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Input
                                        style={inputStyle}
                                        onChange={(e) => setEditableTestName(e.target.value)}
                                        defaultValue={"Tipo A"}
                                        readOnly={true}
                                    />
                                </Col>

                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Operador</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Input
                                        style={inputStyle}
                                        onChange={(e) => setEditableTestName(e.target.value)}
                                        defaultValue={"STEL"}
                                        readOnly={false}
                                    />
                                </Col>
                            </Row>
                        </Content>

                        {/* Datos Grilla del Informe */}
                        <Content style={{ marginTop: "70px" }}>
                            <Row gutter={[16, 24]}>
                                <Col span={24}>
                                    <Typography.Text style={textStyle} strong>Test Nro</Typography.Text>
                                </Col>

                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Material</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Typography.Text style={textStyle} strong>PE</Typography.Text>
                                </Col>
                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Especificacion</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Typography.Text style={textStyle} strong>PE80</Typography.Text>
                                </Col>

                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Diametro Real [mm]</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Typography.Text style={textStyle} strong>180</Typography.Text>
                                </Col>
                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Diametro Normal [mm]</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Typography.Text style={textStyle} strong>180</Typography.Text>
                                </Col>

                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Longitud Libre [mm]</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Typography.Text style={textStyle} strong>540</Typography.Text>
                                </Col>
                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Longitud Total [mm]</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Typography.Text style={textStyle} strong>750</Typography.Text>
                                </Col>

                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Tiempo de Prueba</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Typography.Text style={textStyle} strong>100h 00m 00s</Typography.Text>
                                </Col>
                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Temperatura [C]</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Typography.Text style={textStyle} strong>20</Typography.Text>
                                </Col>

                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Grosor Pared [mm]</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Typography.Text style={textStyle} strong>16</Typography.Text>
                                </Col>
                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Periodo de Condicionamiento</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Typography.Text style={textStyle} strong>6 h + 30 min</Typography.Text>
                                </Col>

                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Hoop Stress [Bar]</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Typography.Text style={textStyle} strong></Typography.Text>
                                </Col>
                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Presion [Bar]</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Typography.Text style={textStyle} strong>21</Typography.Text>
                                </Col>

                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Fecha de Inicio</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Typography.Text style={textStyle} strong>2019-05-20 09:36:51</Typography.Text>
                                </Col>
                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Fecha de Finalizacion</Typography.Text>
                                </Col>
                                <Col span={8}>
                                    <Typography.Text style={textStyle} strong>24/05/2019 01:40:44 p.m.</Typography.Text>
                                </Col>

                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Tipo de falla</Typography.Text>
                                </Col>
                                <Col span={20}>
                                    <Typography.Text style={textStyle} strong>Sin fallas</Typography.Text>
                                </Col>

                                <Col span={4}>
                                    <Typography.Text style={textStyle} strong>Remark</Typography.Text>
                                </Col>
                                <Col span={20}>
                                    <Typography.Text style={textStyle} strong>-----</Typography.Text>
                                </Col>
                            </Row>
                        </Content>
                    </Content>
                    <Line style={{background: "white"}} width={window.innerWidth} height={750} options={options} data={data} />
                </Layout>
            </Space>
        </Layout>
    );
};

export default testSample;