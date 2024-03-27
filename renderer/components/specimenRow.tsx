import dynamic from 'next/dynamic';
import { useState, useEffect, FunctionComponent } from 'react';
import { Table, Space, Button, Modal, message, Popconfirm } from 'antd';

import openNewWindow from '../utils/newWindows';
import QueryService from '../utils/database/query';

const TestInformation = dynamic(() => import('./testInformation'), { ssr: false });

import type { TableColumnsType } from 'antd';
import type { QuerySpecimenTest } from '../interfaces/query';
import type { SpecimenType } from '../interfaces/table';
import type { TestData, TestDataValues } from '../interfaces/query';

import { PlusOutlined, MinusOutlined, EditOutlined, FilePdfOutlined, DeleteOutlined } from '@ant-design/icons';

interface Props { specimens: QuerySpecimenTest[]; rowSelection: { selectedRowKeys: number[], onChange: (idTest: number) => void }; tableUpdate: (value: number) => void; };

const { info } = Modal;

const SpecimenTable: FunctionComponent<Props> = ({ specimens, rowSelection, tableUpdate }: Props) => {
    const [tableUpdated, setTableUpdated] = useState<number>(0);
    const [specimenData, setSpecimenData] = useState<SpecimenType[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    const viewTest = (e: any, Specimen: SpecimenType) => {
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
                };

                info({
                    title: `Prueba Nro.: ${Specimen['testNumber']} [ID: ${Specimen['idSpecimen']}]`,
                    content: (<TestInformation myTest={myTest[0]} myData={TestResults} changesOnSpecimen={updateSpecimen} />),
                    width: "80vw",
                    closable: true,
                    okText: "Guardar",
                    afterClose() {
                        if (testName !== "" || operator !== "" || fail !== "" || reMark !== "") {
                            QueryService.UPDATE.Specimen([Specimen['idSpecimen'], testName, operator, fail, reMark]).then((response) => {
                                const index = specimens.findIndex((specimen: QuerySpecimenTest) => specimen['idSpecimen'] === Specimen['idSpecimen']);
                                specimens[index]['operator'] = operator;
                                setTableUpdated(tableUpdated + 1);
                                message.success(response);
                            }).catch((error) => { message.error(error); });
                        }
                    }
                });
            });
        });
    };

    const printTest = (e: any, Specimen: SpecimenType) => { openNewWindow(`test_${Specimen['idSpecimen']}`, `Prueba Nro [${Specimen['idSpecimen']}] - Fecha: ${Specimen['begin']}`, `/printTest?idSpecimen=${Specimen['idSpecimen']}`); };

    const deleteTest = (e: any, Specimen: SpecimenType) => {
        QueryService.DELETE.Specimen([Specimen['idSpecimen']]).then((response) => {
            const index = specimens.findIndex((specimen: QuerySpecimenTest) => specimen['idSpecimen'] === Specimen['idSpecimen']);
            specimens.splice(index, 1);
            tableUpdate(tableUpdated + 1);
            setTableUpdated(tableUpdated + 1);
            message.success(response);
        }).catch((error) => { message.error(error); });
    };

    const columns: TableColumnsType<SpecimenType> = [
        { title: 'ID Especimen', dataIndex: 'idSpecimen', key: 'idSpecimen' },
        { title: 'Prueba N°', dataIndex: 'testNumber', key: 'testNumber' },
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
                    <Button onClick={(event) => viewTest(event, record)} icon={<EditOutlined />} type="primary" ghost></Button>
                    <Button onClick={(event) => printTest(event, record)} icon={<FilePdfOutlined />} type="primary" ghost></Button>
                    <Popconfirm
                        title="Eliminar Prueba?"
                        description="Está seguro que desea eliminar la Prueba?"
                        onConfirm={() => { deleteTest(event, record); }}
                        okText="Si"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger></Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    useEffect(() => {
        const loadSpecimens = () => {
            let myData: SpecimenType[] = [];
            specimens.forEach((specimen: QuerySpecimenTest) => {
                myData.push({
                    key: specimen['idSpecimen'],
                    idSpecimen: specimen['idSpecimen'],
                    begin: specimen['beginTime'],
                    end: specimen['endTime'],
                    duration: specimen['duration'],
                    testNumber: specimen['testNumber'],
                    operator: specimen['operator']
                });
            });
            setSpecimenData(myData);
        };
        loadSpecimens();
    }, [tableUpdated]);

    return (
        <>
            {contextHolder}
            <Table
                columns={columns}
                dataSource={[...specimenData]}
                pagination={{ disabled: false, size: "small", pageSize: 5, position: ["bottomCenter"] }}
            /* onChange={(...args) => { console.log(...args) }} */
            />
        </>
    )
}
export default SpecimenTable;