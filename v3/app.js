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
    app.dom.creativeContainer = document.querySelectorAll(".creative-container");
    app.dom.linkSearchInput = document.getElementById("links-search-input")
    app.dom.closePreviews = document.getElementById("close-previews");
    app.dom.generateButton = document.getElementById("generate-button");
    app.dom.floatingContainer = document.querySelector(".floating-container")
    app.dom.linksTextarea = document.getElementById("links-textarea");
    app.dom.indexPathInput = document.getElementById("index-path-input")
    app.dom.jsonNameTextarea = document.getElementById("json-name-textarea")
    app.dom.adSizeCheckbox = document.querySelectorAll(".size-checkbox")
    app.dom.creatives = document.getElementById("creatives")
    app.dom.copiedMessage = document.getElementById("copied-message")
}

function addListeners() {

    console.log("addListeners");

    for (var i = 0; i < app.dom.previewButtons.length; i++) {
        app.dom.previewButtons[i].addEventListener("click", previewButtonsClickHandler);
    }

    app.dom.linkSearchInput.addEventListener("input", previewLinkSearchHandler)
    app.dom.closePreviews.addEventListener("click", closePreviewClickHandler);
    app.dom.generateButton.addEventListener("click", verifyJsons);
}

function reloadButtonClickHandler(e) {

    var targetPreview = e.currentTarget.parentNode.parentNode.childNodes[0];

    console.log(targetPreview)

    targetPreview.src += "";
}

function previewButtonsClickHandler(e) {

    var targetAction = e.currentTarget.dataset.action;

    app.dom.linksTextarea.innerHTML = "";

    for (var i = 0; i < app.dom.creativeCheckboxes.length; i++) {

        // var previewUrl = app.dom.creativeCheckboxes[i].parentNode.parentNode.dataset.url;
        var previewUrl = app.dom.creativeCheckboxes[i].parentNode.parentNode.parentNode.dataset.preview
        var adWidth = app.dom.creativeCheckboxes[i].parentNode.parentNode.parentNode.dataset.width
        var adHeight = app.dom.creativeCheckboxes[i].parentNode.parentNode.parentNode.dataset.height
        var previewInner = app.dom.creativeCheckboxes[i].parentNode.parentNode.parentNode.childNodes[1].childNodes[0]
        var previewContainer = app.dom.creativeCheckboxes[i].parentNode.parentNode.parentNode.childNodes
        var creativeContainer = app.dom.creativeCheckboxes[i].parentNode.parentNode.parentNode

        switch (targetAction) {

            case "select":

                app.dom.creativeCheckboxes[i].checked = true;

                break;

            case "deselect":

                app.dom.creativeCheckboxes[i].checked = false;

                break;

            case "copy":

                app.dom.copiedMessage.style.display = "block";

                setTimeout(function() {
                    app.dom.copiedMessage.style.opacity = "1";
                },10);

                setTimeout(function() {
                    
                    setTimeout(function() {

                        app.dom.copiedMessage.style.display = "none";

                    }, 500);

                    app.dom.copiedMessage.style.opacity = "0";

                }, 2000)





                if (app.dom.creativeCheckboxes[i].checked === true) {

                    app.dom.linksTextarea.innerHTML += previewUrl + "\n";

                    app.dom.linksTextarea.select();

                    document.execCommand("copy");

                }

                break;

            case "open":

                if (app.dom.creativeCheckboxes[i].checked === true) {

                    window.open(previewUrl);
                    window.focus();

                }

                break;
            case "preview":

                if (app.dom.creativeCheckboxes[i].checked === true) {

                    previewInner.innerHTML = "";
                    creativeContainer.classList.add("previews")
                    app.dom.creativePreviewContainer[i].style.display = "flex";

                    var http = new XMLHttpRequest();
                    http.open('HEAD', previewUrl, false);
                    http.send();
                    if (http.status != 404) {
                        var optionsContainer = document.createElement("div");
                        var reloadButton = document.createElement("input");
                        reloadButton.setAttribute("type", "button")
                        reloadButton.setAttribute("value", "Reload Ad")
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
                        optionsContainer.appendChild(reloadButton)

                    } else {

                        console.log("preview not working: " + previewUrl);

                        previewInner.innerHTML += "404 (Not Found)";

                    }
                }
                break;
        }
    }
}

function closePreviewClickHandler() {

    app.dom.floatingContainer.style.opacity = 0;

    setTimeout(function() {
        app.dom.floatingContainer.style.display = "none";
    }, 500);

}


function previewLinkSearchHandler(e) {

    console.log("inputted");

    for (var i = 0; i < app.dom.creativeCheckboxes.length; i++) {
        app.dom.creativeCheckboxes[i].checked = false;
    }

    var filter = e.target.value

    console.log(filter)

    for (var i = 0; i < app.dom.creativeContainer.length; i++) {

        var name = app.dom.creativeContainer[i].dataset.name

        if (name.indexOf(filter) > -1) {
            console.log("Matching: \n " + name);

            app.dom.creativeContainer[i].style.display = "block";

        } else {
            console.log("Not matching: \n " + name);
            app.dom.creativeContainer[i].style.display = "none";
        }

    }
}

function verifyJsons() {


    jsonArr = [];

    var jsonFileNames = app.dom.jsonNameTextarea.value;
    var splitRegex = /[\n,]/;
    var splitJsonVal = jsonFileNames.split(splitRegex);

    for (var i = 0; i < splitJsonVal.length; i++) {
        jsonArr.push(splitJsonVal[i].replace(".json", "").trim());
    }

    console.log(splitJsonVal)

    var numberOfJsons = jsonArr.length;

    generateLinks(numberOfJsons)

}

