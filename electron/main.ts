import { app, BrowserWindow, Menu, Tray } from "electron";
import path from "node:path";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │

process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

let tray: Tray | null;

const iconPath = path.join(process.env.VITE_PUBLIC, "weather.png");

// Hide dock icon on macOS
// app.dock.hide();

// console.log(path.join(__dirname, "dist-electron", "preload.js"));
console.log(path.join(__dirname, "../index.html"));

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 230,
    resizable: false,
    frame: false,
    alwaysOnTop: false,
    // Hide the window when it loses focus
    skipTaskbar: true,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }
  win.on("blur", () => {
    win?.webContents.send("out-of-window");
  });

  win.webContents.openDevTools();

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
  tray.setToolTip("Weather");
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
    win?.webContents.send("hide-cursor");
  });

  win.on("focus", () => {
    win?.webContents.send("focus-on-window");
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
