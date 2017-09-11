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
                    // console.log(data)
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
    // console.log(req.params.id)
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
    Article.find({ "isSaved": true }).populate("notes").exec((err, data) => {
        if (err) {
            console.log(err)
        } else {
            res.render("saved", { savedArticles: data });
        }
    })
});
//Delete saved article
router.delete("/saved/article/:id", (req, res) => {
    console.log("79")
    Article.remove({ "_id": req.params.id }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/saved")
        }
    });
});

//create new note or update an existing note
router.put("/saved/note/:id", (req, res) => {
    var newNote = new Note(req.body);
    newNote.save((err, noteData) => {
        if (err) {
            console.log(err)
        } else {
            Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "notes": noteData._id } }, { new: true },
                (err, data) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.redirect("/saved")
                    }
                })
        }
    })
});

//delete note
router.delete("/saved/note/:id", (req, res) => {
    Note.remove({ "_id": req.params.id }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/saved")
        }
    });
})

module.exports = router;