import { ipcMain } from "electron";
import { createPool, Pool } from 'mysql2/promise';

const DBCONFIG = {
	HOST: "localhost",
	PORT: 3306,
	USER: "reportGenerator",
	PASSWORD: "STEL_ReportGenerator",
	DATABASE: "STEL_DB_DATA"
};

export interface DatabaseRequest {
	query: string;
	values: any[];
}

let globalPool: Pool | undefined = undefined;

const myDB = {
	connect: async(): Promise<Pool> => {
		if (typeof globalPool !== 'undefined') {
			return globalPool;
		}
	
		globalPool = await createPool('mysql://' + DBCONFIG.USER + ':' + DBCONFIG.PASSWORD + '@' + DBCONFIG.HOST + ':' + DBCONFIG.PORT + '/' + DBCONFIG.DATABASE);
		return globalPool;	
	},
	disconnect: () => {

	},
	get: (): Pool|undefined => {
		return globalPool;
	}
}

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