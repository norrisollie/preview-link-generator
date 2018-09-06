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
    app.dom.container = document.getElementById("container");

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
    app.dom.removeSizeWidthInput = document.getElementById("remove-custom-ad-size-width");
    app.dom.removeSizeHeightInput = document.getElementById("remove-custom-ad-size-height");
    app.dom.linkPreviewSection = document.getElementById("links-preview");
    app.dom.linksContainer = document.getElementById("links-container");
    app.dom.previewLinks = document.querySelectorAll(".preview-link");
    app.dom.previewLinksSelectAll = document.getElementById("preview-links-select-all");
    app.dom.previewLinksDeselectAll = document.getElementById("preview-links-deselect-all");
    app.dom.previewLinksOpenSelected = document.getElementById("preview-links-open-selected");
    app.dom.previewLinksSearch = document.getElementById("preview-links-search");
    app.dom.previewLinksCheckboxes = document.querySelectorAll(".preview-link-checkbox")
    app.dom.previewLinksCancel = document.getElementById("close-preview")
    app.dom.previewLinksCopy = document.getElementById("preview-links-copy-links");
    app.dom.linksTextarea = document.getElementById("links-textarea");

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
    app.dom.previewLinksCancel.addEventListener("click", floatingSectionHandler)
    app.dom.generateLinksButton.addEventListener("click", previewLinksHandler)
    app.dom.removeSizeConfirm.addEventListener("click", floatingSectionHandler)
    app.dom.removeSizeCancel.addEventListener("click", floatingSectionHandler)
    app.dom.addSizeConfirm.addEventListener("click", verifyCustomSize)
    app.dom.removeSizeConfirm.addEventListener("click", removeCustomSize)
    app.dom.previewLinksSelectAll.addEventListener("click", previewOptionsHandler)
    app.dom.previewLinksDeselectAll.addEventListener("click", previewOptionsHandler)
    app.dom.previewLinksOpenSelected.addEventListener("click", previewOptionsHandler)
    app.dom.previewLinksSearch.addEventListener("input", previewLinkSearchHandler)
    app.dom.previewLinksCopy.addEventListener("click", copyPreviewLinks)
}

function previewLinksClickHandler(e) {

    var targetLink = e.currentTarget.dataset.link;

    window.open(targetLink)
    window.focus();

}

function previewLinkSearchHandler(e) {

    setupDom();

    for (var i = 0; i < app.dom.previewLinksCheckboxes.length; i++) {
        app.dom.previewLinksCheckboxes[i].checked = false;
    }

    var filter = e.target.value;

    console.log(app.dom.previewLinks)

    for (var i = 0; i < app.dom.previewLinks.length; i++) {

        if (app.dom.previewLinks[i].innerHTML.indexOf(filter) > -1) {
            app.dom.previewLinks[i].parentNode.style.display = "flex";
            app.dom.previewLinks[i].parentNode.childNodes[0].removeAttribute("disabled");
        } else {
            app.dom.previewLinks[i].parentNode.style.display = "none";
            app.dom.previewLinks[i].parentNode.childNodes[0].setAttribute("disabled", "true");

        }

    }


}

function copyPreviewLinks(e) {

    var copyLinksArray = [];

    setupDom();

    console.log("copy")

    for (var i = 0; i < app.dom.previewLinksCheckboxes.length; i++) {

        if (app.dom.previewLinksCheckboxes[i].checked === true) {

            var copyText = app.dom.previewLinksCheckboxes[i].parentNode.childNodes[1].dataset.link;

            copyLinksArray.push(copyText);

            for(var i = 0; i < copyLinksArray.length; i++) {

                app.dom.linksTextarea.value += copyLinksArray[i] + "\n"
            }

            console.log(copyLinksArray)



            app.dom.linksTextarea.select();

            document.execCommand("copy")


            // console.log(app.dom.previewLinksCheckboxes[i].parentNode.childNodes[1].dataset.link);



            // var copyText = app.dom.previewLinksCheckboxes[i].parentNode.childNodes[1].dataset.link
            // copyText.select();
            // document.execCommand("copy");

        }

        console.log(app.dom.linksTextarea.value)
    }

    // var copyString = "";

    // for(var i = 0; i < copyLinksArray.length; i++) {

    //     copyString += copyLinksArray[i] + "\n"

    // }

    // copyText.select();
    //         document.execCommand("copy");

    // console.log(copyString)
}

