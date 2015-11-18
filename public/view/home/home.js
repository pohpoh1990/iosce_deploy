app.controller('HomeController', ["$scope", 'ExaminationFactory',
function($scope, ExaminationFactory){
	ExaminationFactory.get()
		.then(function(examinations){
			$scope.examinations = examinations;
		})
}])