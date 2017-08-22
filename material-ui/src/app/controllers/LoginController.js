angular.module('app')
 
.controller('LoginController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        AuthenticationService.ClearCredentials();
 
        $scope.login = function () {
            $scope.dataLoading = true;
            var promise=AuthenticationService.Login($scope.username, $scope.password);
            promise.then(
            function(response) { 
                AuthenticationService.SetCredentials($scope.username, response.data.token);
                $location.path('/');
            },
            function(response) {
                $scope.error = response.data;
                $scope.dataLoading = false;
            });
        };
    }]);
