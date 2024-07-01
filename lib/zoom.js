/**
 * Define action to zoom in/out
 */
(function () {
  'use strict';

  function zoom() {   

    const minZoom = 0.05
    const maxZoom = 3

    this.applyZoom = (zoom) => {
      this.canvas.setZoom(zoom)
      this.canvas.setWidth(this.canvas.originalW * this.canvas.getZoom())
      this.canvas.setHeight(this.canvas.originalH * this.canvas.getZoom())
    }
    
    // zoom fit the area
    this.fitZoom = () => {
      const container = document.querySelector(this.containerSelector + ' .main-panel');  
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const canvasWidth = this.canvas.originalW;
      const canvasHeight = this.canvas.originalH;
      const widthRatio = containerWidth / canvasWidth;
      const heightRatio = containerHeight / canvasHeight;
      const newZoom = Math.min(widthRatio, heightRatio) - 0.1;
      const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));  
      this.applyZoom(clampedZoom)
    };      

    // zoom out/in/reset (ctr + -/+/0)
    const keyZoom = (e) => {
      const key = e.which || e.keyCode
    
      // ctr -: zoom out
      if (key === 189 && e.ctrlKey) {
        e.preventDefault()
        if (this.canvas.getZoom() === minZoom) return
    
        let updatedZoom = parseInt(this.canvas.getZoom() * 100)
    
        // 25% jumps
        if ((updatedZoom % 25) !== 0) {
          while ((updatedZoom % 25) !== 0) {
            updatedZoom = updatedZoom - 1
          }
        } else {
          updatedZoom = updatedZoom - 25
        }
    
        updatedZoom = updatedZoom / 100
        updatedZoom = (updatedZoom <= 0) ? minZoom : updatedZoom
    
        this.applyZoom(updatedZoom)
      }
    
    
      // ctr +: zoom in
      if (key === 187 && e.ctrlKey) {
        e.preventDefault()
        if (this.canvas.getZoom() === maxZoom) return
    
        let updatedZoom = parseInt(this.canvas.getZoom() * 100)
    
        // 25% jumps
        if ((updatedZoom % 25) !== 0) {
          while ((updatedZoom % 25) !== 0) {
            updatedZoom = updatedZoom + 1
          }
        } else {
          updatedZoom = updatedZoom + 25
        }
    
        updatedZoom = updatedZoom / 100
        updatedZoom = (updatedZoom > maxZoom) ? maxZoom : updatedZoom
    
        this.applyZoom(updatedZoom)
      }
    
    
      // ctr 0: reset
      if ((key === 96 || key === 48 || key === 192) && e.ctrlKey) {
        e.preventDefault()
        this.applyZoom(1)
      }
    }
    document.addEventListener('keydown', keyZoom)

    // zoom out/in with mouse    
    const mouseZoom = (e) => {
      if (!e.ctrlKey) return
      e.preventDefault()
    
      let updatedZoom = this.canvas.getZoom().toFixed(2)
      let zoomAmount = (e.deltaY > 0) ? -5 : 5
      updatedZoom = ((updatedZoom * 100) + zoomAmount) / 100
      if (updatedZoom < minZoom || updatedZoom > maxZoom) return
    
      this.applyZoom(updatedZoom)
    }
    document.addEventListener('wheel', mouseZoom, {
      passive: false
    })    
  
  }

  window.ImageEditor.prototype.initializeZoomEvents = zoom;
})();