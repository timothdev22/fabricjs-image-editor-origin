/**
 * The Core of Image Editor
 */
(function () {
  'use strict';

  /**
   * Image Editor class
   * @param {String} containerSelector jquery selector for image editor container
   * @param {Array} buttons define toolbar buttons 
   * @param {Array} shapes define shapes
   * @param {Array} images define images
   * @param {Array} templates define templates
   * @param {Array} fonts define custom fonts
   * @param {Boolean} fixedCanvas define if canvas holder should have fixed width
   */
  var ImageEditor = function (containerSelector,  options) {
    const {buttons, shapes, images, dimensions, api, templates, canvasSizeBlock = false, fonts = [], fixedCanvas = false } = options
    
    this.containerSelector = containerSelector;
    this.containerEl = $(containerSelector);
    
    this.dimensions = {
      width: dimensions && dimensions.width > 0 ? dimensions.width : 800,
      height: dimensions && dimensions.height > 0 ? dimensions.height :600
    }
    this.buttons = buttons;
    this.shapes = shapes;
    this.images = images;
    this.templates = templates;
    this.fonts = fonts;
    this.fixedCanvas = fixedCanvas;

    this.api = {
      upload: api && api.upload ? api.upload : null
    };
    
    this.containerEl.addClass('default-container');

    this.canvas = null;
    this.activeTool = null;
    this.activeSelection = null;
    this.canvasSizeBlock = canvasSizeBlock === true ? true : false;

    /**
     * Load custom fonts
     */
    this.loadCustomFonts = async () => {
      const fontPromises = this.fonts.map(font => {
        const fontFace = new FontFace(font.name, `url(${font.path})`, {
          style: font.style || 'normal',
          weight: font.weight || 'normal'
        });
        return fontFace.load().then(loadedFont => {
          document.fonts.add(loadedFont);
          return loadedFont;
        });
      });

      try {
        await Promise.all(fontPromises);
      } catch (error) {
        console.error('Error loading custom fonts:', error);
      }
    };

    /**
     * Get current state of canvas as object
     * @returns {Object}
     */
   this.getCanvasJSON = () => {
  if (!this.canvas) {
    console.error('Canvas is not initialized!');
    return null;
  }
  return this.canvas.toJSON();
};

    /**
     * Set canvas status by object
     * @param {Object} current the object of fabric canvas status
     */
    this.setCanvasJSON = (current) => {
      current && this.canvas.loadFromJSON(JSON.parse(current), this.canvas.renderAll.bind(this.canvas))
    }

    /**
     * Event handler to set active tool
     * @param {String} id tool id
     */
    this.setActiveTool = (id) => {     
      
      $(`${containerSelector} .toolpanel`).removeClass('visible');  

      if (this.activeSelection && this.activeSelection.metadata && (this.activeSelection.metadata.isGuide || this.activeSelection.metadata.isRuler || this.activeSelection.metadata.isMargin)) {        
        this.activeTool = null;        
        this.activeSelection = null;        
        return;
      }

      this.activeTool = id;

      if (id === 'select' && this.activeSelection) {
        $(`${containerSelector} .toolbar .active`).removeClass('active');
        $(`${containerSelector} .toolpanel#${id}-panel`)
          .attr('class', `toolpanel visible type-${this.activeSelection.type}`)
          .addClass('visible');
        this.setSelectionValues();
      } else {
        
        $(`${containerSelector} .toolpanel#${id}-panel`).addClass('visible');
       
        this.canvas.discardActiveObject();
        this.canvas.renderAll();
        this.activeSelection = null;
      }

      this.canvas.isDrawingLineMode = false;
      this.canvas.isDrawingPathMode = false;
      this.canvas.isDrawingMode = false;
      this.canvas.isDrawingTextMode = false;

      this.canvas.defaultCursor = 'default';
      this.canvas.selection = true;
      this.canvas.forEachObject(o => {
        o.selectable = true;
        o.evented = true;
      })

      switch (id) {
        case 'draw':
          this.canvas.isDrawingMode = true;
          break;
        case 'line':
          this.canvas.isDrawingLineMode = true
          this.canvas.defaultCursor = 'crosshair'
          this.canvas.selection = false
          this.canvas.forEachObject(o => {
            o.selectable = false
            o.evented = false
          });
          break;
        case 'path':
          this.canvas.isDrawingPathMode = true
          this.canvas.defaultCursor = 'crosshair'
          this.canvas.selection = false
          this.canvas.forEachObject(o => {
            o.selectable = false
            o.evented = false
          });
          this.updateTip('Tip: click to place points, press and pull for curves! Click outside or press Esc to cancel!');
          break;
        case 'textbox' || 'i-text':
          this.canvas.isDrawingTextMode = true
          this.canvas.defaultCursor = 'crosshair'
          this.canvas.selection = false
          this.canvas.forEachObject(o => {
            o.selectable = false
            o.evented = false
          });
          break;
        case 'upload':
          this.openDragDropPanel();
          break;
        default:
          this.updateTip('Tip: hold Shift when drawing a line for 15° angle jumps!');
          break;
      }
    }

    /**
     * Event handler when perform undo
     */
    this.undo = () => {
      console.log('undo')
      try {
        let undoList = this.history.getValues().undo;
        if (undoList.length) {
          let current = undoList[undoList.length - 1];
          this.history.undo();
          current && this.canvas.loadFromJSON(JSON.parse(current), this.canvas.renderAll.bind(this.canvas))
        }
      } catch (_) {
        console.error("undo failed")
      }
    }

    /**
     * Event handler when perform redo
     */
    this.redo = () => {
      console.log('redo')
      try {
        let redoList = this.history.getValues().redo;
        if (redoList.length) {
          let current = redoList[redoList.length - 1];
          this.history.redo();
          current && this.canvas.loadFromJSON(JSON.parse(current), this.canvas.renderAll.bind(this.canvas))
        }
      } catch (_) {
        console.error("redo failed")
      }
    }

    /**
     * Event handler when select objects on fabric canvas
     * @param {Object} activeSelection fabric js object
     */
    this.setActiveSelection = (activeSelection) => { 
      this.activeSelection = activeSelection && activeSelection[0] ? activeSelection[0] : activeSelection;
      if(this.activeSelection) {
        this.setActiveTool('select');
      }
    }

    /**
     * Initialize undo/redo stack
     */
    this.configUndoRedoStack = () => {
      this.history = window.UndoRedoStack();
      const ctrZY = (e) => {
        const key = e.which || e.keyCode;

        if (e.ctrlKey && document.querySelectorAll('textarea:focus, input:focus').length === 0) {
          if (key === 90) this.undo()
          if (key === 89) this.redo()
        }
      }
      document.addEventListener('keydown', ctrZY)
    }    

    /**
     * Initialize image editor
     */
    this.init = async () => {
      // Carregar fontes personalizadas antes de inicializar
      await this.loadCustomFonts();
      
      // Inicializar o componente de réguas
      this.initializeRuler();
      
      this.configUndoRedoStack();

      this.initializeToolbar();
      this.initializeMainPanel();

      this.initializeShapes();
      this.initializeImages();
      try {
        this.initializeTemplates();
      } catch (error) {
        console.error("can't initialize templates", error);        
      }
      
      this.initializeFreeDrawSettings();
      this.initializeCanvasSettingPanel();
      this.initializeSelectionSettings();

      this.canvas = this.initializeCanvas();

      // Aplicar estilo fixo ao canvas-holder se necessário
      if (this.fixedCanvas) {      
        $(`${this.containerSelector} #canvas-holder`).addClass('fixed-canvas');
      }

      this.initializeLineDrawing(this.canvas);
      this.initializePathDrawing(this.canvas);
      this.initializeTextBoxDrawing(this.canvas);
      this.initializeUpload(this.canvas);
      this.initializeCopyPaste(this.canvas);
      this.initializeAnimations(this.canvas);

      this.initializeTipSection();

      this.initializeUtilsEvents()

      this.initializeZoomEvents();
      this.initializeLayers();
      this.initializeFullscreenEvents();

      this.initializeNotification()

      this.extendHideShowToolPanel();
      this.extendNumberInput();
      
      this.fitZoom()
    }

    /**
     * Initialize main panel 
     */
    this.initializeMainPanel = () => {
      $(`${containerSelector}`).append('<div class="main-panel"></div>');
    }

    /**
     * Add features to hide/show tool panel
     */
    this.extendHideShowToolPanel = () => {
      $(`${this.containerSelector} .toolpanel`).each(function () {
        $(this).append(`<div class="hide-show-handler"></div>`)
      })

      $(`${this.containerSelector} .toolpanel  .hide-show-handler`).click(function () {
        let panel = $(this).closest('.toolpanel');
        panel.toggleClass('closed');
      })
    }

    /**
     * Extend custom number input with increase/decrease button
     */
    this.extendNumberInput = () => {
      $(`${containerSelector} .decrease`).click(function () {
        let input = $(this).closest('.custom-number-input').find('input[type=number]')
        let step = input.attr('step');
        if (!step) step = 1;
        else {
          step = parseFloat(step);
        }
        let val = parseFloat(input.val());
        input.val((val - step).toFixed(step.countDecimals()));
        input.change();
      })
      $(`${containerSelector} .increase`).click(function () {
        let input = $(this).closest('.custom-number-input').find('input[type=number]')
        let step = input.attr('step');
        if (!step) step = 1;
        else {
          step = parseFloat(step);
        }
        let val = parseFloat(input.val());
        input.val((val + step).toFixed(step.countDecimals()));
        input.change();
      })
    } 
    
    this.deleteObject = (eventData, transform) => {
      var target = transform.target;
      var canvas = target.canvas;
      canvas.remove(target);
      canvas.requestRenderAll();
    }

    this.cloneObject = (eventData, transform) => {
      var target = transform.target;
      var canvas = target.canvas;
      target.clone(function(cloned) {
        cloned.left += 10;
        cloned.top += 10;
        canvas.add(cloned);
      });
    }

    this.renderIcon = (icon) => {
      var Img = document.createElement('img');
      Img.src = icon;
      return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        var img = Img; // Referência à imagem
        var originalWidth = img.naturalWidth; // Largura original da imagem
        var originalHeight = img.naturalHeight; // Altura original da imagem
        var cornerSize = this.cornerSize; // Tamanho do canto

        // Calcula a proporção da imagem
        var aspectRatio = originalWidth / originalHeight;

        // Ajusta a altura e largura com base na proporção e no tamanho do canto
        var width = cornerSize;
        var height = width / aspectRatio;

        // Se a altura for maior que o tamanho do canto, ajusta a largura
        if (height > cornerSize) {
          height = cornerSize;
          width = height * aspectRatio;
        }

        // Desenha a imagem na tela
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.restore();
      }
    }    

    this.init();
  }

  ImageEditor.prototype.destroy = function () {
    // Remove all added event listeners
    $(document).off('keydown', this.ctrZY);

    // Clear all DOM elements created by the editor
    $(this.containerSelector).empty();
    
    // Remove references to free up memory
    this.canvas = null;
    this.activeTool = null;
    this.activeSelection = null;
  };

  window.ImageEditor = ImageEditor;
})();