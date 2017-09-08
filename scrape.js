// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");

// Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
request("https://techcrunch.com/popular/", function (error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);

    // An empty array to save the data that we'll scrape
    var results = [];

       $("div.block-content").each(function (i, element) {
     
    
        var title = $(element).find("h2").text();
        var link = $(element).find("h2").find("a").attr("href");
        var author = $(element).find(".byline").find("a").text();
        var intro = $(element).find(".excerpt").text().slice(0, 200);
       
        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
            title: title,
            link: link,
            author: author,
            intro: intro
        });
   
    });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
});
