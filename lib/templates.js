/**
 * Define action to add tempaltes to canvas
 */
(function () {
  'use strict';

  const defaultTemplates = [  
  ];

  var templates = function () {
    const _self = this;

    let TemplatesList = defaultTemplates;
    if (Array.isArray(this.templates) && this.templates.length) TemplatesList.push(...this.templates);

    $(`${this.containerSelector} .main-panel`).append(`<div class="toolpanel" id="templates-panel"><div class="content"><p class="title">Templates</p></div></div>`);

    $(`${this.containerSelector} .toolpanel#templates-panel .content`).append('<div class="list-templates"></div>')

    TemplatesList.forEach((img, index) => {
      $(`${this.containerSelector} .toolpanel#templates-panel .content .list-templates`).append(`<div class="button default-theme" data-index="${index}"><img src="${img.preview}" /></div>`)
    })
    
    const contextMenuItems = [
      { name: 'Cut', fn: function(target) { console.log('Cut', target); }},
      { name: 'Copy', fn: function(target) { console.log('Copy', target); }},
      { name: 'Paste', fn: function(target) { console.log('Paste', target); }},
      {},
      { name: 'Select All', fn: function(target) { console.log('Select All', target); }},
    ];
    new ContextMenu('.default-theme', contextMenuItems);

    $(`${this.containerSelector} .toolpanel#templates-panel .content .list-templates`).on('click', '.button', function () {
      let index = $(this).data('index');
      console.log('index', index)
      
        _self.applyTemplate(index);
      try {} catch (_) {
        console.error("can't add tempalte", _);
      }
    })

    const button = document.createElement('button');
    button.innerHTML = 'Add Template';
    button.onclick = function () {
      // Captura o nome do template (solicita ao usuário)
      const templateName = '1';//prompt("Digite um nome para o novo template:");
      // if (!templateName) {
      //   alert("Nome do template é obrigatório!");
      //   return;
      // }

      // Captura o estado atual do canvas como JSON
      const canvasData = JSON.stringify(_self.canvas.toJSON());

      // Adiciona o novo template à lista
      const newTemplate = {
        name: templateName,
        preview: null, // Adicione uma pré-visualização se necessário
        data: canvasData
      };

      const preview = _self.canvas.toDataURL({
          format: 'png',
          multiplier: 0.2 // Reduz a resolução para uma miniatura
      });
      newTemplate.preview = preview;
      
      TemplatesList.push(newTemplate);
      _self.templates = TemplatesList;

      _self.toast('Success')

      // Dispatch a event after new template
      const event = new CustomEvent('ImageEditor.newTemplate', { detail: newTemplate });
      window.dispatchEvent(event);

      $(`${_self.containerSelector} .toolpanel#templates-panel .content .list-templates`).html('');

      TemplatesList.forEach((template, index) => {
        // Criar o elemento div
        const templateDiv = document.createElement('div');
        templateDiv.className = 'button default-theme';
        templateDiv.setAttribute('data-index', index);

        // Criar o elemento img
        const templateImg = document.createElement('img');
        templateImg.src = template.preview;

        // Adicionar a imagem ao div
        templateDiv.appendChild(templateImg);
               

        // Adicionar o div ao container
        document.querySelector(`${_self.containerSelector} .toolpanel#templates-panel .content .list-templates`).appendChild(templateDiv);
      })

      // Atualiza a interface para exibir o novo template
      // updateTemplateList();
    };
    $(`${this.containerSelector} .toolpanel#templates-panel .content`).append(button)
  }

  window.ImageEditor.prototype.initializeTemplates = templates;
})();