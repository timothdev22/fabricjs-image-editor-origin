
// ...existing code...

const llm_json = {
  topic: "Health Benefits of Apples",
  subtopics: [
    {
      title: "Nutrient-Dense Fruit",
      content: "Apples are packed with nutrients and antioxidants (polyphenols). Eating the skin provides more fiber and polyphenols."
    },
    {
      title: "Weight Management Support",
      content: "High in fiber and water, apples promote fullness. Studies suggest apple intake may help lower Body Mass Index (BMI)."
    },
    {
      title: "Heart Health Benefits",
      content: "Linked to a lower chance of heart disease and stroke. Soluble fiber and polyphenols contribute to lower blood pressure."
    },
    {
      title: "Diabetes Risk Reduction",
      content: "Eating apples may decrease the risk of type 2 diabetes. The polyphenol quercetin may be responsible for this beneficial effect."
    },
    {
      title: "Gut Health Improvement",
      content: "Apples contain pectin, a prebiotic fiber that promotes the growth of beneficial gut bacteria. May help protect against chronic diseases."
    },
    {
      title: "Potential Cancer Prevention",
      content: "Apple polyphenols may help prevent cancerous cells from multiplying. Further clinical studies are needed to confirm this effect."
    },
    {
      title: "Improved Mental and Digestive Health",
      content: "Apples can help improve digestive diseases like GERD and constipation. Also, consuming fruits and vegetables like apples daily may improve mental health."
    }
  ]
};
function generateInfographic(template, llm) {
  const infographic = JSON.parse(JSON.stringify(template));

  let subtopicIdx = 0;
  let isTitleSet = false;

  infographic.objects = infographic.objects.map(obj => {
    if (obj.type === "i-text") {
      if (obj.text === "topic") {
        obj.text = llm.topic;
      } else if (obj.text === "title" && subtopicIdx < llm.subtopics.length) {
        obj.text = llm.subtopics[subtopicIdx].title;
        isTitleSet = true;
      } else if (obj.text === "content" && subtopicIdx < llm.subtopics.length) {
        obj.text = llm.subtopics[subtopicIdx].content;
        if (isTitleSet) {
          subtopicIdx++;
          isTitleSet = false;
        }
      }
    }
    return obj;
  });

  return infographic;
}
// ...existing code...

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
    'upload',
    'background',
    'undo',
    'redo',
    'save',
    'download',
    'clear',
    'images',
    'fullscreen',
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

document.fonts.ready.then(async () => {
  const imgEditor = new ImageEditor('#image-editor-container', options);
  console.log('initialize image editor');

  await imgEditor.ready; // ✅ Now this is valid// ✅ wait for editor canvas setup

  // ✅ Get initial status after the canvas is ready (no need to await .init)
  let status = imgEditor.getCanvasJSON();
  imgEditor.setCanvasStatus(status);

  // ✅ Generate infographic button
  document.getElementById('generate-infographic').addEventListener('click', function () {
    console.log('Templates Array:', imgEditor.templates);

    const templatesArr = imgEditor.templates;
    const template_json = (templatesArr && templatesArr.length > 0)
      ? JSON.parse(templatesArr[templatesArr.length - 1].data)
      : null;

    if (!template_json) {
      alert('No template found!');
      return;
    }

    console.log('Last Template JSON:', template_json);

    const finalJson = generateInfographic(template_json, llm_json);
    console.log('Modified Template JSON:', finalJson);

    // ✅ No need to manually call renderAll inside callback
    imgEditor.canvas.loadFromJSON(finalJson);
  });
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