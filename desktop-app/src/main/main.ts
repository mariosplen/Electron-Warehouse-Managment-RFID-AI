import { app, BrowserWindow, ipcMain } from "electron";
import runOSSpecificCode from "./os-specific";

runOSSpecificCode(app);

const isDev: boolean = MAIN_WINDOW_VITE_DEV_SERVER_URL !== undefined;

let win: BrowserWindow = null;

app.on("ready", () => {
  win = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    webPreferences: {
      preload: `${__dirname}/preload.js`,
      nodeIntegration: true,
      // webSecurity: false,
      contextIsolation: false,
    },
  });

  isDev
    ? win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/index.html`)
    : win.loadFile(
        `${__dirname}/../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`
      );

  isDev ? win.webContents.openDevTools() : win.webContents.closeDevTools();

  win.on("ready-to-show", () => win.show());

  ipcMain.on("r2m-connected-to-reader", () => {
    win.webContents.send("m2r-connected-to-reader");
  });

  ipcMain.on("r2m-disconnected-from-reader", () => {
    win.webContents.send("m2r-disconnected-from-reader");
  });
});
