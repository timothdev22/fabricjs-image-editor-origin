/**
 * Define action to add shape to canvas
 */
(function () {
  'use strict';
  const defaultImages = [
    `screenshots/editor.jpg`,
  ]

  var images = function () {
    const _self = this;

    let ImageList = defaultImages;
    if (Array.isArray(this.images) && this.images.length) ImageList.push(...this.images);
    
    $(`${this.containerSelector} .main-panel`).append(`<div class="toolpanel" id="images-panel"><div class="content"><p class="title">Images</p></div></div>`);

    ImageList.forEach(img => {
      $(`${this.containerSelector} .toolpanel#Images-panel .content`).append(`<div class="button"><img src="${img}" /></div>`)
    })

    $(`${this.containerSelector} .toolpanel#Images-panel .content .button`).click(function () {
      let img = $(this).find('img').attr('src');

      try {
        fabric.Image.fromURL(img, (img) => {
          
          img.scaleToHeight(300);
          img.scaleToWidth(300);
          
          const canvasCenterX = _self.canvas.originalW / 2;
          const canvasCenterY = _self.canvas.originalH / 2;

          img.set({
              left: canvasCenterX - (img.getScaledWidth() / 2),
              top: canvasCenterY - (img.getScaledHeight() / 2)
          });
          
          _self.canvas.add(img)
          _self.canvas.setActiveObject(img);
          _self.canvas.renderAll()
          _self.canvas.trigger('object:modified')

          $(`${_self.containerSelector} #toolbar button`).removeClass('active');
          
        })
      } catch (_) {
        console.error("can't add image");
      }
    })
  }

  window.ImageEditor.prototype.initializeImages = images;
})();