(function () {

  angular.module('services')
    .service('$api', function ($http) {
      var domain = "api.connect.university";
      this.uploadCoord = function (lat, lng) {
        return $http.get("http://httpbin.org/ip");
      }
    })
})();
