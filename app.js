// Requires \\
var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/surveyData')


// Create Express App Object \\
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Routes \\
var surveyCtrl = require('./controllers/surveyCtrl')
var subscriberCtrl = require('./controllers/subscriberCtrl')
var emailCtrl = require('./controllers/emailCtrl')


app.get('/', function(req, res){
  res.sendFile('/html/home.html', {root : './public'})
});

app.get('/all', function(req, res){
  res.sendFile('/html/all.html', {root : './public'})
});

app.get('/console', function(req, res){
  res.sendFile('/html/console.html', {root : './public'})
});

app.get('/emailReport', function(req, res){
  res.sendFile('/html/email.html', {root : './public'})
});

app.get('/emailPreview', function(req, res){
  res.sendFile('/html/emailGreen.html', {root : './public'})
});

app.get('/emailAlertPreview', function(req, res){
  res.sendFile('/html/emailRed.html', {root : './public'})
});


// API Routes
app.post('/api/surveys', surveyCtrl.submitSurvey)
app.get('/api/surveys', surveyCtrl.getSurveyData)
app.get('/api/surveys/dataReport', surveyCtrl.getSurveyReport)
app.post('/api/subscribers', subscriberCtrl.addSubscriber)
app.get('/api/subscribers', subscriberCtrl.getSubscriberData)
app.delete('/api/subscribers/:subscriberId/remove', subscriberCtrl.deleteSubscriber)
app.post('/api/email', emailCtrl.sendEmail)
app.get('/api/email', emailCtrl.getEmailInfo)


// Creating Server and Listening for Connections \\
var port = 3000
app.listen(port, function(){
  console.log('Server running on port ' + port);

});
