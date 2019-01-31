// global app variable
let app = {};

// function to setup DOM so the variables can be used without scope issues
const setupDom = () => {

    console.log("Setting up DOM.")

    // dom object
    app.dom = {};

    // variables here
    app.dom.indexPathInput = document.getElementById("index-path-input");
    app.dom.jsonNameInput = document.getElementById("json-name-input");
    app.dom.adSizeCheckboxes = [...document.querySelectorAll(".ad-size-checkbox")];
    app.dom.adSizeWrapper = [...document.querySelectorAll(".ad-size-wrapper")];
    app.dom.closeOverlayButton = document.getElementById("close-overlay-button");
    app.dom.generateLinksButton = document.getElementById("generate-links-button");
    app.dom.overlayContainer = document.getElementById("overlay-container");
    app.dom.copyLinksTextarea = document.getElementById("copy-links-textarea");
    app.dom.previewOptionsButton = document.querySelectorAll(".preview-options-button");
    app.dom.jsonNameCheckbox = document.querySelectorAll(".json-name-checkbox");
    app.dom.jsonNameLabel = document.querySelectorAll(".json-name-label");
    app.dom.jsonNameCheckboxWrapper = [...document.querySelectorAll(".json-name-checkbox-wrapper")];
    app.dom.jsonNameWrapper = [...document.querySelectorAll(".json-name-wrapper")];
    app.dom.jsonPreviewWrapper = [...document.querySelectorAll(".json-preview-wrapper")];
    app.dom.jsonPreviewButtons = [...document.querySelectorAll(".json-preview-buttons")];

    app.dom.indexPathInput = document.getElementById("index-path-input");
    app.dom.jsonNameInput = document.getElementById("json-name-input");

    // when DOM is ready, run function to check url for paramaters
    checkUrl();

}

// function to add event liteners
const addEventListeners = () => {

    app.dom.closeOverlayButton.addEventListener("click", closeOverlayHandler);
    app.dom.generateLinksButton.addEventListener("click", openOverlayHandler);
    app.dom.generateLinksButton.addEventListener("click", generatePreviewLinks);

    for (let i = 0; i < app.dom.previewOptionsButton.length; i++) {
        app.dom.previewOptionsButton[i].addEventListener("click", previewOptionsClickHandler);
    }

    for (let i = 0; i < app.dom.jsonPreviewButtons.length; i++) {
        app.dom.jsonPreviewButtons[i].addEventListener("click", jsonPreviewOptionsClickHandler);
    }
}

// function to check the url
const checkUrl = () => {

    console.log("Checking for parameters.");

    // split the url if theres a question mark (this means there will be parameters)
    let urlCheck = window.location.href.split("?");

    // if the url has parameters, there will be an array with more than one entry
    if (urlCheck.length > 1) {

        console.log("There are some parameters. Running urlSplitHandler.")

        // run function to split url and get the parameters
        urlSplitHandler();

        // otherwise load preview link generator like normal
    } else {

        console.log("There are no parameters.");

    };
};

// if there are paramaters, this function will run
const urlSplitHandler = () => {

    // split url at question mark
    let urlSplit = window.location.href.split("?")[1];

    // regex required to find the base url, ad sizes and json names
    let baseUrl_regex = /(?<=base_url=)(.*?)(?=\&)/g;
    let jsonNames_regex = /(?<=json_names=)(.*)/g;
    let adSizes_regex = /(?<=ad_sizes=)(.*?)(?=\&)/g;

    // use match to return an array that contains a string with matching characters
    let baseUrl = urlSplit.match(baseUrl_regex);
    let jsonNames = urlSplit.match(jsonNames_regex);
    let adSizes = urlSplit.match(adSizes_regex);

    // split the ad sizes and json names, returns an array
    let adSizesArray = adSizes[0].split(",");
    let jsonNamesArray = jsonNames[0].split(",");

    // log the base url, ad sizes and json names
    // console.log(baseUrl);
    // console.log(adSizesArray);
    // console.log(jsonNamesArray);

    // insert base url in to the index path input
    app.dom.indexPathInput.value = baseUrl;

    // loop through json names array to get json names
    jsonNamesArray.map(jsonName => {

        // insert json names in to the textarea
        app.dom.jsonNameInput.innerHTML += jsonName + "\n";

    });

    // loop through the ad sizes array to see what sizes there are
    adSizesArray.map(size => {

        // loop through ad checkboxes
        app.dom.adSizeCheckboxes.map(checkboxSize => {

            // if a size in the parameters exists
            if (size === checkboxSize.id) {

                // set the checked property to true
                checkboxSize.checked = true;

            }
        });
    });
}

