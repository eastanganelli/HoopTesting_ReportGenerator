import { useState, useEffect, FunctionComponent } from 'react';
import dynamic from 'next/dynamic';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';

import QueryService from '../utils/database/query';
const SpecimenRow = dynamic(() => import('./specimenRow'));

import type { DataType } from '../interfaces/table';
import type { QuerySampleTest } from '../interfaces/query';

interface Props { selectedRowKeys: number[]; };

const SampleTable: FunctionComponent<Props> = ({ selectedRowKeys }: Props) => {
    const [tableUpdated, setTableUpdated] = useState<number>(0);
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
        { title: 'ID Muestra', dataIndex: 'idSample', key: 'idSample' },
        { title: 'Estándard', dataIndex: 'standard', key: 'standard' },
        { title: 'Material', dataIndex: 'material', key: 'material' },
        { title: 'Cantidad', dataIndex: 'count', key: 'count' }
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
                        count: Test["mySpecimens"].length,
                        description: <SpecimenRow specimens={Test["mySpecimens"].reverse()} rowSelection={rowSelection} tableUpdate={setTableUpdated} />
                    });
                });
                setSampleList(myData);
            });
        };
        fetchData();
    }, [tableUpdated]);

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