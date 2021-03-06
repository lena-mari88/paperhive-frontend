'use strict';

import template from './template.html';

export default function(app) {
    app.component('navbarUser', {
      controller: [ '$scope', 'authService', 'tourService',
        function($scope, authService, tourService) {

          $scope.auth = authService;
          $scope.tour = tourService;

        }],
      template,
    });
};
