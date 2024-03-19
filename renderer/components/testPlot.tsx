import { FunctionComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, Label, Legend, ResponsiveContainer } from 'recharts';

import type { TestDataValues } from '../interfaces/query';

interface Props { DataPlot: TestDataValues[]; };

const plotTestResult: FunctionComponent<Props> = ({ DataPlot }: Props) => {
    const hoursInSeconds = [];
    for (let i = Math.min(...DataPlot.map(d => d.key)); i <= Math.max(...DataPlot.map(d => d.key)); i += 3600) {
        hoursInSeconds.push(i);
    }

    return (
        <ResponsiveContainer height={(globalThis.innerHeight * 0.8) - 48}>
            <LineChart data={DataPlot}>
                <XAxis dataKey="key" ticks={hoursInSeconds} tickFormatter={(tick) => `${tick / 3600}`}>
                    <Label value="Tiempo [Hora]" offset={0} position="insideBottom" />
                </XAxis>
                <YAxis yAxisId="left">
                    <Label value="Presión [Bar]" angle={-90} position="insideLeft" />
                </YAxis>
                <YAxis yAxisId="right" orientation="right">
                    <Label value="Temperatura [°C]" angle={90} position="insideRight" />
                </YAxis>
                <Legend verticalAlign="top" />
                <Line yAxisId="left" type="monotone" dataKey="pressure" name="Presión" stroke="#8884d8" scale='identity' dot={false} isAnimationActive={false}/>
                <Line yAxisId="right" type="monotone" dataKey="temperature" name="Temperatura" scale='identity' stroke="#82ca9d" dot={false} isAnimationActive={false}/>
            </LineChart>
        </ResponsiveContainer>
    );
};

export default plotTestResult;