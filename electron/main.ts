import { app, BrowserWindow, Menu, Tray } from "electron";
import path from "path";

process.env.DIST = path.join(__dirname, "../dist-electron");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
let tray: Tray | null;

const iconPath = path.join(process.env.VITE_PUBLIC, "weather.png");

// Hide dock icon on macOS
// app.dock.hide();

function createWindow() {
  win = new BrowserWindow({
    width: 300,
    height: 200,
    resizable: false,
    frame: false,
    alwaysOnTop: false,
    // Hide the window when it loses focus
    skipTaskbar: true,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }

  // const trayIconPath = path.join(__dirname, "weather-icon-original.svg");
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setToolTip("Your Electron-React App");
  tray.setContextMenu(contextMenu);

  // Minimize to tray on window close
  win.on("minimize", (event: { preventDefault: () => void }) => {
    event.preventDefault();
    win?.hide();
  });

  // Restore from tray on tray icon click
  tray.on("click", () => {
    win?.show();
  });

  win.on("leave-full-screen", () => {
    // if (!isDev) {
    win?.webContents.send("hide-cursor");
    // }
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("before-quit", () => {
  if (tray) {
    tray.destroy();
  }
});

app.whenReady().then(createWindow);