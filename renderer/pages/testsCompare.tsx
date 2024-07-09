import { useState, useEffect, FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import { Layout, Table, Checkbox, Typography, Divider, type CheckboxOptionType, type TableColumnsType } from 'antd';

import QueryService from '../utils/database/query';

const TestPlot = dynamic(() => import('../components/testPlot'), { ssr: true });

import type { TestCompare, TestDataValues } from '../interfaces/query';
import type { CompareType } from '../interfaces/table';
import dynamic from 'next/dynamic';

const { Content } = Layout;

const columns: TableColumnsType<CompareType> = [
    { title: 'ID Muestra',            dataIndex: 'idSample',          key: 'idSample',          width: 85,  fixed: 'left' },
    { title: 'ID Especimen',          dataIndex: 'idSpecimen',        key: 'idSpecimen',        width: 120, fixed: 'left' },
    { title: 'Prueba N°',             dataIndex: 'testNumber',        key: 'testNumber',        width: 85,  fixed: 'left' },
    { title: 'Muestras',              dataIndex: 'counts',            key: 'counts',            width: 100 },
    { title: 'Estándard',             dataIndex: 'standard',          key: 'standard',          width: 150 },
    { title: 'Material',              dataIndex: 'material',          key: 'material',          width: 125 },
    { title: 'Especificación',        dataIndex: 'specification',     key: 'specification',     width: 140 },
    { title: 'Diámetro Real [mm]',    dataIndex: 'diameterReal',      key: 'diameterReal',      width: 100 },
    { title: 'Diámetro Nominal [mm]', dataIndex: 'diameterNominal',   key: 'diameterNominal',   width: 125 },
    { title: 'Espesor [mm]',          dataIndex: 'wallThickness',     key: 'wallThickness',     width: 100 },
    { title: 'Temperatura  [°C]',     dataIndex: 'targetTemperature', key: 'targetTemperature', width: 125 },
    { title: 'Presión [bar]',         dataIndex: 'targetPressure',    key: 'targetPressure',    width: 100 },
    { title: 'Entorno',               dataIndex: 'enviroment',        key: 'enviroment',        width: 100 },
    { title: 'Inicio',                dataIndex: 'beginTime',         key: 'beginTime',         width: 150 },
    { title: 'Fin',                   dataIndex: 'endTime',           key: 'endTime',           width: 150 },
    { title: 'Duración',              dataIndex: 'duration',          key: 'duration',          width: 100 },
    { title: 'Tapa',                  dataIndex: 'endCap',            key: 'endCap',            width: 100 },
    { title: 'Operador',              dataIndex: 'operator',          key: 'operator',          width: 150, hidden: true },
    { title: 'Falla',                 dataIndex: 'fail',              key: 'fail',              width: 275, hidden: true },
    { title: 'Observaciones',         dataIndex: 'remark',            key: 'remark',            width: 275, hidden: true },
];

const defaultCheckedList = columns.map((column) => { if (column.key !== 'operator' && column.key !== "fail" && column.key !== "remark") { return column.key as string; } });

const testSample: FunctionComponent = () => {
    const { query, isReady }            = useRouter();
    const [myTest, setMyTest]           = useState<CompareType[]>([]);
    const [plotData, setPlotData]       = useState<TestDataValues[][]>([]);
    const [checkedList, setCheckedList] = useState(defaultCheckedList);

    const loadCompareTable = async (idsSpecimens: string) => {
        const resultQueryy: TestCompare[]   = await QueryService.SELECT.TEST.TestCompare([idsSpecimens]);
        let tableData: CompareType[]        = [];
        let plotDataAux: TestDataValues[][] = [];

        resultQueryy.forEach((Test: TestCompare) => {
            plotDataAux.push(Test["myData"] as TestDataValues[]);
            tableData.push({
                key: Number(Test["idSpecimen"]),
                idSample: Number(Test["idSample"]),
                standard: Test["standard"],
                material: Test["material"],
                specification: Test["specification"],
                diameterReal: Test["diameterReal"],
                diameterNominal: Test["diameterNominal"],
                wallThickness: Test["wallThickness"],
                lengthTotal: Test["lengthTotal"],
                lengthFree: Test["lengthFree"],
                targetTemperature: Test["targetTemperature"],
                targetPressure: Test["targetPressure"],
                conditionalPeriod: Test["conditionalPeriod"],
                idSpecimen: Number(Test["idSpecimen"]),
                operator: Test["operator"],
                enviroment: Test["enviroment"],
                beginTime: Test["beginTime"],
                endTime: Test["endTime"],
                duration: Test["duration"],
                counts: Test["counts"],
                testName: Test["testName"],
                testNumber: Test["testNumber"],
                endCap: Test["endCap"],
                fail: Test["fail"],
                remark: Test["remark"]
            });
        });
        await setMyTest(tableData);
        await setPlotData(plotDataAux);
    };

    const options = columns.map(({ key, title }) => ({
        label: title,
        value: key,
        disabled: (key === 'idSample' || key === 'idSpecimen' || key === 'testNumber' ? true : false)
    }));

    const newColumns = columns.map((item) => ({
        ...item,
        hidden: !checkedList.includes(item.key as string)
    }));

    useEffect(() => {
        const idsSpecimens: string = String(query['idSpecimens']) as string;
        if (isReady && idsSpecimens !== undefined) { loadCompareTable(idsSpecimens); }
    }, [isReady]);

    return (
        <Layout style={{ background: "lightgrey", minHeight: "98vh", overflow: "auto" }}>
            <Layout style={{ padding: '12px' }}>
                <Content style={{ padding: 24, background: 'white', borderRadius: 25, alignItems: 'center', justifyContent: 'center', fontSize: "1vw" }}>
                    <><Checkbox.Group value={checkedList} options={options as CheckboxOptionType[]} onChange={(value) => { setCheckedList(value as string[]) }} /></>
                    <><Table style={{ paddingTop: 20, paddingBottom: 20 }} columns={newColumns} dataSource={myTest} scroll={{ x: 1000 }} pagination={{ position: [] }} /></>
                    <>
                        {
                            Array.apply(null, { length: plotData.length }).map((_, index) => (
                                <>
                                    <Typography.Title level={3}> ID Prueba: {myTest[index].idSpecimen}</Typography.Title>
                                    <TestPlot key={index} DataPlot={plotData[index]} />
                                    <Divider />
                                </>
                            ))
                        }
                    </>
                </Content>
            </Layout>
        </Layout>
    );
}

export default testSample;