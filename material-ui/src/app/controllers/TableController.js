(function(){

  angular
    .module('app')
    .controller('TableController', [
      'tableService','simpleToast',
      TableController
    ]);

  function TableController(tableService,simpleToast) {
    var vm = this;

    vm.tableData = [];
    vm.getDate=function(nanoSeconds){
      return moment(new Date(nanoSeconds)).format("DD-MMM-YYYY");
    };
    tableService.getClaims(function(response) {
        if(response.status===200) {
          console.log(response);
          vm.tableData=response.data.result;
        }
    });
  }

})();