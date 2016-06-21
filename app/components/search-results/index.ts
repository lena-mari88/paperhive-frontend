'use strict';

import * as _ from 'lodash';

import template from './template.html';

export default function(app) {
  app.component(
    'searchResults',
    {
      template,
      controller: [
        'config', '$http', '$location', '$scope', 'notificationService',
        function(config, $http, $location, $scope, notificationService) {
          const maxPerPage = 10;

          $scope.search = {
            page: 1,
            maxSize: 7,
          };

          // update scope variables from location
          function updateFromLocation() {
            $scope.search.query = $location.search().query;
            $scope.search.page = $location.search().page || 1;

            $scope.search.period = $location.search().period || 'any';
            $scope.search.periodFrom = $location.search().periodFrom || 1900;
            $scope.search.periodUntil = $location.search().periodUntil || (new Date()).getFullYear();

            $scope.search.inTitle = ($location.search().inTitle === false ? false : true);
            $scope.search.inAuthors = ($location.search().inAuthors === false ? false : true);
            $scope.search.inAbstract = ($location.search().inAbstract === false ? false : true);

            $scope.search.journal = $location.search().journal || '';
            $scope.search.publisher = $location.search().publisher || '';
            $scope.search.tags = $location.search().tags || '';

          }
          updateFromLocation();
          $scope.$on('$locationChangeSuccess', updateFromLocation);

          // update location from scope variables
          function updateFromScope(page) {
            $location.search({
              query: $scope.search.query,
              page: page,
              period: $scope.search.period,
              periodFrom: $scope.search.periodFrom,
              periodUntil: $scope.search.periodUntil,
              inTitle: $scope.search.inTitle,
              inAuthors: $scope.search.inAuthors,
              inAbstract: $scope.search.inAbstract,
              journal: $scope.search.journal,
              publisher: $scope.search.publisher,
              tags: $scope.search.tags
            });
          }

          function getSearchResults(query, page) {
            $scope.search.total = undefined;
            $scope.search.documents = undefined;

            // $scope.search.searchIn = {
            //   title: true,
            //   authors: true,
            //   abstract: true
            // };

            return $http.get(config.apiUrl + '/documents/search', {
              params: {
                q: query,
                limit: maxPerPage,
                skip: (page - 1) * maxPerPage,
                restrictToLatest: true,
                period: $scope.search.period,
                periodFrom: $scope.search.periodFrom,
                periodUntil: $scope.search.periodUntil,
                inTitle: $location.search().inTitle,
                inAuthors: $location.search().inAuthors,
                inAbstract: $location.search().inAbstract,
                journal: $scope.search.journal,
                publisher: $scope.search.publisher,
                tags: $scope.search.tags
              }
            })
            .then(
              function(response) {
                $scope.search.total = response.data.total;
                $scope.search.documents = response.data.documents;
              },
              function(response) {
                notificationService.notifications.push({
                  type: 'error',
                  message: 'Could not fetch documents'
                });
              }
            );
          };

          $scope.$watchGroup(['search.query', 'search.page', 'search.period', 'search.inTitle', 'search.inAuthors', 'search.inAbstract', 'search.periodFrom', 'search.periodUntil', 'search.journal', 'search.publisher', 'search.tags'], newValues => {
            let searchQuery = newValues[0];
            let searchPage = newValues[1];

            updateFromScope(searchPage);
            getSearchResults(searchQuery, searchPage)
          });

          $scope.scrollToTop = function() {
            window.scrollTo(0, 0);
          };

          $scope.filterForTag = function(tag) {
            if($scope.search.tags.length > 0) {
              $scope.search.tags += ', ';
            }
            $scope.search.tags += tag.value;
          };

          $scope.filterForDate = function(dateString) {
            let dateObj = new Date(dateString);

            $scope.search.period = 'custom';
            $scope.search.periodFrom = dateObj.getFullYear();
            $scope.search.periodUntil = dateObj.getFullYear();
          };

        }
      ]
    });
};
