import React, { useState, useEffect, FunctionComponent } from 'react';
import { FolderOpenOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Space, Button } from 'antd';
import type { TableColumnsType } from 'antd';

import { openNewWindow } from '../utils/newWindows';

interface ExpandedDataType {
    key: React.Key;
    idspecimen: number;
    init: string;
    end: string;
    duration: string;
    operator: string;
}

interface Specimen {
    idSpecimen: number;
    begin: string;
    end: string;
    duration: string;
    operator: number;

}

interface Props {
    specimens: Specimen[];
}

const specimenTable: FunctionComponent<Props> = ({ specimens }: Props) => {
    const [specimenData, setSpecimenData] = useState<ExpandedDataType[]>([]);

    const viewSampleTest = async (e: any, Specimen: any) => {
        // openNewWindow('/testSample/testSample', { width: screen.availWidth, height: screen.availHeight }, 'idSpecimen=' + Specimen['idspecimen']);
        console.log('/testSample?idSpecimen=' + Specimen['idspecimen']);
        openNewWindow('test_'+Specimen['idspecimen'], 'Test Nro: XXXXXX', '/testSample?idSpecimen=' + Specimen['idspecimen']);
    }

    const deleteSampoTest = async (e: any, bla: any) => {
        console.log(bla);
    }

    const columns: TableColumnsType<ExpandedDataType> = [
        { title: 'ID Specimen', dataIndex: 'idspecimen', key: 'idspecimen' },
        { title: 'Inicio', dataIndex: 'init', key: 'init' },
        { title: 'Fin', dataIndex: 'end', key: 'end' },
        { title: 'Duración', dataIndex: 'duration', key: 'duration' },
        { title: 'Operador', dataIndex: 'operator', key: 'operator' },
        {
            title: 'Accion',
            dataIndex: 'actions',
            key: 'actions',
            render: (text, record, index) => (
                <Space size="middle">
                    <Button onClick={(event) => viewSampleTest(event, record)} icon={<FolderOpenOutlined />} type="primary">Ver</Button>
                    <Button onClick={(event) => deleteSampoTest(event, record)} icon={<DeleteOutlined />} danger></Button>
                </Space>
            )
        }
    ];

    const loadSpecimens = async () => {
        let myData: ExpandedDataType[] = [];
        specimens.forEach((specimen: Specimen) => {
            myData.push({
                key: specimen.idSpecimen,
                idspecimen: specimen.idSpecimen,
                init: specimen.begin,
                end: specimen.end,
                duration: specimen.duration,
                operator: String(specimen.operator)
            });
        });
        setSpecimenData(myData);
    };

    useEffect(() => {
        loadSpecimens();
    }, []);

    return (
        <Table columns={columns} dataSource={specimenData} pagination={false} />
    )
}

export default specimenTable;