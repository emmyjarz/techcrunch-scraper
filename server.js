// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
// var Note = require("./models/Note.js");
// var Article = require("./models/Article.js");
// //Our scraping tools
// var request = require("request");
// var cheerio = require("cheerio");
//Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Make public a static dir
app.use(express.static("public"));

//methodOverride for handlebars
app.use(methodOverride("_method"));
//handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Database configuration with mongoose
// mongoose.connect("mongodb://localhost/techcrunch");
var MONGODB_URI = "mongodb://heroku_h5h2hqns:rksuvvvq4373mrgdufbqe6be0n@ds133084.mlab.com:33084/heroku_h5h2hqns";
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/techcrunch");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function (error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
    console.log("Mongoose connection successful.");
});
var routes = require("./controllers/techcrunch");
app.use("/", routes);

// Listen on port 3000
app.listen(process.env.PORT || 3000, function () {
    console.log("App running on port 3000!");
});
