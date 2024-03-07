import Store from 'electron-store'


let globalCached: Store | undefined = new Store();

const setupCache = (key: string, value: any) => {
    globalCached?.set(key, value);
};

const removeCache = (key: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        try {
            globalCached?.delete(key);
            resolve('Cache removed');
        } catch(error: any) {
            reject(error.message);
        }
    });
};

const selectCache = (key: string): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        try {
            const result = globalCached?.get(key);
            resolve(result);
        } catch(error: any) {
            reject(error.message);
        }
    });
}

export { setupCache, removeCache, selectCache};