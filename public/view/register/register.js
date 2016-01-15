app.controller("RegisterController", ["$scope", "$http", "$location", "PeerlistFactory",
	function($scope, $http, $location, PeerlistFactory){

		var usernames = [];

		PeerlistFactory.getPeers().then(function(peers){
			for (var i=0;i<peers.length;i++){
				var name = peers[i].username.toLowerCase();
				usernames.push(name);
			};
			console.log(usernames);
		})

		$scope.checkusername = function(){
			$scope.checkusernamesuccess = null;
			$scope.checkusernameerror = null;
			var newName = $scope.user.username.toLowerCase();
			if (usernames.indexOf($scope.user.username)>-1){
				$scope.checkusernameerror = "This username has been used. Please use another!"
			} else {
				$scope.checkusernamesuccess = "Username available!"
			}
		}
		
		$scope.register = function(){
			$scope.message = null;
			if (isUndefinedOrNull($scope.user)||
				isUndefinedOrNull($scope.user.fullname) || 
				isUndefinedOrNull($scope.user.username) || 
				isUndefinedOrNull($scope.user.email) ||
				isUndefinedOrNull($scope.user.password)||
				isUndefinedOrNull($scope.user.password2) || 
				isUndefinedOrNull($scope.user.role) ||
				($scope.user.role == 'student' && isUndefinedOrNull($scope.user.uni))) {
					$scope.message = "Please fill in all fields."
			} else if ($scope.user.password != $scope.user.password2){
				$scope.message = "Please check retyped password."
			} else if ($scope.checkusernameerror){
				$scope.message = "Please check the availability of your username!"
			} else {
			console.log($scope.user);
			$http.post('/register', $scope.user)
				.success(function(response){
					console.log(response);
					if (response == "This email has been used. Please use another!"){
						$scope.message = response;
					} else if (response == "This username has been used. Please use another!"){
						$scope.message = response;
					} else {
						$location.url('/checkemail');
					};
				});
			};
		};
	}
]);

var isUndefinedOrNull = function(user){ 
	return angular.isUndefined(user) || user === null
};

var isValidMail = function(str) { 
	 var patternAccept
     var mailPattern = [
     			/^[a-zA-Z0-9._-]+@kcl.ac.uk$/, 
     			/^[a-zA-Z0-9._-]+@doctors.org.uk$/, 
     			/^[a-zA-Z0-9._-]+@gmail.com$/,
				/^[a-zA-Z0-9._-]+@ucl.ac.uk$/,
				/^[a-zA-Z0-9._-]+@live.ucl.ac.uk$/
	 	];
	 mailPattern.forEach(function(pattern){
	 	patternAccept = patternAccept || pattern.test(str);
	 })
     return patternAccept
}
/*Only use ucl / KCL / doctors email*/