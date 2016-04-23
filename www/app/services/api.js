(function () {

  angular.module('services')
    .service('$api', function ($http) {
      var domain = "api.connect.university";
      this.uploadCoord = function (lat, log) {
        return $http.get("http://" + domain + "/track", { "lat": lat, "lng": log});
      }
    })
})();