function verifyJsons() {

    setupDom();

    jsonArr = [];

    var jsonNameInputVal = app.dom.jsonInput.value;
    var splitRegex = /[\n,]/;
    var splitJsonVal = jsonNameInputVal.split(splitRegex);

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

    app.dom.linksContainer.innerHTML = "";

    app.dom.linkOutput.value = "";

    var linksArr = [];
    var linksAndJsonArr = [];
    var sizesArr = [];
    var replacedArr = [];
    var replacedNameArr = [];

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
        replacedNameArr.push(linksAndJsonArr[i].replace(regex, sizesArr[i]).split("?"));
    }

    for (var i = 0; i < replacedArr.length; i++) {

        app.dom.linksTextarea.value += replacedArr[i] + "\n"

        // app.dom.linksTextarea.innerHTML += replacedArr[i] + "\n"


        // app.dom.linksContainer.innerHTML += "<label><input type='checkbox' target='_blank' name='adlink'><a class='preview-link' href='" + replacedArr[i] +"'>" + replacedNameArr[i][1] + "</a></label><br>";
        // app.dom.linksContainer.innerHTML += "<a class='preview-link' href='" + replacedArr[i] + "'>" + replacedNameArr[i][1] + "</a><br>";

        var linkLabel = document.createElement("label");
        linkLabel.classList.add("preview-link-label");
        app.dom.linksContainer.appendChild(linkLabel);

        var linkCheckbox = document.createElement("input");
        linkCheckbox.setAttribute("type", "checkbox");
        linkCheckbox.classList.add("preview-link-checkbox");
        linkCheckbox.addEventListener("change", checkboxChangeHandler)
        linkLabel.appendChild(linkCheckbox);

        var linkEl = document.createElement("div");
        linkEl.setAttribute("data-link", replacedArr[i]);
        linkEl.classList.add("preview-link");
        linkEl.innerHTML = replacedNameArr[i][1];
        linkLabel.appendChild(linkEl);
        linkEl.addEventListener("click", previewLinksClickHandler);
    }
}

function checkboxChangeHandler(e) {
    console.log("checked")

    app.dom.previewLinksOpenSelected.removeAttribute('disabled')

}

function previewOptionsHandler(e) {

    setupDom();

    var targetAction = e.currentTarget.dataset.action;

    switch (targetAction) {

        case "selectall":

            app.dom.previewLinksOpenSelected.removeAttribute("disabled");

            for (var i = 0; i < app.dom.previewLinksCheckboxes.length; i++) {

                if (!app.dom.previewLinksCheckboxes[i].hasAttribute("disabled")) {

                    app.dom.previewLinksCheckboxes[i].checked = true;

                }

            }

            break;

        case "deselectall":

            app.dom.previewLinksOpenSelected.setAttribute("disabled", "true");

            for (var i = 0; i < app.dom.previewLinksCheckboxes.length; i++) {

                app.dom.previewLinksCheckboxes[i].checked = false;

            }

            break;

        case "openselected":

            console.log("openselected");

            for (var i = 0; i < app.dom.previewLinksCheckboxes.length; i++) {

                if (app.dom.previewLinksCheckboxes[i].checked === true) {

                    window.open(app.dom.previewLinksCheckboxes[i].parentNode.childNodes[1].dataset.link);

                }


            }

            break;

    }


}

function addRemoveCustomSize(e) {

    console.log("creating a new size");

    var addRemoveDataset = e.currentTarget.dataset.action;

    app.dom.floatingContainer.style.pointerEvents = "all";
    app.dom.floatingContainer.style.opacity = 1;
    app.dom.container.style.overflow = "hidden";

    if (addRemoveDataset === "add") {

        app.dom.addSizeSection.style.display = "block";

    } else if (addRemoveDataset === "remove") {

        app.dom.removeSizeSection.style.display = "block";

    }

}

function previewLinksHandler(e) {

    var actionDataset = e.currentTarget.dataset.action;

    app.dom.floatingContainer.style.pointerEvents = "all";
    app.dom.floatingContainer.style.opacity = 1;
    app.dom.container.style.overflow = "hidden";


    if (actionDataset === "previewlinks") {

        app.dom.linkPreviewSection.style.display = "block";

    }
}

function floatingSectionHandler(e) {

    var actionDataset = e.currentTarget.dataset.action;
    app.dom.container.style.overflow = "visible";
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

function removeCustomSize() {

    var removeSizeInputWidthValue = app.dom.removeSizeWidthInput.value
    var removeSizeInputHeightValue = app.dom.removeSizeHeightInput.value

    var adWidthHeight = removeSizeInputWidthValue + "x" + removeSizeInputHeightValue;

    var count = -1;

    // set the key as a variable
    var storedAdSizes = localStorage.getItem("adSizes");

    // parse the string back to HTML
    var parsedAdSizes = JSON.parse(storedAdSizes);

    console.log(parsedAdSizes)

    for (var i = 0; i < parsedAdSizes.length; i++) {

        if (parsedAdSizes[i].indexOf(adWidthHeight) >= 0) {

            count++

        } else {
            console.log("no match");
        }
    }
    console.log(count)

    parsedAdSizes.splice(count, 1)
    localStorage.setItem("adSizes", JSON.stringify(parsedAdSizes));
    setupDom();
    setCustomSizes();

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