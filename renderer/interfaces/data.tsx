import { Sample } from './sample';
import { Specimen } from './specimen';

export interface TestData {
    mySample: Sample;
    mySpecimen: Specimen;
    myData: DataTest[];
};

export interface DataTest {
    // idData: number;
    temperature: number;
    pressure: number;
    key: number;
};