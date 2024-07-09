import type { QuerySampleTest, TestData, TestDataValues, TestCompare } from '../../interfaces/query';

const Query = <T extends unknown>(query: string, values: any[] = []): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        if (global && global.ipcRenderer) {
            global.ipcRenderer.send('database-request', { query: query, values: values });
            global.ipcRenderer.on('database-response', (_, response: T) => {
                resolve(response[0]);
            });
            global.ipcRenderer.on('database-error', (_, error) => {
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
            TestCompare: (queryData: any[] | string[] | number[]): Promise<TestCompare[]> => {
                return new Promise<TestCompare[]>(async (resolve, reject) => {
                    const TestDataQuery: string = 'CALL selectCompareTests(?)';
                    const queryResult: TestData[] = await Query<TestData[]>(TestDataQuery, queryData);
                    if (queryResult.length === 0) reject("No data found");

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
                            targetTemperature: test['mySpecimen']['targetTemperature'],
                            targetPressure: test['mySpecimen']['targetPressure'],
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
                            remark: test['mySpecimen']['remark'],
                            myData: test['myData']
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
        Specimen: (queryData: any[] | string[] | number[]): Promise<string> => {
            const SpecimenQuery: string = "CALL updateSpecimen(?,?,?,?,?)";
            return new Promise<string>((resolve, reject) => {
                Query(SpecimenQuery, queryData).catch(() => { reject("Base de Datos: Error al actualizar!"); })
                .then(() => { resolve("Base de Datos: Actualización Exitosa!"); });
            });
        }
    },
    DELETE: {
        Specimen: (queryData: any[] | string[] | number[]): Promise<string> => {
            const SpecimenQuery: string = "CALL deleteTest(?)";
            return new Promise<string>((resolve, reject) => {
                Query(SpecimenQuery, queryData).catch(() => { reject("Base de Datos: Error al eliminar Prueba!"); })
                .then(() => { resolve("Base de Datos: Eliminación Exitosa!"); });
            });
        }
    }
}

export default QueryService;