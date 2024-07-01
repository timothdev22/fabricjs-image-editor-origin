const path = require('path');

module.exports = {
    entry: [
        './lib/core.js',
        './lib/toolbar.js',
        './lib/canvas.js',
        './lib/shapes.js',
        './lib/images.js',
        './lib/freeDrawSettings.js',
        './lib/canvasSettings.js',
        './lib/selectionSettings.js',
        './lib/drawingLine.js',
        './lib/drawingPath.js',
        './lib/drawingText.js',
        './lib/tip.js',
        './lib/upload.js',
        './lib/copyPaste.js',
        './lib/utils.js',
        './lib/zoom.js',
        './lib/saveInBrowser.js'
    ],
    output: {
        filename: 'fabricjs-image-editor-origin.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development', // Altere para 'production' para minificação
};
