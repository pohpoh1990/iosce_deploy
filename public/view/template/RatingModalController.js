app.controller('RatingModalController', ['$scope', 'variables', 'CaselistFactory',
function($scope, variables, CaselistFactory){
	$scope.variables = variables;
	$scope.submitrating = function(id){
		console.log("Rating: "+$scope.rating+", Difficulty: "+$scope.difficulty);
		CaselistFactory.submitrating(variables.caseid, variables.myid, $scope.difficulty, $scope.rating);
	}

}])

