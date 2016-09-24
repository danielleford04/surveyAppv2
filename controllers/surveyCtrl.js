// Include our Model
var Survey = require('../models/surveys')

// Define our Route Handlers

// Create a NEW Survey
var submitSurvey = function(req, res){
	// Data from a POST request lives in req.body
	console.log(req)

	var newSurvey = new Survey({
		satisfied	    : req.body.satisfied === 'true' ? true : false,
		likelyReturn	: req.body.likelyReturn === 'true' ? true : false,
		likelyRecommend	: +req.body.likelyRecommend,
		email			: req.body.email,
		feedback		: req.body.feedback
	})

	newSurvey.save( function(err, doc){
		res.send(doc)
	} )

}

var getSurveyData = function(req, res) {

		Survey.find({}, function(err, docs){
			res.send(docs)
	})
}

var getSurveyReport = function(req, res) {
var satisfied;
var likelyReturn;
var likelyRecommend;
var recommendAvg;

	//get satisfied aggregate data
	Survey.aggregate([
        {
            $group: {
                _id: '$satisfied',
                count: {$sum: 1}
            }
        }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
        	satisfied = result;
        	//get return aggregate data
    		Survey.aggregate([
		        {
		            $group: {
		                _id: '$likelyReturn',
		                count: {$sum: 1},
		            }
		        }
		    ], function (err, result) {
		        if (err) {
		            next(err);
		        } else {
		        	likelyReturn = result;
		        	//get recommend aggregate data
    	    		Survey.aggregate([
				        {
				            $group: {
				                _id: '$likelyRecommend', 
				                count: {$sum: 1}
				            }
				        }
				    ], function (err, result) {
				        if (err) {
				            next(err);
				        } else {
				        	likelyRecommend = result;
				        	// get average recommend
    	    	    		Survey.aggregate([
						        {
						            $group: {
						                _id: '', 
						                avgRating: {$avg: '$likelyRecommend'}
						            }
						        }
						    ], function (err, result) {
						        if (err) {
						            next(err);
						        } else {
						        	recommendAvg = result;
						        	res.send([satisfied,likelyReturn,likelyRecommend,recommendAvg])
						        }
						    });
				        }
				    });
		        }
		    });
        }
    });

}

module.exports = {
	submitSurvey : submitSurvey,
	getSurveyData : getSurveyData,
	getSurveyReport : getSurveyReport,
}