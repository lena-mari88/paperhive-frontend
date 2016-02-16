'use strict';

export default function(app) {

  app.controller('ActivityCtrl', [
    '$scope', 'metaService',
    function($scope, metaService) {
      // set meta data
      $scope.$watch('document', function(document) {
        if (document) {
          metaService.set({
            title: 'Activity · ' + document.title + ' · PaperHive',
            meta: [
              {
                name: 'description',
                content: 'Activity for ' + document.title + ' by ' +
                  document.authors.join(', ') + '.'
              },
              {name: 'author', content: document.authors.join(', ')}
            ]
          });
        }
      });
    }
  ]);
};