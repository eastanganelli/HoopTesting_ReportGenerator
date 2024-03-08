import settings from 'electron-settings';

const setupCache = (key: string, value: any) => {
    return settings.set(key, { data: value });
};

const removeCache = (key: string): Promise<any> => {
    return settings.unset(key);
};

const selectCache = (key: string): Promise<any> => {
    return settings.get(key);
}

export { setupCache, removeCache, selectCache };