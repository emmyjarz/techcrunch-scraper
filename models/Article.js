var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    link:{
        type: String,
        required: true,
        trim: true
    }, 
    author:{
        type: String,
        required: true,
        trim: true
    }, 
    intro:{
        type: String,
        required: true,
        trime: true
    },
    isSaved: Boolean,
    note: {
        type: Schema.Types.ObjectId,
        ref:"Note"
    }

});

ArticleSchema.methods.saved = function(){
    this.isSaved = false;
    return this.isSaved;
};

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;