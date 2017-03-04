(function () {
  'use strict';

  angular.module('angular-gridster2').directive('gridsterItem', gridsterItem);

  /** @ngInject */
  function gridsterItem(gridsterDraggable, gridsterResizable) {
    function link(scope, element, attributes) {
      var item = scope.$eval(attributes.gridsterItem);
      scope.gridsterItem = {
        cols: item.cols,
        rows: item.rows,
        x: item.x,
        y: item.y,
        initCallback: item.initCallback,
        setSize: setSize,
        checkItemChanges: checkItemChanges,
        itemChanged: itemChanged,
        drag: new gridsterDraggable(element, scope),
        resize: new gridsterResizable(element, scope)
      };

      var itemTop, itemLeft, itemWidth, itemHeight, top, left, width, height, itemMargin;

      function setSize(noCheck) {
        if (scope.gridster.mobile) {
          top = 0;
          left = 0;
          width = scope.gridster.curWidth - (scope.gridster.outerMargin ? 2 * scope.gridster.margin : 0);
          height = width / 2;
        } else {
          top = scope.gridsterItem.y * scope.gridster.curRowHeight;
          left = scope.gridsterItem.x * scope.gridster.curColWidth;
          width = scope.gridsterItem.cols * scope.gridster.curColWidth - scope.gridster.margin;
          height = scope.gridsterItem.rows * scope.gridster.curRowHeight - scope.gridster.margin;
        }
        if (!noCheck && top === itemTop && left === itemLeft && width === itemWidth && height === itemHeight) {
          return;
        }
        if (scope.gridster.outerMargin) {
          itemMargin = scope.gridster.margin;
        } else {
          itemMargin = 0;
        }
        element.css({
          display: 'block',
          top: top + 'px',
          left: left + 'px',
          width: width + 'px',
          height: height + 'px',
          margin: itemMargin + 'px'
        });
        if (width !== itemWidth || height !== itemHeight) {
          scope.$broadcast('gridster-item-resize');
        }
        itemTop = top;
        itemLeft = left;
        itemWidth = width;
        itemHeight = height;
      }

      function itemChanged() {
        scope.$broadcast('gridster-item-change');
        if (scope.gridster.itemChangeCallback) {
          scope.gridster.itemChangeCallback(scope.gridsterItem, scope);
        }
      }

      function checkItemChanges(newValue, oldValue) {
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
          item.cols = scope.gridsterItem.cols;
          item.rows = scope.gridsterItem.rows;
          item.x = scope.gridsterItem.x;
          item.y = scope.gridsterItem.y;
          scope.gridster.calculateLayout();
          itemChanged();
        }
      }

      scope.$on('$destroy', function () {
        scope.gridsterItem.drag.toggle(false);
        scope.gridster.removeItem(scope.gridsterItem);
      });

      scope.gridster.addItem(scope.gridsterItem);
    }

    return {
      restrict: 'A',
      link: link
    }
  }
})();
