const path = require('path');

module.exports = {
    entry: [
        './vendor/context-menu.js',
        './lib/core.js',
        './lib/utils.js',
        './lib/saveInBrowser.js',
        './lib/toolbar.js',
        './lib/canvas.js',
        './lib/shapes.js',
        './lib/images.js',
        './lib/templates.js',
        './lib/freeDrawSettings.js',
        './lib/canvasSettings.js',
        './lib/selectionSettings.js',
        './lib/drawingLine.js',
        './lib/drawingPath.js',
        './lib/drawingText.js',
        './lib/tip.js',
        './lib/upload.js',
        './lib/copyPaste.js',
        './lib/zoom.js',
        './lib/ruler.js',
        './lib/fullscreen.js',
        './lib/notification.js',
        './lib/animation.js',
        './lib/frames.js',
        './lib/style.css'
    ],
    output: {
        filename: 'fabricjs-image-editor-origin.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    mode: 'development', // Altere para 'production' para minificação
};
