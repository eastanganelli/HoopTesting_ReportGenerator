import dynamic from 'next/dynamic';
import { useState, useEffect, FunctionComponent } from 'react';
import { Table, Space, Button, Modal, message, Popconfirm, Form } from 'antd';

import openNewWindow from '../utils/newWindows';
import QueryService from '../utils/database/query';

const TestInformation = dynamic(() => import('./testInformation'), { ssr: false });

import type { TableColumnsType } from 'antd';
import type { QuerySpecimenTest } from '../interfaces/query';
import type { SpecimenType } from '../interfaces/table';
import type { TestData, TestDataValues } from '../interfaces/query';

import { PlusOutlined, MinusOutlined, EditOutlined, FilePdfOutlined, DeleteOutlined } from '@ant-design/icons';

interface Props { specimens: QuerySpecimenTest[]; rowSelection: { selectedRowKeys: number[], onChange: (idTest: number) => void }; };

const { info } = Modal;

const SpecimenTable: FunctionComponent<Props> = (Props: Props) => {
    const { specimens, rowSelection } = Props;
    const [specimensData, setSpecimensData] = useState<QuerySpecimenTest[]>(specimens);
    const [specimenData, setSpecimenData] = useState<SpecimenType[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [mySpecimenForm] = Form.useForm();

    const viewTest = (e: any, Specimen: SpecimenType) => {
        if(mySpecimenForm.isFieldsTouched()) { mySpecimenForm.resetFields(); }
        QueryService.SELECT.TEST.Test([Specimen['idSpecimen']]).then((myTest: TestData) => {
            const auxTestData: TestData = { ...myTest[0] };
            const formData = {
                "operator": auxTestData['mySpecimen']['operator'],
                "testName": auxTestData['mySpecimen']['testName'],
                "standard": auxTestData['mySample']['standard'],
                "material": auxTestData['mySample']['material'],
                "specification": auxTestData['mySample']['specification'],
                "endCap": auxTestData['mySpecimen']['endCap'],
                "enviroment": auxTestData['mySpecimen']['enviroment'],
                "specimensCount": auxTestData['mySpecimen']['counts'],
                "targetPressure": auxTestData['mySample']['targetPressure'],
                "targetTemperature": auxTestData['mySample']['targetTemperature'],
                "lengthTotal": auxTestData['mySample']['lengthTotal'],
                "lengthFree": auxTestData['mySample']['lengthFree'],
                "conditionalPeriod": auxTestData['mySample']['conditionalPeriod'],
                "diameterNominal": auxTestData['mySample']['diameterNominal'],
                "diameterReal": auxTestData['mySample']['diameterReal'],
                "wallThickness": auxTestData['mySample']['wallThickness'],
                "beginTime": auxTestData['mySpecimen']['beginTime'],
                "endTime": auxTestData['mySpecimen']['endTime'],
                "duration": auxTestData['mySpecimen']['duration'],
                "fail": auxTestData['mySpecimen']['fail'],
                "remark": auxTestData['mySpecimen']['remark']
            };
            mySpecimenForm.setFieldsValue(formData);
            QueryService.SELECT.TEST.Data([Specimen['idSpecimen']]).then((TestResults: TestDataValues[]) => {
                info({
                    title: `Prueba Nro.: ${Specimen['testNumber']} [ID: ${Specimen['idSpecimen']}]`,
                    content: (<TestInformation myTestForm={mySpecimenForm} myData={TestResults} />),
                    width: "80vw",
                    closable: true,
                    okText: "Guardar",
                    onOk: () => {
                        QueryService.UPDATE.Specimen([Specimen['idSpecimen'], mySpecimenForm.getFieldValue('testName'), mySpecimenForm.getFieldValue('operator'), mySpecimenForm.getFieldValue('fail'), mySpecimenForm.getFieldValue('remark')]).then((response) => {
                            const arrAux: QuerySpecimenTest[] = [...specimensData];
                            const index = arrAux.findIndex((specimen: QuerySpecimenTest) => specimen['idSpecimen'] === Specimen['idSpecimen']);
                            arrAux[index]['operator'] = mySpecimenForm.getFieldValue('operator');
                            setSpecimensData(arrAux);
                            message.success(response);
                        }).catch((error) => { message.error(error); });
                    }
                });
            });
        });
    };

    const printTest = (e: any, Specimen: SpecimenType) => { openNewWindow(`test_${Specimen['idSpecimen']}`, `Generación de Informe > Prueba Nro [${Specimen['idSpecimen']}] - Fecha: ${Specimen['begin']}`, `/printTest?idSpecimen=${Specimen['idSpecimen']}`); };

    const deleteTest = (e: any, Specimen: SpecimenType) => {
        QueryService.DELETE.Specimen([Specimen['idSpecimen']]).then((response) => {
            const index = specimensData.findIndex((specimen: QuerySpecimenTest) => specimen['idSpecimen'] === Specimen['idSpecimen']);
            specimensData.splice(index, 1);
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
            specimensData.forEach((specimen: QuerySpecimenTest) => {
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
    }, []);

    return (
        <>
            {contextHolder}
            <Table
                columns={columns}
                dataSource={[...specimenData]}
                pagination={{ disabled: false, size: "small", pageSize: 5, position: ["bottomCenter"] }}
            />
        </>
    )
}
export default SpecimenTable;