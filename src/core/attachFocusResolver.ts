import { BrowserWindow } from "electron";

export default function attachFocusResolver(overlayWindow: BrowserWindow) {
  // Attach focus event listener to the overlay window
  overlayWindow.on("focus", () => {
    
  });

  // Attach blur event listener to the overlay window
  overlayWindow.on("blur", () => {
    overlayWindow.setAlwaysOnTop(true);
  });
}
