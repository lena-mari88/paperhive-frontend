'use strict';
export default function(app) {
  app.factory(
    'tourService',
    ['$window', 'authService',
      function($window, authService) {
        const service = {
          stages: ['start', 'margin-discussion', 'highlight', 'search', 'hive', 'signup'],
          index: 0,
        };

        service.increaseIndex = function() {
          service.index++;

          // do not show the tour next time when the last stage has been reached
          if (service.index === service.stages.length - 1) {
            $window.localStorage.tourVisited = true;
          }

          if (authService.user && (service.index === service.stages.length - 2)) {
            $window.localStorage.tourVisited = true;
          }
        };

        service.setUndefined = function() {
          service.index = undefined;
        };

        service.reject = function() {
          // ask local storage if flag 'tourVisited' is already set
          if (!$window.localStorage.tourVisited) {
            // set flag at first usage
            $window.localStorage.tourVisited = true;
          }
          service.index = undefined;
        };

        return service;
      }
    ]);
};
