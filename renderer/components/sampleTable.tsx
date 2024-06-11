import dynamic from 'next/dynamic';
import { useState, useEffect, FunctionComponent } from 'react';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';

import useWindowSize from '../utils/windowState';
import QueryService from '../utils/database/query';
const SpecimenRow = dynamic(() => import('./specimenTable'));

import type { SampleType } from '../interfaces/table';
import type { QuerySampleTest } from '../interfaces/query';

interface Props { rowSelection: { selectedRowKeys: number[], onChange: (idTest: number) => void } };

const SampleTable: FunctionComponent<Props> = ({ rowSelection }: Props) => {
    const [queryData, setQueryData] = useState<QuerySampleTest[]>([]);
    const [sampleList, setSampleList] = useState<SampleType[]>([]);
    const [pageSizing, setPageSizing] = useState<number>(5);
    const size = useWindowSize();

    const calculatePageSize = () => {
        if (size.height > 900) { setPageSizing(14); }
        else if (size.height > 800) { setPageSizing(10); }
        else if (size.height > 600) { setPageSizing(6); }
        else { setPageSizing(5); }
    };

    const callDatabase = async () => { setQueryData(await QueryService.SELECT.TEST.Tests()); };

    const columns: TableColumnsType<SampleType> = [
        { title: 'ID Muestra', dataIndex: 'idSample', key: 'idSample' },
        { title: 'Estándard', dataIndex: 'standard', key: 'standard' },
        { title: 'Material', dataIndex: 'material', key: 'material' },
        { title: 'Cantidad', dataIndex: 'count', key: 'count' }
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
                description: <SpecimenRow specimens={Test["mySpecimens"]/* .reverse() */} rowSelection={rowSelection} />
            });
        });
        setSampleList(myData);
    };

    useEffect(() => {
        if (queryData.length === 0) { callDatabase(); }
        loadDataTable();
        calculatePageSize();
    }, [queryData, size]);

    return (
        <Table
            columns={columns}
            expandable={{ expandedRowRender: record => (<div>{record.description}</div>) }}
            dataSource={sampleList}
            pagination={{ simple: true, disabled: false, size: "small", pageSize: pageSizing, position: ["bottomCenter"] }}
        />
    )
}

export default SampleTable;