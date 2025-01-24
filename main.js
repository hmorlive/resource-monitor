import { app, BrowserWindow, ipcMain, screen } from "electron";
import path from "path";
import si from "systeminformation";
import { getNetworkMbps } from "./core/getSysInfo.js";
import serve from 'electron-serve';

const loadURL = serve({directory: 'renderer'});

let overlayWindow;

app.on("ready", () => {
  // Get screen dimensions
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.bounds;

  // Define window dimensions
  const windowWidth = 220;
  const windowHeight = 520;

  // Calculate position for the right side of the screen
  const x = width - windowWidth - 4; // Align to the right
  const y = (height - windowHeight) / 2; // Center vertically

  // Create the browser window
  overlayWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x, // Set horizontal position
    y, // Set vertical position
    frame: false, // Frameless window
    title: "ReMon",
    transparent: true, // Transparent background
    alwaysOnTop: true, // Always stays on top
    resizable: false, // Disable resizing
    webPreferences: {
      preload: path.join(app.getAppPath(), "preload.js"), // Absolute path for the preload script
      contextIsolation: true, // Recommended for security
      devTools: false
    },
    icon: path.join(app.getAppPath(), "build/128x128.png"),
  });

  loadURL(overlayWindow);

  // ignore mouse events
  //overlayWindow.setIgnoreMouseEvents(true, { forward: true });

  setInterval(async () => {
    try {
      const memory = await si.mem();
      const storage = await si.fsSize();
      const cpuLoad = await si.currentLoad();
      const cpuTemp = await si.cpuTemperature();

      // Identify the primary drive (root mount point or highest usage)
      const primaryStorage =
        storage.find((drive) =>
          process.platform === "win32"
            ? drive.mount === "C:\\"
            : drive.mount === "/"
        ) || storage[0]; // Fallback to the first drive if no root is found

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
