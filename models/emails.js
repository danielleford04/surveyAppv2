var mongoose = require('mongoose');

// Define our Schema for the DB

var emailSchema = mongoose.Schema({

	date			: {type: Date, default: Date.now },
	recipients		: []
});


// Being modelling the collection
module.exports = mongoose.model('Email', emailSchema);
