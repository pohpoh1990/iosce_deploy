app.factory('ResultFactory', ['$http', '$q',
function($http, $q){
	return {
		get: function(id){
			var q = $q.defer();
				$http.get('/result/'+id)
					.success(function(results){
						q.resolve(results);
					})
					
				return q.promise
		}
	}
}]);