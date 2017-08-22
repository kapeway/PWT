(function(){

  angular
    .module('app')
    .controller('PolicyController', [
      'policyService',
      PolicyController
    ]);

  function PolicyController(policyService) {
    var vm = this;
    vm.tableData = [];

    vm.getDate=function(nanoSeconds){
      return moment(new Date(nanoSeconds)).format("DD-MMM-YYYY HH:mm");
    };

    vm.dataLoading=true;
    var promise = policyService.getPolicy();
    promise.then(
      function(response) { 
          vm.dataLoading=false;
          vm.tableData=response.data.result;
      });
  }

})();