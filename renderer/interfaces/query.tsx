interface QuerySampleTest {
    idSample: number;
    standard: string;
    material: string;
    mySpecimens: QuerySpecimenTest[];
};

interface QuerySpecimenTest {
    idSpecimen: number;
    beginTime: string;
    endTime: string;
    testNumber: number;
    duration: string;
    operator: string;
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
    targetTemperature: number;
    targetPressure: number;
    hoopStress: number;
    conditionalPeriod: string;
};

interface TestSpecimenValue {
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
    counts: number;
    testName: string;
    testNumber: number;
    endCap: string;
    fail: string;
    remark: string;
    myData: TestDataValues[];
};

export type { QuerySampleTest, QuerySpecimenTest, TestData, TestSampleValue, TestSpecimenValue, TestDataValues, TestCompare };