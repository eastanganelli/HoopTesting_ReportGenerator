import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout, Table, Checkbox, type CheckboxOptionType, type TableColumnsType, Form, Row, Col, Select, InputNumber, Button } from 'antd';
import { PlotComparing } from '../components/testPlot';


import type { CompareType } from '../interfaces/table';
import { QueryTest } from '../interfaces/query/data';
import QueryDataService from '../utils/database/query/data';

const { Content } = Layout;
const Option = Select.Option;

const columns: TableColumnsType<CompareType> = [
    { title: 'ID Muestra', dataIndex: 'idSample', key: 'idSample', width: 85, fixed: 'left' },
    { title: 'ID Especimen', dataIndex: 'idSpecimen', key: 'idSpecimen', width: 120, fixed: 'left' },
    // { title: 'Prueba N°', dataIndex: 'testNumber', key: 'testNumber', width: 85, fixed: 'left' },
    // { title: 'Muestras', dataIndex: 'counts', key: 'counts', width: 100 },
    { title: 'Estándard', dataIndex: 'standard', key: 'standard', width: 150 },
    { title: 'Material', dataIndex: 'material', key: 'material', width: 125 },
    { title: 'Especificación', dataIndex: 'specification', key: 'specification', width: 140 },
    { title: 'Diámetro Real [mm]', dataIndex: 'diameterReal', key: 'diameterReal', width: 100 },
    { title: 'Diámetro Nominal [mm]', dataIndex: 'diameterNominal', key: 'diameterNominal', width: 125 },
    { title: 'Espesor [mm]', dataIndex: 'wallThickness', key: 'wallThickness', width: 100 },
    { title: 'Temperatura  [°C]', dataIndex: 'targetTemperature', key: 'targetTemperature', width: 125 },
    { title: 'Presión [bar]', dataIndex: 'targetPressure', key: 'targetPressure', width: 100 },
    { title: 'Entorno', dataIndex: 'enviroment', key: 'enviroment', width: 100 },
    { title: 'Inicio', dataIndex: 'beginTime', key: 'beginTime', width: 150 },
    { title: 'Fin', dataIndex: 'endTime', key: 'endTime', width: 150 },
    { title: 'Duración', dataIndex: 'duration', key: 'duration', width: 100 },
    { title: 'Tapa', dataIndex: 'endCap', key: 'endCap', width: 100 },
    // { title: 'Operador',              dataIndex: 'operator',          key: 'operator',          width: 150, hidden: true },
    // { title: 'Falla',                 dataIndex: 'fail',              key: 'fail',              width: 275, hidden: true },
    // { title: 'Observaciones',         dataIndex: 'remark',            key: 'remark',            width: 275, hidden: true },
];

const defaultCheckedList = columns.map((column) => { return column.key as string; });

const TestCompare = () => {
    const { query, isReady }            = useRouter();
    const [myTests,         setMyTests] = useState<CompareType[]>([]);
    const [checkedList, setCheckedList] = useState(defaultCheckedList);

    const options = columns.map(({ key, title }) => ({
        label: title,
        value: key,
        disabled: false
    }));

    const newColumns = columns.map((item) => ({ ...item, hidden: !checkedList.includes(item.key as string) }));

    const loadCompareTable = async(idSpecimens: number[]) => {
        let tableCompareData: CompareType[] = [];
        for(let idSpecimen of idSpecimens) {
            await QueryDataService.SELECT.TEST.Test(idSpecimen).then((DataResults: QueryTest) => {
                const auxData = DataResults;
                tableCompareData.push({
                    key: auxData['idSpecimen'],
                    idSpecimen: auxData['idSpecimen'],
                    idSample: auxData['idSample'],
                    standard: auxData['standard'],
                    material: auxData['material'],
                    specification: auxData['specification'],
                    diameterReal: auxData['diameterReal'],
                    diameterNominal: auxData['diameterNominal'],
                    wallThickness: auxData['wallThickness'],
                    lengthTotal: auxData['lengthTotal'],
                    lengthFree: auxData['lengthFree'],
                    targetTemperature: auxData['targetTemperature'],
                    targetPressure: auxData['targetPressure'],
                    conditionalPeriod: auxData['conditionalPeriod'],
                    enviroment: auxData['enviroment'],
                    beginTime: auxData['beginTime'],
                    endTime: auxData['endTime'],
                    duration: auxData['duration'],
                    testName: auxData['testName'],
                    endCap: auxData['endCap']
                });
            });
        }
        setMyTests([...tableCompareData]);
    }

    useEffect(() => {
        const idsSpecimens: string = String(query['idSpecimens']) as string;
        if (isReady && idsSpecimens !== undefined) {
            let auxIdSpecimen: number[] = [];
            idsSpecimens.split(',').forEach((idSpecimen: string) => { auxIdSpecimen.push(Number(idSpecimen)); });
            loadCompareTable(auxIdSpecimen);
        }
    }, [isReady]);

    return (
        <Layout style={{ background: "lightgrey", minHeight: "98vh", overflow: "auto" }}>
            <Layout style={{ padding: '12px' }}>
                <Content style={{ padding: 24, background: 'white', borderRadius: 25, alignItems: 'center', justifyContent: 'center', fontSize: "1vw" }}>
                    <><Checkbox.Group value={checkedList} options={options as CheckboxOptionType[]} onChange={(value) => { setCheckedList(value as string[]) }} /></>
                    <><Table style={{ paddingTop: 20, paddingBottom: 20 }} columns={newColumns} dataSource={myTests} scroll={{ x: 1000 }} pagination={{ position: [] }}
                        expandable={{ expandedRowRender: record => (
                            <PlotComparing idSpecimen={record['idSpecimen']} height={globalThis.innerHeight * 0.8} width={globalThis.innerWidth * 0.8}/>
                        ) }}
                    /></>
                </Content>
            </Layout>
        </Layout>
    );
}

export default TestCompare;