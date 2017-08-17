'use strict';
 
angular.module('app')
 
.service('simpleToast', ['$mdToast', function ($mdToast) {
      this.show = function(title){
        $mdToast.show(
        $mdToast.simple()
          .content(title)
          .hideDelay(2000)
          .position('bottom right')
      );
    }
}]);