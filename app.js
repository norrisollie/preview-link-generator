var app = {};

function setupDom() {

    app.dom = {};

    app.dom.customSizeTitle = document.getElementById("custom-size-title");
    app.dom.customSizeContainer = document.getElementById("custom-size-container");
    app.dom.generateLinksButton = document.getElementById("generate-links-button");
    app.dom.baseUrlInput = document.getElementById("base-url");
    app.dom.jsonNameInput = document.getElementById("json-name");
    app.dom.adSizeCheckboxes = document.querySelectorAll(".ad-size-checkbox");
    app.dom.adSizeLabels = document.querySelectorAll(".label-size");
    app.dom.linkOutput = document.getElementById("link-output");
    app.dom.widthInput = document.getElementById("custom-ad-size-width");
    app.dom.heightInput = document.getElementById("custom-ad-size-height");
    app.dom.addNewSizeButton = document.getElementById("add-new-size-button");
    app.dom.sizesContainer = document.getElementById("sizes-container");

}

function addListeners(argument) {
    app.dom.customSizeTitle.addEventListener("click", toggleCustomSize);
    app.dom.generateLinksButton.addEventListener("click", generateLinks);
    app.dom.addNewSizeButton.addEventListener("click", addNewSize);
}

function storeCustomAdSizes() {

    // refresh the dom to make sure all new ad sizes are store
    setupDom();

    // create new array to store all of the ad size elements
    var sizesArr = [];

    // loop thriugh all of the elements and push them to the array
    for(var i = 0; i < app.dom.adSizeLabels.length; i++) {
        sizesArr.push(app.dom.adSizeLabels[i].outerHTML);
    }   

    // add the array to localstorage, you need to stringify the array as local storage only supports strings
    localStorage.setItem("adSizes", JSON.stringify(sizesArr));

}

function addNewSize() {

    // create variables to store the width and height values entered in inputs
    var widthInputVal = app.dom.widthInput.value;
    var heightInputVal = app.dom.widthInput.value;

    console.log(widthInputVal + "x" + heightInputVal);

    // create a new label element
    var newLabel = document.createElement("label");

    // add class
    newLabel.classList.add("label-size");

    // create new input
    var newInput = document.createElement("input");

    // add the attributes and class
    newInput.classList.add("ad-size-checkbox");
    newInput.setAttribute("type", "checkbox");
    newInput.setAttribute("name", "ad-size");
    newInput.setAttribute("data-adsize", widthInputVal + "x" + heightInputVal);

    newLabel.appendChild(newInput)
    newLabel.innerHTML += widthInputVal + "x" + heightInputVal;

    // append input in label
    app.dom.sizesContainer.appendChild(newLabel);

    setupDom();
    storeCustomAdSizes();
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
    console.log(app.dom.adSizeCheckboxes)

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

    e.stopPropagation();

    if (app.dom.customSizeContainer.classList.contains("active")) {
        app.dom.customSizeContainer.style.display = "none";
        app.dom.customSizeContainer.classList.remove("active");
    } else {
        app.dom.customSizeContainer.style.display = "block";
        app.dom.customSizeContainer.classList.add("active");
    }

}

function addCustomAdSizes() {

    // clear the container with all the default sizes
    app.dom.sizesContainer.innerHTML = "";

    // set the key as a variable
    var storedAdSizes = localStorage.getItem("adSizes");

    // parse the string back to HTML
    var parsedAdSizes = JSON.parse(storedAdSizes);

    // loop through the array and add the elements to the container
    for (var i = 0; i < parsedAdSizes.length; i++) {
        app.dom.sizesContainer.innerHTML += parsedAdSizes[i];
    }

    storeCustomAdSizes();
}

function init() {
    setupDom();
    addListeners();
    addCustomAdSizes();
}

window.onload = init