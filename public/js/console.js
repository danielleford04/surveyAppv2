var app = angular.module("myApp", []);

app.controller('myCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.surveysLength = 0;

//get survey data
    $http.get('/api/surveys')
    .then(function(returnData){
        $scope.surveys = returnData.data
        $scope.surveysLength = $scope.surveys.length
    })

//submit new survey
$scope.submitSurvey = function(){
    var feedback;

    if ($scope.newSurvey.satisfied && $scope.newSurvey.likelyReturn && $scope.newSurvey.likelyRecommend >= 3) {
            swal("Thank you!", "Thank you for rating our dealership truly exceptional!", "success")
            $http.post('/api/surveys', $scope.newSurvey) //Req TO SERVER
                .then(function(returnData){ //Res FROM SERVER
                    console.log($scope.newSurvey);
                    console.log('Submitted a survey!', returnData)
                    $scope.sendEmail('../html/emailGreen.html', $scope.newSurvey)
                })
    } else {
        swal({   
           title: "One last question...",
           text: "What can we do to improve your experience?",   
           type: "input",   
           showCancelButton: false,   
           closeOnConfirm: false,   
           animation: "slide-from-top",   
           inputPlaceholder: "Text" }, 
           function(inputValue){   
            if (inputValue === false) 
                return false;      
            if (inputValue === "") {     
                swal.showInputError("Please let us know how we can improve your experience!");     
                return false   } 
            feedback = inputValue;
            $scope.newSurvey.feedback = feedback;
            $http.post('/api/surveys', $scope.newSurvey) //Req TO SERVER
                .then(function(returnData){ //Res FROM SERVER
                    swal("Thank you for your feedback!", '', "success");
                    $scope.sendEmail('../html/emailRed.html', $scope.newSurvey)
                })
        });
               
    }

}

// ----------------- Email Subscriber Management ------------------- \\
//get/render subscribers
    $http.get('/api/subscribers')
        .then(function(returnData){
            $scope.subscribers = returnData.data
            
        })

//add new subscriber
    $scope.addSubscriber = function(){

        $http.post('/api/subscribers', $scope.newSubscriber) //Req TO SERVER
            .then(function(returnData){ //Res FROM SERVER
                console.log('Added a subscriber! ', returnData)
                $http.get('/api/subscribers')
                    .then(function(returnData){
                        $scope.subscribers = returnData.data
                    })
            })

    }

//delete email subscriber
$scope.deleteSubscriber = function(subscriberId) {

 // console.log(subscriberId);
     $http.delete('/api/subscribers/' + subscriberId + '/remove')
        .then(function(returnData){
            $scope.subscribers = returnData.data
            $http.get('/api/subscribers')
                    .then(function(returnData){
                        $scope.subscribers = returnData.data

                    })
        })
}

// ----------------- Data Aggregation and Graph Creation ------------------- \\
//get survey report data
    $http.get('/api/surveys/dataReport')
        .then(function(returnData){
            $scope.surveyReport = returnData.data
            $scope.satisfiedReport = $scope.surveyReport[0]
            $scope.likelyReturnReport = $scope.surveyReport[1]
            $scope.likelyRecommendReport = $scope.surveyReport[2]
            if ($scope.surveyReport[3][0]) {
                 $scope.recommendAvg = $scope.surveyReport[3][0].avgRating.toFixed(2) 
            } else {
                $scope.recommendAvg = "No Data Yet"}

            // satisfied pie graph
            var satisfiedChartOptions = {
                type: 'pie',
                data: {
                    labels: ["Yes","No"],
                    datasets: [{
                        data: [],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                        ],
                        borderWidth: 1,
                        options: {
                        responsive: true
                    }
                    }]
                }
            }

            var satisfiedTrue = 0;
            var satisfiedFalse=0;

            for (i = 0; i < $scope.satisfiedReport.length; i++) {
                if ($scope.satisfiedReport[i]._id == true) {
                satisfiedTrue = $scope.satisfiedReport[i].count;
                satisfiedChartOptions.data.datasets[0].data[0] = satisfiedTrue;
                }
                if ($scope.satisfiedReport[i]._id == false) {
                satisfiedFalse = $scope.satisfiedReport[i].count;
                satisfiedChartOptions.data.datasets[0].data[1] = satisfiedFalse;
                }
            }
            if ($scope.satisfiedReport[0]) {
                var percentage = (satisfiedTrue / (satisfiedTrue+satisfiedFalse) * 100).toFixed(2)
                $scope.percentSatisfied =  percentage + "%";
             } else {
                $scope.percentSatisfied = "No Data Yet"
             }

            var ctx = document.getElementById("satisfiedChart");
            var satisfiedChart = new Chart(ctx, satisfiedChartOptions);

            // likely return pie graph
            var likelyReturnChartOptions = {
                type: 'pie',
                data: {
                    labels: ["Yes", "No"],
                    datasets: [{
                        data: [0,0],
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderWidth: 1,
                        options: {
                        responsive: true
                    }
                    }]
                }
            }

            var likelyReturnTrue = 0;
            var likelyReturnFalse=0;

            for (i = 0; i < $scope.likelyReturnReport.length; i++) {
                if ($scope.likelyReturnReport[i]._id == true) {
                likelyReturnTrue = $scope.likelyReturnReport[i].count;
                likelyReturnChartOptions.data.datasets[0].data[0] = likelyReturnTrue;
                }
                if ($scope.likelyReturnReport[i]._id == false) {
                likelyReturnFalse = $scope.likelyReturnReport[i].count;
                likelyReturnChartOptions.data.datasets[0].data[1] = likelyReturnFalse;
                }
            }
            if ($scope.likelyReturnReport[0]) {
                var percentage = (likelyReturnTrue / (likelyReturnTrue+likelyReturnFalse) * 100).toFixed(2)
                $scope.percentReturn =  percentage + "%";
             } else {
                $scope.percentReturn = "No Data Yet"
             }

            var ctx = document.getElementById("likelyReturnChart");
            var likelyReturnChart = new Chart(ctx, likelyReturnChartOptions);

            // likely recommend bar graph
            var likelyRecommendChartOptions = {
                type: 'bar',
                data: {
                    labels: [1,2,3,4,5],
                    datasets: [{
                        label: 'Respondents',
                        data: [0,0,0,0,0],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            }

            for (i = 0; i < $scope.likelyRecommendReport.length; i++) {
                if ($scope.likelyRecommendReport[i]._id == 1) {
                likelyRecommendChartOptions.data.datasets[0].data[0] = $scope.likelyRecommendReport[i].count;
                }
                if ($scope.likelyRecommendReport[i]._id == 2) {
                likelyRecommendChartOptions.data.datasets[0].data[1] = $scope.likelyRecommendReport[i].count;
                }
                if ($scope.likelyRecommendReport[i]._id == 3) {
                likelyRecommendChartOptions.data.datasets[0].data[2] = $scope.likelyRecommendReport[i].count;
                }
                if ($scope.likelyRecommendReport[i]._id == 4) {
                likelyRecommendChartOptions.data.datasets[0].data[3] = $scope.likelyRecommendReport[i].count;
                }
                if ($scope.likelyRecommendReport[i]._id == 5) {
                likelyRecommendChartOptions.data.datasets[0].data[4] = $scope.likelyRecommendReport[i].count;
                }
            }

            var ctx = document.getElementById("likelyRecommendChart");
            var likelyRecommendChart = new Chart(ctx, likelyRecommendChartOptions);
        })

// ----------------- Create and Send Emails ------------------- \\

    $scope.lastEmailDate = "None Sent Yet"

    $http.get('/api/email')
    .then(function(returnData){
       var lastEmailDate = returnData.data[0].date;

       var date = new Date(lastEmailDate);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        $scope.lastEmailDate = month + '-' + day + '-' + year;
    })

var emailHtml;

$scope.sendEmail = function(templatePath, mostRecentSurvey){
    if (mostRecentSurvey.satisfied) {
        mostRecentSurvey.satisfied = "Yes"
    } else {
        mostRecentSurvey.satisfied = "No"
    }

        if (mostRecentSurvey.likelyReturn) {
        mostRecentSurvey.likelyReturn = "Yes"
    } else {
        mostRecentSurvey.likelyReturn = "No"
    }

    var mailOptions = {
        from: '"Danielle" <danielleford04@gmail.com>', // sender address 
        to: '', // list of receivers 
        subject: 'A new survey has been submitted!', // Subject line 
        text: "Oops! Your email provider doesn't support html. View your updated report at localhost:3000/emailReport" , // plaintext body 
        html: "", // html body 
        context: {
          totalSurveys : $scope.surveysLength,
          satisfiedT      : 0,
          satisfiedF      : 0,
          satisfiedP      : 0,
          returnT         : 0,
          returnF         : 0,
          returnP         : 0,
          oneCount        : 0,
          twoCount        : 0,
          threeCount      : 0,
          fourCount       : 0,
          fiveCount       : 0,
          recommendAvg    : 0,
          satisfied       : mostRecentSurvey.satisfied,
          likelyReturn    : mostRecentSurvey.likelyReturn,
          recommend       : mostRecentSurvey.likelyRecommend,
          email           : mostRecentSurvey.email || "None provided",
          feedback        : mostRecentSurvey.feedback || "None provided",
          barChartHeight: 5
        }
    };

    //get html template
    //var htmlTemplatePath
    // $http.get('../html/emailGreen.html')
    $http.get(templatePath)
    .then(function(returnData){

        mailOptions.html = returnData.data;
        //get subscribers for 'to' field
        $http.get('/api/subscribers')
        .then(function(returnData){
            $scope.subscribers = returnData.data
            var emailSendTo;
            var emailSendToArr = [];
            for (var i=0; i<$scope.subscribers.length; i++) {
                emailSendToArr.push($scope.subscribers[i].email)
            }
            emailSendTo = emailSendToArr.join(', ');
            mailOptions.to = emailSendTo

            //get survey data to set context variables in email
            $http.get('/api/surveys/dataReport')
            .then(function(returnData){
                $scope.surveyReport = returnData.data
                $scope.satisfiedReport = $scope.surveyReport[0]
                $scope.likelyReturnReport = $scope.surveyReport[1]
                $scope.likelyRecommendReport = $scope.surveyReport[2]
                if ($scope.surveyReport[3][0]) {
                     mailOptions.context.recommendAvg = $scope.surveyReport[3][0].avgRating.toFixed(2) 
                } else {
                    mailOptions.context.recommendAvg = "No Data Yet"}

                // satisfied data
                var satisfiedTrue = 0;
                var satisfiedFalse=0;

                for (i = 0; i < $scope.satisfiedReport.length; i++) {
                    if ($scope.satisfiedReport[i]._id == true) {
                    satisfiedTrue = $scope.satisfiedReport[i].count;
                    mailOptions.context.satisfiedT = satisfiedTrue;
                    }
                    if ($scope.satisfiedReport[i]._id == false) {
                    satisfiedFalse = $scope.satisfiedReport[i].count;
                    mailOptions.context.satisfiedF = satisfiedFalse;
                    }
                }
                if ($scope.satisfiedReport[0]) {
                    var percentage = (satisfiedTrue / (satisfiedTrue+satisfiedFalse) * 100).toFixed(2)
                    mailOptions.context.satisfiedP =  percentage + "%";
                 } else {
                    mailOptions.context.satisfiedP = "No Data Yet"
                 }

                
                // return data

                var likelyReturnTrue = 0;
                var likelyReturnFalse=0;

                for (i = 0; i < $scope.likelyReturnReport.length; i++) {
                    if ($scope.likelyReturnReport[i]._id == true) {
                    likelyReturnTrue = $scope.likelyReturnReport[i].count;
                    mailOptions.context.returnT = likelyReturnTrue;
                    }
                    if ($scope.likelyReturnReport[i]._id == false) {
                    likelyReturnFalse = $scope.likelyReturnReport[i].count;
                    mailOptions.context.returnF = likelyReturnFalse;
                    }
                }

                if ($scope.likelyReturnReport[0]) {
                    var percentage = (likelyReturnTrue / (likelyReturnTrue+likelyReturnFalse) * 100).toFixed(2)
                    mailOptions.context.returnP =  percentage + "%";
                 } else {
                    mailOptions.context.returnP = "No Data Yet"
                }

                // recommend data
                for (i = 0; i < $scope.likelyRecommendReport.length; i++) {
                    if ($scope.likelyRecommendReport[i]._id == 1) {
                    mailOptions.context.oneCount = $scope.likelyRecommendReport[i].count;
                    }
                    if ($scope.likelyRecommendReport[i]._id == 2) {
                    mailOptions.context.twoCount = $scope.likelyRecommendReport[i].count;
                    }
                    if ($scope.likelyRecommendReport[i]._id == 3) {
                    mailOptions.context.threeCount = $scope.likelyRecommendReport[i].count;
                    }
                    if ($scope.likelyRecommendReport[i]._id == 4) {
                    mailOptions.context.fourCount = $scope.likelyRecommendReport[i].count;
                    }
                    if ($scope.likelyRecommendReport[i]._id == 5) {
                    mailOptions.context.fiveCount = $scope.likelyRecommendReport[i].count;
                    }
                }

                 //send email
                $http.post('/api/email', mailOptions) //Req TO SERVER
                    .then(function(returnData){ //Res FROM SERVER
                        console.log('Sent an email! ', returnData)
                    })
            })
        })
    })

}
    



}])
