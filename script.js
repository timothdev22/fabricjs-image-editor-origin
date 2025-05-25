try {
  // define toolbar buttons to show
  // if this value is undefined or its length is 0, default toolbar buttons will be shown
  const buttons = [
    'select',
    'shapes',
    // 'draw',
    'line',
    // 'path',
    'textbox',
    // 'upload',
    'background',
    'undo',
    'redo',
    'save',
    'download',
    // 'clear',
    'images',
    // 'fullscreen',
    'templates',
    // 'animation',
    // 'frames'
  ];

  // define custom shapes
  // if this value is undefined or its length is 0, default shapes will be used
  const shapes = [];

  // define custom images
  // if this value is undefined or its length is 0, default images will be used
  const images = [
    `screenshots/astronaut.png`,
  ];

  const templates = [
    
  ];

  // define custom fonts
  const fonts = [
    {
      name: 'WorkSans',
      path: 'fonts/WorkSans/WorkSans-Regular.ttf',
      style: 'normal',
      weight: 'normal'
    },
    {
      name: 'WorkSans',
      path: 'fonts/WorkSans/WorkSans-Bold.ttf', 
      style: 'normal',
      weight: 'bold'
    },
    {
      name: 'WorkSans',
      path: 'fonts/WorkSans/WorkSans-Italic.ttf',
      style: 'italic',
      weight: 'normal'
    },
    {
      name: 'WorkSans',
      path: 'fonts/WorkSans/WorkSans-BoldItalic.ttf',
      style: 'italic',
      weight: 'bold'
    }   
  ];

  // define options
  const options = {
    buttons: buttons,
    shapes: shapes,
    images: images,
    dimensions: {
      width: 1360,
      height: 768
    },
    templates: templates,
    canvasSizeBlock: true,
    fonts: fonts,
    fixedCanvas: true // By default, the canvas is dynamic
  };

  document.fonts.ready.then(() => {
    var imgEditor = new ImageEditor('#image-editor-container', options);
    console.log('initialize image editor');

    let status = imgEditor.getCanvasJSON();
    imgEditor.setCanvasStatus(status);
  });

} catch (_) {
  const browserWarning = document.createElement('div')
  browserWarning.innerHTML = '<p style="line-height: 26px; margin-top: 100px; font-size: 16px; color: #555">Your browser is out of date!<br/>Please update to a modern browser, for example:<a href="https://www.google.com/chrome/" target="_blank">Chrome</a>!</p>';

  browserWarning.setAttribute(
    'style',
    'position: fixed; z-index: 1000; width: 100%; height: 100%; top: 0; left: 0; background-color: #f9f9f9; text-align: center; color: #555;'
  )

  // check for flex and grid support
  let divGrid = document.createElement('div')
  divGrid.style['display'] = 'grid'
  let supportsGrid = divGrid.style['display'] === 'grid'

  let divFlex = document.createElement('div')
  divFlex.style['display'] = 'flex'
  let supportsFlex = divFlex.style['display'] === 'flex'

  if (!supportsGrid || !supportsFlex) {
    document.body.appendChild(browserWarning)
  }
}
