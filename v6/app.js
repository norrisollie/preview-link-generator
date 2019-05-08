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

  app.dom.generateLinksButton = document.getElementById(
    "generate-links-button"
  );
  app.dom.indexPathInput = document.getElementById("index-path-input");
  app.dom.jsonNameInput = document.getElementById("json-names-input");
  app.dom.generateLinksButton = document.getElementById(
    "generate-links-button"
  );
  app.dom.sizeInputCheckbox = [
    ...document.querySelectorAll(".size-input-checkbox")
  ];
  app.dom.copyLinkTextarea = document.getElementById("copy-link-textarea");
  app.dom.copyTextareaWrapper = document.getElementById(
    "copy-textarea-wrapper"
  );

  // preview link section
  app.dom.previewLinkWrapper = [
    ...document.querySelectorAll(".preview-link-wrapper")
  ];

  // test wrapper to append links
  app.dom.linkWrapper = document.getElementById("link-wrapper");

  // preview links container
  app.dom.previewLinksSection = document.getElementById(
    "preview-links-section"
  );

  // preview all links buttons
  app.dom.overlayPreviewButtons = [
    ...document.querySelectorAll(".overlay-preview-buttons")
  ];

  // link name checkboxes
  app.dom.linkNameCheckbox = [
    ...document.querySelectorAll(".link-name-checkbox")
  ];

  // preview link wrappers
  app.dom.previewLinkWrappers = [
    ...document.querySelectorAll(".preview-link-wrapper")
  ];

  app.dom.creativeSearchInput = document.getElementById(
    "creative-search-input"
  );

  // close overlay button
  app.dom.closeOverlayButton = document.getElementById("close-overlay-button");

  // overlay container
  app.dom.overlayContainerWrapper = document.getElementById(
    "overlay-container-wrapper"
  );

  // preview wrapper in overlay
  app.dom.overlayPreviewWrapper = document.getElementById(
    "overlay-preview-wrapper"
  );
};

const addListeners = () => {
  console.log("Adding event listeners.");

  app.dom.generateLinksButton.addEventListener("click", generateLinksHandler);
  app.dom.creativeSearchInput.addEventListener("input", creativeSearchHandler);
  app.dom.closeOverlayButton.addEventListener("click", closeOverlayHandler);

  for (let i = 0; i < app.dom.overlayPreviewButtons.length; i++) {
    app.dom.overlayPreviewButtons[i].addEventListener(
      "click",
      overlayPreviewButtonsHandler
    );
  }

  // now check to see if there are an parameters in the url
  checkUrlForParams();
};

const checkUrlForParams = () => {
  console.log("Checking for URL parameters.");

  // split the url if there is a "?" mark
  const windowURL = window.location.href.split("?");
  const paramsString = windowURL[1];

  // if statement to check if windowURL array returned has more than 1 entry
  if (windowURL.length > 1) {
    console.log(
      "Looks like there are some parameters, time to verify if they are ok..."
    );

    const paramsConfirmation = confirm(
      "It looks like there are some parameters. Would you like to use them?"
    );

    // if user clicks confirm/ok run function to get the parameter values
    if (paramsConfirmation) {
      verifyParams(paramsString);
    } else {
      console.log("There are parameters, but they will be ignored...");
    }
  } else {
    console.log("Looks like there are no parameters... all is good...");
  }
};

const verifyParams = params => {
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

  // clear textarea
  app.dom.jsonNameInput.innerHTML = "";

  // loop through json names and place each name within the textarea
  for (let i = 0; i < jsons_split.length; i++) {
    app.dom.jsonNameInput.innerHTML += jsons_split[i] + "\n";
  }

  // loop through sizes_split array
  for (let i = 0; i < sizes_split.length; i++) {
    // loop through the ad size checkboxes
    for (let k = 0; k < app.dom.sizeInputCheckbox.length; k++) {
      // get the ad size dataset from the checkbox
      let adSize = app.dom.sizeInputCheckbox[k].dataset.adSize;
      // use an if statement to compare the sizes
      if (adSize === sizes_split[i]) {
        // if they match then set the checkbox so it is checked
        app.dom.sizeInputCheckbox[k].checked = true;
      }
    }
  }
};

