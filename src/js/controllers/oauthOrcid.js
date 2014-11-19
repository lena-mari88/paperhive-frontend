module.exports = function (app) {
  app.controller('OauthOrcidCtrl', [
    '$scope', '$routeParams', '$location', 'AuthService',
    function ($scope, $routeParams, $location, authService) {
      authService
        .signinOrcid($routeParams.code, $routeParams.state)
        .then(
          function success(data) {
            $location.path('/welcome').search({});
          },
          function fail(reason) {
            $scope.error = reason;
          }
        );
      $scope.auth = authService;
    }
  ]);
};
