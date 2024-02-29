import type { TestSample } from '../../interfaces/query';
import { TestData } from '../../interfaces/data';

const Query = (query: string, values: any[] = []): Promise<TestSample[] | any> => {
    return new Promise<any | TestData>((resolve, reject) => {
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

const QueryService = {
    SELECT: {
        Tests: (): Promise<any> => {
            const SampleWithSpecimensQuery: string = "CALL getTests()";
            return Query(SampleWithSpecimensQuery, []);
        },
        Test: (queryData: any[] | string[] | number[]): Promise<TestData> => {
            const TestDataQuery: string = 'CALL getTest(?)';
            const TestDataResponse = Query(TestDataQuery, queryData);
            return new Promise<TestData>((resolve, reject) => {
                TestDataResponse.then((TestData) => {
                    TestData = TestData[0];
                    let myTestData: TestData = {
                        mySample: {
                            idSample: TestData["idSample"],
                            standard: TestData["standard"],
                            material: TestData["material"],
                            specification: TestData["specification"],
                            diameterReal: TestData["diameterReal"],
                            diameterNominal: TestData["diameterNominal"],
                            wallThickness: TestData["wallThickness"],
                            lengthTotal: TestData["lengthTotal"],
                            lengthFree: TestData["lengthFree"],
                            targetTemperature: TestData["targetTemperature"],
                            targetPressure: TestData["targetPressure"],
                            hoopStress: TestData["hoopStress"],
                            conditionalPeriod: TestData["conditionalPeriod"]
                        },
                        mySpecimen: {
                            idSpecimen: TestData["idSpecimen"],
                            operator: TestData["operator"],
                            environment: TestData["enviroment"],
                            initTime: TestData["initTime"],
                            endTime: TestData["endTime"],
                            duration: TestData["duration"],
                            counts: TestData["counts"],
                            testName: TestData["testName"],
                            endCap: TestData["endCap"],
                            fail: TestData["failText"],
                            remark: TestData["remark"]
                        },
                        myData: TestData["myData"]
                    };
                    resolve(myTestData);
                }).catch((error) => { reject(error); });
            });
        }
    },
    UPDATE: {
        Specimen: (queryData: any[] | string[] | number[]): void => {
            const SpecimenQuery: string = "CALL updateSpecimen(?,?,?,?,?)";
            Query(SpecimenQuery, queryData).catch((error) => { console.error("Error updating specimen:", error) });
        }
    },
    DELETE: {
        Specimen: (queryData: any[] | string[] | number[]) => {
            const SpecimenQuery: string = "CALL deleteTest(?)";
            Query(SpecimenQuery, queryData).catch((error) => { console.error("Error deleting specimen:", error) });
        }
    }
}

export default QueryService;