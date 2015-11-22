app.controller('FeedbackController', ['$scope', '$http', '$rootScope',
  function($scope, $http, $rootScope, $localStorage){

    $scope.message = null;
    $scope.sent =  false;

    $scope.submit = function(){
      if (!$scope.sent){
        $scope.sent = true;
        $scope.message = "Sending..."
        $http.post('/feedback', {
          feedback: $scope.feedback,
          email: $rootScope.currentUser.email
        })
        .success(function(response){
          $scope.message = response;
        })
      } 
    }
}])