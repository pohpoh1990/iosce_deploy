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
					position[i] = true
				} else {
					position[i] = false
				}
			}
			console.log(position);
			console.log('file is ');
			console.dir(file);

			var uploadUrl = '/upload';
			fileUpload.uploadFileToUrl(file, uploadUrl).then(
				function(filename){
					// Compare filename and file before postDB
					for (var i=0; i<file.length; i++){
						if (file[i].filename){
							var pos = filename.map(function(e) { return e.filename; }).indexOf(file[i].filename);
							file[i] = filename[pos];
						}
					};
					fileUpload.postDB(filename, position, $routeParams.id, $scope.markscheme, $scope.title, $scope.brief, $routeScope.currentUser._id);
				}
			);		
		}
	}

}])