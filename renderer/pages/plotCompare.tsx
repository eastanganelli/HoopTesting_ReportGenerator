import { useState, useEffect, FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import { Layout, Table } from 'antd';
import type { TableColumnsType } from 'antd';

import QueryService from '../utils/database/query';

import type { TestData } from '../interfaces/query';
import type { CompareType } from '../interfaces/table';

const { Content } = Layout;

const columns: TableColumnsType<CompareType> = [
    { title: 'ID Muestra', dataIndex: 'idSample', key: 'idSample', fixed: 'left' },
    { title: 'ID Especimen', dataIndex: 'idSpecimen', key: 'idSpecimen', fixed: 'left' },
    { title: 'Prueba N°', dataIndex: 'testNumber', key: 'testNumber', fixed: 'left' },
    { title: 'Temperatura', dataIndex: 'targetTemperature', key: 'targetTemperature' },
    { title: 'Presión', dataIndex: 'targetPressure', key: 'targetPressure' },
    { title: 'Esfuerzo', dataIndex: 'hoopStress', key: 'hoopStress' },
    { title: 'Estándard', dataIndex: 'standard', key: 'standard' },
    { title: 'Material', dataIndex: 'material', key: 'material' },
    { title: 'Especificación', dataIndex: 'specification', key: 'specification' },
    { title: 'Diámetro Real', dataIndex: 'diameterReal', key: 'diameterReal' },
    { title: 'Diámetro Nominal', dataIndex: 'diameterNominal', key: 'diameterNominal' },
    { title: 'Espesor', dataIndex: 'wallThickness', key: 'wallThickness' },
    { title: 'Operador', dataIndex: 'operator', key: 'operator' },
    { title: 'Ambiente', dataIndex: 'enviroment', key: 'enviroment' },
    { title: 'Inicio', dataIndex: 'beginTime', key: 'beginTime' },
    { title: 'Fin', dataIndex: 'endTime', key: 'endTime' },
    { title: 'Duración', dataIndex: 'duration', key: 'duration' },
    { title: 'Conteos', dataIndex: 'counts', key: 'counts' },
    { title: 'Prueba', dataIndex: 'testName', key: 'testName' },
    { title: 'Tapas', dataIndex: 'endCap', key: 'endCap' },
    { title: 'Falla', dataIndex: 'fail', key: 'fail' },
    { title: 'Observaciones', dataIndex: 'remark', key: 'remark' },
];

const testSample: FunctionComponent = () => {
    const { query, isReady } = useRouter();
    const [myTest, setMyTest] = useState<CompareType[]>([]);

    const loadCompareTable = async (idsSpecimens: string) => {
        const data: CompareType[] = await QueryService.SELECT.TEST.TestCompare([idsSpecimens]);
        await console.log('Data:', data);
        await setMyTest(data);
    };

    useEffect(() => {
        const idsSpecimens: string = String(query['idSpecimens']) as string;
        if (isReady && idsSpecimens !== undefined) {
            loadCompareTable(idsSpecimens);
        }
    }, [isReady]);

    return (
        <Layout style={{ background: "lightgray", minHeight: "98vh", overflow: "auto" }}>
            <Layout style={{ padding: '12px', minHeight: "98vh", overflow: "auto" }}>
                <Content style={{ padding: 24, background: 'white', borderRadius: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: "1vw" }}>
                    <Table columns={columns} dataSource={myTest} scroll={{ x: 2800 }} />
                </Content>
            </Layout>
        </Layout>
    );
}

export default testSample;