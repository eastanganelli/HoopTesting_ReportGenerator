import { FunctionComponent, Key } from "react";

interface DataType {
    key: Key;
    idsample: number;
    standard: string;
    material: string;
    description: FunctionComponent<{ specimens: ExpandedDataType[] }> | any;
};

interface ExpandedDataType {
    key: Key;
    idspecimen: number;
    begin: string;
    end: string;
    duration: string;
    operator: string;
};

export type { DataType, ExpandedDataType };