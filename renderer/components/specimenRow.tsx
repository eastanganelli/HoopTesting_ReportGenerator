import dynamic from 'next/dynamic';
import { useState, useEffect, FunctionComponent } from 'react';
import { PlusOutlined, MinusOutlined, EditOutlined, FilePdfOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Space, Button, Modal, message } from 'antd';

import openNewWindow from '../utils/newWindows';
import QueryService from '../utils/database/dbquery';

const TestSample = dynamic(() => import('./testSample'), { ssr: false });

import type { TableColumnsType } from 'antd';
import type { QuerySpecimenTest } from '../interfaces/query';
import type { ExpandedDataType } from '../interfaces/table';
import type { TestData, TestDataValues } from '../interfaces/query';

interface Props { specimens: QuerySpecimenTest[]; rowSelection: { selectedRowKeys: number[]; onChange: (idTest: number) => void; }; };

const { info } = Modal;

const SpecimenTable: FunctionComponent<Props> = ({ specimens, rowSelection }: Props) => {
    const [tableUpdated, setTableUpdated] = useState<number>(0);
    const [specimenData, setSpecimenData] = useState<ExpandedDataType[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    const viewTest = (e: any, Specimen: ExpandedDataType, index: number) => {
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
                    //console.log('Params needs update in DB', testName, operator, fail, reMark);
                };

                info({
                    title: `Prueba ID: ${Specimen['idSpecimen']}`,
                    content: (<TestSample myTest={myTest[0]} myData={TestResults} changesOnSpecimen={updateSpecimen} />),
                    width: "80vw",
                    okText: "Guardar",
                    afterClose() {
                        if (testName !== "" || operator !== "" || fail !== "" || reMark !== "") {
                            console.log('Params needs update in DB', testName, operator, fail, reMark);
                            QueryService.UPDATE.Specimen([Specimen['idSpecimen'], testName, operator, fail, reMark]);
                            specimens[index]['operator'] = operator;
                            setTableUpdated(tableUpdated + 1);
                        }
                    }
                });
            });
        });
    };

    const printTest = (e: any, Specimen: ExpandedDataType) => { openNewWindow(`test_${Specimen['idSpecimen']}`, `Visualizador Reporte || Prueba Nro [${Specimen['idSpecimen']}] - Fecha: ${Specimen['beginTime']}`, `/printer?idSpecimen=${Specimen['idSpecimen']}`); };

    const deleteTest = (e: any, Specimen: ExpandedDataType, index: number) => {
        QueryService.DELETE.Specimen([Specimen['idSpecimen']]);
        specimens.splice(index, 1);
    };

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
            render: (_, record, index) => (
                <Space size="middle">
                    <Button
                        icon={rowSelection.selectedRowKeys.includes(record['idSpecimen']) ? <MinusOutlined /> : <PlusOutlined />}
                        onClick={
                            () => {
                                rowSelection.onChange(record['idSpecimen']);
                                setTableUpdated(tableUpdated + 1);
                                messageApi.info({
                                    content: `${rowSelection.selectedRowKeys.length} de 5 seleccionados`,
                                    duration: 4,
                                });
                            }
                        }
                        type='primary'
                        danger={rowSelection.selectedRowKeys.includes(record['idSpecimen'])}
                        ghost
                    >
                    </Button>
                    <Button onClick={(event) => viewTest(event, record, index)} icon={<EditOutlined />} type="primary" ghost></Button>
                    <Button onClick={(event) => printTest(event, record)} icon={<FilePdfOutlined />} type="primary" ghost></Button>
                    <Button onClick={(event) => deleteTest(event, record, index)} icon={<DeleteOutlined />} danger></Button>
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
    }, [tableUpdated]);

    return (
        <div>
            {contextHolder}
            <Table
                columns={columns}
                dataSource={specimenData}
                pagination={{ disabled: false, size: "small", pageSize: 5, position: ["topCenter"] }}
            /* onChange={(...args) => { console.log(...args) }} */
            />
        </div>
    )
}

export default SpecimenTable;