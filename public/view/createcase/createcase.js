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
		if (!$scope.title){
			$scope.errormessage = "Please fill in the title!"
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
			fileUpload.uploadFileToUrl(file, uploadUrl).then(
				$scope.errormessage = "Loading...";
				function(filename){
					fileUpload.postDB(filename, position, $routeParams.id, $scope.markscheme, $scope.title, $scope.brief, $routeScope.currentUser._id);
				}
			);	
		}
	}

}])