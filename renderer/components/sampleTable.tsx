import { useState, useEffect, FunctionComponent } from 'react';
import dynamic from 'next/dynamic';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';

import QueryService from '../utils/database/dbquery';
const SpecimenRow = dynamic(() => import('./specimenRow'));

import type { DataType } from '../interfaces/table';
import type { QuerySampleTest } from '../interfaces/query';

const SampleTable: FunctionComponent = () => {
    const [sampleList, setSampleList] = useState<DataType[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        if (newSelectedRowKeys.length > 0 && newSelectedRowKeys.length < 5) {
            console.log('selected row keys: ', newSelectedRowKeys);
            setSelectedRowKeys(newSelectedRowKeys);
        }
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    const columns: TableColumnsType<DataType> = [
        { title: 'ID Sample', dataIndex: 'idSample', key: 'idSample' },
        { title: 'Standard', dataIndex: 'standard', key: 'standard' },
        { title: 'Material', dataIndex: 'material', key: 'material' }
    ];

    const changeState = () => {
        try {
            if (global && global.ipcRenderer) { global.ipcRenderer.send('window-reload', `Main Window`); }
        } catch (e) { console.error(e); }
    };

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
                        description: <SpecimenRow specimens={Test["mySpecimens"].reverse()} rowSelection={rowSelection} changesOnSpecimen={changeState} />
                    });
                });
                setSampleList(myData);
            });
        };
        fetchData();
    }, []);

    return (
        <div>
            <span style={{ marginLeft: 8 }}>
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
            </span>
            <Table
                columns={columns}
                expandable={{ expandedRowRender: record => (<div>{record.description}</div>) }}
                dataSource={sampleList}
            />
        </div>
    )
}

export default SampleTable;