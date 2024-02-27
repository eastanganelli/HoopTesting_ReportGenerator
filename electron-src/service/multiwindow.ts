import { BrowserWindow, ipcMain, screen, Rectangle, } from 'electron';
import Store from 'electron-store';

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
    webPreferences: {
        nodeIntegration: boolean;
        contextIsolation: boolean;
        preload: string;
    };
}

let preloadPath: string = '';

const setPreloadPath = (path: string) => {
    preloadPath = path;
};

const newWindow = (params: winParams): void => {
	const key = 'window-state';
	const name = `window-state-${params.windowID}`;
	const store = new Store<Rectangle>({ name });
	const defaultSize = { width: params.windowParams.width, height: params.windowParams.height, };
	let state = {};

	console.log('Window ID', name);

	const restore = () => store.get(key, defaultSize);

	const getCurrentPosition = () => {
		const position = win.getPosition();
		const size = win.getSize();
		return {
			x: position[0],
			y: position[1],
			width: size[0],
			height: size[1],
		};
	};

	const windowWithinBounds = (windowState: any, bounds: any) => {
		return (
			windowState.x >= bounds.x &&
			windowState.y >= bounds.y &&
			windowState.x + windowState.width <= bounds.x + bounds.width &&
			windowState.y + windowState.height <= bounds.y + bounds.height
		);
	};

	const resetToDefaults = () => {
		const bounds = screen.getPrimaryDisplay().bounds
		return Object.assign({}, defaultSize, {
			x: (bounds.width - defaultSize.width) / 2,
			y: (bounds.height - defaultSize.height) / 2,
		})
	};

	const ensureVisibleOnSomeDisplay = (windowState: any) => {
		const visible = screen.getAllDisplays().some((display) => {
			return windowWithinBounds(windowState, display.bounds)
		})
		if (!visible) {
			// Window is partially or fully not visible now.
			// Reset it to safe defaults.
			return resetToDefaults()
		}
		return windowState;
	};

	const saveState = () => {
		if (!win?.isMinimized() && !win?.isMaximized()) {
			Object.assign(state, getCurrentPosition())
		}
		store.set(key, state)
	};

	state = ensureVisibleOnSomeDisplay(restore())
    params['windowParams']['webPreferences']['preload'] = preloadPath;
    const win: BrowserWindow = new BrowserWindow({
        width: params.windowParams.width,
        height: params.windowParams.height,
        webPreferences: params.windowParams.webPreferences,
    });
	// win.setMenu(null);
    win.setTitle(params.windowTitle);
    win.loadURL('http://localhost:3000/' + params.windowPath);

	win.on('close', saveState);
};

ipcMain.on('new-window', async (event, params: winParams) => {
	try {
        newWindow(params);
	} catch (error: any) {
		event.reply('new-window-error', error.message);
	}
});

export { setPreloadPath, newWindow };