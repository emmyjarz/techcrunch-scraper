var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
mongoose.Promise = Promise;


//Homepage 
router.get("/", (req, res) => {
    res.render("index");
})

//After scrape then redirect back to homepage
router.get("/scrape", (req, res) => {
    request("https://techcrunch.com/popular/", (err, res, html) => {
        //load html into cheerio and save it to a variable
        var $ = cheerio.load(html);
        var result = {};

        $("div.block-content").each((i, element) => {
            result.title = $(element).find("h2").text();
            result.link = $(element).find("h2").find("a").attr("href");
            result.author = $(element).find(".byline").find("a").text();
            result.intro = $(element).find(".excerpt").text().slice(0, 200);

            var entry = new Article(result);
            entry.saved();
            entry.save((err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(data)
                }
            });
        });
    });
    res.redirect("/articles");
});

//Show articles after scraping from database.(isSaved = false)
router.get("/articles", (req, res) => {
    Article.find({ isSaved: false }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            res.render("index", { scrapedArticles: data })
        }
    });
});
//Change article to save
router.put("/articles/:id", (req, res) => {
    console.log(req.params.id)
    Article.findOneAndUpdate({ "_id": req.params.id }, { "isSaved": true }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/articles")
        }
    });
});

//Show all saved articles(isSaved = true)
router.get("/saved", (req, res) => {
    Article.find({ isSaved: true }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            res.render("saved", { savedArticles: data })
        }
    });
});
//Delete saved article
router.delete("/saved/:id", (req, res) => {
    Article.remove({ "_id": req.params.id }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/saved")
        }
    });
});

//create new note or update an existing note
router.post("/saved/:id", (req, res) => {
    console.log("param", req.params.id)
    console.log(req.body)
});
//grab each article and show note
// router.get("/saved:id", (req,res)=>{
//     res.send("haha")
// })

module.exports = router;