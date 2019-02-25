"use strict"

const app = {};

const init = () => {

  console.log("App is running.");

  // setup the dom and add listeners
  setupDom();
  addListeners();

};

const setupDom = () => {

    console.log("Setting up the DOM.");

    // object to store DOM elements
    app.dom = {};

    // app.dom.elementName = document.getElementByID("element-id");
    // app.dom.elementNames = document.querySelectorAll(".elements-class");

    app.dom.generateLinksButton = document.getElementById("generate-links-button");
    app.dom.indexPathInput = document.getElementById("index-path-input");
    app.dom.jsonNameInput = document.getElementById("json-names-input");
    app.dom.generateLinksButton = document.getElementById("generate-links-button");
    app.dom.sizeInputCheckbox = [...document.querySelectorAll(".size-input-checkbox")];
    app.dom.copyLinkTextarea = document.getElementById("copy-link-textarea");
    app.dom.copyTextareaWrapper = document.getElementById("copy-textarea-wrapper");

    // preview link section
    app.dom.previewLinkWrapper = [...document.querySelectorAll(".preview-link-wrapper")];

    // test wrapper to append links
    app.dom.overlayWrapper = document.getElementById("overlay-wrapper");

}

const addListeners = () => {

    console.log("Adding event listeners.");
    
    app.dom.generateLinksButton.addEventListener("click", generateLinksHandler);


    // now check to see if there are an parameters in the url
    checkUrlForParams();

}

const checkUrlForParams = () => {

    console.log("Checking for URL parameters.");

    // split the url if there is a "?" mark
    const windowURL = window.location.href.split("?");
    const paramsString = windowURL[1];

    // if statement to check if windowURL array returned has more than 1 entry
    if(windowURL.length > 1) {

        console.log("Looks like there are some parameters, time to verify if they are ok...");

        const paramsConfirmation = confirm("It looks like there are some parameters. Would you like to use them?");

        // if user clicks confirm/ok run function to get the parameter values
        if(paramsConfirmation) {
            verifyParams(paramsString);
        } else {
            console.log("There are parameters, but they will be ignored...")
        }

    } else {
        console.log("Looks like there are no parameters... all is good...")
    }
}

const verifyParams = (params) => {

    console.log("Verifying the parameters...");

    // regex required to find base url, json names and ad sizes
    const base_regex = /(?<=base=)(.*?)(?=\&)/g;
    const jsons_regex = /(?<=jsons=)(.*?)(?=\&)/g;
    const sizes_regex = /(?<=sizes=)(.*)/g;

    // use match to return an array with that matches what the regex is looking for
    const base_match = params.match(base_regex);
    const jsons_match = params.match(jsons_regex);
    const sizes_match = params.match(sizes_regex);

    // now split the jsons and sizes
    const jsons_split = jsons_match[0].split(",");
    const sizes_split = sizes_match[0].split(",");

    // get the base url as a string
    const base_url = base_match[0];

    // insert base url in to the base url input field
    app.dom.indexPathInput.value = base_url;

    // loop through json names and place each name within the textarea
    for(let i = 0; i < jsons_split.length; i++) {
        app.dom.jsonNameInput.innerHTML += jsons_split[i] + "\n";
    }

    // loop through sizes_split array
    for(let i = 0; i < sizes_split.length; i++) {
        // loop through the ad size checkboxes
        for(let k = 0; k < app.dom.sizeInputCheckbox.length; k++) {
            // get the ad size dataset from the checkbox
            let adSize = app.dom.sizeInputCheckbox[k].dataset.adSize;
            // use an if statement to compare the sizes
            if(adSize === sizes_split[i]) {
                // if they match then set the checkbox so it is checked
                app.dom.sizeInputCheckbox[k].checked = true;
            }
        }
    }
}

