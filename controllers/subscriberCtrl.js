// Include our Model
var Subscriber = require('../models/subscribers')

// Define our Route Handlers

// Create a NEW Survey
var addSubscriber = function(req, res){
	// Data from a POST request lives in req.body

	var newSubscriber = new Subscriber({
		name			: req.body.name,
		email			: req.body.email
	})

	newSubscriber.save( function(err, doc){
		res.send(doc)
	} )

}

var getSubscriberData = function(req, res) {

		Subscriber.find({}, function(err, docs){
			res.send(docs)
	})
}

var deleteSubscriber = function(req, res) {

	Subscriber.findByIdAndRemove(req.params.subscriberId, function (err, doc) {  
    var response = {
        message: "Subscriber successfully deleted",
    };
    res.send(response);
})

};

module.exports = {
	addSubscriber : addSubscriber,
	getSubscriberData : getSubscriberData,
	deleteSubscriber : deleteSubscriber
}