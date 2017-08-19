'use strict';
 
angular.module('app')
 
.service('claimService', ['$http', function ($http) {
    this.getClaims = function(callback){
        $http.get('http://127.0.0.1:5000/api/claims')
    .then(function (response){
        callback(response);
            console.log('fetched claims data',response);
        },
    function (error){
        callback(error);
        console.log('failed to fetch claims data',error);
    })  
    };
    this.closeClaim = function(claimToClose,callback){
        $http.put('http://127.0.0.1:5000/api/claims/close/'+claimToClose)
    .then(function (response){
        callback(response);
            console.log('claim closed',response);
        },
    function (error){
        callback(error);
        console.log('failed to close claim',error);
    })  
    };
    this.reopenClaim = function(claimToReopen,callback){
        $http.put('http://127.0.0.1:5000/api/claims/reopen/'+claimToReopen)
    .then(function (response){
        callback(response);
            console.log('claim reopened',response);
        },
    function (error){
        callback(error);
        console.log('failed to reopen claim',error);
    })  
    };
}
]);