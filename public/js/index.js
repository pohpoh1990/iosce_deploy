app.controller("IndexController", ["$scope", "$location", "$rootScope", "$http",
	function($scope, $location, $rootScope, $http){
		$scope.logout = function(){
			$http.get("/logout")
				.success(function(){
					console.log("logged out");
					$rootScope.currentUser = null;
				})
		};

		$scope.isActive = function(viewLocation1, viewLocation2, viewLocation3){
			return viewLocation1 === $location.path() || 
				viewLocation2 === $location.path() || 
				viewLocation3 === $location.path();
		};
	}
]);
