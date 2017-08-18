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

    vm.closeClaim=function(claimToClose){
    tableService.closeClaim(claimToClose.sno,function(response) {
        if(response.status===200) {
          console.log(response);
          claimToClose.claimStatus=1;
        }
    });
    };

    vm.reopenClaim=function(claimToReopen){
      tableService.reopenClaim(claimToReopen.sno,function(response) {
          if(response.status===200) {
            console.log(response);
            claimToReopen.claimStatus=0;
          }
      });
    };

    tableService.getClaims(function(response) {
        if(response.status===200) {
          console.log(response);
          vm.tableData=response.data.result;
        }
    });
  }

})();