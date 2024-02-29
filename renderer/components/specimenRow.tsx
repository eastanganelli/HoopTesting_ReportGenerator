import { useState, useEffect, FunctionComponent } from 'react';
import { FolderOpenOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Space, Button } from 'antd';

import { openNewWindow } from '../utils/newWindows';
import QueryService from '../utils/database/dbquery';

import type { TableColumnsType } from 'antd';
import type { TestSpecimen } from '../interfaces/query';
import type { ExpandedDataType } from '../interfaces/tableData';

interface Props { specimens: TestSpecimen[]; };

const SpecimenTable: FunctionComponent<Props> = ({ specimens }: Props) => {
    const [specimenData, setSpecimenData] = useState<ExpandedDataType[]>([]);

    const viewTest = (e: any, Specimen: any) => { openNewWindow(`test_${Specimen['idspecimen']}`, `Test Nro: ${Specimen['idspecimen']}`, `/testSample?idSpecimen=${Specimen['idspecimen']}`); };

    const deleteTest = (e: any, Specimen: any) => { QueryService.DELETE.Specimen([Specimen['idspecimen']]); };

    const columns: TableColumnsType<ExpandedDataType> = [
        { title: 'ID Specimen', dataIndex: 'idspecimen', key: 'idspecimen' },
        { title: 'Inicio', dataIndex: 'init', key: 'begin' },
        { title: 'Fin', dataIndex: 'end', key: 'end' },
        { title: 'Duración', dataIndex: 'duration', key: 'duration' },
        { title: 'Operador', dataIndex: 'operator', key: 'operator' },
        {
            title: 'Accion',
            dataIndex: 'actions',
            key: 'actions',
            render: (text, record, index) => (
                <Space size="middle">
                    <Button onClick={(event) => viewTest(event, record)} icon={<FolderOpenOutlined />} type="primary">Ver</Button>
                    <Button onClick={(event) => deleteTest(event, record)} icon={<DeleteOutlined />} danger></Button>
                </Space>
            )
        }
    ];

    const loadSpecimens = async () => {
        let myData: ExpandedDataType[] = [];
        specimens.forEach((specimen: TestSpecimen) => {
            myData.push({
                key: specimen.idSpecimen,
                idspecimen: specimen.idSpecimen,
                begin: specimen.init,
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

export default SpecimenTable;