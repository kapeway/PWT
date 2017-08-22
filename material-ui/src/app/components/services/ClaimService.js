'use strict';
 
angular.module('app')
 
.service('claimService', ['$http', function ($http) {
    this.getClaims = function(){
        return $http.get('http://127.0.0.1:5000/api/claims');
    };
    this.closeClaim = function(claimToClose){
        return $http.put('http://127.0.0.1:5000/api/claims/close/'+claimToClose);
    };
    this.reopenClaim = function(claimToReopen){
        return $http.put('http://127.0.0.1:5000/api/claims/reopen/'+claimToReopen)
    };
}
]);