/**
 * Defines the layers functionality for the editor
 */
(function () {
  'use strict';

  function initializeLayers() {
    const _self = this;

    // Container for the layers list
    const layersContainer = document.createElement('div');
    layersContainer.className = 'image-editor-layers';
    layersContainer.style.cssText = `
      position: absolute;
      right: 0;
      top: 0;
      width: 200px;
      height: 100%;
      background: #f9f9f9;
      color: #333;
      padding: 10px;
      box-sizing: border-box;
      overflow-y: auto;
    `;

    // Layers header
    const layersHeader = document.createElement('div');
    layersHeader.innerHTML = `
    <p style="font-size: 14px;
    font-weight: 700;
    margin: 0;
    padding-bottom: 10px;
    width: 100%;
    border-bottom: 1px solid #ddd;
    color: #333;
    text-transform: uppercase;">Layers</p>
    `;
    layersContainer.appendChild(layersHeader);

    // Layers list
    const layersList = document.createElement('div');
    layersList.className = 'layers-list';
    layersContainer.appendChild(layersList);

    // Add container to editor
    _self.containerEl.find('.main-panel').append(layersContainer);

    // Variables for drag and drop control
    let draggedItem = null;
    let placeholder = null;

    // Add drag and drop events to the list container
    layersList.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    layersList.addEventListener('drop', (e) => {
      e.preventDefault();
      console.log('drop in container', draggedItem);

      if (draggedItem) {
        const allItems = Array.from(layersList.children);
        const newIndex = allItems.indexOf(placeholder);
        const oldIndex = allItems.indexOf(draggedItem);

        if (newIndex !== -1) {
          const objects = _self.canvas.getObjects().filter(obj => {
            return !obj.id || (!obj.id.startsWith('vertical-') && !obj.id.startsWith('horizontal-'));
          });

          const draggedItemId = draggedItem.dataset.objectId;
          const objectToMove = objects.find(obj => obj.id === draggedItemId);

          if (objectToMove) {
            console.log('Object to move:', objectToMove);
            _self.canvas.remove(objectToMove);
            const clonedObject = fabric.util.object.clone(objectToMove);

            // Insert at the new position corresponding to the new list index
            _self.canvas.insertAt(clonedObject, objects.length - 1 - newIndex);

            _self.canvas.renderAll();
            updateLayersList();
          } else {
            console.warn('Object to be moved not found in canvas with ID:', draggedItemId);
          }
        }
      }
    });

    // Function to create a layer item
    function createLayerItem(fabricObject) {
      const layer = document.createElement('div');
      layer.className = 'layer-item';
      layer.dataset.objectId = fabricObject.id;
      layer.draggable = true;
      layer.style.cssText = `
        padding: 5px;
        margin: 2px 0;
        background: #ffffff;
        cursor: move;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 2px solid transparent;
        transition: all 0.2s ease;
        user-select: none;
      `;

      // Determine icon based on object type
      let icon = '📄';
      if (fabricObject.type === 'image') icon = '🖼️';
      else if (fabricObject.type === 'text') icon = '📝';
      else if (fabricObject.type === 'rect') icon = '⬜';
      else if (fabricObject.type === 'circle') icon = '⚪';
      else if (fabricObject.type === 'triangle') icon = '⬜';
      else if (fabricObject.type === 'path') icon = '🤍';

      layer.innerHTML = `
        <div class="layer-info">
          <span>${icon} ${fabricObject.type || 'Object'}</span>
        </div>
        <div class="layer-controls">
          <button class="layer-visibility" style="background: none; border: none; color: #fff; opacity: ${fabricObject.visible ? '1' : '0.5'}; cursor: pointer;">👁️</button>
          <button class="layer-delete" style="background: none; border: none; color: #fff; cursor: pointer;">🗑️</button>
        </div>
      `;

      // Add drag and drop events
      layer.addEventListener('dragstart', (e) => {
        draggedItem = layer;
        layer.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'move';

        // Create a placeholder
        placeholder = document.createElement('div');
        placeholder.className = 'layer-item-placeholder';
        placeholder.style.cssText = `
          padding: 0;
          margin: 0;
          background: #ffffff;
          outline: 2px dashed #6d6d6d;
          height: ${layer.offsetHeight}px;
        `;
      });

      layer.addEventListener('dragend', () => {
        layer.style.opacity = '1';
        if (placeholder && placeholder.parentNode) {
          placeholder.parentNode.removeChild(placeholder);
        }
        draggedItem = null;
        placeholder = null;
      });

      layer.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (draggedItem !== layer) {
          const rect = layer.getBoundingClientRect();
          const midY = rect.top + rect.height / 2;

          if (e.clientY < midY) {
            layer.parentNode.insertBefore(placeholder, layer);
          } else {
            layer.parentNode.insertBefore(placeholder, layer.nextSibling);
          }
        }
      });

      // Add events
      layer.querySelector('.layer-visibility').addEventListener('click', (e) => {
        e.stopPropagation();
        fabricObject.visible = !fabricObject.visible;
        e.target.style.opacity = fabricObject.visible ? '1' : '0.5';
        _self.canvas.renderAll();
      });

      layer.querySelector('.layer-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        _self.canvas.remove(fabricObject);
        layer.remove();
        _self.canvas.renderAll();
      });

      layer.addEventListener('click', () => {
        _self.canvas.setActiveObject(fabricObject);
        _self.canvas.renderAll();
      });

      layersList.appendChild(layer);
      return layer;
    }

    // Update layers list when objects are added or removed
    function updateLayersList() {
      updateZIndices();

      layersList.innerHTML = '';
      const objects = _self.canvas.getObjects().filter(obj => {
        // Filter out guide lines
        // Não retorna objetos que são guias ou margens
        return (
          (!obj.metadata || (!obj.metadata.isGuide && !obj.metadata.isMargin)) &&
          (!obj.id || (!obj.id.startsWith('vertical-') && !obj.id.startsWith('horizontal-')))
        );
      }).reverse(); // Reverse object order

      objects.forEach(obj => {
        const layerItem = createLayerItem(obj);
        // Highlight item if it's the selected object
        if (_self.canvas.getActiveObject() === obj) {
          layerItem.style.background = '#e4e4e4';
          // layerItem.style.outline = '2px solid #6d6d6d';
        }
      });
    }

    function addIdToObject(obj) {
      if (!obj.id) {
        const timestamp = new Date().getTime();
        obj.id = `${obj.type}-${timestamp}`;
      }
    }

    function updateZIndices() {
      const objects = _self.canvas.getObjects();
      objects.forEach((obj, index) => {
        addIdToObject(obj);
        obj.zIndex = index;
      });
    }

    // Add canvas event listeners
    _self.canvas.on('object:added', updateLayersList);
    _self.canvas.on('object:removed', updateLayersList);
    _self.canvas.on('object:modified', updateLayersList);
    _self.canvas.on('selection:created', updateLayersList);
    _self.canvas.on('selection:updated', updateLayersList);
    _self.canvas.on('selection:cleared', updateLayersList);

    // Update initial list
    updateLayersList();
  }

  // Add function to ImageEditor prototype
  if (window.ImageEditor) {
    window.ImageEditor.prototype.initializeLayers = initializeLayers;
  }
})();