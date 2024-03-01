import { useState, useEffect, FunctionComponent } from 'react';
import dynamic from 'next/dynamic';
// import { FolderOpenOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';

import QueryService from '../utils/database/dbquery';
const SpecimenRow = dynamic(() => import('./specimenRow'));

import type { DataType } from '../interfaces/table';
import type { QuerySampleTest } from '../interfaces/query';

const SampleTable: FunctionComponent = () => {
    const [sampleList, setSampleList] = useState<DataType[]>([]);
    const columns: TableColumnsType<DataType> = [
        { title: 'ID Sample', dataIndex: 'idsample', key: 'idsample' },
        { title: 'Standard', dataIndex: 'standard', key: 'standard' },
        { title: 'Material', dataIndex: 'material', key: 'material' }
    ];

    useEffect(() => {
        const fetchData = () => {
            let myResponse: any = QueryService.SELECT.TEST.Tests(),
                myData: DataType[] = [];
            myResponse.then((Tests: QuerySampleTest[]) => {
                Tests.forEach((Test: QuerySampleTest) => {
                    myData.push({
                        key: Number(Test["idSample"]),
                        idSample: Number(Test["idSample"]),
                        standard: Test["standard"],
                        material: Test["material"],
                        description: <SpecimenRow specimens={Test["mySpecimens"]} />
                    });

                });

                setSampleList(myData);
            });
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
export default SampleTable;