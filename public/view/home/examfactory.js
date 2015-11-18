app.factory('ExaminationFactory', ["$http", "$q",
function($http, $q){
	return {
		get: function(){
			var q = $q.defer();
			$http.get('/all/examination/')
				.success(function(results){
					q.resolve(results);
				})

			return q.promise
		}
	}
}])