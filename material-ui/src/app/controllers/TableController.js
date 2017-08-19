(function(){

  angular
    .module('app')
    .controller('TableController', [
      'claimService','simpleToast',
      TableController
    ]);

  function TableController(claimService,simpleToast) {
    var vm = this;

    vm.tableData = [];

    vm.getDate=function(nanoSeconds){
      return moment(new Date(nanoSeconds)).format("DD-MMM-YYYY");
    };

    vm.closeClaim=function(claimToClose){
    claimService.closeClaim(claimToClose.sno,function(response) {
        if(response.status===200) {
          console.log(response);
          claimToClose.claimStatus=1;
        }
    });
    };

    vm.reopenClaim=function(claimToReopen){
      claimService.reopenClaim(claimToReopen.sno,function(response) {
          if(response.status===200) {
            console.log(response);
            claimToReopen.claimStatus=0;
          }
      });
    };

    claimService.getClaims(function(response) {
        if(response.status===200) {
          console.log(response);
          vm.tableData=response.data.result;
        }
    });
  }

})();