
angular.module('ThingsApp', [])
    // Service
    .factory('obsFac', ['$http', function($http){
        return {
            get: function() {
              return $http.get('/obs');
            },
            delete : function(id) {
              return $http.delete('/obs/' + id);
            }
        }    
    }])

    // Controller
    .controller('obsCtrl', ['$scope', 'obsFac', function ($scope, obsFac) {
      obsFac.get().success(function(data){
        console.log(data, status);
        $scope.obs = data;
      }).error(function(data, status){
        console.log(data, status);
        $scope.obs = [];
      });
    
      $scope.deleteObs = function(id) {
          $scope.loading = true;

          obs.delete(id)
            // if successful creation, call our get function to get all the new todos
              .success(function(data) {
              $scope.loading = false;
              $scope.obs = data; // assign our new list
          });
      };
  }])