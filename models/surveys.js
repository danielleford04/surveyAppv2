var mongoose = require('mongoose');

// Define our Schema for the DB

var surveyResultsSchema = mongoose.Schema({

	satisfied		: {type : Boolean},
	likelyReturn	: {type : Boolean},
	likelyRecommend : {type : Number},
	email			: {type : String},
	feedback		: {type : String},
	orderNumber     : {type : String}
});


// Being modelling the collection
module.exports = mongoose.model('Survey', surveyResultsSchema);
