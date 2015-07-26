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
          // obsFac.showData(id).success(function(data){
          //     $scope.obj = data.obj;
          // }
          $location.path('/show');
          $route.reload();
          // //Load Show-Part plus Data
          // obsFac.getShow()
          // obsFac.show(id)
          // .success(function(data) {
          //     $scope.obj = data.obj;
          //     $scope.objdob = data.objdob;
          // });
      };
    }]);

thingsControllers.controller('showCtrl', ['$scope', 'obsFac', function ($scope, obsFac) {
    $scope.hans = "Hans";
    if (obsFac.Id != undefined) {
        obsFac.showData(obsFac.Id).success(function(data){
            $scope.obj = data.obj;
        })
    };


     // obsFac.get().success(function(data){
     //    console.log(data, status);
     //    $scope.obj = data.obj;
     //  }).error(function(data, status){
     //    console.log(data, status);
     //    $scope.obj = [];
     //  })

      $scope.test = function() {
         alert("Huh!!!!");
      }
 }])
