import type { QueryStatic, QueryStandard, QueryOperator } from '../../../interfaces/query/static';

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

const QueryStaticService = {
    SELECT: {
        
    }
}

export default QueryStaticService;