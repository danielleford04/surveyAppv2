var mongoose = require('mongoose');

// Define our Schema for the DB

var subscriberSchema = mongoose.Schema({

	name			: {type : String},
	email			: {type : String}
});


// Being modelling the collection
module.exports = mongoose.model('Subscriber', subscriberSchema);
