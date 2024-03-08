import { FunctionComponent, Key } from "react";

interface DataType {
    key: Key;
    idSample: number;
    standard: string;
    material: string;
    count: number;
    description: FunctionComponent<{ specimens: ExpandedDataType[] }> | any;
};

interface ExpandedDataType {
    key: Key;
    idSpecimen: number;
    begin: string;
    end: string;
    duration: string;
    operator: string;
};

export type { DataType, ExpandedDataType };