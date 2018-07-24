var app = {};

function setupDom() {

    app.dom = {};

    app.dom.customSizeTitle = document.getElementById("custom-size-title");

    app.dom.customSizesContainer = document.getElementById("custom-sizes-container");
    app.dom.addCustomSizeContainer = document.getElementById("add-custom-size-container");
    app.dom.generateLinksButton = document.getElementById("generate-links-button");
    app.dom.baseUrlInput = document.getElementById("base-url");
    app.dom.jsonNameInput = document.getElementById("json-name");
    app.dom.adSizeCheckboxes = document.querySelectorAll(".ad-size-checkbox");
    app.dom.adSizeLabels = document.querySelectorAll(".label-size");
    app.dom.customLabels = document.querySelectorAll(".custom-label");
    app.dom.linkOutput = document.getElementById("link-output");
    app.dom.widthInput = document.getElementById("custom-ad-size-width");
    app.dom.heightInput = document.getElementById("custom-ad-size-height");
    app.dom.addNewSizeButton = document.getElementById("add-new-size-button");
    app.dom.sizesContainer = document.getElementById("sizes-container");

    var jsonArr

}

function addListeners(argument) {
    app.dom.customSizeTitle.addEventListener("click", toggleCustomSize);
    app.dom.generateLinksButton.addEventListener("click", verifyJsons);
    app.dom.addNewSizeButton.addEventListener("click", verifyCustomSize);
}

function verifyJsons() {

    jsonArr = [];

    var jsonNameInputVal = app.dom.jsonNameInput.value

    // var sanitiseInputVal = jsonNameInputVal.replace("\n", ",");

    var replaceJsonVal = jsonNameInputVal.replace(",", "\n");
    var splitJsonVal = replaceJsonVal.split("\n")


    for (var i = 0; i < splitJsonVal.length; i++) {
        jsonArr.push(splitJsonVal[i])
    }

    var numberOfJsons = jsonArr.length;

    generateLinks(numberOfJsons)

}

function verifyCustomSize() {

    setupDom();

    var widthInputVal = app.dom.widthInput.value;
    var heightInputVal = app.dom.heightInput.value;
    var newAdSize = widthInputVal + "x" + heightInputVal;

    var testArr = [];

    for (var i = 0; i < app.dom.adSizeCheckboxes.length; i++) {

        var adSizeDataset = app.dom.adSizeCheckboxes[i].dataset.adsize;

        testArr.push(adSizeDataset);

    }

    if (testArr.indexOf(newAdSize) > -1) {
        console.log("There is a matching size!");
    } else {
        console.log("There is not a matching size!");
        addNewSize(widthInputVal, heightInputVal)
    }
}

function addNewSize(adWidth, adHeight) {

    if (adWidth > 0 && adHeight > 0) {

        console.log("width: " + adWidth)
        console.log("height: " + adHeight)

        console.log(adWidth + "x" + adHeight);

        // create a new label element
        var newLabel = document.createElement("label");

        // add class
        newLabel.classList.add("label-size");
        newLabel.classList.add("custom-label");

        // create new input
        var newInput = document.createElement("input");

        // add the attributes and class
        newInput.classList.add("ad-size-checkbox");
        newInput.setAttribute("type", "checkbox");
        newInput.setAttribute("name", "ad-size");
        newInput.setAttribute("data-adsize", adWidth + "x" + adHeight);

        newLabel.appendChild(newInput)
        newLabel.innerHTML += adWidth + "x" + adHeight;

        // append input in label
        app.dom.customSizesContainer.appendChild(newLabel);

        setupDom();
        saveCustomAdSize();
    }

    function saveCustomAdSize() {

        setupDom();

        var sizesArr = [];

        // loop thriugh all of the elements and push them to the array
        for (var i = 0; i < app.dom.customLabels.length; i++) {
            sizesArr.push(app.dom.customLabels[i].outerHTML);
        }

        // add the array to localstorage, you need to stringify the array as local storage only supports strings
        localStorage.setItem("adSizes", JSON.stringify(sizesArr));
    }

}

function setCustomSizes() {

    // set the key as a variable
    var storedAdSizes = localStorage.getItem("adSizes");

    // parse the string back to HTML
    var parsedAdSizes = JSON.parse(storedAdSizes);

    // loop through the array and add the elements to the container
    for (var i = 0; i < parsedAdSizes.length; i++) {
        app.dom.customSizesContainer.innerHTML += parsedAdSizes[i];
    }
}

function generateLinks(numberOfJsons) {

    setupDom()

    var linksArr = [];
    var linksAndJsonArr = [];
    var sizesArr = [];
    var replacedArr = [];

    var numberChecked = 0;

    var regex = /\d{1,4}[x]\d{1,4}/g;

    // loop through all checkboxes to see what is checked
    for (var k = 0; k < app.dom.adSizeCheckboxes.length; k++) {

        if (app.dom.adSizeCheckboxes[k].checked === true) {

            numberChecked++

            // store the size of the ad in a variable
            var checkedSizes = app.dom.adSizeCheckboxes[k].dataset.adsize;

            for (var i = 0; i < numberOfJsons; i++) {

                sizesArr.push(checkedSizes)

            }
        }
    }

    for (var i = 0; i < numberChecked; i++) {

        linksArr.push(app.dom.baseUrlInput.value);

        for (var k = 0; k < jsonArr.length; k++) {

            var fullURL = linksArr[i] + "?" + jsonArr[k];

            linksAndJsonArr.push(fullURL)

        }
    }

    for (var i = 0; i < sizesArr.length; i++) {
        replacedArr.push(linksAndJsonArr[i].replace(regex, sizesArr[i]));
    }

    console.log(replacedArr)

}

function toggleCustomSize(e) {

    e.stopPropagation();

    if (app.dom.customSizeTitle.classList.contains("active")) {
        app.dom.addCustomSizeContainer.style.display = "none";
        app.dom.customSizeTitle.classList.remove("active");
    } else {
        app.dom.addCustomSizeContainer.style.display = "block";
        app.dom.customSizeTitle.classList.add("active");
    }

}




function init() {
    setupDom();
    addListeners();
    setCustomSizes();
}

window.onload = init