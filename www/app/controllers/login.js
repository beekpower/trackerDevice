angular.module('controllers').controller('LoginController',
function ($scope, $state, $api, $ionicPlatform, $cordovaDeviceMotion, $cordovaGeolocation, $interval) {
  var lastLat;
  var lastLon;
  var armed = false;
  var rotationThreshold = 2;
  var moved = false;



  $ionicPlatform.ready(function() {
    $scope.accel = {};
    $scope.rotation = {};
    $scope.gps = {};
    $scope.rotationCal = {};

    //Check Accelerometer rotation
    $interval(function() {
      $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {
        $scope.rotation.roll  = Math.atan2(result.y, result.z) * 180/3.14159265359;
        $scope.rotation.pitch = Math.atan2(-result.x, Math.sqrt(result.y*result.y + result.z*result.z)) * 180/3.14159265359;
      }, function(err) {
        console.log("error getting accel sensor data");
        // An error occurred. Show a message to the user
      });
      if (armed) {
        //check if moved based on calibrated val
        console.log($scope.rotation.roll);
        if (Math.abs($scope.rotation.roll - $scope.rotationCal.roll) > rotationThreshold || Math.abs($scope.rotation.pitch - $scope.rotationCal.pitch) > rotationThreshold) {
          $api.setMoved(true).success(function(response) {
            moved = true;
            console.log("Success setting moved");
          }).error(function(response) {
            console.log("Error setting moved");
          });
        }
      }
    }, 100);

    //Check for server flags
    $interval(function() {
     $api.getStatus().success(function(response) {
       if (response.armed == true) {
         if (armed = false) {
           //calibrate
           $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {
             $scope.rotationCal.roll  = Math.atan2(result.y, result.z) * 180/3.14159265359;
             $scope.rotation.rotationCal.pitch = Math.atan2(-result.x, Math.sqrt(result.y*result.y + result.z*result.z)) * 180/3.14159265359;
           }, function(err) {
             console.log("error getting accel sensor data");
             // An error occurred. Show a message to the user
           });
         }
         armed = true;
       } else {
         armed = false;
       }
     }).error(function(response) {
       console.log("Failure Checking Status");
     });
    }, 1000);

    var posOptions = { maximumAge: 0, timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
      $scope.gps.lat  = position.coords.latitude
      $scope.gps.lon = position.coords.longitude
      lastLat = position.coords.latitude;
      lastLon = position.coords.longitude;
    }, function(err) {
      // error
    });

    var watch = $cordovaGeolocation.watchPosition(posOptions);
    watch.then(
      null,
      function(err) {
        console.log("error getting gps coord");
      },
      function(position) {
        if (position.coords.latitude != lastLat && position.coords.longitude != lastLon) {
          lastLat = position.coords.latitude;
          lastLon = position.coords.longitude;
          $scope.gps.lat  = position.coords.latitude
          $scope.gps.lon = position.coords.longitude

          if (moved) {
            $api.uploadCoord(position.coords.latitude, position.coords.longitude).success(function(response) {
              console.log("Success uploading coord");
            }).error(function(response) {
              console.log("failure uploading coord");
            });
          }
        }
    });
  });
});
