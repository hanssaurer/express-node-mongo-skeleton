var thingsControllers = angular.module('thingsControllers', []);

thingsControllers.controller('obsCtrl', ['$scope', 'obsFac','$location','$route', function ($scope, obsFac, $location, $route) {
      obsFac.get().success(function(data){
        console.log(data, status);
        $scope.obs = data;
      }).error(function(data, status){
        console.log(data, status);
        $scope.obs = [];
      });
    
      $scope.deleteObj = function(id) {
          $scope.loading = true;

          obsFac.delete(id)
              // if successful show remaining objects
              .success(function(data) {
                  obsFac.get('/obs')
                  .success(function(data) {
                      $scope.obs = data;
                  })
                  .error(function(data) {
                      console.log('Error: ' + data);
                  });

              $scope.loading = false;
              $scope.obs = data; // assign our new list
          });
      },
      $scope.showObj = function(id) {
          obsFac.Id = id;
          $location.path('/show');
          $route.reload();
      };
      $scope.editObj = function(id) {
          obsFac.Id = id;
          $location.path('/obs/'+id+'/edit');
          $route.reload();
      };
    }]);

thingsControllers.controller('showCtrl', ['$scope', 'obsFac', function ($scope, obsFac) {
    if (obsFac.Id != undefined) {
        obsFac.showData(obsFac.Id).success(function(data){
            $scope.obj = data.obj;
        })
    };

    $scope.test = function() {
         alert("Huh!!!!");
    }
 }])