function generateLinks(numberOfJsons) {

    app.dom.creatives.innerHTML = "";

    var linksArr = [];
    var linksAndJsonArr = [];
    var sizesArr = [];
    var replacedArr = [];
    var replacedNameArr = [];

    var indexPathValue = app.dom.indexPathInput.value;

    var numberChecked = 0;
    var regex = /\d{1,4}[x]\d{1,4}/g;

    // loop through all checkboxes to see what is checked
    for (var k = 0; k < app.dom.adSizeCheckbox.length; k++) {

        if (app.dom.adSizeCheckbox[k].checked === true) {

            numberChecked++

            // store the size of the ad in a variable
            var checkedWidth = app.dom.adSizeCheckbox[k].parentNode.parentNode.dataset.width;
            var checkedHeight = app.dom.adSizeCheckbox[k].parentNode.parentNode.dataset.height;

            var checkedSize = checkedWidth + "x" + checkedHeight;

            console.log(checkedSize);

            for (var i = 0; i < numberOfJsons; i++) {

                sizesArr.push(checkedSize)

            }
        }
    }

    console.log(sizesArr)

    for (var i = 0; i < numberChecked; i++) {

        linksArr.push(indexPathValue);

        for (var k = 0; k < jsonArr.length; k++) {

            var fullURL = linksArr[i] + "?" + jsonArr[k];

            linksAndJsonArr.push(fullURL)
        }
    }

    for (var i = 0; i < sizesArr.length; i++) {
        replacedArr.push(linksAndJsonArr[i].replace(regex, sizesArr[i]));
        replacedNameArr.push(linksAndJsonArr[i].replace(regex, sizesArr[i]).split("?"));
    }

    console.log(replacedArr)

    for (var i = 0; i < replacedArr.length; i++) {

        console.log(replacedArr[i]);

        var previewUrl = replacedArr[i];
        var jsonName = replacedArr[i].split("?")[1];
        var adSize = jsonName.match(regex)[0].split("x");
        var adWidth = adSize[0];
        var adHeight = adSize[1];

        var creativeContainer = '<div class="creative-container" data-width="' + adWidth + '" data-height="' + adHeight + '" data-preview="' + previewUrl + '" data-name="' + jsonName + '">'
        + '<div class="creative-name-container">'
        + '<label class="creative-label">'
        + '<input class="creative-checkbox" type="checkbox">'
        + '<div class="creative-name">' + jsonName + '</div>'
        + '</label>'
        + '</div>'
        + '<div class="creative-preview-container">'
        + '<div class="creative-preview"></div>'
        + '</div>'
        + '</div>'

        // // container
        // var creativeContainer = document.createElement("div");

        // creativeContainer.classList.add("creative-container");
        // creativeContainer.setAttribute("data-width", adWidth)
        // creativeContainer.setAttribute("data-height", adHeight)
        // creativeContainer.setAttribute("data-preview", previewUrl)
        // creativeContainer.setAttribute("data-name", jsonName)

        // // name container
        // var creativeNameContainer = document.createElement("div");

        // creativeNameContainer.classList.add("creative-name-container")

        // creativeContainer.appendChild(creativeNameContainer);

        // // label
        // var creativeLabel = document.createElement("label");

        // creativeLabel.classList.add("creative-label");

        // creativeNameContainer.appendChild(creativeLabel);

        // var creativeCheckbox = document.createElement("input")

        // creativeCheckbox.classList.add("creative-checkbox");
        // creativeCheckbox.setAttribute("type", "checkbox");

        // creativeLabel.appendChild(creativeCheckbox);

        // // name
        // var creativeName = document.createElement("div")

        // creativeName.classList.add("creative-name");
        // creativeName.innerHTML = jsonName;

        // creativeLabel.appendChild(creativeName);

        // // preview container
        // var creativePreviewContainer = document.createElement("div");

        // creativePreviewContainer.classList.add("creative-preview-container");

        // creativeContainer.appendChild(creativePreviewContainer);

        // // creative preview
        // var creativePreview = document.createElement("div");

        // creativePreview.classList.add("creative-preview");

        // creativePreviewContainer.appendChild(creativePreview);

        app.dom.creatives.innerHTML += creativeContainer;

        // unhide floating container
        app.dom.floatingContainer.style.display = "flex";
        setTimeout(function() {
            app.dom.floatingContainer.style.opacity = 1;
        },10)

    }

    setupDom();
}

function generateButtonClickHandler() {

    console.log("generating links");

    var indexPathValue = app.dom.indexPathInput.value;
    var jsonFileNames = app.dom.jsonNameTextarea.value;
    var jsonFileNamesArray = jsonFileNames.split("\n");
    var jsonCount = jsonFileNamesArray.length;
    var checkboxCount = 0;

    var sizesArray = [];
    var linksArray = [];
    var jsonArray = [];

    for (var i = 0; i < app.dom.adSizeCheckbox.length; i++) {

        var checkboxWidth = app.dom.adSizeCheckbox[i].parentNode.parentNode.dataset.width;
        var checkboxHeight = app.dom.adSizeCheckbox[i].parentNode.parentNode.dataset.height;

        if (app.dom.adSizeCheckbox[i].checked === true) {
            console.log("true: " + checkboxWidth + "x" + checkboxHeight);
            checkboxCount++
        } else {
            console.log("false: " + checkboxWidth + "x" + checkboxHeight);
        }
    }
}







window.onload = init();