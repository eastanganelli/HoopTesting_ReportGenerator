import { ipcMain, app } from "electron";
import settings from 'electron-settings';
import { createPool, Pool } from 'mysql2/promise';

export interface DatabaseConfig {
	HOST: string;
	PORT: number;
	USER: string;
	PASSWORD: string;
	DATABASE: string;
};

export interface DatabaseRequest {
	query: string;
	values: any[];
}

let globalPool: Map<string, Pool | undefined> = new Map<string, Pool | undefined>();

// let globalPool: Pool | undefined = undefined;

const myDB = {
	connect: (): Promise<Map<string, Pool | undefined>> => {
		return new Promise<Map<string, Pool | undefined>>((resolve, reject) => {
			settings.get('dbConfig.data').then((response: any) => {
				if(response === undefined) { reject(new Error('No Data to Logging')); }

				const DBCONFIG: DatabaseConfig = JSON.parse(response);
				try {
					globalPool.set('DataPool',   createPool(`mysql://${DBCONFIG.USER}:${DBCONFIG.PASSWORD}@${DBCONFIG.HOST}:${DBCONFIG.PORT}/${'data_db'}`));
					globalPool.set('StaticPool', createPool(`mysql://${DBCONFIG.USER}:${DBCONFIG.PASSWORD}@${DBCONFIG.HOST}:${DBCONFIG.PORT}/${'static_db'}`));
					resolve(globalPool);
				} catch (error: any) {
					globalPool.set('DataPool',   undefined);
					globalPool.set('StaticPool', undefined);
					reject(error);
				}
			}).catch((error) => { reject(error); });
		});
	},
	disconnect: () => {
		globalPool.forEach((pool: Pool | undefined) => {
			pool?.end();
		});
	},
	get: (keyPool: string): Pool|undefined => {
		return globalPool.get(keyPool);
	}
}

ipcMain.on('database-connect', async (event, requestData: { clicked: boolean }) => {
	try {
		globalPool = await myDB.connect();
		if(requestData.clicked) {
			setTimeout(() => { app.relaunch(); app.exit(); }, 4000);
			event.reply('database-connected', 'Base de Datos: La aplicación se reiniciará para aplicar los cambios en la conexión!');
		}
	} catch (error: any) {
		event.reply('database-error', 'Base de Datos: Conexión No Exitosa!');
	}
});

ipcMain.on('database-isconnected', async (event) => {
	try {
		let localPool = await myDB.get('DataPool');
		localPool?.execute('SELECT 1').then(() => {
			event.reply('database-connected', 'Base de Datos: Conexión Exitosa!');
		}).catch(() => {
			event.reply('database-error', 'Base de Datos: Conexión No Exitosa!');
		});
	} catch (error: any) {
		event.reply('database-error', 'Base de Datos: Conexión No Exitosa!');
	}
});

ipcMain.on('database-save', async (event, requestData: DatabaseConfig) => {
	settings.set('dbConfig', { data: JSON.stringify(requestData) }).then(() => {
		event.reply('database-save-succes', 'Base de Datos: Configuración Guardada!');
	}).catch((error) => {
		event.reply('database-save-error', error.message);
	});
});
ipcMain.on('database-read', async (event) => {

	settings.get('dbConfig.data').then((response: any) => {
		if(response === undefined) { throw new Error('Base de Datos: No Hay Configuración!'); }
		const DBCONFIG: DatabaseConfig = JSON.parse(response);
		DBCONFIG['PASSWORD'] = '';
		DBCONFIG['DATABASE'] = '';
		event.reply('database-read-response', DBCONFIG);
	}).catch((error) => {
		event.reply('database-read-error', error.message);
	});
});

ipcMain.on('database-request', async (event, keySchema, requestData: DatabaseRequest) => {
	try {
		const myConnection = myDB.get(keySchema);
		myConnection?.execute(requestData.query, requestData.values).then(([rows]) => {
			event.reply('database-response', rows);
		});
	} catch (error: any) {
		event.reply('database-error', error.message);
	}
});

export default myDB;