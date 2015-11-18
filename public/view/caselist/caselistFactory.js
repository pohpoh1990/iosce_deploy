app.factory('CaselistFactory', ['$http', '$q', '$rootScope',
function($http, $q, $rootScope){
	return{
		getMarkscheme: function(id){
			var q = $q.defer();
			$http.get('/markscheme/'+id)
				.success(function(markscheme){
					console.log(markscheme)
					q.resolve(markscheme);
				})
				
			return q.promise
		}, 

		getCases: function(id){
			var q = $q.defer();
			$http.get('/cases/'+id)
				.success(function(cases){
					console.log(cases)
					q.resolve(cases);
				})
				
			return q.promise
		},

		getCase: function(id){
			var q = $q.defer();
			$http.get('/singlecase/'+id)
				.success(function(onecase){
					console.log(onecase)
					q.resolve(onecase);
				})
				
			return q.promise
		},

		getMarkschemeCreated: function(id){
			var q = $q.defer();
			$http.get('/getmarkschemecreated/'+id)
				.success(function(markschemecreated){
					console.log(markschemecreated)
					q.resolve(markschemecreated);
				})
				
			return q.promise
		},

		getCaseCreated: function(id){
			var q = $q.defer();
			if ($rootScope.currentUser.role[1] =="admin"){
				$http.get('/all/casecreated/')
					.success(function(scenarios){
						q.resolve(scenarios);
					})
					
				return q.promise
			} else {
				$http.get('/casecreated/'+$rootScope.currentUser._id)
					.success(function(scenarios){
						q.resolve(scenarios);
					})
					
				return q.promise
			}
		},

		deleteCaseCreated: function(caseid, myid){
			var q = $q.defer();
			$http.get('/deletecasecreated/'+caseid+'/'+$rootScope.currentUser._id)
				.success(function(casecreated){
					console.log(casecreated)
					q.resolve(casecreated);
				})
				
			return q.promise
		},

		submitrating: function(caseid, myid, difficulty, rating){
			console.log("difficulty: "+difficulty+", rating: "+rating)
			$http.post('/caserating/'+caseid, {
				difficulty: difficulty,
				rating: rating,
				myid: myid
			})
			.success(function(res){
				console.log(res);
			})
		}
	}
}]);