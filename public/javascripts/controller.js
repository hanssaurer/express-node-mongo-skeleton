ThingsModule.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider
        // route for the home page
        .when('/', {
            templateUrl : '',
            controller  : 'obsCtrl'
        })
        .when('/obs/:id/edit', {
            templateUrl : 'edit.html',
            controller  : 'showCtrl'
        })
        .when('/obs/:id', {
            templateUrl : 'show.html',
            controller  : 'showCtrl'
        })
        .when('/test', {
            templateUrl : 'test.html'
        })
        .when('/show', {
            templateUrl : 'show.html'
        })
        .when('/new', {
            templateUrl : 'obs/new',
            controller  : 'showCtrl'
        });
        $locationProvider.html5Mode(true);
    }])
    .factory('obsFac', ['$http', function($http){
        return {
            insert: function(obj) {
              return $http.post('/obs', obj);
            },
            get: function() {
              return $http.get('/obs');
            },
            showData: function(id) {
              return $http.get('/obs/' + id);
            },
            editData: function(id) {
              return $http.get('/obs/' + id + '/edit');
            },
            delete : function(id) {
              return $http.delete('/obs/' + id);
            },
            update : function(obj) {
              return $http.put('/obs/edit/' + obj._id, obj);
            }
        }    
    }])

var thingsControllers = angular.module('thingsControllers', ['ui.bootstrap', 'ui.bootstrap.datetimepicker']);

thingsControllers.controller('obsCtrl', ['$scope', 'obsFac','$location','$route', function ($scope, obsFac, $location, $route) {

      obsFac.get().success(function(data){
        console.log(data, status);
        $scope.obs = data;
      }).error(function(data, status){
        console.log("Error: ", status);
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

thingsControllers.controller('showCtrl', ['$scope', 'obsFac','$location', function ($scope, obsFac, $location, $filter) {
    if ($location.$$path == "/new") {
      //Create Date object and set minutes to 0 or 30
      $scope.obj = {};
      $scope.obj.dob = new Date();     
      $scope.time =  $scope.obj.dob;
      $scope.time.setMinutes(Math.round($scope.time.getMinutes()/30)*30)

    } else {
        if (obsFac.Id != undefined) {
          obsFac.showData(obsFac.Id).success(function(data){
            $scope.obj = data.obj;
            $scope.myMessage = data.message;
            $scope.obj.dob = new Date(data.obj.dob);
            $scope.time =  $scope.obj.dob;
          })
        }  
    };

    $scope.open = {
        date1: false,
        date2: false
    };

    $scope.dateOptions = {
        showWeeks: false,
        startingDay: 1
    };

    $scope.timeOptions = {
        minuteStep: 30,
        readonlyInput: true,
        showMeridian: false
    };

    $scope.openCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
    };

    // watch date1 and date2 to add date and time 
    $scope.$watch( function() {
         return  $scope.time;
     }, function() {
      if ($scope.obj){
         if ($scope.obj.dob && $scope.time) {
             $scope.obj.dob.setMinutes($scope.time.getMinutes());
             $scope.obj.dob.setHours($scope.time.getHours());
         }
      }   
     }, true);    


    $scope.test = function() {
         alert("Huh!!!!");
    }
    $scope.save = function() {
        if ($scope.obj.dob && $scope.time) {
             $scope.obj.dob.setMinutes($scope.time.getMinutes());
             $scope.obj.dob.setHours($scope.time.getHours());
        };
        if ($scope.obj._id) {
            obsFac.update($scope.obj, $scope.obj._id)
        }  else {
            obsFac.insert($scope.obj)

              .success(function(data) {
                  obsFac.Id = data.obj._id
                  $location.path('/show');
                  //obsFac.get();
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              });          

        }
    }
 }])
