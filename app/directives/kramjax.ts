/*global MathJax*/
'use strict';

// TODO: ts complains about missing default export but this works!
import jquery from 'jquery';
import kramed from 'kramed';
import {highlightAuto} from 'highlightjs';
// TODO: const MathJax = require('MathJax');

export default function(app) {

  // syntax highlighting with highlight.js
  kramed.setOptions({
    highlight: function(code) {
      return highlightAuto(code).value;
    }
  });

  app.directive(
    'kramjax', ['$sanitize', 'notificationService',
    function($sanitize, notificationService) {
      // modify the kramed renderer such that math items are wrapped in
      // div and span groups
      const renderer = new kramed.Renderer();
      const origMathRenderer = renderer.math;
      renderer.math = function(content, language, display) {
        if (display) {
          return '<div class="mathjax">' + content + '</div>';
        } else {
          return '<span class="mathjax">' + content + '</span>';
        }
      };
      const origParagraphRenderer = renderer.paragraph;

      return {
        restrict: 'E',
        scope: {
          body: '=',
          suppressParagraphs: '='
        },
        link: function(scope, element, attrs) {
          // kramed puts a <p> around every output sample, making it impossible
          // to avoid the line break right after the kramed text; cf.
          // <https://github.com/GitbookIO/kramed/issues/40>. To work around,
          // add an attribute option here to suppress paragraphs altogether.
          scope.$watch('suppressParagraphs', function(value) {
            if (value) {
              renderer.paragraph = function(text) { return text; };
            } else {
              renderer.paragraph = origParagraphRenderer;
            }
          });

          scope.$watch('body', function(newValue) {
            try {
              element.html(
                $sanitize(kramed(newValue || '', {renderer: renderer}))
              );
              // replace span/div tags with script tags
              jquery(element[0]).find('.mathjax').each(function(index, el) {
                jquery(el).replaceWith(origMathRenderer(
                  jquery(el).text(), 'math/tex', jquery(el).prop('tagName') === 'DIV'
                ));
              });
              MathJax.Hub.Queue(['Typeset', MathJax.Hub, element[0]]);
            } catch (e) {
              notificationService.notifications.push({
                type: 'error',
                message: e.message
              });
            }
          });
        }
      };
    }
  ]);
};
