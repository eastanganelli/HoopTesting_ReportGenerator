import { TestData, DataTest } from '../../interfaces/data';

const Query = async (query: string, values: any[] = []): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        if (global && global.ipcRenderer) {
            global.ipcRenderer.send('database-request', { query: query, values: values });
            global.ipcRenderer.on('database-response', (event, response: any) => {
                resolve(response[0]);
            });
            global.ipcRenderer.on('database-error', (event, error) => {
                console.error("Database error:", error)
                reject(error);
            });
        }
    });
}

const ServiceSampleWithSpecimens = async () => {
    const SampleWithSpecimensQuery: string = "CALL getSampleWithSpecimens()";
    let ServiceTestReponse = await Query(SampleWithSpecimensQuery, []);
    return ServiceTestReponse;
};

const ServiceTestData = async (queryData: any[]) => {
    const TestDataQuery: string = 'CALL getTest(?)';
    let TestDataResponse = await Query(TestDataQuery, queryData);
    TestDataResponse = TestDataResponse[0];
    let myTestData: TestData = {
        mySample: {
            idSample: TestDataResponse["idSample"],
            standard: TestDataResponse["standard"],
            material: TestDataResponse["material"],
            specification: TestDataResponse["specification"],
            diameterReal: TestDataResponse["diameterReal"],
            diameterNominal: TestDataResponse["diameterNominal"],
            wallThickness: TestDataResponse["wallThickness"],
            lengthTotal: TestDataResponse["lengthTotal"],
            lengthFree: TestDataResponse["lengthFree"],
            targetTemperature: TestDataResponse["targetTemperature"],
            targetPressure: TestDataResponse["targetPressure"],
            hoopStress: TestDataResponse["hoopStress"],
            conditionalPeriod: TestDataResponse["conditionalPeriod"]
        },
        mySpecimen: {
            idSpecimen: TestDataResponse["idSpecimen"],
            operator: TestDataResponse["operator"],
            environment: TestDataResponse["enviroment"],
            initTime: TestDataResponse["initTime"],
            endTime: TestDataResponse["endTime"],
            duration: TestDataResponse["duration"],
            counts: TestDataResponse["counts"],
            testName: TestDataResponse["testName"],
            endCap: TestDataResponse["endCap"],
            fail: TestDataResponse["failText"]
        },
        myData: TestDataResponse["myData"]
    };
    // console.log(myTestData.mySample, myTestData.mySpecimen, TestDataResponse["myData"]);
    return myTestData;
};

export { ServiceSampleWithSpecimens, ServiceTestData };