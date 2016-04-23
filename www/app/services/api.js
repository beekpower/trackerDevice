(function () {

  angular.module('services')
    .service('$api', function ($http) {
      var domain = "api.connect.university";
      this.uploadCoord = function (lat, log) {
        return $http.post("http://" + domain + "/track", { "lat": lat, "lng": log});
      }
      this.getStatus = function() {
        return $http.get("http://" + domain + "/status");
      }
    })
})();
