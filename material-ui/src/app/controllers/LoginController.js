angular.module('app')
 
.controller('LoginController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        AuthenticationService.ClearCredentials();
 
        $scope.login = function () {
            $scope.dataLoading = true;
            var authToken=AuthenticationService.Login($scope.username, $scope.password, function(response) {
                if(response.status===200) {
                    AuthenticationService.SetCredentials($scope.username, response.data.token);
                    $location.path('/');
                } else {
                    $scope.error = response.data;
                    $scope.dataLoading = false;
                }
            });
        };
    }]);
