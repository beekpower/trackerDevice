angular.module('controllers').controller('LoginController',
function ($scope, $state, $api, $ionicPlatform, $cordovaDeviceMotion, $cordovaGeolocation, $interval) {
  var lastLat;
  var lastLon;

   $ionicPlatform.ready(function() {
     $scope.accel = {};
     $scope.rotation = {};
     $scope.gps = {};
     $interval(function() {
       $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {

       $scope.accel = result;
       $scope.rotation.roll  = Math.atan2(result.y, result.z) * 180/3.14159265359;
       $scope.rotation.pitch = Math.atan2(-result.x, Math.sqrt(result.y*result.y + result.z*result.z)) * 180/3.14159265359;

        // console.log(result);
      }, function(err) {
         // An error occurred. Show a message to the user
      });
    }, 100);

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
        // error
      },
      function(position) {
        if (position.coords.latitude != lastLat && position.coords.longitude != lastLon) {
          $api.uploadCoord(position.coords.latitude, position.coords.longitude).success(function(response) {
            lastLat = position.coords.latitude;
            lastLon = position.coords.longitude;
          }).error(function(response) {
            alert("failure");
          });
        }

        $scope.gps.lat  = position.coords.latitude
        $scope.gps.lon = position.coords.longitude
    });
  });
});
