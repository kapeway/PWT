(function(){

  angular
       .module('app')
       .controller('MainController', [
          'navService', '$mdSidenav', '$q', '$state', 'simpleToast',
          MainController
       ]);

  function MainController(navService, $mdSidenav, $q, $state, simpleToast) {
    var vm = this;

    vm.menuItems = [ ];
    vm.selectItem = selectItem;
    vm.toggleItemsList = toggleItemsList;
    vm.title = $state.current.data.title;
    vm.toggleRightSidebar = toggleRightSidebar;

    navService.loadAllItems()
      .then(function(menuItems) {
        vm.menuItems = [].concat(menuItems);
      });

    function toggleRightSidebar() {
        $mdSidenav('right').toggle();
    }

    function toggleItemsList() {
      var pending = $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    }

    function selectItem (item) {
      vm.title = item.name;
      vm.toggleItemsList();
      simpleToast.show('Navigated to '+vm.title);
    }
  }

})();
