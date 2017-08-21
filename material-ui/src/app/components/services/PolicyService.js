'use strict';
 
angular.module('app')
 
.service('policyService', ['$http', function ($http) {
    this.getPolicy = function(callback){
        $http.get('http://127.0.0.1:5000/api/policy')
    .then(function (response){
        callback(response);
            console.log('fetched policy data',response);
        },
    function (error){
        callback(error);
        console.log('failed to fetch policy data',error);
    })  
    };
}
]);