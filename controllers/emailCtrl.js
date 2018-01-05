var Email = require('../models/emails')
var nodemailer = require('nodemailer');


var getEmailInfo = function(req,res) {
			Email.find({}).sort('-date').exec(function(err, docs){
			res.send(docs)
	})
}

var sendEmail = function(req, res) {
	// create reusable transporter object using the default SMTP transport 
	var transporter = nodemailer.createTransport('smtps://danielleford04%40gmail.com:NeoDiamoa44@smtp.gmail.com');
	 
	var mailOptions = req.body;
	console.log(mailOptions)

// create template based sender function
var sendTemplateEmail = transporter.templateSender({
    subject: mailOptions.subject,
    text: mailOptions.text,
    html: mailOptions.html
}, {
    from: mailOptions.from,
});

// use template based sender to send a message
sendTemplateEmail({
    to: mailOptions.to
}, mailOptions.context, function(err, info){
    if(err){
       console.log('Error');
    }else{
        console.log('Message sent: ' + info.response);
	    // res.send(info)

		var newEmail = new Email({
			date			: new Date(),
			recipients		: mailOptions.to
		})

		newEmail.save( function(err, doc){
			res.send(doc)
		} )
    }
});

}


module.exports = {
	getEmailInfo : getEmailInfo,
	sendEmail : sendEmail,
}