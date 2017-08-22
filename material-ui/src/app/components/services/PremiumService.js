'use strict';
 
angular.module('app')
 
.service('premiumService', ['$http', function ($http) {
    this.getWeeklyPremium = function(){
        return $http.get('http://127.0.0.1:5000/api/premiums/weekly');
    };
    this.getMonthlyPremium = function(){
        return $http.get('http://127.0.0.1:5000/api/premiums/monthly');
    };
}
]);