// runs when generate links button is clicked
const generateLinksHandler = () => {
  console.log("Generating links...");

  // get the values from index file path and json names
  const indexPathValue = app.dom.indexPathInput.value;
  let jsonNamesValue = app.dom.jsonNameInput.value.split("\n");
  jsonNamesValue = jsonNamesValue.filter(jsonName => jsonName != "");
  // counter to find out how many have been checked
  let numberChecked = 0;
  // arrays to store base url and ad sizes
  const indexPathArray = [];
  const adSizesArray = [];
  const fullUrlArray = [];

  // loop through checkboxes to increment counter if the checkbox is checked
  for (let i = 0; i < app.dom.sizeInputCheckbox.length; i++) {
    // get width and height of checked
    let adSize = app.dom.sizeInputCheckbox[i].dataset.adSize;
    // if checkbox is checked, loop through by the number of json names
    if (app.dom.sizeInputCheckbox[i].checked) {
      //increment counter
      numberChecked++;
      for (let k = 0; k < jsonNamesValue.length; k++) {
        // push to the ad sizes array
        adSizesArray.push(adSize);
        // push base url to the base url array
        indexPathArray.push(indexPathValue);
      }
    }
  }

  // loop runs the number of times a checkbox is checked
  for (let i = 0; i < numberChecked; i++) {
    // loop to loop through the json names to then add index path on to the end of a url
    for (let k = 0; k < jsonNamesValue.length; k++) {
      // variable stores the index path and the json name
      let fullLinks = indexPathValue + "?" + jsonNamesValue[k];
      // push the full links to the array
      fullUrlArray.push(fullLinks);
    }
  }

  // time to replace the sizes with the checked sizes
  // regex to find 4 characters either side of an 'x'
  const adSizeRegex = /\d{1,4}[x]\d{1,4}/g;
  // new array for the final replaced links with correct sizes
  const finalLinksArray = [];
  // variable initialised outside so it can be used outside for loop
  let linkElementsArray;
  // loop through fullUrlArray
  for (let i = 0; i < adSizesArray.length; i++) {
    // replace sizes with correct sizes
    const finalLink = fullUrlArray[i].replace(adSizeRegex, adSizesArray[i]);
    // push final links to new array
    finalLinksArray.push(finalLink);
  }
  formatLinkElements(finalLinksArray, adSizesArray);
};

