import { ipcMain } from "electron";
import settings from 'electron-settings';
import { createPool, Pool } from 'mysql2/promise';
import { refreshWindow } from "./multiwindow";

/* const DBCONFIG = {
	HOST: "localhost",
	PORT: 33061,
	USER: "reportGenerator",
	PASSWORD: "STEL_ReportGenerator",
	DATABASE: "stel_db_data"
}; */

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

				globalPool = createPool('mysql://' + DBCONFIG.USER + ':' + DBCONFIG.PASSWORD + '@' + DBCONFIG.HOST + ':' + DBCONFIG.PORT + '/' + DBCONFIG.DATABASE);
				resolve(globalPool);
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

ipcMain.on('database-connect', async (event) => {
	try {
		globalPool = await myDB.connect();
		event.reply('database-connected', 'Connection Successful');
		refreshWindow('main-window');
	} catch (error: any) {
		event.reply('database-error', error.message);
	}
});

ipcMain.on('database-isconnected', async (event) => {
	try {
		globalPool = await myDB.get();
		if(globalPool !== undefined) { event.reply('database-connected', 'Connection Successful'); }
		else { throw new Error('No Connection'); }
	} catch (error: any) {
		event.reply('database-error', error.message);
	}
});

ipcMain.on('database-save', async (event, requestData: DatabaseConfig) => {
	settings.set('dbConfig', { data: JSON.stringify(requestData) }).then(() => {
		event.reply('database-save-succes', 'Configuración guardada exitosamente');
	}).catch((error) => {
		event.reply('database-save-error', error.message);
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