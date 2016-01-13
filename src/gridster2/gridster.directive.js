(function () {
  'use strict';
  angular.module('angular-gridster2').directive('gridster', gridster);

  /** @ngInject */
  function gridster($window, $compile) {

    function link(scope, element, attributes, gridster) {
      var gridsterPreview = '<div gridster-preview></div>';
      element.append($compile(gridsterPreview)(scope));
      var options = scope.$eval(attributes.gridster), scrollBarPresent;

      scope.$watch(attributes.gridster, function () {
        gridster.setOptions(options);
      }, true);

      function setGridSize() {
        if (gridster.rowHeight === 'fit' && gridster.fitBreakpoint < element[0].clientWidth) {
          gridster.curWidth = element[0].offsetWidth;
          gridster.curHeight = element[0].offsetHeight;
        } else {
          gridster.curWidth = element[0].clientWidth;
          gridster.curHeight = element[0].clientHeight;
        }
      }

      setGridSize();

      function onResize() {
        setGridSize();
        gridster.calculateLayout();
      }

      var detectScrollBar = function () {
        if (scrollBarPresent && element[0].scrollHeight <= element[0].offsetHeight &&
          element[0].offsetWidth - element[0].clientWidth >= element[0].scrollHeight - element[0].offsetHeight) {
          scrollBarPresent = !scrollBarPresent;
          gridster.onResize();
        } else if (!scrollBarPresent && element[0].scrollHeight > element[0].offsetHeight &&
          element[0].offsetWidth - element[0].clientWidth < element[0].scrollHeight - element[0].offsetHeight) {
          scrollBarPresent = !scrollBarPresent;
          gridster.onResize();
        }
      };

      gridster.detectScrollBarLayout = _.debounce(detectScrollBar, 10);
      element[0].addEventListener('transitionend', gridster.detectScrollBarLayout);


      gridster.onResize = onResize;

      $window.addResizeListener(element[0], onResize);

      gridster.element = element;

      scope.$on('$destroy', function () {
        $window.removeResizeListener(element[0], onResize);
        element[0].removeEventListener('transitionend', gridster.detectScrollBarLayout);
      });
    }

    return {
      restrict: 'A',
      controller: 'GridsterController',
      controllerAs: 'gridster',
      link: link
    };
  }
})();
