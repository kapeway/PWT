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

    vm.isClaimBeingProcessed=function(claimToProcess){
      return vm.claimBeingProcessed==claimToProcess;
    };  

    vm.isProcessRunnning=false;

    vm.closeClaim=function(claimToClose){
    vm.isProcessRunnning=true;  
    vm.claimBeingProcessed = claimToClose; 
    claimService.closeClaim(claimToClose.sno).then(
      function(response) {
          claimToClose.claimStatus=1;
          vm.claimBeingProcessed=null;
          vm.isProcessRunnning=false;  
      });
    };

    vm.reopenClaim=function(claimToReopen){
      vm.isProcessRunnning=true;
      claimService.reopenClaim(claimToReopen.sno).then(
      function(response) { 
          claimToReopen.claimStatus=0;
          vm.isProcessRunnning=false;
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