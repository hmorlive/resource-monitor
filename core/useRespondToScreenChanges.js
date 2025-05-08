import { BrowserWindow, screen } from "electron";

/**
 * 
 * @param {BrowserWindow} overlayWindow
 */
export default function attachScreenChangeResolver(overlayWindow) {
    const repositionWindow = () => {
        const display = screen.getDisplayMatching(overlayWindow.getBounds());
        const { x, y, width, height } = display.bounds;
        
        const windowWidth = 220;
        const windowHeight = 520;
        
        // x and y here are global desktop space
        const newX = x + width - windowWidth - 6;
        const newY = y + (height - windowHeight) / 2;
        
        overlayWindow.setBounds({ x: newX, y: newY, width: windowWidth, height: windowHeight });        
    };

    screen.on("display-added", repositionWindow);
    screen.on("display-removed", repositionWindow);
    screen.on("display-metrics-changed", repositionWindow);

    repositionWindow();
}