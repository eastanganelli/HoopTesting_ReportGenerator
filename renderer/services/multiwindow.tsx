let activeWindows: Window[] = [];

const openNewWindow = (url: string, data: any = "") => {
    let urlString = url;
    if(data != "") { urlString += "?" + data; }
    let newWindow = window.open(urlString, "_blank", "width=1600,height=900,position=center,contextIsolation=no,nodeIntegration=yes");
    activeWindows.push(newWindow);
};


const closeAllWindows = () => {
    activeWindows.forEach(window => window.close());
    activeWindows = [];
};

export { openNewWindow, closeAllWindows };