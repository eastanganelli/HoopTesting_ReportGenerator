import { FunctionComponent, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Label, Legend, ResponsiveContainer } from 'recharts';
import { Button, Col, Form, FormInstance, InputNumber, Row, Select } from 'antd';

import QueryDataService from '../utils/database/query/data';

import type { QueryData } from '../interfaces/query/data';
import { Option } from 'antd/es/mentions';

interface Props { idSpecimen: number; plotForm: FormInstance<{ interval: number; timeType: string; }>; }
interface PropsComparing { idSpecimen: number; plotTiming: { interval: number; timeType: string; }; }

const PlotTestResult: FunctionComponent<Props> = (Props: Props) => {
    const { idSpecimen, plotForm } = Props;
    const [plotParams,   setPlotParams] = useState<{ interval: number; timeType: string; }>({ interval: 1, timeType: 'm' });
    const [minValue,       setMinValue] = useState<number>(1);
    const [stepValue,     setStepValue] = useState<number>(1);
    const [axisColors,   setAxisColors] = useState<{ pressureColor: string; temperatureColor: string; }>({ pressureColor: '#ff0000', temperatureColor: '#00ff00' });
    const [plotData,       setPlotData] = useState<QueryData[]>([]);

    const selectTimeType = (): string => {
        switch (plotParams['timeType']) {
            case 's': return 'Segundos';
            case 'm': return 'Minutos';
            case 'h': return 'Horas';
        }
    }

    const myPlotDataLoad = async (intervalue: number) => {
        await QueryDataService.SELECT.Data(idSpecimen, intervalue, plotParams['timeType']).then(async(DataResults: QueryData[]) => { setPlotData(await DataResults); });
    }

    useEffect(() => {
        const storedConfig = JSON.parse(localStorage.getItem('chartConfig'));
        if (storedConfig) {
            setAxisColors({
                pressureColor: storedConfig['pressureColor'],
                temperatureColor: storedConfig['temperatureColor']
            });
        }
    }, []);

    useEffect(() => {
        let intervalue: number = 0;
        switch (plotParams['timeType']) {
            case 's': intervalue = plotParams['interval'] / 10; break;
            case 'm': intervalue = plotParams['interval'] * 6; break;
            case 'h': intervalue = plotParams['interval'] * 360; break;
        }
        myPlotDataLoad(intervalue);
    }, [plotParams, plotData.length === 0]);

    return (
        <Form form={plotForm} layout='horizontal' onFinish={(values) => setPlotParams(values)} initialValues={plotParams}>
            <Row gutter={[16, 16]}>
                <Col span={4}><Form.Item label='Intervalo' name="interval"><InputNumber min={minValue} defaultValue={1} step={stepValue} placeholder='Intervalo' /></Form.Item></Col>
                <Col span={4}>
                    <Form.Item name="timeType">
                        <Select defaultValue={`Horas`} onChange={(value: string) => {
                            switch (value) {
                                case 's': setMinValue(10); setStepValue(10); if(plotForm.getFieldValue('interval') < 10) { plotForm.setFieldValue('interval', 10); } break;
                                case 'm': 
                                case 'h': setMinValue(1); setStepValue(1); break;
                            }
                            plotForm.setFieldValue('timeType', value);
                        }} placeholder="Medida de Tiempo">
                            <Option value="s">{`Segundos`}</Option>
                            <Option value="m">{`Minutos`}</Option>
                            <Option value="h">{`Horas`}</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={16}><Form.Item><Button type="primary" htmlType='submit'>
                    {`Actualizar Gráfico`}
                </Button></Form.Item></Col>
            </Row>
            <Row gutter={[16, 16]}>
                <ResponsiveContainer height={(globalThis.innerHeight * 0.8) - 48}>
                    <LineChart data={plotData}>
                        <Legend verticalAlign="top"/>
                        <XAxis dataKey="key"><Label value={`Tiempo [${selectTimeType()}]`} offset={0} position="insideBottom" /></XAxis>
                        <YAxis yAxisId="left"                      domain={['auto', 'auto']}/>
                        <YAxis yAxisId="right" orientation='right' domain={['auto', 'auto']}/>
                        <YAxis yAxisId="left" domain={['auto', 'auto']}/>
                        <Line yAxisId="left"  type="monotone" dataKey="pressure"    name="Presión"     scale='identity' stroke={axisColors['pressureColor']}    dot={false} isAnimationActive={true} />
                        <Line yAxisId="right" type="monotone" dataKey="temperature" name="Temperatura" scale='identity' stroke={axisColors['temperatureColor']} dot={false} isAnimationActive={true} />
                    </LineChart>
                </ResponsiveContainer>
            </Row>
        </Form>
    );
};

const PlotComparing: FunctionComponent<PropsComparing> = (Props: PropsComparing) => {
    const { idSpecimen, plotTiming } = Props;
    const [axisColors,   setAxisColors] = useState<{ pressureColor: string; temperatureColor: string; }>({ pressureColor: '#ff0000', temperatureColor: '#00ff00' });
    const [plotData,       setPlotData] = useState<QueryData[]>([]);

    const selectTimeType = (): string => {
        switch (plotTiming['timeType']) {
            case 's': return 'Segundos';
            case 'm': return 'Minutos';
            case 'h': return 'Horas';
        }
    }

    const myPlotDataLoad = async (intervalue: number) => {
        await QueryDataService.SELECT.Data(idSpecimen, intervalue, plotTiming['timeType']).then(async(DataResults: QueryData[]) => { setPlotData(await DataResults); });
    }

    useEffect(() => {
        const storedConfig = JSON.parse(localStorage.getItem('chartConfig'));
        if (storedConfig) {
            setAxisColors({
                pressureColor: storedConfig['pressureColor'],
                temperatureColor: storedConfig['temperatureColor']
            });
        }
    }, []);

    useEffect(() => {
        let intervalue: number = 0;
        switch (plotTiming['timeType']) {
            case 's': intervalue = plotTiming['interval'] / 10; break;
            case 'm': intervalue = plotTiming['interval'] * 6; break;
            case 'h': intervalue = plotTiming['interval'] * 360; break;
        }
        myPlotDataLoad(intervalue);
    }, [plotTiming, plotData.length === 0]);

    return (
        <ResponsiveContainer height={(globalThis.innerHeight * 0.8) - 48}>
            <LineChart data={plotData}>
                <Legend verticalAlign="top"/>
                <XAxis dataKey="key"><Label value={`Tiempo [${selectTimeType()}]`} offset={0} position="insideBottom" /></XAxis>
                <YAxis yAxisId="left"                      domain={['auto', 'auto']}/>
                <YAxis yAxisId="right" orientation='right' domain={['auto', 'auto']}/>
                <YAxis yAxisId="left" domain={['auto', 'auto']}/>
                <Line yAxisId="left"  type="monotone" dataKey="pressure"    name="Presión"     scale='identity' stroke={axisColors['pressureColor']}    dot={false} isAnimationActive={true} />
                <Line yAxisId="right" type="monotone" dataKey="temperature" name="Temperatura" scale='identity' stroke={axisColors['temperatureColor']} dot={false} isAnimationActive={true} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export { PlotComparing, PlotTestResult };