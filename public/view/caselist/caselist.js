app.controller('CaselistController', ['$scope', '$http', '$routeParams', 'CaselistFactory',
function($scope, $http, $routeParams, CaselistFactory){
	if($routeParams.id){
		$scope.markschemeid = $routeParams.id;
		CaselistFactory.getMarkscheme($routeParams.id).then(
			function(markscheme){
				$scope.markscheme = markscheme;
			}
		)
		CaselistFactory.getCases($routeParams.id).then(
			function(cases){
				for (var i=0; i<cases.length; i++){
					cases[i].rating = Math.ceil(cases[i].rating/cases[i].ratecount);
					cases[i].difficulty = Math.ceil(cases[i].difficulty/cases[i].ratecount);
				}
				$scope.cases = cases;
			}
		)
	} 

	$scope.back = function(){
		console.log('back')
		window.history.back()
	}
}])