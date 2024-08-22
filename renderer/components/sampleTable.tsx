import dynamic from 'next/dynamic';
import { useState, useEffect, FunctionComponent } from 'react';
import { Table, type TableColumnsType } from 'antd';

import useWindowSize from '../utils/window/windowState';
import QueryService from '../utils/database/query';
const SpecimenRow = dynamic(() => import('./specimenTable'));

import type { SampleType }  from '../interfaces/table';
import type { QuerySample } from '../interfaces/query/data';

interface Props { rowSelection: { selectedRowKeys: number[], onChange: (idTest: number) => void } };

const SampleTable: FunctionComponent<Props> = (Props: Props) => {
    const [queryData,  setQueryData]  = useState<QuerySample[]>([]);
    const [sampleList, setSampleList] = useState<SampleType[]>([]);
    const [pageSizing, setPageSizing] = useState<number>(5);
    const [lastUpdate, setlastUpdate] = useState<number>(Date.now());
    const size                        = useWindowSize();

    const calculatePageSize = () => {
        if (size.height > 900) { setPageSizing(14); }
        else if (size.height > 800) { setPageSizing(10); }
        else if (size.height > 600) { setPageSizing(6); }
        else { setPageSizing(5); }
    };

    const columns: TableColumnsType<SampleType> = [
        { title: 'ID Muestra',     dataIndex: 'idSample',      key: 'idSample' },
        { title: 'Material',       dataIndex: 'material',      key: 'material' },
        { title: 'Especificación', dataIndex: 'specification', key: 'specification' },
        { title: 'Diámetro [mm]',  dataIndex: 'diameter',      key: 'diameter' },
        { title: 'Espesor [mm]',   dataIndex: 'wallThickness', key: 'wallThickness' },
        { title: 'Longitud [mm]',  dataIndex: 'length',        key: 'length' },
        { title: 'Cantidad',       dataIndex: 'count',         key: 'count' }
    ];

    useEffect(() => {
        const loadDataTable = async () => {
            QueryService.SELECT.Samples().then((mySamples: QuerySample[]) => {
                let myData: SampleType[] = [];
                setQueryData(mySamples);
                mySamples.forEach((Test: QuerySample) => {
                    myData.push({
                        key:      Number(Test["idSample"]),
                        idSample: Number(Test["idSample"]),
                        material: Test["material"],
                        specification: Test["specification"],
                        diameter: Test["diameter"],
                        wallThickness: Test["wallThickness"],
                        length:   Test["length"],
                        count:    Number(Test["count"])
                    });
                });
                setSampleList(myData);
                setlastUpdate(Date.now());
            }).catch((error) => { console.error(error); });
        }
        if (queryData.length === 0) { loadDataTable(); }
        calculatePageSize();
        const intervalId = setInterval(loadDataTable, 60000);
        return () => clearInterval(intervalId);
    }, [queryData, size, lastUpdate]);

    return (
        <Table
            columns={columns}
            expandable={{ expandedRowRender: record => (
                <SpecimenRow
                    idSample={Number(record["idSample"])}
                    rowSelection={Props['rowSelection']}
                    onUpdateView={() => setlastUpdate(Date.now())}
                    />
            ) }}
            dataSource={sampleList}
            pagination={{ simple: true, disabled: false, size: "small", pageSize: pageSizing, position: ["bottomCenter"] }}
        />
    )
}

export default SampleTable;