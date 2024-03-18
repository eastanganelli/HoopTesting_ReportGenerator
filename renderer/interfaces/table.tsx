import { FunctionComponent, Key } from "react";

interface SampleType {
    key: Key;
    idSample: number;
    standard: string;
    material: string;
    count: number;
    description: FunctionComponent<{ specimens: SpecimenType[] }> | any;
};

interface SpecimenType {
    key: Key;
    idSpecimen: number;
    begin: string;
    end: string;
    testNumber: number;
    duration: string;
    operator: string;
};

interface CompareType {
    key: Key;
    idSample: number;
    standard: string;
    material: string;
    specification: string;
    diameterReal: number;
    diameterNominal: number;
    wallThickness: number;
    lengthTotal: number;
    lengthFree: number;
    targetTemperature: number;
    targetPressure: number;
    conditionalPeriod: string;
    idSpecimen: number;
    operator: string;
    enviroment: string;
    beginTime: string;
    endTime: string;
    duration: string;
    counts: number;
    testName: string;
    testNumber: number;
    endCap: string;
    fail: string;
    remark: string;
};

export type { SampleType, SpecimenType, CompareType };