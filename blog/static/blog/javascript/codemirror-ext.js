define(["../codemirror/lib/codemirror", "../codemirror/mode/markdown/markdown"], function (CodeMirror) {
  "use strict";

  /**
   * Returns the value of specified cookie.
   * @param name
   * @returns {null}
   */
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      let cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }

    return cookieValue;
  }

  /**
   * Call CodeMirror's 'fromTextArea' to initiate an editor instance, and add button to preview content in editor.
   * @param element textareaElement is required.
   */
  function fromTextAreaExtension(element) {
    let containerPreview = document.createElement("div");
    containerPreview.className = "file container-preview";
    element.parentNode.replaceChild(containerPreview, element);
    containerPreview.innerHTML = `
      <div class="file-header">
        <div class="tabnav-tabs">
          <button type="button" class="tabnav-tab selected" data-tab="show-code">
            Edit file
          </button>
          <button type="button" class="tabnav-tab" data-tab="preview">
            Preview changes
          </button>
        </div>
      </div>
      <div class="commit-create position-relative"></div>
      <div class="loading-preview-msg hidden">
        <p class="preview-msg">Loading preview...</p>
      </div>
      <div class="commit-preview hidden"></div>
    `;

    let commitCreate = containerPreview.querySelector(".commit-create");
    commitCreate.appendChild(element);

    let cm = CodeMirror.fromTextArea(element, {
      lineNumbers: true,
      mode: "markdown",
      scrollbarStyle: 'native',
      lineWrapping: true
    });

    const activeMarker = "selected";
    const hiddenMarker = "hidden";
    const postUrl = "/blog/preview-markdown";

    let fileHeader = document.querySelector(".file-header");
    let editTab = fileHeader.querySelector("[data-tab='show-code']");
    let previewTab = fileHeader.querySelector("[data-tab='preview']");
    let editPanel = document.querySelector(".commit-create");
    let loadingPanel = document.querySelector(".loading-preview-msg");
    let previewPanel = document.querySelector(".commit-preview");

    /**
     * Call relative handler when tab clicked.
     * @param event
     */
    const dispatchTabs = function dispatchToCodeOrPreview(event) {
      if (event.target === editTab) {
        codeTabClicked();
      } else if (event.target === previewTab) {
        previewTabClicked();
      }
    }

    /**
     * Handler for editor tab, show editor and hide preview tab.
     */
    const codeTabClicked = function handlerWhenCodeTabWasClicked() {
      if (!editTab.classList.contains(activeMarker)) {

        // Highlight edit tab.
        editTab.classList.add(activeMarker);

        // Un-highlight preview tab.
        previewTab.classList.remove(activeMarker);

        // Display editor panel.
        editPanel.classList.remove(hiddenMarker);

        // Hide preview panel.
        previewPanel.classList.add(hiddenMarker);
      }
    }

    /**
     * Handler for preview tab.
     *
     * 1. Hide editor and show loading panel;
     * 2. Send a request to translate markdown via XMLHttpRequest.
     * 3. Display HTML when finishing translation.
     */
    const previewTabClicked = function handlerWhenPreviewTabWasClicked() {
      if (!previewPanel.classList.contains(activeMarker)) {

        // Highlight preview tab.
        previewTab.classList.add(activeMarker);

        // Un-highlight edit tab.
        editTab.classList.remove(activeMarker);

        // Hide editor panel.
        editPanel.classList.add(hiddenMarker);

        // Hide preview panel.
        previewPanel.classList.add(hiddenMarker);

        // Display loading panel.
        loadingPanel.classList.remove(hiddenMarker);

        let xhr = new XMLHttpRequest();
        let data = new FormData();
        let csrftoken = getCookie('csrftoken');
        data.append("origin-markdown", cm.getValue())
        xhr.addEventListener('load', displayPreview);
        xhr.open("post", postUrl);
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
        xhr.send(data);
      }
    }

    /**
     * Handles when XMLHttpRequest's load event triggers.
     * @param event
     */
    const displayPreview = function displayPreviewWhenMarkdownTranslated(event) {
      loadingPanel.classList.add(hiddenMarker);
      previewPanel.innerHTML = JSON.parse(event.target.responseText)["html"];
      previewPanel.classList.remove(hiddenMarker);
    }

    fileHeader.addEventListener("click", dispatchTabs, false);
  }

  return {
      fromTextAreaExtension: fromTextAreaExtension
  }
})
