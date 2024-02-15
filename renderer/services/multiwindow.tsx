let activeWindows: Window[] = [];

export interface windowSize {
    width:  number;
    height: number;
}

const openNewWindow = (url: string, size: windowSize = { width: 1600, height: 900}, data: any) => {
    let urlString = url;
    if(data != "") { urlString += "?" + data; }
    let newWindow = window.open(urlString, "popup_window", "width="+size.width+",height="+size.height+",position=center,contextIsolation=no,nodeIntegration=yes,resizable=yes");
    activeWindows.push(newWindow);
};


const closeAllWindows = () => {
    activeWindows.forEach(window => window.close());
    activeWindows = [];
};

export { openNewWindow, closeAllWindows };