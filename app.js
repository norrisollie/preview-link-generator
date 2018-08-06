var app = {};

function init() {

    console.log("init is running");

    setupDom();
    setCustomSizes();
    addListeners();

}

function setupDom() {

    console.log("setting up the DOM");

    app.dom = {}

    // add dom elements here
    // ids
    app.dom.urlInput = document.getElementById("url-input");
    app.dom.jsonInput = document.getElementById("json-input");
    app.dom.devmodeCheckbox = document.getElementById("devmode-checkbox");
    app.dom.customAdSizeContainer = document.getElementById("custom-adsize-container");
    app.dom.addCustomSizeButton = document.getElementById("add-custom-size-button");
    app.dom.removeCustomSizeButton = document.getElementById("remove-custom-size-button");
    app.dom.generateLinksButton = document.getElementById("generate-links-button");
    app.dom.linkOutput = document.getElementById("link-output");
    app.dom.noCustomSizesMsg = document.getElementById("no-custom-sizes");

    // classes/multiple elements
    app.dom.adSizeCheckboxes = document.querySelectorAll(".adsize-checkbox");
    app.dom.customLabels = document.querySelectorAll(".custom-label");
    app.dom.customAdSizeCheckboxes

    // floating container
    app.dom.floatingContainer = document.getElementById("floating-container");
    app.dom.addSizeSection = document.getElementById("add-size")
    app.dom.removeSizeSection = document.getElementById("remove-size")
    app.dom.addSizeConfirm = document.getElementById("add-size-confirm");
    app.dom.addSizeCancel = document.getElementById("add-size-cancel");
    app.dom.addSizeWidthInput = document.getElementById("custom-ad-size-width");
    app.dom.addSizeHeightInput = document.getElementById("custom-ad-size-height");
    app.dom.removeSizeConfirm = document.getElementById("remove-size-confirm");
    app.dom.removeSizeCancel = document.getElementById("remove-size-cancel");

    var jsonArr

    var storedAdSizes = localStorage.getItem("adSizes");
    var parsedAdSizes = JSON.parse(storedAdSizes);

    if (parsedAdSizes !== null && parsedAdSizes.length > 0) {
        app.dom.noCustomSizesMsg.style.display = "none";
    } else if (parsedAdSizes === null) {
        app.dom.noCustomSizesMsg.style.display = "block";
    }
}

function addListeners() {

    console.log("setting up the event listeners");

    app.dom.generateLinksButton.addEventListener("click", verifyJsons);
    app.dom.addCustomSizeButton.addEventListener("click", addRemoveCustomSize);
    app.dom.removeCustomSizeButton.addEventListener("click", addRemoveCustomSize);
    app.dom.addSizeConfirm.addEventListener("click", floatingSectionHandler)
    app.dom.addSizeCancel.addEventListener("click", floatingSectionHandler)
    app.dom.removeSizeConfirm.addEventListener("click", floatingSectionHandler)
    app.dom.removeSizeCancel.addEventListener("click", floatingSectionHandler)
    app.dom.addSizeConfirm.addEventListener("click", verifyCustomSize)


}

function verifyJsons() {

    setupDom();

    jsonArr = [];

    var jsonNameInputVal = app.dom.jsonInput.value;
    var splitJsonVal = jsonNameInputVal.split(",")

    for (var i = 0; i < splitJsonVal.length; i++) {
        jsonArr.push(splitJsonVal[i].replace(".json", "").trim());
    }

    console.log(splitJsonVal)

    var numberOfJsons = jsonArr.length;

    generateLinks(numberOfJsons)
}

function generateLinks(numberOfJsons) {

    setupDom()

    console.log(app.dom.adSizeCheckboxes)

    app.dom.linkOutput.value = "";

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

        linksArr.push(app.dom.urlInput.value);

        for (var k = 0; k < jsonArr.length; k++) {

            if (app.dom.devmodeCheckbox.checked === true) {

                var fullURL = linksArr[i] + "?devmode=" + jsonArr[k] + ".json";

                linksAndJsonArr.push(fullURL)

            } else {

                var fullURL = linksArr[i] + "?" + jsonArr[k];

                linksAndJsonArr.push(fullURL)
            }

        }
    }

    for (var i = 0; i < sizesArr.length; i++) {
        replacedArr.push(linksAndJsonArr[i].replace(regex, sizesArr[i]));
    }

    console.log(replacedArr)

    for (var i = 0; i < replacedArr.length; i++) {

        app.dom.linkOutput.value += replacedArr[i] + "\n";
    }
}

function addRemoveCustomSize(e) {

    console.log("creating a new size");

    var addRemoveDataset = e.currentTarget.dataset.action;

    app.dom.floatingContainer.style.pointerEvents = "all";
    app.dom.floatingContainer.style.opacity = 1;
    // app.dom.floatingInner.style.transform = "none";

    if (addRemoveDataset === "add") {

        app.dom.addSizeSection.style.display = "block";

    } else if (addRemoveDataset === "remove") {

        app.dom.removeSizeSection.style.display = "block";

    }

}

function floatingSectionHandler(e) {

    var actionDataset = e.currentTarget.dataset.action;

    app.dom.floatingContainer.style.pointerEvents = "none";
    app.dom.floatingContainer.style.opacity = 0;

    setTimeout(function() {

        if (actionDataset === "add") {

            app.dom.addSizeSection.style.display = "block";

        } else if (actionDataset === "remove") {

            app.dom.removeSizeSection.style.display = "block";

        } else if (actionDataset === "close") {

            app.dom.removeSizeSection.style.display = "none";
            app.dom.addSizeSection.style.display = "none";

        }

    }, 500)

}

function verifyCustomSize() {

    var widthInputVal = app.dom.addSizeWidthInput.value;
    var heightInputVal = app.dom.addSizeHeightInput.value;
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

    setupDom();
}

function addNewSize(adWidth, adHeight) {

    if (adWidth > 0 && adHeight > 0) {

        console.log("width: " + adWidth)
        console.log("height: " + adHeight)

        console.log(adWidth + "x" + adHeight);

        // create a new label element
        var newLabel = document.createElement("label");

        // add class
        newLabel.classList.add("size-label");
        newLabel.classList.add("custom-label");

        // create new input
        var newInput = document.createElement("input");

        // add the attributes and class
        newInput.classList.add("adsize-checkbox");
        newInput.setAttribute("type", "checkbox");
        newInput.setAttribute("name", "ad-size");
        newInput.setAttribute("data-adsize", adWidth + "x" + adHeight);

        newLabel.appendChild(newInput)
        newLabel.innerHTML += adWidth + "x" + adHeight;

        app.dom.customAdSizeContainer.appendChild(newLabel);

        saveCustomAdSize();
        setupDom();

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

    setupDom();

    // set the key as a variable
    var storedAdSizes = localStorage.getItem("adSizes");

    // parse the string back to HTML
    var parsedAdSizes = JSON.parse(storedAdSizes);

    if (parsedAdSizes !== null) {

        // loop through the array and add the elements to the container
        for (var i = 0; i < parsedAdSizes.length; i++) {
            app.dom.customAdSizeContainer.innerHTML += parsedAdSizes[i];
        }
    }

}

window.onload = init();