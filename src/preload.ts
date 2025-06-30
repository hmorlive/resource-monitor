const { contextBridge, ipcRenderer } = require("electron");

// Expose APIs to the renderer process
contextBridge.exposeInMainWorld("electron", {
  onResourceUsage: (callback: (data: any) => Promise<void>) => ipcRenderer.on("resource-usage", (event: Event, data: any) => callback(data)),
  getSystemHost: () => ipcRenderer.invoke("get-system-host"),
  onExpansionChange: (callback: (isExpanded: boolean) => void) => ipcRenderer.on("expansion-change", (event: Event, isExpanded: boolean) => callback(isExpanded)),
  removeListener: (channel: string, callback: (data: any) => Promise<void>) => ipcRenderer.removeListener(channel, callback),
  setHoverState: (isHovering: boolean) => ipcRenderer.send("hover-state", isHovering),
});