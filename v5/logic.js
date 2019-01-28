window.onload = function() {

    const urlSplitHandler = () => {

        let urlSplit = window.location.href.split("?")[1];

        let baseUrl_regex = /(?<=base_url=)(.*?)(?=\&)/g;

        let adSizes_regex = /(?<=ad_sizes=)(.*?)(?=\&)/g;

        let jsonNames_regex = /(?<=json_names=)(.*)/g;

        let baseUrl = urlSplit.match(baseUrl_regex);
        let adSizes = urlSplit.match(adSizes_regex);
        let jsonNames = urlSplit.match(jsonNames_regex);

        console.log("Base URL:", baseUrl[0]);

        let adSizesArray = adSizes.map(adSizes => {

            let adSizesSplit = adSizes.split(",");

            return adSizesSplit

        });

        let jsonNamesArray = jsonNames.map(jsonNames => {

            let jsonNamesSplit = jsonNames.split(",");

            return jsonNamesSplit

        });



        console.log(adSizesArray[0])
        console.log(jsonNamesArray[0])






    }




    urlSplitHandler();







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



}
// var str = base_url=xxx&ad_sizes=300x250,300x600,728x90,970x250&json_names=120x600-test1,120x600-test2

// app_id=999&app_key=456&operator=operator&origin=origin&service=service&train_status=passenger