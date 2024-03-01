interface QuerySampleTest {
    idSample: number;
    standard: string;
    material: string;
    mySpecimens: QuerySpecimenTest[];
};

interface QuerySpecimenTest {
    idSpecimen: number;
    begin: string;
    end: string;
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
    endCap: string;
    fail: string;
    remark: string;
};

interface TestDataValues {
    key: number;
    pressure: number;
    temperature: number;
};

export type { QuerySampleTest, QuerySpecimenTest, TestData, TestSampleValue, TestSpecimenValue, TestDataValues };