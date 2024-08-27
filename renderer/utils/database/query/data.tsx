import type { QuerySpecimen, QuerySample, TestCompare, QueryData, QueryTest } from '../../../interfaces/query/data';

const Query = <T extends unknown>(query: string, values: any[] = []): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        if (global && global.ipcRenderer) {
            global.ipcRenderer.send('database-request', 'DataPool', { query: query, values: values });
            global.ipcRenderer.on('database-response', (_, response: T) => { resolve(response); });
            global.ipcRenderer.on('database-error',    (_, error) => { reject(error); });
        }
    });
}

const QueryDataService = {
    SELECT: {
        Samples: (): Promise<QuerySample[]> => {
            const SampleQuery: string = `SELECT
                                            s.id AS idSample,
                                            s.standard AS standard,
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
                                    DATE_FORMAT((SELECT MIN(d.createdAt) FROM data d WHERE d.specimen = s.id), '%d/%m/%Y %H:%i:%s') AS beginTime,
                                    DATE_FORMAT((SELECT MAX(d.createdAt) FROM data d WHERE d.specimen = s.id), '%d/%m/%Y %H:%i:%s') AS endTime,
                                    DATE_FORMAT(TIMEDIFF((SELECT MAX(d.createdAt) FROM data d WHERE d.specimen = s.id), (SELECT MIN(d.createdAt) FROM data d WHERE d.specimen = s.id)), '%H:%i:%s') AS duration
                                FROM specimen s WHERE s.sample = ?;`;
            }
            return Query<QuerySpecimen[]>(SpecimenQuery, idSample !== null ? [idSample] : []);
        },
        Data: (idSpecimen: number, interval: number, timeType: string): Promise<QueryData[]> => {
            const DataQuery: string = `CALL selectData(${idSpecimen}, ${interval}, '${timeType}');`;
            return new Promise<QueryData[]>((resolve, reject) => {
                Query(DataQuery).catch(() => { reject("No data found"); })
                .then((DataResults: any) => { resolve(DataResults[0]) });
            });
        },
        TEST: {
            Test: (idSpecimen: number): Promise<QueryTest> => {
                const TestQuery: string = `SELECT
                                                s.id AS idSpecimen,
                                                s.sample AS idSample,
                                                s1.standard AS standard,
                                                s1.material AS material,
                                                s1.specification AS specification,
                                                s1.diamreal AS diameterReal,
                                                s1.diamnom AS diameterNominal,
                                                s1.wallthick AS wallThickness,
                                                s1.lenfree AS lengthFree,
                                                s1.lentotal AS lengthTotal,
                                                s1.condPeriod AS conditionalPeriod,
                                                (SELECT COUNT(*) FROM specimen spe WHERE spe.id = s.id GROUP BY spe.sample) AS specimensCount,
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
                                            FROM specimen s INNER JOIN sample s1 ON s.sample = s1.id WHERE s.id = ${idSpecimen};`;
                return new Promise<QueryTest>((resolve, reject) => {
                    Query<any>(TestQuery, []).catch(() => { reject("No data found"); })
                    .then((DataResults: any) => { resolve(DataResults[0]) });
                });
            }
        }
    },
    UPDATE: {
        Sample: (idSample: number, sampleData: QueryTest): Promise<string> => {
            const SampleQuery: string = `UPDATE sample
                                        SET standard = '${sampleData['standard']}', material = '${sampleData['material']}', specification = '${sampleData['specification']}', diamreal = ${sampleData['diameterReal']}, diamnom = ${sampleData['diameterNominal']}, wallthick = ${sampleData['wallThickness']}, lenfree = ${sampleData['lengthFree']}, lentotal = ${sampleData['lengthTotal']}, condperiod = '${sampleData['conditionalPeriod']}'
                                        WHERE id = ${idSample};`;
            return new Promise<string>((resolve, reject) => {
                Query(SampleQuery).catch(() => { reject("Base de Datos: Error al actualizar!"); })
                .then(() => { resolve("Base de Datos: Actualización Exitosa!"); });
            });
        },
        Specimen: (idSpecimen: number, idSample: number, specimenData: QueryTest): Promise<string> => {
            const SpecimenQuery: string = `UPDATE specimen
                                        SET sample = ${idSample}, targetPressure = ${specimenData['targetPressure']}, targetTemperature = ${specimenData['targetTemperature']}, operator = '${specimenData['operator']}', enviroment = '${specimenData['enviroment']}', testName = '${specimenData['testName']}', endCap = '${specimenData['endCap']}', failText = '${specimenData['failText']}', remark = '${specimenData['remark']}'
                                        WHERE id = ${idSpecimen};`;
                                        console.log(SpecimenQuery);
            return new Promise<string>((resolve, reject) => {
                Query(SpecimenQuery).catch(() => { reject("Base de Datos: Error al actualizar!"); })
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

export default QueryDataService;