/**
 * Canvas section management of image editor
 */
(function () {
  'use strict';

  var canvas = function () {

    const _self = this;

    try {
      $(`${this.containerSelector} .main-panel`).append(`<div class="canvas-holder" id="canvas-holder"><div class="content"><canvas id="c"></canvas></div></div>`);

      fabric.Object.prototype.toObject = (function(toObject) {
        return function(properties) {
          var obj = toObject.call(this, properties);
          obj.animation = this.animation;
          return obj;
        };
      })(fabric.Object.prototype.toObject);     

      fabric.Object.prototype.initialize = (function (initialize) {
        return function (options) {
          initialize.call(this, options);
          this.animation = options.animation || null;  // Definindo um valor padrão
        };
      })(fabric.Object.prototype.initialize); 

      fabric.Object.prototype.originX = "center";
      fabric.Object.prototype.originY = "center";

      const fabricOptions = { 
        renderOnAddRemove: false
      };
      const fabricCanvas = new fabric.Canvas('c', fabricOptions).setDimensions(this.dimensions)

      fabricCanvas.originalW = fabricCanvas.width;
      fabricCanvas.originalH = fabricCanvas.height;

      // set up selection style
      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerStyle = 'circle';
      fabric.Object.prototype.borderColor = '#C00000';
      fabric.Object.prototype.cornerColor = '#C00000';
      fabric.Object.prototype.cornerStrokeColor = '#FFF';
      fabric.Object.prototype.padding = 0;

      // set up selection controls
      fabric.Object.prototype.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: -16,
        offsetX: -10,
        cursorStyle: 'pointer',
        mouseUpHandler: this.deleteObject,
        render: this.renderIcon("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath d='M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z' fill='%234c4c4c'/%3E%3C/svg%3E"),
        cornerSize: 16
      });

      fabric.Object.prototype.controls.clone = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: -16,
        offsetX: -36,
        cursorStyle: 'pointer',
        mouseUpHandler: this.cloneObject,
        render: this.renderIcon("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M288 448H64V224h64V160H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H288v64zm-64-96H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64z' fill='%234c4c4c' /%3E%3C/svg%3E"),
        cornerSize: 16
      });

      fabricCanvas.preserveObjectStacking = true;

      // retrieve active selection to react state
      fabricCanvas.on('selection:created', (e) => this.setActiveSelection(e.selected))
      fabricCanvas.on('selection:updated', (e) => this.setActiveSelection(e.selected))
      fabricCanvas.on('selection:cleared', (e) => this.setActiveSelection(null))

      // snap to an angle on rotate if shift key is down
      fabricCanvas.on('object:rotating', (e) => {
        if (e.e.shiftKey) {
          e.target.snapAngle = 15;
        } else {
          e.target.snapAngle = false;
        }
      })

      // add angle text to object
      fabricCanvas.on('object:rotating', (e) => {       

        var obj = e.target;
        var angle = Math.round(obj.angle); // Rounds the angle for display
      
        // Creates or updates the angle text
        if (!obj.angleText) {
          // Creates the text
          var text = new fabric.Text(angle + '°', {
            fontSize: 18,
            fill: 'white',
            fontFamily: 'sans-serif',
            originX: 'center',
            originY: 'center'
          });
      
          // Creates a rectangle as background with padding and borders
          var bgRect = new fabric.Rect({
            fill: '#333333', 
            width: text.width + 20, // Text width + padding
            height: text.height + 20, // Text height + padding
            rx: 5, // Horizontal border-radius
            ry: 5, // Vertical border-radius
            stroke: 'white',
            strokeWidth: 1,
            originX: 'center',
            originY: 'center'
          });
      
          // Groups text and rectangle
          obj.angleText = new fabric.Group([bgRect, text], {
            originX: 'center',
            originY: 'center'
          });
          fabricCanvas.add(obj.angleText);
        } else {
          // Updates text and rectangle size
          var text = obj.angleText.item(1);
          var bgRect = obj.angleText.item(0);
          text.set('text', angle + '°'); // Updates the text
          bgRect.set({
            width: text.width + 20,
            height: text.height + 20
          });
          obj.angleText.setCoords(); // Recalculates group coordinates
        }
      
        // Positions the text near the object
        obj.angleText.set({
          left: obj.left , // Centers horizontally considering scale
          top: obj.top - 10 // Positions above the object (adjust distance as needed)
        });
        fabricCanvas.renderAll();

      })

      

      fabricCanvas.on('mouse:up', function(options) {
        if (fabricCanvas.getActiveObject() && fabricCanvas.getActiveObject().angleText) {
          fabricCanvas.remove(fabricCanvas.getActiveObject().angleText);
          fabricCanvas.getActiveObject().angleText = null;
          fabricCanvas.renderAll();
        }
      });

      fabricCanvas.on('object:moving', (e) => {
        var obj = e.target;
        this.handleObjectMoving(fabricCanvas, obj);
        // this.onObjectMoving(fabricCanvas, obj);
      })      

      fabricCanvas.on('object:modified', () => {
        if (this.canvas) {
          let currentState = this.canvas.toJSON();
            if (this.history) {
                this.history.push(JSON.stringify(currentState));
            } else {
                console.error("History (this.history) is not defined.");
            }
        } else {
            console.error("Canvas (this.canvas) is not defined.");
        }
        this.clearGuidesline(fabricCanvas);
      })
      

      // Verificar se saveInBrowser foi carregado corretamente antes de usá-lo
      let savedCanvas = null;
      if (window.saveInBrowser) {
        try {
          savedCanvas = window.saveInBrowser.load('canvasEditor');
          if (savedCanvas) {
            console.log('loading canvas from local storage', savedCanvas);
            fabricCanvas.loadFromJSON(savedCanvas, fabricCanvas.renderAll.bind(fabricCanvas));
          }
        } catch (error) {
          console.error('Erro ao carregar canvas salvo:', error);
        }
      } else {
        console.warn('saveInBrowser não está disponível. O canvas não será carregado do armazenamento local.');
      }

      // move objects with arrow keys
      (() => document.addEventListener('keydown', (e) => {
        const key = e.which || e.keyCode;
        let activeObject;

        if (document.querySelectorAll('textarea:focus, input:focus').length > 0) return;

        if (key === 37 || key === 38 || key === 39 || key === 40) {
          e.preventDefault();
          activeObject = fabricCanvas.getActiveObject();
          if (!activeObject) {
            return;
          }
        }

        if (key === 37) {
          activeObject.left -= 1;
        } else if (key === 39) {
          activeObject.left += 1;
        } else if (key === 38) {
          activeObject.top -= 1;
        } else if (key === 40) {
          activeObject.top += 1;
        }

        if (key === 37 || key === 38 || key === 39 || key === 40) {
          activeObject.setCoords();
          fabricCanvas.renderAll();
          fabricCanvas.fire('object:modified');
        }
      }))();

      // delete object on del key
      (() => {
        document.addEventListener('keydown', (e) => {
          const key = e.which || e.keyCode;
          if (
            key === 46 &&
            document.querySelectorAll('textarea:focus, input:focus').length === 0
          ) {

            fabricCanvas.getActiveObjects().forEach(obj => {
              fabricCanvas.remove(obj);
            });

            fabricCanvas.discardActiveObject().requestRenderAll();
            fabricCanvas.fire('object:modified')
          }
        })
      })();

      // remove selection on click outside canvas
      (() => {
        document.addEventListener('mousedown', (event) => {
          const canvasElement = document.getElementById('canvas-holder');
          if (canvasElement == event.target) {
            fabricCanvas.discardActiveObject();
            fabricCanvas.renderAll();
          }
        })
      })();

      setTimeout(() => {
        let currentState = fabricCanvas.toJSON();
        if (this.history) {
          this.history.push(JSON.stringify(currentState));
        }
      }, 1000);

      // Inicializar o componente de réguas após o canvas estar pronto
      this.canvas = fabricCanvas;
      if (this.initRulerComponent) {
        this.initRulerComponent();
      } else {
        console.warn('initRulerComponent não está disponível');
      }
      
      // Configurar o componente de réguas após o canvas estar pronto
      setTimeout(() => {
        if (this.setupRulerAfterCanvasReady) {
          this.setupRulerAfterCanvasReady();
        } else {
          console.warn('setupRulerAfterCanvasReady não está disponível');
        }
      }, 500);

      return fabricCanvas;
    } catch (error) {
      console.error("can't create canvas instance", error);
      return null;
    }
  }

  window.ImageEditor.prototype.initializeCanvas = canvas;
})();