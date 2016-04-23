(function () {

  angular.module('services')
    .service('$api', function ($http) {
      this.testAuth = function () {
        return $http.get("http://" + domain + "/v1/student/profile");
      }
    })
})();
