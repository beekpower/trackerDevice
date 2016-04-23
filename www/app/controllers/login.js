angular.module('controllers').controller('LoginController',
function ($scope, $state, $api, $ionicPlatform, $cordovaDeviceMotion, $cordovaGeolocation, $interval) {
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


      var posOptions = {timeout: 10000, enableHighAccuracy: false};
$cordovaGeolocation
  .getCurrentPosition(posOptions)
  .then(function (position) {
    $scope.gps.lat  = position.coords.latitude
    $scope.gps.lon = position.coords.longitude
  }, function(err) {
    // error
  });


var watchOptions = {
  timeout : 3000,
  enableHighAccuracy: false // may cause errors if true
};

var watch = $cordovaGeolocation.watchPosition(watchOptions);
watch.then(
  null,
  function(err) {
    // error
  },
  function(position) {
    $scope.gps.lat  = position.coords.latitude
    $scope.gps.long = position.coords.longitude
});


   });

});