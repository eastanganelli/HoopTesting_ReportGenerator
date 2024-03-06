import dynamic from 'next/dynamic';
import { useState, useEffect, FunctionComponent } from 'react';
import { EyeOutlined, FilePdfOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Space, Button, Modal } from 'antd';

import openNewWindow from '../utils/newWindows';
import QueryService from '../utils/database/dbquery';

const TestSample = dynamic(() => import('./testSample'), { ssr: false });

import type { TableColumnsType } from 'antd';
import type { QuerySpecimenTest } from '../interfaces/query';
import type { ExpandedDataType } from '../interfaces/table';
import type { TestData, TestDataValues } from '../interfaces/query';

interface Props { specimens: QuerySpecimenTest[]; rowSelection: { selectedRowKeys: React.Key[]; onChange: (newSelectedRowKeys: React.Key[]) => void; }; changesOnSpecimen: () => void; };

const { info } = Modal;

const SpecimenTable: FunctionComponent<Props> = ({ specimens, rowSelection, changesOnSpecimen }: Props) => {
    const [specimenData, setSpecimenData] = useState<ExpandedDataType[]>([]);

    const viewTest = (e: any, Specimen: any) => {
        QueryService.SELECT.TEST.Test([Specimen['idSpecimen']]).then((myTest: TestData) => {
            QueryService.SELECT.TEST.Data([Specimen['idSpecimen']]).then((TestResults: TestDataValues[]) => {
                let testName: string = "",
                    operator: string = "",
                    fail: string = "",
                    reMark: string = "";

                const updateSpecimen = (testNameInput: string, operatorInput: string, failInput: string, reMarkInput: string) => {
                    testName = testNameInput;
                    operator = operatorInput;
                    fail = failInput;
                    reMark = reMarkInput;
                    console.log('Params needs update in DB', testName, operator, fail, reMark);
                };

                info({
                    title: `Test Nro: ${Specimen['idSpecimen']}`,
                    content: (
                        <TestSample myTest={myTest[0]} myData={TestResults} changesOnSpecimen={updateSpecimen} />
                    ),
                    width: "80vw",
                    onOk() { },
                    afterClose() {
                        if (testName !== "" || operator !== "" || fail !== "" || reMark !== "") {
                            console.log('Params needs update in DB', testName, operator, fail, reMark);
                            QueryService.UPDATE.Specimen([Specimen['idSpecimen'], testName, operator, fail, reMark]);
                            changesOnSpecimen();
                        }
                    }
                });
            });
        });
    };

    const printTest = (e: any, Specimen: any) => { openNewWindow(`test_${Specimen['idSpecimen']}`, `Visualizador Reporte || Prueba Nro [${Specimen['idSpecimen']}] - Fecha: ${Specimen['beginTime']}`, `/printer?idSpecimen=${Specimen['idSpecimen']}`); };

    const deleteTest = (e: any, Specimen: any) => { QueryService.DELETE.Specimen([Specimen['idSpecimen']]); };

    const columns: TableColumnsType<ExpandedDataType> = [
        { title: 'ID Specimen', dataIndex: 'idSpecimen', key: 'idSpecimen' },
        { title: 'Inicio', dataIndex: 'begin', key: 'begin' },
        { title: 'Fin', dataIndex: 'end', key: 'end' },
        { title: 'Duración', dataIndex: 'duration', key: 'duration' },
        { title: 'Operador', dataIndex: 'operator', key: 'operator' },
        {
            title: 'Accion',
            dataIndex: 'actions',
            key: 'actions',
            render: (text, record, index) => (
                <Space size="middle">
                    <Button onClick={(event) => viewTest(event, record)} icon={<EyeOutlined />} type="primary">Ver</Button>
                    <Button onClick={(event) => printTest(event, record)} icon={<FilePdfOutlined />} type="primary">Imprimir</Button>
                    <Button onClick={(event) => deleteTest(event, record)} icon={<DeleteOutlined />} danger></Button>
                </Space>
            )
        }
    ];

    useEffect(() => {
        const loadSpecimens = () => {
            let myData: ExpandedDataType[] = [];
            specimens.forEach((specimen: QuerySpecimenTest) => {
                myData.push({
                    key: specimen['idSpecimen'],
                    idSpecimen: specimen['idSpecimen'],
                    begin: specimen['beginTime'],
                    end: specimen['endTime'],
                    duration: specimen['duration'],
                    operator: specimen['operator']
                });
            });
            setSpecimenData(myData);
        };
        loadSpecimens();
    }, []);

    return (
        <Table rowSelection={rowSelection} columns={columns} dataSource={specimenData} pagination={false} />
    )
}

export default SpecimenTable;