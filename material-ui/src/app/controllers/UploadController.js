(function(){
angular.module('app')

.controller('UploadController', ['$scope','$state', 'fileUpload','simpleToast', function($scope, $state, fileUpload,simpleToast){
$scope.dataLoading=false;
$scope.uploadFile = function(){
    $scope.dataLoading=true;
    var file = $scope.myFile;
    var uploadUrl = "http://127.0.0.1:5000/api/upload";
    var promise=fileUpload.uploadFileToUrl(file, uploadUrl);
    promise.then(
    function(response) { 
        $scope.dataLoading=false;
        if(response.status===200) {
            simpleToast.show('File uploaded');
            $state.reload();
        } else {
            simpleToast.show('File upload failed');
        }
    },
    function(response) {
        $scope.dataLoading=false;
        simpleToast.show('File upload failed');
     });
};
}]);
})();
