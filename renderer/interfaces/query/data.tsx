interface QuerySample {
    idSample:      number;
    material:      string;
    specification: string;
    diameter:      number;
    wallThickness: number;
    length:        number;
    count:         number;
};

interface QuerySpecimen {
    idSpecimen:        number;
    idSample:          number | null;
    targetPressure:    number | null;
    targetTemperature: number | null;
    operator:          string | null;
    enviroment:        string | null;
    testName:          string | null;
    endCap:            string | null;
    failText:          string | null;
    remark:            string | null;
    beginTime:         string;
    endTime:           string;
    duration:          string;
};

interface QuerySpecimenTest {
    idSpecimen:        number;
    targetPressure:    number;
    targetTemperature: number;
    operator:          string;
    testNumber:        number;
    beginTime:         string;
    endTime:           string;
    duration:          string;
};

interface TestData {
    mySample: TestSampleValue;
    mySpecimen: TestSpecimenValue;
};

interface TestSampleValue {
    idSample: number;
    standard: string;
    material: string;
    specification: string;
    diameterReal: number;
    diameterNominal: number;
    wallThickness: number;
    lengthTotal: number;
    lengthFree: number;
    conditionalPeriod: string;
};

interface TestSpecimenValue {
    idSpecimen: number;
    targetTemperature: number;
    targetPressure: number;
    hoopStress: number;
    operator: string;
    enviroment: string;
    beginTime: string;
    endTime: string;
    duration: string;
    testName: string;
    testNumber: number;
    endCap: string;
    fail: string;
    remark: string;
};

interface TestDataValues {
    key: number;
    pressure: number;
    temperature: number;
};

interface TestCompare{
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
    hoopStress: number;
    conditionalPeriod: string;
    idSpecimen: number;
    operator: string;
    enviroment: string;
    beginTime: string;
    endTime: string;
    duration: string;
    // counts: number;
    testName: string;
    testNumber: number;
    endCap: string;
    fail: string;
    remark: string;
    myData: TestDataValues[];
};

export type { QuerySpecimen, QuerySample, QuerySpecimenTest, TestData, TestSampleValue, TestSpecimenValue, TestDataValues, TestCompare };