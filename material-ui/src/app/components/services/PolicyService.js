'use strict';
 
angular.module('app')
 
.service('policyService', ['$http', function ($http) {
    this.getPolicy = function(){
    return $http.get('http://127.0.0.1:5000/api/policy');
    };
}
]);