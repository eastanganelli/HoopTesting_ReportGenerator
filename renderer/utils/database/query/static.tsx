import type { QueryStatic, QueryStandard, QueryOperator } from '../../../interfaces/query/static';

const Query = <T extends unknown>(query: string, values: any[] = []): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        if (global && global.ipcRenderer) {
            global.ipcRenderer.send('database-request', 'StaticPool', { query: query, values: values });
            global.ipcRenderer.on('database-response', (_, response: T) => {
                resolve(response);
            });
            global.ipcRenderer.on('database-error', (_, error) => { reject(error); });
        }
    });
}

const QueryStaticService = {
    SELECT: {
        Standards: (): Promise<any> => {
            const standardsData: string = `SELECT selectStandard_Into_JSON() AS standards;`;
            return Query<any>(standardsData);
        },
        Operators: (): Promise<any> => {
            return Query<any>(`SELECT o.id AS 'key', o.dni AS dni, CONCAT(o.familyname,', ',o.name) AS operator FROM operator o`);
        }
    }
}

export default QueryStaticService;