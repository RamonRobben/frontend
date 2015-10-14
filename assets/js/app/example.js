/**
 * Created by Andrew on 9/28/2015.
 *
 *
 * I hope you learn from this and can use it as a bases for a simple scoreboard app. Don't hesitate to ask me anything.
 */



/**
 * Variables can act as standalone functions that contain other functions/callbacks.
 * This HttpClient creates async request to websites to fetch data.
 * Javascript HTTP request can only work on websites with Access Origin * allowed
 * So usually APIS or shitty websites with no security.
 * http://blog.andrew.im/post/128277655275/a-is-for-asynchronous
 */
var HttpClient = function() {
    this.get = function(url, callback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {

            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 204) {
                callback("");
            } else if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) {
                callback(anHttpRequest.responseText);
            }
        };

        anHttpRequest.open("GET", url, true);
        anHttpRequest.send(null);
    }
};



/**
 * Declaring like this allows you to create a namespace for functions, variables and whatever
 */
var netflixRouletteAPI = {
    /**
     * Fields don't need a var symbol, simply a name and then a string, int, etc.
     * Every field and function is followed by a comma when done.
     */

    baseUrl: "https://netflixroulette.net/api/api.php/", //this is a string
    buildQuery: function() { //this is a function
        /**
         * we want to grab information on Attack on Titan, so we set that title.
         */
        var title = 'Attack on titan';
        /**
         * we build it as a url parameter, the first parameter always starts with "?"
         * any others are followed by "&"
         * example: ?title=qt314&age=20
         */
        var squery = '?title=' + encodeURIComponent(title);
        //return the formatted string
        return squery;

    },
    fetchRemoteData: function() {
        /**
         * We create a "new" instance of the HttpClient so we can access its functions.
         */
        var client = new HttpClient();

        /**
         * Call our field baseUrl and then append the query to the end of it
         */
        var builtUrl = netflixRouletteAPI.baseUrl + netflixRouletteAPI.buildQuery();

        client.get(builtUrl, function(response) {
            /**
             * This is our callback, so when the request to Netflix Roulette completes we can access the data.
             * In this case we will pass it to another function, alter page.
             */

            netflixRouletteAPI.alterPage(response);
        });
    },

    alterPage: function(response) {
        /**
         * We convert the JSON into a Javascript Object to easily read its data
         */
        var jsonData = JSON.parse(response);
        /**
         * Get the div we want to alter data to by its ID.
         */
        var resultsBody = document.getElementById("results");

        /**
         * Replace the HTML of the div seamlessly
         * You could all append new html/text.
         * Update the date to see it working.
         */
        resultsBody.innerHTML = "Attack on Titans Netflix ID is " + jsonData.show_id + " and it is currently " + new Date();
    },
    init: function() {
        /**
         * Fetch Netflix Data every 500ms
         */
        setInterval(function() {
            netflixRouletteAPI.fetchRemoteData();
        }, 500);
    }
};

netflixRouletteAPI.init();