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


//homepage show all article that already in the database
router.get("/", (req, res)=>{
    res.render("index");

})

//after scrape then redirect back to homepage



module.exports = router;