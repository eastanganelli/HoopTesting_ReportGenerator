import { join } from 'path';
// Packages
import { app } from 'electron';
import isDev from 'electron-is-dev';

import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

import { newWindow, setPreloadPath, winParams } from './service/multiwindow';
import myDB from './service/database';

setPreloadPath(join(__dirname, 'preload.js'));
const nextApp = next({ dev: isDev, dir: app.getAppPath() + '/renderer' });
const handle = nextApp.getRequestHandler();

// Prepare the renderer once the app is ready
app.on('ready', async () => {
	await nextApp.prepare();
	await myDB.connect();

	createServer((req: any, res: any) => {
		const parsedUrl = parse(req.url, true);
		handle(req, res, parsedUrl);
	}).listen(3000, () => {
		console.log('> Ready on http://localhost:3000');
	});
	const windowParams: winParams = {
		windowID: 'main-window',
		windowTitle: 'Main Window',
		windowPath: 'index',
		windowParams: { width: 1600, height: 900, autoHideMenuBar: false, icon: "", webPreferences: { nodeIntegration: false, contextIsolation: false, preload: "" } }
	}
	newWindow(windowParams);
});

// Quit the app once all windows are closed
app.on('window-all-closed', () => {
	console.log('Closing app');
	myDB.disconnect();
	app.quit();
});

// listen the channel `message` and resend the received message to the renderer process
/* ipcMain.on('message', (event: IpcMainEvent, message: any) => {
	console.log(message)
	setTimeout(() => event.sender.send('message', 'hi from electron'), 500);
}); */