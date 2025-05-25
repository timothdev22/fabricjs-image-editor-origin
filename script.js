try {
  const buttons = [
    'templates',  // Templates first for default visibility
    'shapes',
    'line',
    'textbox',
    'background',
    'images',
    'undo',
    'redo',
    'save',
    'download'
  ];

  const shapes = [];
  const images = [
    `screenshots/astronaut.png`,
  ];
  const templates = [];

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
    fixedCanvas: true
  };

  document.fonts.ready.then(() => {
    var imgEditor = new ImageEditor('#image-editor-container', options);
    console.log('initialize image editor');

    let status = imgEditor.getCanvasJSON();
    imgEditor.setCanvasStatus(status);

    // Show templates panel by default
    setTimeout(() => {
      document.querySelector('#toolbar button#templates').click();
    }, 100);
  });

} catch (_) {
  const browserWarning = document.createElement('div');
  browserWarning.innerHTML = '<p style="line-height: 26px; margin-top: 100px; font-size: 16px; color: #555">Your browser is out of date!<br/>Please update to a modern browser, for example:<a href="https://www.google.com/chrome/" target="_blank">Chrome</a>!</p>';

  browserWarning.setAttribute(
    'style',
    'position: fixed; z-index: 1000; width: 100%; height: 100%; top: 0; left: 0; background-color: #f9f9f9; text-align: center; color: #555;'
  );

  let divGrid = document.createElement('div');
  divGrid.style['display'] = 'grid';
  let supportsGrid = divGrid.style['display'] === 'grid';

  let divFlex = document.createElement('div');
  divFlex.style['display'] = 'flex';
  let supportsFlex = divFlex.style['display'] === 'flex';

  if (!supportsGrid || !supportsFlex) {
    document.body.appendChild(browserWarning);
  }
}