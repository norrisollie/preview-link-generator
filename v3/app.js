var app = {};

function init() {

    setupDom();
    addListeners();

}

function setupDom() {

    console.log("setupDom");

    app.dom = {};

    app.dom.previewButtons = document.querySelectorAll(".preview-buttons");

    app.dom.creativeCheckboxes = document.querySelectorAll(".creative-checkbox")
    app.dom.creativePreview = document.querySelectorAll(".creative-preview")
    app.dom.creativePreviewContainer = document.querySelectorAll(".creative-preview-container");


}

function addListeners() {

    console.log("addListeners");

    for (var i = 0; i < app.dom.previewButtons.length; i++) {
        app.dom.previewButtons[i].addEventListener("click", previewButtonsClickHandler);
    }
}

function reloadButtonClickHandler(e) {

    var targetPreview = e.currentTarget.parentNode.parentNode.childNodes[0];

    console.log(targetPreview)

    targetPreview.src += "";
}

function previewButtonsClickHandler(e) {

    var targetAction = e.currentTarget.dataset.action;

    for (var i = 0; i < app.dom.creativeCheckboxes.length; i++) {

        // var previewUrl = app.dom.creativeCheckboxes[i].parentNode.parentNode.dataset.url;
        var previewUrl = app.dom.creativeCheckboxes[i].parentNode.parentNode.parentNode.dataset.preview
        var adWidth = app.dom.creativeCheckboxes[i].parentNode.parentNode.parentNode.dataset.width
        var adHeight = app.dom.creativeCheckboxes[i].parentNode.parentNode.parentNode.dataset.height
        var previewInner = app.dom.creativeCheckboxes[i].parentNode.parentNode.parentNode.childNodes[3].childNodes[1];
        var previewContainer = app.dom.creativeCheckboxes[i].parentNode.parentNode.parentNode.childNodes


        switch (targetAction) {

            case "select":

                app.dom.creativeCheckboxes[i].checked = true;

                break;

            case "deselect":

                app.dom.creativeCheckboxes[i].checked = false;

                break;

            case "copy":

                // console.log(previewUrl[i])

                break;

            case "preview":

                previewInner.innerHTML = "";

                app.dom.creativePreviewContainer[i].style.display = "flex";

                var optionsContainer = document.createElement("div");
                var reloadButton = document.createElement("input");
                reloadButton.setAttribute("type", "button")
                reloadButton.setAttribute("value", "refresh")
                reloadButton.classList.add("reload-button");
                reloadButton.addEventListener("click", reloadButtonClickHandler);
                optionsContainer.classList.add("options-container")

                var iframe = document.createElement("iframe");

                iframe.classList.add("preview-iframe");
                iframe.setAttribute("width", adWidth)
                iframe.setAttribute("height", adHeight)
                iframe.setAttribute("src", previewUrl)

                previewInner.appendChild(iframe);
                previewInner.appendChild(optionsContainer);
                optionsContainer.appendChild(reloadButton);

                break

        }

    }

}


window.onload = init();