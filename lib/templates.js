(function () {
  "use strict";

  const defaultTemplates = [{
    "uuid": "8a4c1398-bece-4e32-bf3b-edc1d557f208",
    "preview": "data:image/png;base64,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",
    "data": "{\"version\":\"5.3.0\",\"objects\":[{\"type\":\"image\",\"version\":\"5.3.0\",\"originX\":\"center\",\"originY\":\"center\",\"left\":387.42,\"top\":405.49,\"width\":600,\"height\":667,\"fill\":\"rgb(0, 0, 0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":[],\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"circle\",\"strokeUniform\":true,\"strokeMiterLimit\":4,\"scaleX\":0.85,\"scaleY\":0.85,\"angle\":360,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"cropX\":0,\"cropY\":0,\"animation\":{\"type\":\"spin\",\"duration\":1000,\"easing\":\"easeInOutQuad\"},\"src\":\"http://127.0.0.1:5501/screenshots/astronaut.png\",\"crossOrigin\":\"anonymous\",\"filters\":[]},{\"type\":\"i-text\",\"version\":\"5.3.0\",\"originX\":\"center\",\"originY\":\"center\",\"left\":1000.74,\"top\":363.83,\"width\":251.18,\"height\":33.9,\"fill\":\"white\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":[],\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"circle\",\"strokeUniform\":true,\"strokeMiterLimit\":4,\"scaleX\":2.03,\"scaleY\":2.03,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"fontFamily\":\"Impact, Charcoal, sans-serif\",\"fontWeight\":\"normal\",\"fontSize\":30,\"text\":\"Your text goes here...\",\"underline\":false,\"overline\":false,\"linethrough\":false,\"textAlign\":\"left\",\"fontStyle\":\"normal\",\"lineHeight\":1.2,\"textBackgroundColor\":\"\",\"charSpacing\":0,\"styles\":[],\"direction\":\"ltr\",\"path\":null,\"pathStartOffset\":0,\"pathSide\":\"left\",\"pathAlign\":\"baseline\",\"animation\":null}],\"background\":{\"type\":\"linear\",\"coords\":{\"x1\":462.40000000000003,\"y1\":522.24,\"x2\":462.40000000000003,\"y2\":0},\"colorStops\":[{\"id\":\"0\",\"color\":\"red\",\"offset\":0},{\"id\":\"1\",\"color\":\"blue\",\"offset\":1}],\"offsetX\":0,\"offsetY\":0,\"gradientUnits\":\"pixels\",\"gradientTransform\":null}}",
    "timestamp": 1746456655399
}];

  var templates = function () {
    const _self = this;

    let TemplatesList = [...defaultTemplates];
    if (Array.isArray(this.templates) && this.templates.length)
      TemplatesList.push(...this.templates);

    // Criação do painel
    $(`${this.containerSelector} .main-panel`).append(
      `<div class="toolpanel" id="templates-panel"><div class="content"><p class="title">Templates</p></div></div>`
    );

    // Funções declaradas primeiro
    const createTemplateFromCanvas = (canvas, uuid) => {
      const canvasData = JSON.stringify(canvas.toJSON());
      const preview = canvas.toDataURL({
        format: "png",
        multiplier: 0.2,
      });

      return {
        uuid: uuid,
        preview: preview,
        data: canvasData,
        timestamp: new Date().getTime(),
      };
    };

    const updateTemplateListUI = (containerSelector, templates) => {
      const listContainer = document.querySelector(
        `${containerSelector} .toolpanel#templates-panel .content .list-templates`
      );
      listContainer.innerHTML = "";

      templates.forEach((template, index) => {
        const templateDiv = document.createElement("div");
        templateDiv.className = "button list-templates-item";
        templateDiv.setAttribute("data-index", index);

        const templateImg = document.createElement("img");
        templateImg.src = template.preview;
        templateImg.setAttribute("data-index", index);

        templateDiv.appendChild(templateImg);
        listContainer.appendChild(templateDiv);
      });
    };

    const dispatcEvent = (template, eventName) => {
      const event = new CustomEvent("ImageEditor." + eventName, {
        detail: template,
      });
      window.dispatchEvent(event);
    };

    const handleAddTemplate = () => {
      const uuid = crypto.randomUUID();
      const newTemplate = createTemplateFromCanvas(_self.canvas, uuid);

      TemplatesList.push(newTemplate);
      _self.templates = TemplatesList;
      _self.toast("Template added successfully");

      dispatcEvent(newTemplate, "newTemplate");
      updateTemplateListUI(_self.containerSelector, TemplatesList);
    };

    const deleteTemplate = (index) => {
      if (index >= 0 && index < TemplatesList.length) {
        if (confirm("Are you sure you want to delete this template?")) {
          const templateToDelete = TemplatesList[index];
          TemplatesList.splice(index, 1);
          _self.templates = TemplatesList;
          dispatcEvent(templateToDelete, "deleteTemplate");
          updateTemplateListUI(_self.containerSelector, TemplatesList);
          _self.toast("Template excluído com sucesso");
        }
      }
    };

    const cloneTemplate = (index) => {
      if (index >= 0 && index < TemplatesList.length) {
        const templateToClone = TemplatesList[index];
        const clonedTemplate = {
          ...templateToClone,
          timestamp: new Date().getTime(),
          uuid: crypto.randomUUID(),
          preview: templateToClone.preview,
        };

        TemplatesList.push(clonedTemplate);
        _self.templates = TemplatesList;
        dispatcEvent(clonedTemplate, "newTemplate");
        updateTemplateListUI(_self.containerSelector, TemplatesList);
        _self.toast("Template cloned successfully");
      }
    };

    const saveTemplate = (index) => {
      if (index >= 0 && index < TemplatesList.length) {
        if (confirm("Are you sure you want to save and replace this template?")) {
          const uuid = TemplatesList[index].uuid;
          const updatedTemplate = createTemplateFromCanvas(_self.canvas, uuid);
          TemplatesList[index] = updatedTemplate;
          _self.templates = TemplatesList;
          dispatcEvent(updatedTemplate, "saveTemplate");
          updateTemplateListUI(_self.containerSelector, TemplatesList);
          _self.toast("Template salvo com sucesso");
        }
      }
    };

    const applyTemplate = (index) => {
      const _self = this;      
      const template =  TemplatesList[index];      
      const jsonData = JSON.parse(template.data);
      _self.canvas.loadFromJSON(jsonData, () => {
        _self.canvas.renderAll(); // Re-renderiza o canvas após carregar o JSON
      });
      };

    // Botão de adicionar template
    const button = document.createElement("button");
    button.className = "button btn";
    button.innerHTML = "Add Template";
    button.onclick = handleAddTemplate;

    const tabContent = document.createElement("div");
    tabContent.className = "tab-content";
    tabContent.append(button);

    $(`${this.containerSelector} .toolpanel#templates-panel .content`).append(tabContent);
    $(`${this.containerSelector} .toolpanel#templates-panel .content`).append('<div class="list-templates"></div>');

    // TemplatesList.forEach((img, index) => {
    //   $(`${this.containerSelector} .toolpanel#templates-panel .content .list-templates`).append(
    //     `<div class="button list-templates-item" data-index="${index}"><img src="${img.preview}" data-index="${index}" /></div>`
    //   );
    // });

    updateTemplateListUI(_self.containerSelector, TemplatesList);

    const contextMenuItems = [
      {
        name: "Preview",
        fn: function (target) {
          alert("Coming soon");
          console.log("Preview", target);
        },
      },
      {
        name: "Salvar",
        fn: function (target) {
          const index = target.getAttribute("data-index");
          saveTemplate(parseInt(index));
        },
      },
      {
        name: "Clone",
        fn: function (target) {
          const index = target.getAttribute("data-index");
          cloneTemplate(parseInt(index));
        },
      },
      {},
      {
        name: "Delete",
        fn: function (target) {
          const index = target.getAttribute("data-index");
          deleteTemplate(parseInt(index));
        },
      },
    ];

    new ContextMenu(".list-templates-item", contextMenuItems);

    $(`${this.containerSelector} .toolpanel#templates-panel .content .list-templates`)
      .on("click", ".button", function () {
        try {
          let index = $(this).data("index");
          applyTemplate(index);
        } catch (_) {
          console.error("can't add template", _);
        }
      });
  };

  window.ImageEditor.prototype.initializeTemplates = templates;
})();
