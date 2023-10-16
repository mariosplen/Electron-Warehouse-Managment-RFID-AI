import { app, BrowserWindow, ipcMain } from "electron";
import runOSSpecificCode from "./os-specific";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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

  ipcMain.on("add-box", async (event, box) => {
    console.log("received add-box event");
    const data = await prisma.box.create({
      data: {
        uid: box.uid,
        contents: box.contents,
        isFragile: box.isFragile,
        weight: box.weight,
        length: box.length,
        width: box.width,
        height: box.height,
      },
    });
    const dbData = await prisma.box.findUnique({
      where: {
        id: data.id,
      },
    });
    console.log("data:", dbData);
    win.webContents.send("box-added", dbData);
    console.log("sent box-added event");
  });

  // ipcMain.on("get-all-users", async (event) => {
  //   console.log("received get-all-users event");
  //   const data = await prisma.item.findMany();
  //   console.log("data:", data);
  //   win.webContents.send("all-users", data);
  //   console.log("sent all-users event");
  // });
});
