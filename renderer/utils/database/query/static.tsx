import type { QueryStandard, QueryOperator } from '../../../interfaces/query/static';

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
        Standards: (): Promise<QueryStandard[]> => {
            return new Promise<QueryStandard[]>((resolve, reject) => {
                Query<any>(`SELECT selectStandard_Into_JSON() AS standards;`).catch((error) => { reject(error); })
                .then((response) => { resolve(response[0]['standards']); });
            });
        },
        Operators: (): Promise<QueryOperator[]> => {
            return new Promise<QueryOperator[]>((resolve, reject) => {
                Query<any>(`SELECT o.id AS 'key', o.dni AS dni, CONCAT(o.familyname,', ',o.name) AS operator FROM operator o`).catch((error) => { reject(error); })
                .then((response) => { resolve(response); });
            });
        }
    }
}

export default QueryStaticService;