import type { QuerySampleTest, TestData, TestDataValues } from '../../interfaces/query';

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
            Test: (queryData: any[] | string[] | number[]): Promise<TestData> => {
                const TestDataQuery: string = 'CALL selectTest(?)';
                return Query<TestData>(TestDataQuery, queryData);
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