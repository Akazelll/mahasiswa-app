import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { Database } from "./db/Database";
import { MahasiswaRepository } from "./db/MahasiswaRepository";
import { DosenRepository } from "./db/DosenRepository";

let mahasiswaRepo: MahasiswaRepository;
let dosenRepo: DosenRepository;

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      sandbox: false,
    },
  });

  const rendererUrl = process.env.ELECTRON_RENDERER_URL;

  if (rendererUrl) {
    win.loadURL(rendererUrl);
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  const db = Database.getInstance();

  mahasiswaRepo = new MahasiswaRepository(db);
  dosenRepo = new DosenRepository(db);

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("mahasiswa:getAll", () => {
  return mahasiswaRepo.findAll();
});

ipcMain.handle("mahasiswa:search", (_, keyword: string) => {
  return mahasiswaRepo.search(keyword);
});

ipcMain.handle("mahasiswa:insert", (_, data) => {
  return mahasiswaRepo.insert(data);
});

ipcMain.handle("mahasiswa:update", (_, id, data) => {
  return mahasiswaRepo.update(id, data);
});

ipcMain.handle("mahasiswa:delete", (_, id) => {
  return mahasiswaRepo.delete(id);
});

ipcMain.handle("dosen:getAll", () => {
  return dosenRepo.findAll();
});

ipcMain.handle("dosen:search", (_, keyword: string) => {
  return dosenRepo.search(keyword);
});

ipcMain.handle("dosen:insert", (_, data) => {
  return dosenRepo.insert(data);
});

ipcMain.handle("dosen:update", (_, id, data) => {
  return dosenRepo.update(id, data);
});

ipcMain.handle("dosen:delete", (_, id) => {
  return dosenRepo.delete(id);
});
