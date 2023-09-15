import { app, BrowserWindow } from "electron";
import path from "path";

let mainWindow: BrowserWindow = null;
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  // load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    // in development mode
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    // in production mode
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
});

import runOSSpecificCode from "./misc/os-specific";
runOSSpecificCode(app);
