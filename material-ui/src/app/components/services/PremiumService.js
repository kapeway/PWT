'use strict';
 
angular.module('app')
 
.service('premiumService', ['$http', function ($http) {
    this.getWeeklyPremium = function(callback){
        $http.get('http://127.0.0.1:5000/api/premiums/weekly')
    .then(function (response){
        callback(response);
            console.log('fetched weekly premium data',response);
        },
    function (error){
        callback(error);
        console.log('failed to fetch weekly premium data',error);
    })  
    };
    this.getMonthlyPremium = function(callback){
        $http.get('http://127.0.0.1:5000/api/premiums/monthly')
    .then(function (response){
        callback(response);
            console.log('fetched monthly premium data',response);
        },
    function (error){
        callback(error);
        console.log('failed to fetch monthly premium data',error);
    })  
    };
}
]);