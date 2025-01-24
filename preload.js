const { contextBridge, ipcRenderer } = require("electron");

// Expose APIs to the renderer process
contextBridge.exposeInMainWorld("electron", {
  onResourceUsage: (callback) => ipcRenderer.on("resource-usage", (event, data) => callback(data)),
  minimizeWindow: () => ipcRenderer.send("minimize-window"),
  getSystemHost: () => ipcRenderer.invoke("get-system-host"),
  closeWindow: () => ipcRenderer.send("close-window"),
  removeListener: (channel, callback) => ipcRenderer.removeListener(channel, callback),
});