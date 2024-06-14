import type { DatabaseConfig } from '../../../electron-src/service/database';

const DatabaseService = {
    CONNECT: (wasClicked: boolean): Promise<any> => {
        return new Promise((resolve, reject) => {
            global.ipcRenderer.send('database-connect', { clicked: wasClicked });
            global.ipcRenderer.on('database-connected', (_, response: string) => { resolve(response); });
            global.ipcRenderer.on('database-error', (_, error) => { reject(error); });
        });
    },
    ISCONNECTED: (): Promise<any> => {
        return new Promise((resolve, reject) => {
            global.ipcRenderer.send('database-isconnected');
            global.ipcRenderer.on('database-connected', (_, response: string) => { resolve(response); });
            global.ipcRenderer.on('database-error', (_, error) => { reject(error); });
        });
    },
    SAVE: (address: string, port: number, user: string, password: string): Promise<any> => {
        const dbConfig: DatabaseConfig = { HOST: address, PORT: port, USER: user, PASSWORD: password, DATABASE: 'data_db' };
        return new Promise((resolve, reject) => {
            global.ipcRenderer.send('database-save', dbConfig);
            global.ipcRenderer.on('database-save-succes', (_, response: string) => { resolve(response); });
            global.ipcRenderer.on('database-save-error', (_, error) => { reject(error); });
        });
    },
    READ: (): Promise<DatabaseConfig> => {
        return new Promise((resolve, reject) => {
            global.ipcRenderer.send('database-read');
            global.ipcRenderer.on('database-read-response', (_, response: DatabaseConfig) => { resolve(response); });
            global.ipcRenderer.on('database-read-error', (_, error) => { reject(error); });
        });
    }
}
export default DatabaseService;