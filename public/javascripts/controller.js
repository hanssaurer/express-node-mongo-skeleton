
//console.log (JSON.stringify(obs));

angular.module('ThingsApp', [])
     // Service
    .factory('Obs', ['$http', function($http){
      return $http.get('/obs');
    }])

    // Controller
    .controller('obsCtrl', ['$scope', 'Obs', function ($scope, obs) {
      obs.success(function(data){
        console.log(data, status);
        $scope.obs = data;
      }).error(function(data, status){
        console.log(data, status);
        $scope.obs = [];
      });
    }])

 // .controller('obsCtrl', function($scope){
 //    $scope.obs = obs;
 //  });


