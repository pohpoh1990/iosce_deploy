app.factory('PeerlistFactory', ['$http', '$q', '$location',
function($http, $q, $location){
	return{
			getPeers: function(){
				var q = $q.defer();
				$http.get('/allpeers')
					.success(function(peers){
						console.log(peers)
						q.resolve(peers);
					})
					
				return q.promise
			},

			sendresult: function(result, myid){
				$http.post('/postresult/', result)
					.success(function(response){
						console.log(response)
						$location.url('profile')
					})
			}
	}

}]);