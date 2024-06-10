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

let globalPool: Pool | undefined = undefined;

const myDB = {
	connect: (): Promise<Pool> => {
		return new Promise<Pool>((resolve, reject) => {
			settings.get('dbConfig.data').then((response: any) => {
				if(response === undefined) { reject(new Error('No Data to Logging')); }

				const DBCONFIG: DatabaseConfig = JSON.parse(response);
				try {
					globalPool = createPool(`mysql://${DBCONFIG.USER}:${DBCONFIG.PASSWORD}@${DBCONFIG.HOST}:${DBCONFIG.PORT}/${DBCONFIG.DATABASE}`);
					resolve(globalPool);
				} catch (error: any) {
					globalPool = undefined;
					reject(error);
				}
			}).catch((error) => { reject(error); });
		});
	},
	disconnect: () => {
		globalPool?.end();
	},
	get: (): Pool|undefined => {
		return globalPool;
	}
}

ipcMain.on('database-connect', async (event, requestData: { clicked: boolean }) => {
	try {
		globalPool = await myDB.connect();
		if(requestData.clicked) {
			setTimeout(() => { app.relaunch(); app.exit(); }, 4000);
			event.reply('database-connected', 'Base de Datos: La aplicación se reiniciará para aplicar los cambios en la conexión!');
		}// } else { event.reply('database-connected', 'Base de Datos: Conexión Exitosa!'); }
	} catch (error: any) {
		event.reply('database-error', 'Base de Datos: Conexión No Exitosa!');
	}
});

ipcMain.on('database-isconnected', async (event) => {
	try {
		globalPool = await myDB.get();
		globalPool?.execute('SELECT 1').then(() => {
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

ipcMain.on('database-request', async (event, requestData: DatabaseRequest) => {
	try {
		const myConnection = myDB.get();
		myConnection?.execute(requestData.query, requestData.values).then(([rows]) => {
			event.reply('database-response', rows);
		});
	} catch (error: any) {
		event.reply('database-error', error.message);
	}
});

export default myDB;