// runs when generate links button is clicked
const generateLinksHandler = () => {

    console.log("Generating links...");

    // get the values from index file path and json names
    const indexPathValue = app.dom.indexPathInput.value;
    let jsonNamesValue = app.dom.jsonNameInput.innerHTML.split("\n");
    jsonNamesValue = jsonNamesValue.filter(jsonName => jsonName != "")
    // counter to find out how many have been checked
    let numberChecked = 0;
    // arrays to store base url and ad sizes
    const indexPathArray = [];
    const adSizesArray = [];
    const fullUrlArray = [];

    // loop through checkboxes to increment counter if the checkbox is checked
    for(let i = 0; i < app.dom.sizeInputCheckbox.length; i++) {
        // get width and height of checked
        let adSize = app.dom.sizeInputCheckbox[i].dataset.adSize;
        // if checkbox is checked, loop through by the number of json names
        if(app.dom.sizeInputCheckbox[i].checked) {
            //increment counter
            numberChecked++
            for(let k = 0; k < jsonNamesValue.length; k++) {
                // push to the ad sizes array
                adSizesArray.push(adSize);
                // push base url to the base url array
                indexPathArray.push(indexPathValue);
            }
        }
    };

    // loop runs the number of times a checkbox is checked
    for (let i = 0; i < numberChecked; i++) {
        // loop to loop through the json names to then add index path on to the end of a url
        for (let k = 0; k < jsonNamesValue.length; k++) {
            // variable stores the index path and the json name
            let fullLinks = indexPathValue + "?" + jsonNamesValue[k];
            // push the full links to the array
            fullUrlArray.push(fullLinks)
        }
    }

    // time to replace the sizes with the checked sizes
    // regex to find 4 characters either side of an 'x'
    const  adSizeRegex = /\d{1,4}[x]\d{1,4}/g;
    // new array for the final replaced links with correct sizes
    const finalLinksArray = [];
    // variable initialised outside so it can be used outside for loop
    let linkElementsArray;
    // loop through fullUrlArray
    for(let i = 0; i < adSizesArray.length; i++) {
        // replace sizes with correct sizes
        const finalLink = fullUrlArray[i].replace(adSizeRegex, adSizesArray[i]);
        // push final links to new array
        finalLinksArray.push(finalLink);
    }
    formatLinkElements(finalLinksArray, adSizesArray);
}

// function to format the elements for the links
const formatLinkElements = (finalLinksArray, adSizesArray) => {

    console.log("Formatting the link elements...");

    console.log(adSizesArray)

    // empty then overlay wrapper to remove previous searches
    app.dom.overlayWrapper.innerHTML = "";

    // array for the buttons we will need for individual previews
    const previewButtonNames = ["open link", "copy link", "preview creative"]

    // empty array for preview link wrapper elements
    const previewLinkWrapperArray = [];

    // loop by how many links there are in the array
    for(let i = 0; i < finalLinksArray.length; i++) {

        // split full link to get the link names
        // works by splitting it at the ? and getting the second entry in the array
        let jsonName = finalLinksArray[i].split("?")[1];

        // create new element for each preview link
        let previewLinkWrapper = document.createElement("div");
        // add a class to it
        previewLinkWrapper.classList.add("preview-link-wrapper");
        // add the full link to it
        previewLinkWrapper.setAttribute("data-link", finalLinksArray[i]);

        // loop through ad sizes array so we can get the widths and heights
        for(let k = 0; k < adSizesArray.length; k++) {
            // get the width by splitting at x, first entry is the width
            let width = adSizesArray[i].split("x")[0];
            // get the height by splitting, the third entry is the height
            let height = adSizesArray[i].split("x")[1];
            // add the width
            previewLinkWrapper.setAttribute("data-width", width);
            // add the height
            previewLinkWrapper.setAttribute("data-height", height);
        }

        // create wrapper for the name wrapper and the buttons wrapper
        let nameButtonsWrapper = document.createElement("div");
        // add a class to the name buttons wrapper
        nameButtonsWrapper.classList.add("name-buttons-wrapper");
        // append to the preview link wrapper
        previewLinkWrapper.appendChild(nameButtonsWrapper);

        // create wrapper for link name element
        let linkNameWrapper = document.createElement("div");
        // add a class to the link name wrapper
        linkNameWrapper.classList.add("link-name-wrapper");
        // append wrapper to the preview link wrapper
        nameButtonsWrapper.appendChild(linkNameWrapper);

        // now create the checkbox and add the name of the creative
        let linkNameCheckbox = document.createElement("input");
        // set the type to be a checkbox
        linkNameCheckbox.setAttribute("type", "checkbox");
        // add a class name for the checkbox
        linkNameCheckbox.classList.add("link-name-checkbox");
        // set the id of the checkbox so that it is highlighted when the label is clicked
        linkNameCheckbox.setAttribute("id", jsonName)
        // append to the link name wrapper
        linkNameWrapper.appendChild(linkNameCheckbox);

        // now create the element for the name of the creative
        let linkName = document.createElement("label");
        // add a class name for the checkbox
        linkName.classList.add("link-name");
        // insert the name
        linkName.innerHTML += "../" + jsonName
        // set the for attribute so that the when clicked it highlights the checkbox
        linkName.setAttribute("for", jsonName)
        // append to the link name wrapper
        linkNameWrapper.appendChild(linkName);

        // create a wrapper for the link buttons wrapper
        let linkButtonsWrapper = document.createElement("div");
        // add a class to the link buttons wrapper
        linkButtonsWrapper.classList.add("link-buttons-wrapper");

        // loop through preview button names array to create the buttons
        for(let k = 0; k < previewButtonNames.length; k++) {
            
            // create the buttons
            let previewButtons = document.createElement("input");
            // set type to be a button
            previewButtons.setAttribute("type", "button");
            // add a class
            previewButtons.classList.add("single-preview-buttons", "input-button");
            // insert name of the button
            previewButtons.setAttribute("value", previewButtonNames[k]);
            // set the data value
            previewButtons.setAttribute("data-action", previewButtonNames[k]);
            // append them to link buttons wrapper
            linkButtonsWrapper.appendChild(previewButtons);
            // add event listener to the buttons
            previewButtons.addEventListener("click", singlePreviewButtonsHandler);
        }
        // append link buttons wrapper to the name buttons wrapper
        nameButtonsWrapper.appendChild(linkButtonsWrapper);
        // create a wrapper for the creative preview
        let creativePreviewWrapper = document.createElement("div");
        // add class to the creative preview wrapper
        creativePreviewWrapper.classList.add("creative-preview-wrapper");
        // append the link preview-wrapper to the creative-preview-wrapper
        previewLinkWrapper.appendChild(creativePreviewWrapper)
        // push preview link wrappers in to the array
        previewLinkWrapperArray.push(previewLinkWrapper);
    }
    // loop through array
    for(let i = 0; i < previewLinkWrapperArray.length; i++) {
        // and finally append it to the wrapper for the preview links
        app.dom.overlayWrapper.appendChild(previewLinkWrapperArray[i]);
    }
}

