"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = attachFocusResolver;
function attachFocusResolver(overlayWindow) {
    // Attach focus event listener to the overlay window
    overlayWindow.on("focus", () => {
    });
    // Attach blur event listener to the overlay window
    overlayWindow.on("blur", () => {
        overlayWindow.setAlwaysOnTop(true);
    });
}
