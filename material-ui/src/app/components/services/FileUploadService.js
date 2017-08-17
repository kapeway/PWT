'use strict';
 
angular.module('app')
 
.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl,callback){
        var fd = new FormData();
        fd.append('file', file);
    
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
    .then(function (response){
        callback(response);
            console.log('file upload success result',response);
        },
    function (error){
        callback(error);
        console.log('file upload failure result',error);
    })  
}}]);