// function to format the elements for the links
const formatLinkElements = (finalLinksArray, adSizesArray) => {
  console.log("Formatting the link elements...");

  console.log(adSizesArray);

  // empty then overlay wrapper to remove previous searches
  app.dom.linkWrapper.innerHTML = "";

  // array for the buttons we will need for individual previews
  const previewButtonNames = [
    "open link",
    "copy link",
    "preview creative",
    "close preview"
  ];

  // empty array for preview link wrapper elements
  const previewLinkWrapperArray = [];

  // loop by how many links there are in the array
  for (let i = 0; i < finalLinksArray.length; i++) {
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
    for (let k = 0; k < adSizesArray.length; k++) {
      // get the width by splitting at x, first entry is the width
      let width = adSizesArray[i].split("x")[0];
      // get the height by splitting, the third entry is the height
      let height = adSizesArray[i].split("x")[1];
      // add the width
      previewLinkWrapper.setAttribute("data-width", width);
      // add the height
      previewLinkWrapper.setAttribute("data-height", height);
      // add nane
      previewLinkWrapper.setAttribute("data-name", jsonName);
      // add active dataset
      previewLinkWrapper.setAttribute("data-active", "yes");
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
    linkNameCheckbox.setAttribute("id", jsonName);
    // append to the link name wrapper
    linkNameWrapper.appendChild(linkNameCheckbox);

    // now create the element for the name of the creative
    let linkName = document.createElement("label");
    // add a class name for the checkbox
    linkName.classList.add("link-name");
    // insert the name
    linkName.innerHTML += jsonName;
    // set the for attribute so that the when clicked it highlights the checkbox
    linkName.setAttribute("for", jsonName);
    // append to the link name wrapper
    linkNameWrapper.appendChild(linkName);

    // create a wrapper for the link buttons wrapper
    let linkButtonsWrapper = document.createElement("div");
    // add a class to the link buttons wrapper
    linkButtonsWrapper.classList.add("link-buttons-wrapper");

    // loop through preview button names array to create the buttons
    for (let k = 0; k < previewButtonNames.length; k++) {
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
      // if data action is preview button, add another dataset to determine if active or not
      if (previewButtons.dataset.action === "preview creative") {
        // set the preview creative buttont to have a dataset for active set as false initially
        previewButtons.setAttribute("data-active", "false");
      }
      // if its the close button
      if (previewButtons.dataset.action === "close preview") {
        // set preview to be false
        previewButtons.setAttribute("data-active", "false");
        // add class to hide button initially
        previewButtons.classList.add("close-preview-button");
      }
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
    previewLinkWrapper.appendChild(creativePreviewWrapper);
    // push preview link wrappers in to the array
    previewLinkWrapperArray.push(previewLinkWrapper);
  }
  // loop through array
  for (let i = 0; i < previewLinkWrapperArray.length; i++) {
    // and finally append it to the wrapper for the preview links
    app.dom.linkWrapper.appendChild(previewLinkWrapperArray[i]);
  }

  app.dom.overlayContainerWrapper.style.opacity = 1;
  app.dom.overlayContainerWrapper.style.pointerEvents = "all";
};

const singlePreviewButtonsHandler = e => {
  console.log("Single button click handler is running...");

  const target = e.currentTarget;
  // retrieve action dataset value
  const action = target.dataset.action;
  // variable to get the full link
  const link = target.parentNode.parentNode.parentNode.dataset.link;
  // variable to get the width
  const width = target.parentNode.parentNode.parentNode.dataset.width;
  // variable to get the height
  const height = target.parentNode.parentNode.parentNode.dataset.height;
  // find the creative preview wrapper
  const creativePreviewWrapper =
    target.parentNode.parentNode.parentNode.childNodes[1];
  // open button
  const openPreviewButton = target.parentNode.childNodes[2];
  // close button
  const closePreviewButton = target.parentNode.childNodes[3];
  // name buttons wrapper
  const namesButtonsWrapper = target.parentNode.parentNode;

  // switch statement to run code depending on what has been pressed
  switch (action) {
    // if open link
    case "open link":
      // log the current action
      console.log("Action is: " + action);
      // opens the link in a new window
      window.open(link);

      break;

    // if copy link
    case "copy link":
      console.log("Action is: " + action);

      showCopyPrompt();

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

      // only need false as it technically will never be seen if its set to true?
      if (target.dataset.active === "false") {
        // using fetch to check if url works
        fetch(link) // Call the fetch function passing the url of the API as a parameter
          .then(function(e) {
            // get status variable
            const status = e.status;

            console.log("Status: " + status);

            console.log(
              "The preview link exists, now loading if the JSON also exists."
            );

            // hide the preview creative button
            target.style.display = "none";
            // unhide the close creative button
            closePreviewButton.style.display = "inline-block";
            // set preview creative button to true
            target.setAttribute("data-active", "true");
            // set close button active dataset to true
            closePreviewButton.setAttribute("data-active", "true");
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
            // empty the creative preview wrapper
            // creativePreviewWrapper.innerHTML = "";
            // append inthe creative iframe wrapper
            creativeIframeWrapper.appendChild(creativeIframe);

            // create replay button
            let replayCreativeButton = document.createElement("input");
            // set type of input
            replayCreativeButton.setAttribute("type", "button");
            // set the value
            replayCreativeButton.setAttribute("value", "Replay Creative");
            // add a class
            replayCreativeButton.classList.add(
              "input-button",
              "replay-creative-button"
            );
            // append to creative iframe wrapper
            creativeIframeWrapper.appendChild(replayCreativeButton);
            // append to creative preview wrapper
            creativePreviewWrapper.appendChild(creativeIframeWrapper);
            // set display property to flex
            creativePreviewWrapper.style.display = "flex";
            // add active class to name buttons wrapper
            namesButtonsWrapper.classList.add("active");
            // add event listener
            replayCreativeButton.addEventListener("click", replayAdHandler);
          })
          .catch(function(error) {
            // This is where you run code if the server returns any errors
            console.log("There's some sort of error.........");
            console.log("Catch function response: ", error);
          });
      }

      break;

    case "close preview":
      console.log("Action is: " + action);

      // only need true as button will never be seen if set to false?
      if (target.dataset.active === "true") {
        // needed here
        const creativePreviewWrapperParent = creativePreviewWrapper.parentNode;

        // change display property
        target.style.display = "inline-block";
        // set the open preview button active dataset to be false
        openPreviewButton.setAttribute("data-active", "false");
        // set the close preview button active dataset to be false
        closePreviewButton.setAttribute("data-active", "false");
        // remove the creative preview wrapper
        creativePreviewWrapper.removeChild(
          creativePreviewWrapper.childNodes[0]
        );
        // add style to hide button
        closePreviewButton.style.display = "none";
        // hide the preview container
        creativePreviewWrapper.style.display = "none";
        // add style to open button to show it
        openPreviewButton.style.display = "inline-block";
        // remove active class to name buttons wrapper
        namesButtonsWrapper.classList.remove("active");
      }

      break;
  }
};

const overlayPreviewButtonsHandler = e => {
  // needed to get the checkboes as they were created dynamically
  setupDom();

  // get the target element and the action dataset
  const target = e.currentTarget;
  const targetAction = e.currentTarget.dataset.action;

  // switch statement to run code depending on whats been clicked
  switch (targetAction) {
    // if select all
    case "select all":
      // loop through all checkboxes and set to be checked
      for (let i = 0; i < app.dom.linkNameCheckbox.length; i++) {
        if (
          app.dom.linkNameCheckbox[i].parentNode.parentNode.parentNode.dataset
            .active === "yes"
        ) {
          app.dom.linkNameCheckbox[i].checked = true;
        }
      }

      break;

    // if deselect all
    case "deselect all":
      // loop through all checkboxes and set to be checked
      for (let i = 0; i < app.dom.linkNameCheckbox.length; i++) {
        app.dom.linkNameCheckbox[i].checked = false;
      }

      break;

    case "copy link":
      console.log("Action is: " + action);

      showCopyPrompt();

      // clear anything from copy links textarea
      app.dom.copyLinkTextarea.innerHTML = "";
      // insert the link in the textarea

      app.dom.copyLinkTextarea.innerHTML = link;
      // select text in the copy link textarea
      app.dom.copyLinkTextarea.select();
      // copy selected text to copy to clipboard
      document.execCommand("copy");

      break;

    // if open selected
    case "open selected":
      // confirm if user wants to open all or not
      const confirmOpenSelected = confirm(
        "This will open all of the selected links in a new tab. Are you sure?"
      );

      // if they say yes (click ok)..
      if (confirmOpenSelected) {
        // loop thtrough preview link wrappers
        for (let i = 0; i < app.dom.previewLinkWrappers.length; i++) {
          // get the checkboxes for each wrapper
          const previewLinkWrapperCheckboxes =
            app.dom.previewLinkWrappers[i].childNodes[0].childNodes[0]
              .childNodes[0];
          // if its been checked
          if (previewLinkWrapperCheckboxes.checked) {
            // get the link dataset
            const link = app.dom.previewLinkWrappers[i].dataset.link;
            // open the link
            window.open(link);
          }
        }
      }

      break;

    // if preview selected
    case "preview selected":
      // confirm if user wants to preview all or not
      const confirmPreviewSelected = confirm(
        "This will open all of the selected links in a preview window. Are you sure?"
      );

      // if they say yes (click ok)..
      if (confirmPreviewSelected) {
        // loop thtrough preview link wrappers
        for (let i = 0; i < app.dom.previewLinkWrappers.length; i++) {
          // get the checkboxes for each wrapper
          const previewLinkWrapperCheckboxes =
            app.dom.previewLinkWrappers[i].childNodes[0].childNodes[0]
              .childNodes[0];
          // if its been checked
          if (previewLinkWrapperCheckboxes.checked) {
            // get the link, width and height from dataset
            const link = app.dom.previewLinkWrappers[i].dataset.link;
            const width = app.dom.previewLinkWrappers[i].dataset.width;
            const height = app.dom.previewLinkWrappers[i].dataset.height;

            // using fetch to check if url works
            fetch(link) // Call the fetch function passing the url of the API as a parameter
              .then(function(e) {
                // get status variable
                const status = e.status;

                console.log("Status: " + status);

                console.log(
                  "The preview link exists, now loading if the JSON also exists."
                );

                // open/close creative buttons
                const openCreativePreview =
                  app.dom.previewLinkWrappers[i].childNodes[0].childNodes[1]
                    .childNodes[2];
                const closeCreativePreview =
                  app.dom.previewLinkWrappers[i].childNodes[0].childNodes[1]
                    .childNodes[3];

                // creative preview wrapper
                const creativePreviewWrapper =
                  app.dom.previewLinkWrappers[i].childNodes[1];

                // hide the preview creative button
                openCreativePreview.style.display = "none";
                // unhide the close creative button
                closeCreativePreview.style.display = "inline-block";
                // set preview creative button to true
                openCreativePreview.setAttribute("data-active", "true");
                // set close button active dataset to true
                closeCreativePreview.setAttribute("data-active", "true");
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
                // empty the creative preview wrapper
                creativePreviewWrapper.innerHTML = "";
                // append inthe creative iframe wrapper
                creativeIframeWrapper.appendChild(creativeIframe);

                // create replay button
                let replayCreativeButton = document.createElement("input");
                // set type of input
                replayCreativeButton.setAttribute("type", "button");
                // set the value
                replayCreativeButton.setAttribute("value", "Replay Creative");
                // add a class
                replayCreativeButton.classList.add(
                  "input-button",
                  "replay-creative-button"
                );
                // append to creative iframe wrapper
                creativeIframeWrapper.appendChild(replayCreativeButton);
                // append to creative preview wrapper
                creativePreviewWrapper.appendChild(creativeIframeWrapper);
                // set display property to flex
                creativePreviewWrapper.style.display = "flex";
                // add active class to name buttons wrapper
                app.dom.previewLinkWrappers[i].childNodes[0].classList.add(
                  "active"
                );
                            // add event listener
            replayCreativeButton.addEventListener("click", replayAdHandler);
              })
              .catch(function(error) {
                // This is where you run code if the server returns any errors
                console.log("There's some sort of error.........");
                console.log("Catch function response: ", error);
              });
          }
        }
      }
      break;

    case "copy links":

      // empty checkbox
      app.dom.copyLinkTextarea.innerHTML = "";

      // loop through all checked preview link wrappers
      for (var i = 0; i < app.dom.previewLinkWrappers.length; i++) {
        //  declare checkbox
        const linkNameCheckbox =
          app.dom.previewLinkWrappers[i].childNodes[0].childNodes[0]
            .childNodes[0];
        // get link
        const link = app.dom.previewLinkWrappers[i].dataset.link;

        showCopyPrompt();

        // if checked
        if (linkNameCheckbox.checked === true) {
          // add each link to textarea
          app.dom.copyLinkTextarea.innerHTML += link + "\n";

          // select text in the copy link textarea
          app.dom.copyLinkTextarea.select();
          // copy selected text to copy to clipboard
          document.execCommand("copy");
        }
        
      }

      break;
  }
};

const creativeSearchHandler = e => {
  setupDom();

  console.log("Searching for JSONs...");

  // get value of search box
  const searchTerm = e.target.value;

  // loop through all of the checkboxes and set them all to false to reset
  for (let i = 0; i < app.dom.linkNameCheckbox.length; i++) {
    app.dom.linkNameCheckbox[i].checked = false;
  }

  // loop through preview wrappers
  for (let i = 0; i < app.dom.previewLinkWrappers.length; i++) {
    // get the name of the creative
    const creativeName = app.dom.previewLinkWrappers[i].dataset.name;

    // if it matches/doesnt match
    if (creativeName.indexOf(searchTerm) > -1) {
      console.log("Matching: \n " + creativeName);

      // add display block so wrapper appears in search results
      app.dom.previewLinkWrappers[i].style.display = "block";
      // set data active to yes
      app.dom.previewLinkWrappers[i].dataset.active = "yes";
    } else {
      console.log("Not Matching: \n " + creativeName);
      // add display none to hide results that don't match
      app.dom.previewLinkWrappers[i].style.display = "none";
      // set data active to no
      app.dom.previewLinkWrappers[i].dataset.active = "no";
    }
  }
};

const closeOverlayHandler = () => {

  app.dom.overlayContainerWrapper.style.opacity = 0;
  app.dom.overlayContainerWrapper.style.pointerEvents = "none";

};

const showCopyPrompt = () => {
  // show prompt for user to see link has been copied to clipboard
  app.dom.copyTextareaWrapper.style.opacity = 1;
  // hide message after 3 seconds
  let messageTimeout = setTimeout(function() {
    app.dom.copyTextareaWrapper.style.opacity = 0;
  }, 3000);
};

const replayAdHandler = (e) => {
  // find the iframe
  const targetIframe = e.target.parentNode.childNodes[0];
  // reload
  targetIframe.src += "";
}

window.onload = init;
