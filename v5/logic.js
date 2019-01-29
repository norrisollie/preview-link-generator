	const checkUrl = () => {

		console.log("Checking for parameters.");

		let urlCheck = window.location.href.split("?");

		if(urlCheck.length > 1) {

			console.log("There are some parameters. Running urlSplitHandler.")

			urlSplitHandler();

		} else {

			console.log("There are no parameters.");

			return

		};
	};

	// if there are paramaters, this function will run
    const urlSplitHandler = () => {

        // split url at question mark
        let urlSplit = window.location.href.split("?")[1];

        // regex required to find the base url, ad sizes and json names
        let baseUrl_regex = /(?<=base_url=)(.*?)(?=\&)/g;
        let adSizes_regex = /(?<=ad_sizes=)(.*?)(?=\&)/g;
        let jsonNames_regex = /(?<=json_names=)(.*)/g;

        // use match to return an array that contains a string with matching characters
        let baseUrl = urlSplit.match(baseUrl_regex);
        let adSizes = urlSplit.match(adSizes_regex);
        let jsonNames = urlSplit.match(jsonNames_regex);

        // 
        let baseUrlArray = adSizes[0];
        let adSizesArray = adSizes[0].split(",");
        let jsonNamesArray = jsonNames[0].split(",");

        console.log(baseUrlArray)
        console.log(adSizesArray)
        console.log(jsonNamesArray)

    }


    const init = () => {

    	checkUrl();

    }




window.onload = init();







    // console.log("Loaded");

    // var urlSplit = window.location.href.split("?");

    // var endpointSplit = urlSplit[1];

    // var baseUrl_regex = /(?<=base_url=)(.*?)(?=\&)/g
    // var baseUrl_string = endpointSplit.match(baseUrl_regex);

    // console.log(baseUrl_string)





    // var baseUrlSplit = endpointSplit.split("base_url");

    // console.log(baseUrlSplit)

    // var adSizesSplit = endpointSplit.split("ad_sizes");

    // console.log(adSizesSplit)

    // var jsonNamesSplit = endpointSplit.split("json_names");

    // console.log(jsonNamesSplit)



// }
// var str = base_url=xxx&ad_sizes=300x250,300x600,728x90,970x250&json_names=120x600-test1,120x600-test2

// app_id=999&app_key=456&operator=operator&origin=origin&service=service&train_status=passenger