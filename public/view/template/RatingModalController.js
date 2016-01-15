app.controller('RatingModalController', ['$scope', '$uibModalInstance', 'variables','CaselistFactory',
function($scope, $uibModalInstance, variables, CaselistFactory){
	$scope.variables = variables;

	$scope.cancel = function () {
	  $uibModalInstance.dismiss('cancel');
	};

	$scope.submitrating = function(id){
		if (!$scope.rating){
			$scope.rating = 0;
		} else if (!$scope.difficulty){
			$scope.difficulty = 0;
		}
		console.log("Rating: "+$scope.rating+", Difficulty: "+$scope.difficulty);
		CaselistFactory.submitrating(variables.caseid, variables.myid, $scope.difficulty, $scope.rating);
	}

}])


