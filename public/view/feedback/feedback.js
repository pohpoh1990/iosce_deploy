app.controller('FeedbackController', ['$scope', '$http', '$rootScope', '$localStorage',
  function($scope, $http, $rootScope, $localStorage){

    if ($rootScope.currentUser){
      console.log($rootScope.currentUser);
      currentUser =  $rootScope.currentUser;
      $localStorage.currentUser = $rootScope.currentUser;
    } else if ($localStorage.currentUser) {
      console.log($localStorage.currentUser);
      currentUser =  $localStorage.currentUser;
      $rootScope.currentUser = $localStorage.currentUser;
    }


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