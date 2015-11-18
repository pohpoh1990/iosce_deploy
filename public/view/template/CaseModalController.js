app.controller('CaseModalController', ['$scope', '$uibModalInstance', 'variables',
function($scope, $uibModalInstance, variables){
	$scope.variables = variables;

	$scope.cancel = function () {
	  $uibModalInstance.dismiss('cancel');
	};
}])