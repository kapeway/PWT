(function(){

  angular
    .module('app')
    .controller('TableController', [
      'claimService',
      TableController
    ]);

  function TableController(claimService) {
    var vm = this;

    vm.tableData = [];

    vm.getDate=function(nanoSeconds){
      return moment(new Date(nanoSeconds)).format("DD-MMM-YYYY");
    };

    vm.closeClaim=function(claimToClose){
    vm.isClaimBeingClosed=true;  
    claimService.closeClaim(claimToClose.sno).then(
      function(response) {
          vm.isClaimBeingClosed=false;         
          claimToClose.claimStatus=1;
      });
    };

    vm.reopenClaim=function(claimToReopen){
      claimService.reopenClaim(claimToReopen.sno).then(
      function(response) { 
          claimToReopen.claimStatus=0;
      });
    };
    vm.dataLoading=true;
    claimService.getClaims().then(
      function(response) { 
          vm.dataLoading=false;
          vm.tableData=response.data.result;
      });
  }

})();