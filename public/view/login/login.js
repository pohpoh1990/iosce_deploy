app.controller("LoginController", ["$scope", "$http", "$location", "$rootScope",
	function($scope, $http, $location, $rootScope){
	
		$scope.login = function(){
			$http.post('/login', $scope.user)
				.then(function(response){
					$rootScope.currentUser = response.data;
					console.log(response);
					$location.path('/profile');
				}, function(response){
					$scope.errorMessage = "Incorrect email or password."
				});
		};
	}
]);