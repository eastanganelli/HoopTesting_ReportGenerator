import type { QuerySampleTest, TestData, TestDataValues, TestCompare } from '../../interfaces/query';

const Query = <T extends unknown>(query: string, values: any[] = []): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        if (global && global.ipcRenderer) {
            global.ipcRenderer.send('database-request', { query: query, values: values });
            global.ipcRenderer.on('database-response', (event, response: T) => {
                // console.log("Database response:", response)
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
        TEST: {
            Tests: (): Promise<QuerySampleTest[]> => {
                const SampleWithSpecimensQuery: string = "CALL selectTests()";
                return Query<QuerySampleTest[]>(SampleWithSpecimensQuery, []);
            },
            Test: async (queryData: any[] | string[] | number[]): Promise<TestData> => {
                const TestDataQuery: string = 'CALL selectTest(?)';
                return Query<TestData>(TestDataQuery, queryData);
            },
            TestCompare: async (queryData: any[] | string[] | number[]): Promise<TestCompare[]> => {
                const TestDataQuery: string = 'CALL selectTest(?)';
                const queryResult: TestData[] = await Query<TestData[]>(TestDataQuery, queryData);

                return new Promise<TestCompare[]>((resolve, reject) => {
                    if(queryResult.length === 0) reject("No data found");

                    let parseData: TestCompare[] = [];

                    queryResult.forEach((test: TestData) => {
                        parseData.push({
                            idSample: test['mySample']['idSample'],
                            standard: test['mySample']['standard'],
                            material: test['mySample']['material'],
                            specification: test['mySample']['specification'],
                            diameterReal: test['mySample']['diameterReal'],
                            diameterNominal: test['mySample']['diameterNominal'],
                            wallThickness: test['mySample']['wallThickness'],
                            lengthTotal: test['mySample']['lengthTotal'],
                            lengthFree: test['mySample']['lengthFree'],
                            targetTemperature: test['mySample']['targetTemperature'],
                            targetPressure: test['mySample']['targetPressure'],
                            hoopStress: test['mySample']['hoopStress'],
                            conditionalPeriod: test['mySample']['conditionalPeriod'],
                            idSpecimen: test['mySpecimen']['idSpecimen'],
                            operator: test['mySpecimen']['operator'],
                            enviroment: test['mySpecimen']['enviroment'],
                            beginTime: test['mySpecimen']['beginTime'],
                            endTime: test['mySpecimen']['endTime'],
                            duration: test['mySpecimen']['duration'],
                            counts: test['mySpecimen']['counts'],
                            testName: test['mySpecimen']['testName'],
                            testNumber: test['mySpecimen']['testNumber'],
                            endCap: test['mySpecimen']['endCap'],
                            fail: test['mySpecimen']['fail'],
                            remark: test['mySpecimen']['remark']
                        });
                    });
                    resolve(parseData);
                });
            },
            Data: (queryData: any[] | string[] | number[]): Promise<TestDataValues[]> => {
                const TestDataQuery: string = 'CALL selectTestData(?)';
                return Query<TestDataValues[]>(TestDataQuery, queryData);
            }
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