const singlePreviewButtonsHandler = (e) => {

    console.log("Single button click handler is running...");

    // retrieve action dataset value
    const action = e.currentTarget.dataset.action;
    // variable to get the full link
    const link = e.currentTarget.parentNode.parentNode.parentNode.dataset.link;
    // variable to get the width
    const width = e.currentTarget.parentNode.parentNode.parentNode.dataset.width;
    // variable to get the height
    const height = e.currentTarget.parentNode.parentNode.parentNode.dataset.height;
    // find the creative preview wrapper
    const creativePreviewWrapper = e.currentTarget.parentNode.parentNode.parentNode.childNodes[1];
    
    // switch statement to run code depending on what has been pressed
    switch(action) {

        // if open link
        case "open link":
        // log the current action
        console.log("Action is: " + action)
        // opens the link in a new window
        window.open(link);

        break;

        // if copy link
        case "copy link":

        console.log("Action is: " + action)

        // show prompt for user to see link has been copied to clipboard
        app.dom.copyTextareaWrapper.style.opacity = 1;
        // hide message after 3 seconds
        let messageTimeout = setTimeout(function() {
            app.dom.copyTextareaWrapper.style.opacity = 0;
        }, 3000);

        // clear anything from copy links textarea
        app.dom.copyLinkTextarea.innerHTML = "";
        // insert the link in the textarea
        app.dom.copyLinkTextarea.innerHTML = link;
        // select text in the copy link textarea
        app.dom.copyLinkTextarea.select();
        // copy selected text to copy to clipboard
        document.execCommand("copy");

        break;

        // if preview creative
        case "preview creative":

        console.log("Action is: " + action);

        // set display property to flex
        creativePreviewWrapper.style.display = "flex";
        // empty the creative preview wrapper
        creativePreviewWrapper.innerHTML = "";
        // create a wrapper for the iframe
        let creativeIframeWrapper = document.createElement("div");
        // add a class
        creativeIframeWrapper.classList.add("creative-iframe-wrapper");

        // create an iframe for the creative
        let creativeIframe = document.createElement("iframe");
        // add the src
        creativeIframe.setAttribute("src", link);
        // add the width
        creativeIframe.setAttribute("width", width);
        // add the height
        creativeIframe.setAttribute("height", height);
        // add a class
        creativeIframe.classList.add("creative-iframe");
        // append inthe creative iframe wrapper
        creativeIframeWrapper.appendChild(creativeIframe);

        // append to creative preview wrapper
        creativePreviewWrapper.appendChild(creativeIframeWrapper);

        break;
    }






}

window.onload = init;