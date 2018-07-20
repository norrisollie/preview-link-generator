var app = {};

function setupDom() {

    app.dom = {};

    app.dom.customSizeTitle = document.getElementById("add-new-size");
    app.dom.customSizeContainer = document.getElementById("custom-size-container");
    app.dom.generateLinksButton = document.getElementById("generate-links-button");
    app.dom.baseUrlInput = document.getElementById("base-url");
    app.dom.jsonNameInput = document.getElementById("json-name");
    app.dom.adSizeCheckboxes = document.querySelectorAll(".ad-size-checkbox");
    app.dom.linkOutput = document.getElementById("link-output");

}

function addListeners(argument) {
    app.dom.customSizeTitle.addEventListener("click", toggleCustomSize);
    app.dom.generateLinksButton.addEventListener("click", generateLinks);
}

function generateLinks() {

    var checkedSizesArr = [];
    var linksArr = [];
    var regex = /\d{1,3}[x]\d{1,3}/g;

    // clear previous contents of output area
    app.dom.linkOutput.value = "";

    // get value of the base url input
    var baseUrlInputVal = app.dom.baseUrlInput.value;
    var jsonNameInputVal = app.dom.jsonNameInput.value;

    // console.log(baseUrlInputVal)

    // check what checkboxes have been checked
    for (var i = 0; i < app.dom.adSizeCheckboxes.length; i++) {

        if (app.dom.adSizeCheckboxes[i].checked == true) {

            // get the size dataset
            var adSizeDatasets = app.dom.adSizeCheckboxes[i].dataset.adsize;

            // push the sizes to the array
            checkedSizesArr.push(adSizeDatasets)

            var fullLinkUrl = baseUrlInputVal + "?" + jsonNameInputVal

            // push the base url to the array
            var replacedFullLinkUrl = fullLinkUrl.replace(regex, adSizeDatasets);

            // console.log(replacedFullLinkUrl)

            app.dom.linkOutput.value += replacedFullLinkUrl + "\n";

        }
    }
}

function toggleCustomSize(e) {

    if (app.dom.customSizeContainer.classList.contains("active")) {
        app.dom.customSizeContainer.style.display = "none";
        app.dom.customSizeContainer.classList.remove("active");
    } else {
        app.dom.customSizeContainer.style.display = "flex";
        app.dom.customSizeContainer.classList.add("active");
    }

}

function init() {
    setupDom();
    addListeners();
}

window.onload = init