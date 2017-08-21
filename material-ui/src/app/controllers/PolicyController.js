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

    policyService.getPolicy(function(response) {
        if(response.status===200) {
          console.log(response);
          vm.tableData=response.data.result;
        }
    });
  }

})();