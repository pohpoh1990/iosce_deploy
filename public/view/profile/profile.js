app.controller("ProfileController", ["$scope", "$rootScope", "$http", "$location", "CaselistFactory", "ResultFactory", "ExaminationFactory",
	function($scope, $rootScope, $http, $location, CaselistFactory, ResultFactory, ExaminationFactory){

		$scope.showresult = [];

		var intervalResults = setInterval(getResult, 10);
		var intervalCases = setInterval(getCases, 10);

		function getResult(){
			if ($rootScope.currentUser){
				$scope.firstLetter = $rootScope.currentUser.username[0];
				ResultFactory.get($rootScope.currentUser._id).then(function(results){
					if(Array.isArray(results)){
						$scope.results = results;
					} else if (results==null){
						$scope.results = '';
					} else {$scope.results = [results]};
					console.log(results);
				})
				clearInterval(intervalResults);
			} else {
				console.log("getResult: Waiting for rootScope to be populated.")
			}
		};

		function getCases(){
			//$rootScope.currentUser.role = ["student", "admin"]
			if ($rootScope.currentUser){
				CaselistFactory.getCaseCreated($rootScope.currentUser._id).then(function(casecreated){
					if(Array.isArray(casecreated)){
						$scope.casecreated = casecreated;
					} else if (casecreated==null){
						$scope.casecreated = '';
					} else {$scope.casecreated = [casecreated]};
					console.log(casecreated);
				})
				clearInterval(intervalCases);
			} else {
				console.log("getCases: Waiting for rootScope to be populated.")
			}
		}

		function getMarkschemes(){}

		$scope.deleteCase = function(id){
			CaselistFactory.deleteCaseCreated(id).then(function(casecreated){
				if(Array.isArray(casecreated)){
					$scope.casecreated = casecreated;
				} else if (casecreated==null){
					$scope.casecreated = '';
				} else {$scope.casecreated = [casecreated]};
				console.log(casecreated);
			})
		}

		$scope.show = function(result_part){
			if($scope.showresult[result_part])
				{$scope.showresult[result_part]=false}
			else {$scope.showresult[result_part]=true}
		}	

		ExaminationFactory.get()
			.then(function(examinations){
				$scope.examinations = examinations;
			})

	}
]);