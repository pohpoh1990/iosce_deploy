app.controller('CreatecaseController', ["$scope", "$http", "CaselistFactory", "$routeParams", "fileUpload", "$rootScope",
function($scope, $http, CaselistFactory, $routeParams, fileUpload, $routeScope){

	$scope.myFile = [];
	$scope.brief = [];

	if($routeParams.id){
		CaselistFactory.getMarkscheme($routeParams.id).then(
			function(markscheme){
				$scope.markscheme = markscheme;
			}
		)
	} 

	$scope.submit = function(){
		var limitExceeded
		var fileExceedLimit 
		for (var i=0; i<$scope.myFile.length;i++){
			if ($scope.myFile[i]){
				if ($scope.myFile[i].size > 10*1000*1000){ //10MB
					if (fileExceedLimit){fileExceedLimit = fileExceedLimit+', '+$scope.myFile[i].name;}
					else {fileExceedLimit = $scope.myFile[i].name}
					
					limitExceeded = true;
				} 
			}
		};

		if (!$scope.title){
			$scope.errormessage = "Please fill in the title!"
		} else if (limitExceeded){
			$scope.errormessage = fileExceedLimit + " each exceeded the 10MB limit!"
		} else {
			var file = $scope.myFile
			var position = [];
			for (var i=0; i<file.length; i++){
				if (file[i]){
					position[i] = file[i].name;
				} else {
					position[i] = false
				}
			}
			console.log(position);
			console.log('file is ');
			console.dir(file);

			var uploadUrl = '/upload';
			$scope.errormessage = "Loading..."
			fileUpload.uploadFileToUrl(file, uploadUrl).then(
				function(filename){
					fileUpload.postDB(filename, position, $routeParams.id, $scope.markscheme, $scope.title, $scope.brief, $routeScope.currentUser._id);
				}
			);	
		}
	}

}])