var app = angular.module("OsceApp", ["ngRoute", "ngAnimate", 'ui.bootstrap']);

app.config(function($routeProvider, $locationProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'view/home/home.html',
		controller: 'HomeController',
		resolve: {
			logincheck: checkLoggedin2
		}
	})
	.when('/register', {
		templateUrl: '/view/register/register.html',
		controller: 'RegisterController'
	})
	.when('/login', {
		templateUrl: '/view/login/login.html',
		controller: 'LoginController'	
	})
	.when('/checkemail',{
		templateUrl: '/view/checkemail/checkemail.html',
	})
	.when('/options', {
		templateUrl: '/view/options/options.html',
	})
	.when('/markscheme/:id/case/:caseid', {
		templateUrl: '/view/case/case.html',
		controller: 'CaseController',
		resolve: {
			logincheck: checkLoggedin2
		}
	})
	.when('/createmarkscheme', {
		templateUrl: '/view/createmarkscheme/createmarkscheme.html',
		controller: 'CreatemarkschemeController',
		resolve: {
			logincheck: checkLoggedin
		}
	})
	.when('/profile', {
		templateUrl: '/view/profile/profile.html',
		controller: "ProfileController",
		resolve: {
			logincheck: checkLoggedin
		}
	})
	.when('/markscheme/:id', {
		templateUrl: '/view/caselist/caselist.html',
		controller: 'CaselistController',
		resolve: {
			logincheck: checkLoggedin2
		}
	})
	.when('/createcase/:id', {
		templateUrl: '/view/createcase/createcase.html',
		controller: 'CreatecaseController',
		resolve: {
			logincheck: checkLoggedin
		}
	})
	.otherwise({
		redirectTo: '/'
	})
})

var checkLoggedin = function($q, $location, $http, $rootScope, $timeout){
	var deferred = $q.defer();

	$http.get('/loggedin').success(function(user){
		$rootScope.errorMessage = null;

		//User is Authenticated
		if (user !== '0'){
			if (user.emailverified){
				$rootScope.currentUser = user;
				console.log($rootScope.currentUser);
				deferred.resolve();		
			} else {
				$rootScope.errorMessage = "You need to verify email."
				deferred.reject();
				$location.url('checkemail');
			}
		} else {
			$rootScope.errorMessage = "You need to log in."
			deferred.reject();
			$location.url('login');
		}
	})
};

var checkLoggedin2 = function($q, $location, $http, $rootScope, $timeout){
	var deferred = $q.defer();

	$http.get('/loggedin').success(function(user){
		$rootScope.errorMessage = null;

		//User is Authenticated
		if (user !== '0'){
			if (user.emailverified){
				$rootScope.currentUser = user;
				console.log($rootScope.currentUser);
				deferred.resolve();		
			} else {
				$rootScope.errorMessage = "You need to verify email."
				deferred.reject();
			}
		} else {
			$rootScope.errorMessage = "You need to log in."
			deferred.reject();
		}
	})
};