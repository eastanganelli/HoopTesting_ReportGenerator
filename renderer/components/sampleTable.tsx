import React, { useState, useEffect, FunctionComponent } from 'react';
import { FolderOpenOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Button } from 'antd';
import type { TableColumnsType } from 'antd';

import { ServiceSampleWithSpecimens } from '../utils/database/dbquery';

import SpecimenRow from './specimenRow';

interface DataType {
    key: React.Key;
    idsample: number;
    standard: string;
    material: string;
    description: any;
}

const sampleTable: FunctionComponent = () => {
    const [sampleList, setSampleList] = useState<DataType[]>([]);
    const columns: TableColumnsType<DataType> = [
        { title: 'ID Sample', dataIndex: 'idsample', key: 'idsample' },
        { title: 'Standard', dataIndex: 'standard', key: 'standard' },
        { title: 'Material', dataIndex: 'material', key: 'material' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            let myResponse: any = await ServiceSampleWithSpecimens(),
                myData: DataType[] = [];
            myResponse.forEach((sample: any) => {
                myData.push({
                    key: Number(sample["idSample"]),
                    idsample: Number(sample["idSample"]),
                    standard: sample["standard"],
                    material: sample["material"],
                    description: <SpecimenRow specimens={sample["mySpecimens"]} />
                });

            });
            setSampleList(myData);
        };

        fetchData();
    }, []);

    return (
        <Table
            columns={columns}
            expandable={{
                expandedRowRender: record => (
                    <div>{record.description}</div>
                )
            }}
            dataSource={sampleList}
        />
    )
}

export default sampleTable;