(function(){
angular.module('app')

.controller('UploadController', ['$scope', 'fileUpload','simpleToast', function($scope, fileUpload,simpleToast){
$scope.uploadFile = function(){
    var file = $scope.myFile;
    var uploadUrl = "http://127.0.0.1:5000/api/upload";
    fileUpload.uploadFileToUrl(file, uploadUrl,function(response) {
        console.log(response);
        if(response.status===200) {
            simpleToast.show('File uploaded');
        } else {
            simpleToast.show('File upload failed');
        }
    });
};
}]);
})();
