app.controller('CreatemarkschemeController', ["$scope", "$http",
function($scope, $http){
	$scope.examination = {
		title: '',
		markscheme: ['Wash hands', 
			'Introduce yourself', 
			'Position patient', 
			'Expose patient'
		]
	};

	$scope.add = function(index){
		$scope.examination.markscheme.splice(index+1, 0, "");
		console.log($scope.examination.markscheme);
	}

	$scope.del = function(index){
		$scope.examination.markscheme.splice(index, 1);
		console.log($scope.examination.markscheme);
	}

	$scope.shift = function(index){
		return index != 0
	}

	$scope.submit = function(){
		console.log($scope.examination);
		$http.post('/examination', $scope.examination)
			.success(function(response){
				console.log(response);
			})
	}

}])