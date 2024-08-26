import dynamic from 'next/dynamic';
import { useState, useEffect, FunctionComponent } from 'react';
import { Table, Space, Button, Modal, message, Popconfirm, Form, type TableColumnsType } from 'antd';

import openNewWindow from '../utils/window/newWindows';
import QueryDataService  from '../utils/database/query/data';

const TestInformation = dynamic(() => import('./testInformation'), { ssr: false });

import type { QuerySpecimen, QueryTest } from '../interfaces/query/data';
import type { SpecimenType }  from '../interfaces/table';

import { PlusOutlined, MinusOutlined, EditOutlined, FilePdfOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';

interface Props { idSample: number; rowSelection: { selectedRowKeys: number[], onChange: (idTest: number) => void }; onUpdateView: () => void };

const { info } = Modal;

const SpecimenTable: FunctionComponent<Props> = (Props: Props) => {
    const { idSample, rowSelection, onUpdateView } = Props;
    const [queryData,       setQueryData] = useState<QuerySpecimen[]>([]);
    const [specimenData, setSpecimenData] = useState<SpecimenType[]>([]);
    const [lastUpdate,    setLastUpdated] = useState<number>(Date.now());
    const [messageApi,     contextHolder] = message.useMessage();
    const [mySpecimenForm]                = Form.useForm();

    const viewTest = (e: any, Specimen: SpecimenType) => {
        if(mySpecimenForm.isFieldsTouched()) { mySpecimenForm.resetFields(); }
        info({
            title: `Prueba Nro.: ${Specimen['testNumber']} [ID: ${Specimen['idSpecimen']}]`,
            content: <TestInformation myTestForm={mySpecimenForm} idSpecimen={Specimen['idSpecimen']} />,
            width: "80vw",
            closable: true,
            onCancel: () => {
                console.log(mySpecimenForm.getFieldsValue());
                QueryDataService.UPDATE.Specimen(mySpecimenForm.getFieldsValue()).then((response) => {
                    message.success(response);
                }).catch((error) => { message.error(error); });
                QueryDataService.UPDATE.Sample(mySpecimenForm.getFieldsValue()).then((response) => {
                    message.success(response);
                }).catch((error) => { message.error(error); });
            },
            onOk: () => { console.log('Printing PDF'); },
            okButtonProps: { icon: <FilePdfOutlined />, type: 'primary' },
            okText: 'Imprimir',
            destroyOnClose: true
        });
    };

    const printTest  = (e: any, Specimen: SpecimenType) => { openNewWindow(`test_${Specimen['idSpecimen']}`, `Generación de Informe > Prueba Nro [${Specimen['idSpecimen']}] - Fecha: ${Specimen['begin']}`, `/printTest?idSpecimen=${Specimen['idSpecimen']}`); };

    const deleteTest = (e: any, Specimen: SpecimenType) => {
        QueryDataService.DELETE.Specimen(Specimen['idSpecimen']).then((response) => {
            const index = queryData.findIndex((specimen: QuerySpecimen) => specimen['idSpecimen'] === Specimen['idSpecimen']);
            queryData.splice(index, 1);
            onUpdateView();
            setLastUpdated(Date.now());
            message.success(response);
        }).catch((error) => { message.error(error); });
    };

    const columns: TableColumnsType<SpecimenType> = [
        { title: 'ID Especimen',     dataIndex: 'idSpecimen',  key: 'idSpecimen' },
        { title: 'Prueba N°',        dataIndex: 'testNumber',  key: 'testNumber' },
        { title: 'Presión [Bar]',    dataIndex: 'pressure',    key: 'pressure' },
        { title: 'Temperatura [°C]', dataIndex: 'temperature', key: 'temperature' },
        { title: 'Inicio',           dataIndex: 'begin',       key: 'begin' },
        { title: 'Fin',              dataIndex: 'end',         key: 'end' },
        { title: 'Duración',         dataIndex: 'duration',    key: 'duration' },
        { title: 'Operador',         dataIndex: 'operator',    key: 'operator' },
        {
            title: 'Accion',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={rowSelection.selectedRowKeys.includes(record['idSpecimen']) ? <MinusOutlined /> : <PlusOutlined />}
                        onClick={
                            () => {
                                rowSelection.onChange(record['idSpecimen']);
                                setLastUpdated(Date.now());
                                messageApi.info({ content: `${rowSelection.selectedRowKeys.length} de 5 seleccionados`, duration: 5 });
                            }
                        }
                        type='primary'
                        danger={rowSelection.selectedRowKeys.includes(record['idSpecimen'])}
                        ghost
                    />
                    <Button onClick={(event) => viewTest(event,  record)} icon={<EditOutlined />}    type="primary" ghost></Button>
                    {/* <Button onClick={(event) => printTest(event, record)} icon={<FilePdfOutlined />} type="primary" ghost></Button> */}
                    <Popconfirm title="Eliminar Prueba?" description="Está seguro que desea eliminar la Prueba?" onConfirm={() => { deleteTest(event, record); }} okText="Si" cancelText="No">
                        <Button icon={<DeleteOutlined />} danger></Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    useEffect(() => {
        const loadDataTable = async () => {
            QueryDataService.SELECT.Specimens(idSample).then((mySpecimens: QuerySpecimen[]) => {
                let myData: SpecimenType[] = [];
                setQueryData(mySpecimens);
                mySpecimens.forEach((specimen: QuerySpecimen) => {
                    myData.push({
                        key:         specimen['idSpecimen'],
                        testNumber:  specimen['testNumber'],
                        idSpecimen:  specimen['idSpecimen'],
                        pressure:    specimen['targetPressure'],
                        temperature: specimen['targetTemperature'],
                        begin:       specimen['beginTime'],
                        end:         specimen['endTime'],
                        duration:    specimen['duration'],
                        operator:    specimen['operator']
                    });
                });
                setSpecimenData(myData);
                setLastUpdated(Date.now());
            }).catch((error) => { console.error(error); });
        }
        if (queryData.length === 0) { loadDataTable(); }
        // const intervalId = setInterval(loadDataTable, 60000);
        // return () => clearInterval(intervalId);
    }, [queryData, lastUpdate]);

    return (
        <>
            {contextHolder}
            <Table columns={columns} dataSource={[...specimenData]} pagination={{ disabled: false, size: "small", pageSize: 5, position: ["bottomCenter"] }} />
        </>
    )
}
export default SpecimenTable;