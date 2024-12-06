/**
 * Define action to draw line by mouse actions
 */
(function () {
  var animation = function (fabricCanvas) {

    class FabricAnimations {
      constructor(canvas) {
        this.canvas = canvas;
      }

      // Animação: Slide (Deslizar)
      slideIn(obj, direction = 'left') {
        const startPosition = { left: obj.left, top: obj.top };
        if (direction === 'left') obj.left = -obj.width;
        if (direction === 'right') obj.left = this.canvas.width + obj.width;
        if (direction === 'top') obj.top = -obj.height;
        if (direction === 'bottom') obj.top = this.canvas.height + obj.height;

        obj.animate({ left: startPosition.left, top: startPosition.top }, {
          duration: 1000,
          easing: fabric.util.ease.easeOutCubic,
          onChange: this.canvas.renderAll.bind(this.canvas),
        });
      }

      // Animação: Fade (Desaparecer)
      fade(obj, opacity = 1) {
        obj.opacity = opacity === 1 ? 0 : obj.opacity; // Define opacidade inicial
        obj.animate('opacity', opacity, {
          duration: 1000,
          easing: fabric.util.ease.easeInOutQuad,
          onChange: this.canvas.renderAll.bind(this.canvas),
        });
      }

      // Animação: Zoom
      zoom(obj, scale = 2) {
        const startScale = obj.scaleX; // Guarda a escala inicial
        obj.animate({ scaleX: scale, scaleY: scale }, {
          duration: 1000,
          easing: fabric.util.ease.easeInOutCubic,
          onChange: this.canvas.renderAll.bind(this.canvas),
          onComplete: () => {
            obj.animate({ scaleX: startScale, scaleY: startScale }, { // Voltar ao tamanho original
              duration: 1000,
              easing: fabric.util.ease.easeInOutCubic,
              onChange: this.canvas.renderAll.bind(this.canvas),
            });
          },
        });
      }

      // Animação: Spin (Girar)
      spin(obj, angle = 360) {
        const startAngle = obj.angle;
        obj.animate('angle', startAngle + angle, {
          duration: 1000,
          easing: fabric.util.ease.easeOutBack,
          onChange: this.canvas.renderAll.bind(this.canvas),
        });
      }

      // Animação: Swing (Balanço)
      swing(obj) {
        const startAngle = obj.angle;
        obj.animate('angle', startAngle + 10, {
          duration: 300,
          easing: fabric.util.ease.easeInOutCubic,
          onChange: this.canvas.renderAll.bind(this.canvas),
          onComplete: () => {
            obj.animate('angle', startAngle - 10, {
              duration: 300,
              easing: fabric.util.ease.easeInOutCubic,
              onChange: this.canvas.renderAll.bind(this.canvas),
              onComplete: () => {
                obj.animate('angle', startAngle, {
                  duration: 300,
                  easing: fabric.util.ease.easeInOutCubic,
                  onChange: this.canvas.renderAll.bind(this.canvas),
                });
              },
            });
          },
        });
      }

      // Animação: Float (Flutuar)
      float(obj, distance = 20) {
        const startTop = obj.top;
        obj.animate('top', startTop - distance, {
          duration: 1000,
          easing: fabric.util.ease.easeInOutQuad,
          onChange: this.canvas.renderAll.bind(this.canvas),
          onComplete: () => {
            obj.animate('top', startTop, {
              duration: 1000,
              easing: fabric.util.ease.easeInOutQuad,
              onChange: this.canvas.renderAll.bind(this.canvas),
            });
          },
        });
      }

      // Animação: Typewriter (Máquina de Escrever)
      typewriter(textObj) {
        const fullText = textObj.text;
        textObj.text = '';
        let index = 0;

        const interval = setInterval(() => {
          if (index < fullText.length) {
            textObj.text += fullText[index];
            index++;
            this.canvas.renderAll();
          } else {
            clearInterval(interval);
          }
        }, 100); // Intervalo entre cada letra
      }
    }

    this.animations = new FabricAnimations(fabricCanvas);

  }

  window.ImageEditor.prototype.initializeAnimations = animation;
})()