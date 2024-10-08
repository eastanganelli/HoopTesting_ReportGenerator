import { BrowserWindow, ipcMain } from 'electron';
import isDev from 'electron-is-dev';
//import Store from 'electron-store';

let activeWindows: Array<BrowserWindow> = [];

export interface winParams {
	windowID: string;
	windowTitle: string;
	windowPath: string;
	windowParams: winOptions;
}

interface winOptions {
	width: number;
	height: number;
	autoHideMenuBar: boolean;
	icon: string;
	webPreferences: {
		nodeIntegration: boolean;
		contextIsolation: boolean;
		preload: string;
	};
}

const iconPath: string = '../../../logos_ezequiel2_03.ico';

let preloadPath: string = '';

const setPreloadPath = (path: string) => {
	preloadPath = path;
};

const newWindow = (params: winParams): void => {
	params['windowParams']['webPreferences']['preload'] = preloadPath;
	params['windowParams']["icon"] = iconPath;

	const myActiveWindow: BrowserWindow | undefined = activeWindows.find((window) => { if(window.title === params.windowTitle) { return window; } });

	if (myActiveWindow !== undefined) {
		myActiveWindow.focus();
		return;
	}
	const win: BrowserWindow = new BrowserWindow({
		width: params.windowParams.width,
		height: params.windowParams.height,
		webPreferences: params.windowParams.webPreferences,
	});

	if(!isDev) { win.setMenu(null); }

	win.maximize();
	win.setTitle(`${params.windowTitle}`);
	win.loadURL('http://localhost:3000/' + params.windowPath);
	activeWindows.push(win);

	win.once('ready-to-show', () => { win.show(); });

	win.on('close', () => {
		if(activeWindows.length > 1 && win.id !== 1) {
			activeWindows.find((window, index) => { if (window.id === win.id) { activeWindows.splice(index, 1); } });
			win.close();
		} else if(win.id === 1) {
			activeWindows.reverse().forEach((window, index) => { if (index > 0) { window.close(); } });
		}
	});
};

const refreshWindow = (windowID: string): void => {
	const myActiveWindow: BrowserWindow | undefined = activeWindows.find((window) => { if(window.id === Number(windowID)) { return window; } });
	if (myActiveWindow !== undefined) {
		myActiveWindow.reload();
	}
};

ipcMain.on('new-window', async (event, params: winParams) => {
	try {
		newWindow(params);
	} catch (error: any) {
		event.reply('new-window-error', error.message);
	}
});

export { setPreloadPath, newWindow, refreshWindow };