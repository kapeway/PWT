'use strict';
 
angular.module('app')
 
.service('tableService', ['$http', function ($http) {
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
}}]);