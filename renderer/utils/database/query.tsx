import type { QuerySpecimen, QuerySample, TestData, TestDataValues, TestCompare } from '../../interfaces/query/data';

const Query = <T extends unknown>(query: string, values: any[] = []): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        if (global && global.ipcRenderer) {
            global.ipcRenderer.send('database-request', { query: query, values: values });
            global.ipcRenderer.on('database-response', (_, response: T) => {
                resolve(response);
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
        Samples: (): Promise<QuerySample[]> => {
            const SampleQuery: string = `SELECT
                                            s.id AS idSample,
                                            s.material AS material,
                                            s.specification AS specification,
                                            s.diamreal AS diameter,
                                            s.wallthick AS wallThickness,
                                            s.lenfree AS length,
                                            (SELECT count(*) FROM specimen spe WHERE spe.sample = s.id) AS count
                                        FROM sample s;`;
            return Query<QuerySample[]>(SampleQuery, []);
        },
        Specimens: (idSample: number | null): Promise<QuerySpecimen[]> => {
            let SpecimenQuery: string;
            if(idSample === null) {
                SpecimenQuery = `SELECT
                                    s.id AS idSpecimen,
                                    1 AS testNumber,
                                    (IF(s.id IS NULL, NULL, s.sample)) AS idSample,
                                    (IF(s.targetPressure IS NULL, NULL, s.targetPressure)) AS targetPressure,
                                    (IF(s.targetTemperature IS NULL, NULL, s.targetTemperature)) AS targetTemperature,
                                    s.operator AS operator,
                                    s.enviroment AS enviroment,
                                    s.testName AS testName,
                                    s.endCap AS endCap,
                                    s.failText AS failText,
                                    s.remark AS remark,
                                    DATE_FORMAT((SELECT MIN(d.createdAt) FROM data d WHERE d.specimen = s.id), '%d/%m/%Y %H:%i:%s') AS beginTime,
                                    DATE_FORMAT((SELECT MAX(d.createdAt) FROM data d WHERE d.specimen = s.id), '%d/%m/%Y %H:%i:%s') AS endTime,
                                    DATE_FORMAT(TIMEDIFF((SELECT MAX(d.createdAt) FROM data d WHERE d.specimen = s.id), (SELECT MIN(d.createdAt) FROM data d WHERE d.specimen = s.id)), '%H:%i:%s') AS duration
                                FROM specimen s WHERE s.sample is NULL AND s.targetPressure is NULL AND s.targetTemperature is NULL;`;
            }
            else {
                SpecimenQuery = `SELECT
                                    s.id AS idSpecimen,
                                    ROW_NUMBER() OVER (ORDER BY s.id) AS testNumber,
                                    (IF(s.id IS NULL, NULL, s.sample)) AS idSample,
                                    (IF(s.targetPressure IS NULL, NULL, s.targetPressure)) AS targetPressure,
                                    (IF(s.targetTemperature IS NULL, NULL, s.targetTemperature)) AS targetTemperature,
                                    s.operator AS operator,
                                    s.enviroment AS enviroment,
                                    s.testName AS testName,
                                    s.endCap AS endCap,
                                    s.failText AS failText,
                                    s.remark AS remark,
                                    DATE_FORMAT((SELECT MIN(d.createdAt) FROM data d WHERE d.specimen = s.id), '%d/%m/%Y %H:%i:%s') AS beginTime,
                                    DATE_FORMAT((SELECT MAX(d.createdAt) FROM data d WHERE d.specimen = s.id), '%d/%m/%Y %H:%i:%s') AS endTime,
                                    DATE_FORMAT(TIMEDIFF((SELECT MAX(d.createdAt) FROM data d WHERE d.specimen = s.id), (SELECT MIN(d.createdAt) FROM data d WHERE d.specimen = s.id)), '%H:%i:%s') AS duration
                                FROM specimen s WHERE s.sample = ?;`;
            }
            return Query<QuerySpecimen[]>(SpecimenQuery, idSample !== null ? [idSample] : []);
        },
        TEST: {
            Test: async (queryData: any[] | string[] | number[]): Promise<TestData> => {
                const TestDataQuery: string = `SELECT selectTestSample(se.sample) AS mySample, selectTestSpecimen(se.id) AS mySpecimen FROM specimen se WHERE se.id = ?;`;
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
                            // counts: test['mySpecimen']['counts'],
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
                // Delete Procedure
                const TestDataQuery: string = 'CALL selectTestData(?)';
                return Query<TestDataValues[]>(TestDataQuery, queryData);
            }
        }
    },
    UPDATE: {
        
        Sample: (queryData: any[] | string[] | number[]): Promise<string> => {
            // const SampleQuery: string = "CALL updateSample(?,?,?,?,?,?,?)"; Delete Procedure
            const SampleQuery: string = `UPDATE sample
                                        SET standard = ?, material = ?, specification = ?, diamreal = ?, diamnom = ?, wallthick = ?, lenfree = ?, lentotal = ?, condperiod = ?
                                        WHERE id = ?;`;
            return new Promise<string>((resolve, reject) => {
                Query(SampleQuery, queryData).catch(() => { reject("Base de Datos: Error al actualizar!"); })
                .then(() => { resolve("Base de Datos: Actualización Exitosa!"); });
            });
        },
        Specimen: (queryData: any[] | string[] | number[]): Promise<string> => {
            // const SpecimenQuery: string = "CALL updateSpecimen(?,?,?,?,?)"; Delete Procedure
            const SpecimenQuery: string = `UPDATE specimen
                                        SET sample = ?, targetPressure = ?, targetTemperature = ?, operator = ?, enviroment = ?, testName = ?, endCap = ?, failText = ?, remark = ?
                                        WHERE id = ?`;
            return new Promise<string>((resolve, reject) => {
                Query(SpecimenQuery, queryData).catch(() => { reject("Base de Datos: Error al actualizar!"); })
                .then(() => { resolve("Base de Datos: Actualización Exitosa!"); });
            });
        }
    },
    DELETE: {
        Specimen: (idSpecimen: number): Promise<string> => {
            const SpecimenQuery: string = "DELETE FROM specimen WHERE id = ?";
            return new Promise<string>((resolve, reject) => {
                Query(SpecimenQuery, [idSpecimen]).catch(() => { reject("Base de Datos: Error al eliminar Prueba!"); })
                .then(() => { resolve("Base de Datos: Eliminación Exitosa!"); });
            });
        }
    }
}

export default QueryService;