(function () {
  'use strict';
  angular.module('angular-gridster2').directive('gridsterPreview', gridsterPreview);

  function gridsterPreview() {
    return {
      restrict: 'A',
      replace: true,
      template: '<div class="gridster-preview-holder"></div>',
      link: function (scope, element) {
        scope.gridster.previewStyleString = {};
        /**
         * @returns {Object} style object for preview element
         */
        scope.gridster.previewStyle = function () {
          if (!scope.gridster.movingItem) {
            element.css({
              display: 'none'
            });
          } else {
            element.css({
              display: 'block',
              height: (scope.gridster.movingItem.rows * scope.gridster.curRowHeight - scope.gridster.margin) + 'px',
              width: (scope.gridster.movingItem.cols * scope.gridster.curColWidth - scope.gridster.margin) + 'px',
              top: (scope.gridster.movingItem.y * scope.gridster.curRowHeight + (scope.gridster.outerMargin ? scope.gridster.margin : 0)) + 'px',
              left: (scope.gridster.movingItem.x * scope.gridster.curColWidth + (scope.gridster.outerMargin ? scope.gridster.margin : 0)) + 'px',
              marginBottom: (scope.gridster.outerMargin ? scope.gridster.margin : 0) + 'px'
            });
          }
        };
      }
    };
  }
})();
