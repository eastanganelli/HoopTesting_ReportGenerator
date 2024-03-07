import { useState, useEffect, FunctionComponent } from 'react';
import dynamic from 'next/dynamic';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';

import QueryService from '../utils/database/dbquery';
const SpecimenRow = dynamic(() => import('./specimenRow'));

import type { DataType } from '../interfaces/table';
import type { QuerySampleTest } from '../interfaces/query';

interface Props { selectedRowKeys: number[]; };

const SampleTable: FunctionComponent<Props> = ({ selectedRowKeys }: Props) => {
    const [sampleList, setSampleList] = useState<DataType[]>([]);
    const onSelectChange = (idTest: number) => {
        if (selectedRowKeys.includes(idTest)) {
            selectedRowKeys.splice(selectedRowKeys.indexOf(idTest), 1);
        } else if (!selectedRowKeys.includes(idTest) && selectedRowKeys.length < 5) {
            selectedRowKeys.push(idTest);
        }
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const columns: TableColumnsType<DataType> = [
        { title: 'ID Sample', dataIndex: 'idSample', key: 'idSample' },
        { title: 'Standard', dataIndex: 'standard', key: 'standard' },
        { title: 'Material', dataIndex: 'material', key: 'material' }
    ];

    useEffect(() => {
        const fetchData = () => {
            let myData: DataType[] = [];
            QueryService.SELECT.TEST.Tests().then((Tests: QuerySampleTest[]) => {
                Tests.forEach((Test: QuerySampleTest) => {
                    myData.push({
                        key: Number(Test["idSample"]),
                        idSample: Number(Test["idSample"]),
                        standard: Test["standard"],
                        material: Test["material"],
                        description: <SpecimenRow specimens={Test["mySpecimens"].reverse()} rowSelection={rowSelection} />
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
            expandable={{ expandedRowRender: record => (<div>{record.description}</div>) }}
            dataSource={sampleList}
            pagination={{ simple: true, disabled: false, size: "small", pageSize: 5, position: ["bottomCenter"] }}
        />
    )
}

export default SampleTable;