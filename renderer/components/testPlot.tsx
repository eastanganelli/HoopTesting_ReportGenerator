import { FunctionComponent, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Label, Legend, ResponsiveContainer } from 'recharts';

import QueryService  from '../utils/database/query';

import type { TestDataValues } from '../interfaces/query/data';

interface Props { idSpecimen: number; };

const plotTestResult: FunctionComponent<Props> = (Props: Props) => {
    const {idSpecimen} = Props;
    const [axisColors,        setAxisColors]        = useState<{ pressureColor: string; temperatureColor: string; }>({ pressureColor: '#ff0000', temperatureColor: '#00ff00' });
    const [plotData,          setPlotData]          = useState<TestDataValues[]>([]);
    const [plotConfiguration, setPlotConfiguration] = useState<{ interval: number; timeType: string; }>({ interval: 30, timeType: 'min' });

    useEffect(() => {
        const storedConfig = JSON.parse(localStorage.getItem('chartConfig'));
        if (storedConfig) {
            setAxisColors({
                pressureColor:    storedConfig['pressureColor'],
                temperatureColor: storedConfig['temperatureColor']
            });
        }
        QueryService.SELECT.TEST.Data([idSpecimen]).then((TestResults: TestDataValues[]) => { setPlotData(TestResults); });
    }, []);

    return (
        <>
            <ResponsiveContainer height={(globalThis.innerHeight * 0.8) - 48}>
                <LineChart data={plotData}>
                    <XAxis dataKey="key">
                        <Label value={`Tiempo [${plotConfiguration?.timeType}]`} offset={0} position="insideBottom" />
                    </XAxis>
                    <YAxis yAxisId="left" domain={['auto', 'auto']}>
                        {/* <Label value="Presión [Bar]" angle={-90} position="insideLeft" /> */}
                    </YAxis>
                    <Legend verticalAlign="top" />
                    <Line yAxisId="left"  type="monotone" dataKey="pressure" name="Presión" scale='identity' stroke={axisColors['pressureColor']} dot={false} isAnimationActive={false}/>
                    <YAxis yAxisId="right" domain={['auto', 'auto']}>
                        {/* <Label value="Temperatura [°C]" angle={-90} position="insideLeft" /> */}
                    </YAxis>
                    <Legend verticalAlign="top" />
                    <Line yAxisId="right" type="monotone" dataKey="temperature" name="Temperatura" scale='identity' stroke={axisColors['temperatureColor']} dot={false} isAnimationActive={false}/>
                </LineChart>
            </ResponsiveContainer>
        </>
    );
};

export default plotTestResult;