// function to get the base url, json names and ad sizes
const generatePreviewLinks = () => {

    // variables to get values from inputs
    let indexPathInputValue = app.dom.indexPathInput.value;
    let jsonNameInputValue = app.dom.jsonNameInput.value;

    // split them in to an array by new line
    let splitJsonNameInputValue = jsonNameInputValue.split("\n");

    // use filter to remove empty strings in array
    let filteredJsonNameInputValue = splitJsonNameInputValue.filter(jsonName => jsonName != "");

    // counter to get the number of ad sizes
    let numberOfAdSizes = 0;

    // counter that used the length of the json names array to figure out how many jsons there are
    let numberOfJsons = filteredJsonNameInputValue.length;

    let indexUrlPathArray = [];
    let jsonNamesArray = [];
    let adSizesArray = [];

    // loop through adSizeWrapper array to see what sizes are checked
    app.dom.adSizeWrapper.map(adSize => {

        let adSizeCheckbox = adSize.childNodes[1];
        let adSizeWidth = adSizeCheckbox.dataset.width;
        let adSizeHeight = adSizeCheckbox.dataset.height;

        // if ad size checboxes are checked
        if (adSizeCheckbox.checked) {

            // increment the number of ad sizes counter
            numberOfAdSizes++

            // loop through the json name input and duplicated checked sizes based on the number of json files
            for (let i = 0; i < filteredJsonNameInputValue.length; i++) {

                // variable to store the ads width and height 
                let adWidthHeight = adSizeWidth + "x" + adSizeHeight;

                // push the width and height to the ad sizes array
                adSizesArray.push(adWidthHeight);

            }
        }
    });

    // empty array for the full links (before regex)
    let fullLinksArray = [];

    // loop runs for the number of times links there should be
    for (let i = 0; i < numberOfAdSizes; i++) {

        // loop within to add the json names to the end of the url
        for (let k = 0; k < filteredJsonNameInputValue.length; k++) {

            // variable stores the index path and the json name
            let fullLinks = indexPathInputValue + "?" + filteredJsonNameInputValue[k];

            // push the full links to the array
            fullLinksArray.push(fullLinks)
        }
    }

    // regex to find the four numbers either side of and "x" (the size of the ad)
    let adSizeRegex = /\d{1,4}[x]\d{1,4}/g;

    // array to store the regexed links
    let replacedLinksArray = [];

    // loop through the adSizes array to replace the placeholder ad size
    adSizesArray.map((adSize, index) => {

        // replaces the placeholder ad size with the correct one
        let replaceSize = fullLinksArray[index].replace(adSizeRegex, adSize);

        // push the replaced links to a new array
        replacedLinksArray.push(replaceSize);

    });

}

