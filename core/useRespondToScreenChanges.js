import { BrowserWindow, screen } from "electron";

/**
 * 
 * @param {BrowserWindow} overlayWindow
 */
export default function attachScreenChangeResolver(overlayWindow) {
    const repositionWindow = () => {
        const display = screen.getPrimaryDisplay();
        const { width, height } = display.bounds;

        const windowWidth = 220;
        const windowHeight = 520;

        const x = width - windowWidth - 4;
        const y = (height - windowHeight) / 2;

        overlayWindow.setBounds({ x, y, width: windowWidth, height: windowHeight });
    };

    screen.on("display-added", repositionWindow);
    screen.on("display-removed", repositionWindow);
    screen.on("display-metrics-changed", repositionWindow);
    
    repositionWindow();
}