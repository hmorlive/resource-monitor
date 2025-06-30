import { app, BrowserWindow, ipcMain, Menu, nativeImage, screen, Tray } from "electron";
import path from "path";
import si from "systeminformation";
import { getNetworkMbps } from "./core/getSysInfo.js";
import serve from "electron-serve";
import attachScreenChangeResolver, { repositionWindow } from "./core/attachScreenChangeResolver";

const isProd = process.env.NODE_ENV === "prod";
const loadURL = serve({ directory: "renderer" });

let overlayWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isExpanded = false;
let isVisible = true;

const EXPANDED_WINDOW_WIDTH = 220;
const EXPANDED_WINDOW_HEIGHT = 460;
const COLLAPSED_WINDOW_WIDTH = 500; // Collapsed width
const COLLAPSED_WINDOW_HEIGHT = 50; // Collapsed height

const windowDimensions = {
  expanded: {
    width: EXPANDED_WINDOW_WIDTH,
    height: EXPANDED_WINDOW_HEIGHT,
  },
  collapsed: {
    width: COLLAPSED_WINDOW_WIDTH,
    height: COLLAPSED_WINDOW_HEIGHT,
  },
};

app.commandLine.appendSwitch("wm-class", "non-taskbar-window"); // Hide from taskbar on Linux

app.on("ready", () => {
  // Get screen dimensions
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.bounds;

  // Calculate position for the right side of the screen
  const x = width - EXPANDED_WINDOW_WIDTH - 4; // Align to the right
  const y = height - EXPANDED_WINDOW_HEIGHT / 2; // Center vertically

  // Create the browser window
  overlayWindow = new BrowserWindow({
    width: EXPANDED_WINDOW_WIDTH,
    height: EXPANDED_WINDOW_HEIGHT,
    x, // Set horizontal position
    y, // Set vertical position
    frame: false, // Frameless window
    title: "ReMon",
    skipTaskbar: true, // Hide from taskbar
    transparent: true, // Transparent background
    alwaysOnTop: true, // Always stays on top
    focusable: false, // Not focusable by default
    resizable: false, // Disable resizing
    type: "utility", // Window type
    webPreferences: {
      preload: path.join(app.getAppPath(), "preload.js"), // Absolute path for the preload script
      contextIsolation: true, // Recommended for security
      devTools: !!isProd, // Enable DevTools in development mode
    },
    icon: nativeImage.createFromPath(path.join(app.getAppPath(), "public", "icon.ico")),
  });

  overlayWindow.setIgnoreMouseEvents(true, { forward: true }); // Ignore mouse events, but allow forwarding
  isProd ? loadURL(overlayWindow) : overlayWindow.loadURL("http://localhost:3000");

  // overlay position utility
  attachScreenChangeResolver(overlayWindow, windowDimensions, isExpanded);

  setInterval(async () => {
    try {
      const memory = await si.mem();
      const storage = await si.fsSize();
      const cpuLoad = await si.currentLoad();
      const cpuTemp = await si.cpuTemperature();

      // Identify the primary drive (root mount point or highest usage)
      const primaryStorage = storage.find((drive) => (process.platform === "win32" ? drive.mount === "C:\\" : drive.mount === "/")) || storage[0]; // Fallback to the first drive if no root is found

      // Send resource usage to the renderer process
      if (overlayWindow && !overlayWindow.isDestroyed()) {
        overlayWindow.webContents.send("resource-usage", {
          memory: {
            total: memory.total,
            used: memory.used - memory.buffcache,
            buffCache: memory.cached + memory.buffcache,
          },
          storage: {
            total: primaryStorage.size,
            used: primaryStorage.used,
            mount: primaryStorage.mount,
            type: primaryStorage.type,
          },
          cpu: {
            load: cpuLoad?.currentLoad,
            temp: cpuTemp.main,
          },
          network: await getNetworkMbps(),
        });
      }
    } catch (error) {
      console.error("Error fetching resource usage:", error);
    }
  }, 250); // Send stats every 250ms
});

function trayMenuExpamnsionToggleHandler() {
  isExpanded = !isExpanded;
  repositionWindow(overlayWindow, windowDimensions, isExpanded);
  overlayWindow?.webContents.send("expansion-change", isExpanded);
  updateTrayMenu();
}

function toggleWindowVisibility() {
  if (overlayWindow) {
    if (isVisible) {
      overlayWindow.hide();
    } else {
      overlayWindow.show();
      repositionWindow(overlayWindow, windowDimensions, isExpanded);
    }
    isVisible = !isVisible;
    updateTrayMenu();
  }
}

function updateTrayMenu() {
  if (!tray) return;
  const contextMenu = Menu.buildFromTemplate([
    {
      label: isExpanded ? "Collapse" : "Expand",
      click: trayMenuExpamnsionToggleHandler,
    },
        { type: "separator" },
    {
      label: isVisible ? "Hide" : "Show",
      click: toggleWindowVisibility,
    },
    { type: "separator" },
    { label: "Quit", click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);
}

// create tray icon when app is ready
app.whenReady().then(() => {
  try {
    const icon = nativeImage.createFromPath(path.join(app.getAppPath(), "public", "icon.png"));
    tray = new Tray(icon);
    updateTrayMenu();
  } catch (error) {
    console.error("Error creating tray icon:", error);
  }
});

// Handle app quitting behavior
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Handle minimizing the app
ipcMain.on("minimize-window", () => {
  if (overlayWindow) {
    overlayWindow.minimize();
  }
});

// Handle closing the app
ipcMain.on("close-window", () => {
  if (overlayWindow) {
    overlayWindow.close();
  }
});

// Handle getting host name
ipcMain.handle("get-system-host", async () => {
  try {
    const osInfo = await si.osInfo();
    const host = osInfo.hostname;
    return host;
  } catch (error) {
    console.error("Error fetching host name:", error);
  }
});

app.on("before-quit", () => {
  if (tray) {
    tray.destroy();
    tray = null;
  }
  if (overlayWindow) {
    overlayWindow.destroy();
    overlayWindow = null;
  }
});
