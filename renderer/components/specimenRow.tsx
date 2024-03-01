import { useState, useEffect, FunctionComponent } from 'react';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Space, Button } from 'antd';

import { openNewWindow } from '../utils/newWindows';
import QueryService from '../utils/database/dbquery';

import type { TableColumnsType } from 'antd';
import type { QuerySpecimenTest } from '../interfaces/query';
import type { ExpandedDataType } from '../interfaces/table';

interface Props { specimens: QuerySpecimenTest[]; };

const SpecimenTable: FunctionComponent<Props> = ({ specimens }: Props) => {
    const [specimenData, setSpecimenData] = useState<ExpandedDataType[]>([]);

    const viewTest = (e: any, Specimen: any) => { openNewWindow(`test_${Specimen['idSpecimen']}`, `Test Nro: ${Specimen['idSpecimen']}`, `/testSample?idSpecimen=${Specimen['idSpecimen']}`); };

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
                    <Button onClick={(event) => deleteTest(event, record)} icon={<DeleteOutlined />} danger></Button>
                </Space>
            )
        }
    ];

    useEffect(() => {
        const loadSpecimens = async () => {
            let myData: ExpandedDataType[] = [];
            specimens.forEach((specimen: QuerySpecimenTest) => {
                myData.push({
                    key: specimen['idSpecimen'],
                    idSpecimen: specimen['idSpecimen'],
                    begin: specimen['begin'],
                    end: specimen['end'],
                    duration: specimen['duration'],
                    operator: specimen['operator']
                });
            });
            setSpecimenData(myData);
        };
        loadSpecimens();
    }, []);

    return (
        <Table columns={columns} dataSource={specimenData} pagination={false} />
    )
}

export default SpecimenTable;