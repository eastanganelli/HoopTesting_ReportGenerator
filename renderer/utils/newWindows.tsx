import { winParams } from '../../electron-src/service/multiwindow';

const openNewWindow = (windowID: string, windowTitle: string, windowPath: string) => {
    const windowParams: winParams = {
        windowID: windowID,
		windowTitle: `Visualizador Reporte || ${windowTitle}`,
		windowPath: windowPath,
		windowParams: { width: 1600, height: 900, autoHideMenuBar: true, icon: "", webPreferences: { nodeIntegration: false, contextIsolation: false, preload: "" } }
	
	}
    try {
        if (global && global.ipcRenderer) {
            global.ipcRenderer.send('new-window', windowParams);
        }
    } catch (e) {
        console.error(e);
    }
}

export default openNewWindow;