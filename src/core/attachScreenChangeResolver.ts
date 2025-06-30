import { BrowserWindow, screen } from "electron";

type WindowDimensions = {
  expanded: {
    width: number;
    height: number;
  };
  collapsed: {
    width: number;
    height: number;
  };
};

export const repositionWindow = (overlayWindow: BrowserWindow | null, windowDimensions: WindowDimensions, isExpanded: boolean) => {
  if (!overlayWindow) {
    console.warn("Overlay window is not defined.");
    return;
  }

  console.log("Repositioning overlay window...");

  const display = screen.getDisplayMatching(overlayWindow.getBounds());
  const { x, y, width, height } = display.bounds;

  // x and y here are global desktop space
  let newX, newY, newWidth, newHeight;
  if (isExpanded) {
    newX = x + width - windowDimensions.expanded.width - 4; // Align to the right
    newY = y + (height - windowDimensions.expanded.height) / 2; // Center vertically
    newWidth = windowDimensions.expanded.width;
    newHeight = windowDimensions.expanded.height;
  } else {
    newX = x + 2; // Align to the right
    newY = y + height - windowDimensions.collapsed.height - 2; // Align to the bottom
    newWidth = windowDimensions.collapsed.width;
    newHeight = windowDimensions.collapsed.height;
  }

  overlayWindow.setBounds({ x: newX, y: newY, width: newWidth, height: newHeight });
};

export default function attachScreenChangeResolver(overlayWindow: BrowserWindow, windowDimensions: WindowDimensions, isExpanded: boolean = true) {
  screen.on("display-added", () => repositionWindow(overlayWindow, windowDimensions, isExpanded));
  screen.on("display-removed", () => repositionWindow(overlayWindow, windowDimensions, isExpanded));
  screen.on("display-metrics-changed", () => repositionWindow(overlayWindow, windowDimensions, isExpanded));

  repositionWindow(overlayWindow, windowDimensions, isExpanded);
}
