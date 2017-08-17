(function(){
  'use strict';

  angular.module('app')
          .service('navService', [
          '$q',
          navService
  ]);

  function navService($q){
    var menuItems = [
      {
        name: 'Business',
        icon: 'dashboard',
        sref: '.dashboard'
      },
      {
        name: 'Customer Support',
        icon: 'view_module',
        sref: '.data-table'
      }
    ];

    return {
      loadAllItems : function() {
        return $q.when(menuItems);
      }
    };
  }

})();
