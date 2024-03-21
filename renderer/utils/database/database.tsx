import type { DatabaseConfig } from '../../../electron-src/service/database';

const DatabaseService = {
    CONNECT: (wasClicked: boolean): Promise<any> => {
        return new Promise((resolve, reject) => {
            global.ipcRenderer.send('database-connect', { clicked: wasClicked });
            global.ipcRenderer.on('database-connected', (event, response: string) => { resolve(response); });
            global.ipcRenderer.on('database-error', (event, error) => { reject(error); });
        });
    },
    ISCONNECTED: (): Promise<any> => {
        return new Promise((resolve, reject) => {
            global.ipcRenderer.send('database-isconnected');
            global.ipcRenderer.on('database-connected', (event, response: string) => { resolve(response); });
            global.ipcRenderer.on('database-error', (event, error) => { reject(error); });
        });
    },
    SAVE: (address: string, port: number, user: string, password: string): Promise<any> => {
        const dbConfig: DatabaseConfig = { HOST: address, PORT: port, USER: user, PASSWORD: password, DATABASE: 'stel_db_data' };
        return new Promise((resolve, reject) => {
            global.ipcRenderer.send('database-save', dbConfig);
            global.ipcRenderer.on('database-save-succes', (event, response: string) => { resolve(response); });
            global.ipcRenderer.on('database-save-error', (event, error) => { reject(error); });
        });
    },
    READ: (): Promise<DatabaseConfig> => {
        return new Promise((resolve, reject) => {
            global.ipcRenderer.send('database-read');
            global.ipcRenderer.on('database-read-response', (event, response: DatabaseConfig) => { resolve(response); });
            global.ipcRenderer.on('database-read-error', (event, error) => { reject(error); });
        });
    }
}
export default DatabaseService;