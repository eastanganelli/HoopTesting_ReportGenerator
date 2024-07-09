import { FunctionComponent, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Label, Legend, ResponsiveContainer } from 'recharts';

import type { TestDataValues } from '../interfaces/query';

interface Props { DataPlot: TestDataValues[]; };

const plotTestResult: FunctionComponent<Props> = ({ DataPlot }: Props) => {
    const [axisColors, setAxisColors] = useState<{ pressureColor: string; temperatureColor: string; }>({ pressureColor: '#ff0000', temperatureColor: '#00ff00' });
    const hoursInSeconds = [];
    // for (let i = Math.min(...DataPlot.map(d => d.key)); i <= Math.max(...DataPlot.map(d => d.key)); i += 3600) { hoursInSeconds.push(i); }

    useEffect(() => {
        const storedConfig = JSON.parse(localStorage.getItem('chartConfig'));
        if (storedConfig) {
            setAxisColors({
                pressureColor:    storedConfig['pressureColor'],
                temperatureColor: storedConfig['temperatureColor']
            });
        }
    }, []);

    return (
        <>
            <ResponsiveContainer height={(globalThis.innerHeight * 0.8) - 48}>
                <LineChart data={DataPlot}>
                    <XAxis dataKey="key" /* ticks={hoursInSeconds} tickFormatter={(tick) => `${tick / 3600}`} */>
                        <Label value="Tiempo [Hora]" offset={0} position="insideBottom" />
                    </XAxis>
                    <YAxis yAxisId="left" domain={['auto', 'auto']}>
                        {/* <Label value="Presión [Bar]" angle={-90} position="insideLeft" /> */}
                    </YAxis>
                    <Legend verticalAlign="top" />
                    <Line yAxisId="left"  type="monotone" dataKey="pressure" name="Presión" scale='identity' stroke={axisColors['pressureColor']} dot={false} isAnimationActive={false}/>
                </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer height={(globalThis.innerHeight * 0.8) - 48}>
                <LineChart data={DataPlot}>
                    <XAxis dataKey="key" /* ticks={hoursInSeconds} tickFormatter={(tick) => `${tick / 3600}`} */>
                        <Label value="Tiempo [Hora]" offset={0} position="insideBottom" />
                    </XAxis>
                    <YAxis yAxisId="left" domain={['auto', 'auto']}>
                        {/* <Label value="Temperatura [°C]" angle={-90} position="insideLeft" /> */}
                    </YAxis>
                    <Legend verticalAlign="top" />
                    <Line yAxisId="left" type="monotone" dataKey="temperature" name="Temperatura" scale='identity' stroke={axisColors['temperatureColor']} dot={false} isAnimationActive={false}/>
                </LineChart>
            </ResponsiveContainer>
        </>
    );
};

export default plotTestResult;