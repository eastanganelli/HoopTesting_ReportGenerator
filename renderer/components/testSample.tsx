import dynamic from 'next/dynamic';
import { CSSProperties, useState, FunctionComponent } from 'react';
import { Typography, Descriptions } from 'antd';
const PlotTestResult = dynamic(() => import('./plot'), { ssr: false });

import type { TestData, TestDataValues } from '../interfaces/query';

const { Paragraph } = Typography;

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
    const [fail, setFail] = useState<string>((myTest?.mySpecimen?.fail !== `` ? myTest?.mySpecimen?.fail : 'Sin Fallas'));
    const [reMark, setReMark] = useState<string>((myTest?.mySpecimen?.remark !== `` ? myTest?.mySpecimen?.remark : 'Sin Observaciones'));

    return (
        <div>
            {/* Datos iniciales del Informe */}
            <Descriptions bordered>
                <Descriptions.Item label="Nombre de la Prueba" span={2}>
                    <Paragraph style={paragraphEditableStyle} editable={{
                        tooltip: "Editar Nombre de la Prueba", onChange: (e: string) => {
                            setTestName(e);
                            changesOnSpecimen(e, operator, fail, reMark);
                        }, triggerType: ['text'], maxLength: 150
                    }}>{testName}
                    </Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Operador" span={2}>
                <Paragraph style={paragraphEditableStyle} editable={{
                            tooltip: "Editar Operador", onChange: (e: string) => {
                                setOperator(e);
                                changesOnSpecimen(testName, e, fail, reMark);
                            }, triggerType: ['text'], maxLength: 40
                        }}>{operator}</Paragraph>
                </Descriptions.Item>
                {/* Sample Information */}
                <Descriptions.Item label="Estándar" span={1}>{myTest?.mySample?.standard}</Descriptions.Item>
                <Descriptions.Item label="Material" span={1}>{myTest?.mySample?.material}</Descriptions.Item>
                <Descriptions.Item label="Especifición" span={1}>{myTest?.mySample?.specification}</Descriptions.Item>
                {/* Enviroment */}
                <Descriptions.Item label="Tapa de Extremo" span={1}>{myTest?.mySpecimen?.endCap}</Descriptions.Item>
                <Descriptions.Item label="Entorno" span={1}>{myTest?.mySpecimen?.enviroment}</Descriptions.Item>
                <Descriptions.Item label="Cantidad de Especimenes" span={1}>{myTest?.mySpecimen?.counts < 2 ? 'Muestra' : 'Muestras'} {myTest?.mySpecimen?.counts}</Descriptions.Item>
                {/* Target Data */}
                <Descriptions.Item label="Hoop Stress [Bar]" span={1}>{``}</Descriptions.Item>
                <Descriptions.Item label="Presión [Bar]" span={1}>{myTest?.mySample?.targetPressure}</Descriptions.Item>
                <Descriptions.Item label="Temperatura [°C]" span={1}>{myTest?.mySample?.targetTemperature}</Descriptions.Item>
                {/* Length */}
                <Descriptions.Item label="Longitud Total [mm]" span={1}>{myTest?.mySample?.lengthTotal}</Descriptions.Item>
                <Descriptions.Item label="Longitud Libre [mm]" span={1}>{myTest?.mySample?.lengthFree}</Descriptions.Item>
                <Descriptions.Item label="Período de Condicionamiento" span={1}>{myTest?.mySample?.conditionalPeriod}</Descriptions.Item>
                {/* Diameter */}
                <Descriptions.Item label="Diámetro Nominal [mm]" span={1}>{myTest?.mySample?.diameterNominal}</Descriptions.Item>
                <Descriptions.Item label="Diámetro Real [mm]" span={1}>{myTest?.mySample?.diameterReal}</Descriptions.Item>
                <Descriptions.Item label="Grosor Pared [mm]" span={2}>{myTest?.mySample?.diameterReal}</Descriptions.Item>
                {/* Time */}
                <Descriptions.Item label="Fecha de Inicio" span={1}>{myTest?.mySpecimen?.beginTime}</Descriptions.Item>
                <Descriptions.Item label="Fecha de Finalización" span={1}>{myTest?.mySpecimen?.endTime}</Descriptions.Item>
                <Descriptions.Item label="Tiempo de Prueba" span={2}>{myTest?.mySpecimen?.duration}</Descriptions.Item>
                {/* State Information */}
                <Descriptions.Item label="Tipo de falla" span={5}>
                    <Paragraph
                        style={paragraphEditableStyle} editable={{
                            tooltip: "Click para editar", onChange: (e: string) => {
                                setFail(e);
                                changesOnSpecimen(testName, operator, e, reMark);
                            }, triggerType: ['text'], maxLength: 255
                        }}>{fail}
                    </Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Observación" span={5}>
                    <Paragraph
                        style={paragraphEditableStyle} editable={{
                            tooltip: "Click para editar", onChange: (e: string) => {
                                setReMark(e);
                                changesOnSpecimen(testName, operator, fail, e);
                            }, triggerType: ['text'], maxLength: 255
                        }}>{reMark == null ? 'Sin Observaciones' : reMark}
                    </Paragraph>
                </Descriptions.Item>
            </Descriptions>

            <PlotTestResult DataPlot={myData} />
        </div>
    );
}

export default testSample;