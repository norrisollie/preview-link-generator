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

    // preview link section
    app.dom.previewLinkWrapper = [...document.querySelectorAll(".preview-link-wrapper")];

    // test wrapper to append links
    app.dom.testWrapper = document.getElementById("test-wrapper");

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
            // get the ad size dataset from the checbox
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

    // loop through checkboxes to increment counter if the checbox is checked
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
    formatLinkElements(finalLinksArray);
}

// function to format the elements for the links
const formatLinkElements = (finalLinksArray) => {

    console.log("Formatting the link elements...");

    // empty array for preview link wrapper elements
    const previewLinkWrapperArray = [];

    // loop by how many links there are in the array
    for(let i = 0; i < finalLinksArray.length; i++) {
        // create new element for each preview link
        let previewLinkWrapper = document.createElement("div");
        // add a class to it
        previewLinkWrapper.classList.add("preview-link-wrapper");

        // create labels
        let previewLinkLabels = document.createElement("label")
        // add a class to the label
        previewLinkLabels.classList.add("preview-links-label")
        // insert name in to the label
        previewLinkLabels.innerHTML += "JSON name here";
        // append label
        previewLinkWrapper.appendChild(previewLinkLabels)

        // create checkboxes
        let previewLinkCheckbox = document.createElement("input");
        // set the type
        previewLinkCheckbox.setAttribute("type", "checkbox");
        // append the checkbox to the wrapper
        previewLinkLabels.appendChild(previewLinkCheckbox);
        // and push it to the array
        previewLinkWrapperArray.push(previewLinkWrapper);
    }

    for(let i = 0; i < previewLinkWrapperArray.length; i++) {
        // and finally append it to the wrapper for the preview links
        app.dom.testWrapper.appendChild(previewLinkWrapperArray[i]);
    }

    console.log(previewLinkWrapperArray)



}

window.onload = init;