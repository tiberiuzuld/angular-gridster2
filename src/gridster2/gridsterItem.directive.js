(function () {
  'use strict';

  angular.module('angular-gridster2').directive('gridsterItem', gridsterItem);

  /** @ngInject */
  function gridsterItem(gridsterDraggable, gridsterResizable) {
    function link(scope, element, attributes) {
      scope.gridsterItem = scope.$eval(attributes.gridsterItem);

      scope.gridsterItem.drag = new gridsterDraggable(element, scope);
      scope.gridsterItem.resize = new gridsterResizable(element, scope);

      scope.gridster.addItem(scope.gridsterItem);

      var itemTop, itemLeft, itemWidth, itemHeight, top, left, width, height, itemMarginBottom;

      function setSize(noCheck) {
        if (scope.gridster.mobile) {
          top = (scope.gridster.outerMargin ? scope.gridster.margin : 0);
          left = (scope.gridster.outerMargin ? scope.gridster.margin : 0);
          width = scope.gridster.curWidth - (scope.gridster.outerMargin ? 2 * scope.gridster.margin : 0);
          height = width / 2;
        } else {
          top = (scope.gridsterItem.y * scope.gridster.curRowHeight + (scope.gridster.outerMargin ? scope.gridster.margin : 0));
          left = (scope.gridsterItem.x * scope.gridster.curColWidth + (scope.gridster.outerMargin ? scope.gridster.margin : 0));
          width = scope.gridsterItem.cols * scope.gridster.curColWidth - scope.gridster.margin;
          height = scope.gridsterItem.rows * scope.gridster.curRowHeight - scope.gridster.margin;
        }
        if (!noCheck && top === itemTop && left === itemLeft && width === itemWidth && height === itemHeight) {
          return;
        } else {
          if (width !== itemWidth || height !== itemHeight) {
            scope.$broadcast('gridster-item-resize');
          }
          itemTop = top;
          itemLeft = left;
          itemWidth = width;
          itemHeight = height;
          if (scope.gridster.outerMargin) {
            itemMarginBottom = scope.gridster.margin;
          } else {
            itemMarginBottom = 0;
          }
        }
        element.css({
          display: 'block',
          top: itemTop + 'px',
          left: itemLeft + 'px',
          width: itemWidth + 'px',
          height: itemHeight + 'px',
          marginBottom: itemMarginBottom + 'px'
        });
      }

      scope.gridsterItem.setSize = setSize;

      scope.gridsterItem.checkItemChanges = function (newValue, oldValue) {
        if (newValue.rows === oldValue.rows && newValue.cols === oldValue.cols && newValue.x === oldValue.x && newValue.y === oldValue.y) {
          return;
        }
        if (newValue.rows < scope.gridster.minItemRows || newValue.cols < scope.gridster.minItemCols ||
          scope.gridster.checkCollision(scope.gridsterItem)) {
          scope.gridsterItem.x = oldValue.x;
          scope.gridsterItem.y = oldValue.y;
          scope.gridsterItem.cols = oldValue.cols;
          scope.gridsterItem.rows = oldValue.rows;
        } else {
          scope.$broadcast('gridster-item-change');
          scope.gridster.calculateLayout();
          if (scope.gridster.itemChangeCallback) {
            scope.gridster.itemChangeCallback(scope.gridsterItem, scope);
          }
        }
      };

      scope.$on('$destroy', function () {
        scope.gridsterItem.drag.toggle(false);
        scope.gridster.removeItem(scope.gridsterItem);
      });
    }

    return {
      restrict: 'A',
      link: link
    }
  }
})();