// one function that controls the preview options buttons
const previewOptionsClickHandler = (e) => {

    // gets the action dataset value
    let previewOptionAction = e.currentTarget.dataset.action;

    // switch statement to determine what to run when preview option button runs
    switch (previewOptionAction) {

        case "select":

            // loop through all checkboxes and check all
            for (let i = 0; i < app.dom.jsonNameCheckbox.length; i++) {
                app.dom.jsonNameCheckbox[i].checked = true;
            }

            break;

        case "deselect":

            // loop through all checkboxes and uncheck all
            for (let i = 0; i < app.dom.jsonNameCheckbox.length; i++) {
                app.dom.jsonNameCheckbox[i].checked = false;
            }

            break;

        case "copy":

            // clear contents of the textarea
            app.dom.copyLinksTextarea.innerHTML = "";


            // loop through all checkboxes
            for (let i = 0; i < app.dom.jsonNameCheckbox.length; i++) {
                // target parent to get access to child nodes (the checbox within the wrapper);
                if (app.dom.jsonNameCheckbox[i].checked) {
                    // get the full url from the dataset
                    let fullUrl = app.dom.jsonNameLabel[i].dataset.fullUrl + "\n";
                    // set the innerHTML of the textarea to contain the links
                    app.dom.copyLinksTextarea.innerHTML += fullUrl;
                };
            }

            // select all the text in the textarea
            app.dom.copyLinksTextarea.select();
            // copy the contents of the textarea
            document.execCommand("copy");

            break;

        case "open":

            // loop through all checkboxes
            for (let i = 0; i < app.dom.jsonNameCheckboxWrapper.length; i++) {
                // target parent to get access to child nodes (the checbox within the wrapper);
                if (app.dom.jsonNameCheckbox[i].checked) {
                    // get the full url from the dataset
                    let fullUrl = app.dom.jsonNameLabel[i].dataset.fullUrl + "\n";
                    // set the innerHTML of the textarea to contain the links
                    window.open(fullUrl)
                };
            }

            break;

        case "preview":

            for (let i = 0; i < app.dom.jsonNameCheckboxWrapper.length; i++) {
                // target parent to get access to child nodes (the checbox within the wrapper);
                if (app.dom.jsonNameCheckbox[i].checked) {
                    let openButton = app.dom.jsonNameCheckboxWrapper[i].parentNode.childNodes[3].childNodes[5];
                    let closeButton = app.dom.jsonNameCheckboxWrapper[i].parentNode.childNodes[3].childNodes[7];
                    let jsonPreviewContainer = app.dom.jsonNameCheckboxWrapper[i].parentNode.parentNode.childNodes[3];
                    
                    openButton.style.display = "none";
                    closeButton.style.display = "block";
                    jsonPreviewContainer.style.display = "flex";

                };
            }

            break;
    }
}

// one function that controls the preview options buttons
const jsonPreviewOptionsClickHandler = (e) => {

    // gets the action dataset value
    let previewOptionAction = e.currentTarget.dataset.action;
    let jsonNameWrapper = e.currentTarget.parentNode.parentNode;
    let jsonPreviewWrapper = e.currentTarget.parentNode.parentNode.parentNode.childNodes[3];

    let openButton = e.currentTarget.parentNode.childNodes[5];
    let closeButton = e.currentTarget.parentNode.childNodes[7];

    let fullUrl = e.currentTarget.parentNode.parentNode.childNodes[1].childNodes[3].dataset.fullUrl;

    // switch statement to determine what to run when preview option button runs
    switch (previewOptionAction) {

        case "copy-link":

            // clear the textarea
            app.dom.copyLinksTextarea.innerHTML = "";
            // insert full url in to the textarea
            app.dom.copyLinksTextarea.innerHTML = fullUrl;
            // select all the text in the textarea
            app.dom.copyLinksTextarea.select();
            // copy the contents of the textarea
            document.execCommand("copy");

            break;

        case "open-link":

            // open url in window
            window.open(fullUrl);

            break;

        case "open-preview":

            // set the buttons to be hidden/on show
            openButton.style.display = "none";
            closeButton.style.display = "block";
            // set preview wrapper to flex (as it was hidden before)
            jsonPreviewWrapper.style.display = "flex";
            // add class to wrapper
            jsonNameWrapper.classList.add("preview-active");

            break;

        case "close-preview":

            // set the buttons to be hidden/on show
            closeButton.style.display = "none";
            openButton.style.display = "block";
            // set preview wrapper to flex (as it was hidden before)
            jsonPreviewWrapper.style.display = "none";
            // add class to wrapper
            jsonNameWrapper.classList.remove("preview-active");

            break;
    }
}


// close overlay function
const closeOverlayHandler = () => {

    console.log("clicked");

    // add hidden class to overlay container
    app.dom.overlayContainer.classList.add("hidden");

}

// open overlay container
const openOverlayHandler = () => {

    console.log("clicked");

    // remove hidden class to show overlay container and its contents
    app.dom.overlayContainer.classList.remove("hidden");

}

// init function runs on window load
const init = () => {

    // run these functions
    setupDom();
    addEventListeners();

}

window.onload = init();