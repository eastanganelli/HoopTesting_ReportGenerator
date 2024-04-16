import { useState, useEffect, FunctionComponent } from 'react';
import dynamic from 'next/dynamic';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';

import QueryService from '../utils/database/query';
const SpecimenRow = dynamic(() => import('./specimenRow'));

import type { SampleType } from '../interfaces/table';
import type { QuerySampleTest } from '../interfaces/query';

interface Props { rowSelection: { selectedRowKeys: number[], onChange: (idTest: number) => void } };

const SampleTable: FunctionComponent<Props> = ({ rowSelection }: Props) => {
    const [tableUpdated, setTableUpdated] = useState<number>(0);
    const [queryData, setQueryData] = useState<QuerySampleTest[]>([]);
    const [sampleList, setSampleList] = useState<SampleType[]>([]);

    const callDatabase = async () => { setQueryData(await QueryService.SELECT.TEST.Tests()); };

    const columns: TableColumnsType<SampleType> = [
        { title: 'ID Muestra', dataIndex: 'idSample', key: 'idSample' },
        { title: 'Estándard',  dataIndex: 'standard', key: 'standard' },
        { title: 'Material',   dataIndex: 'material', key: 'material' },
        { title: 'Cantidad',   dataIndex: 'count',    key: 'count' }
    ];

    const loadDataTable = () => {
        let myData: SampleType[] = [];
        queryData.forEach((Test: QuerySampleTest) => {
            myData.push({
                key: Number(Test["idSample"]),
                idSample: Number(Test["idSample"]),
                standard: Test["standard"],
                material: Test["material"],
                count: Test["mySpecimens"].length,
                description: <SpecimenRow specimens={Test["mySpecimens"]/* .reverse() */} rowSelection={rowSelection} tableUpdate={setTableUpdated} />
            });
        });
        setSampleList(myData);
    };

    useEffect(() => {
        if(queryData.length === 0) { callDatabase(); }
        loadDataTable();
    }, [queryData, tableUpdated]);

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