(function () {
  'use strict';

  angular.module('angular-gridster2').factory('gridsterSwap', gridsterSwap);

  /** @ngInject */
  function gridsterSwap() {
    function GridsterSwap(scope, elemPosition) {
      var position = scope.gridster.pixelsToPosition(elemPosition[0], elemPosition[1]);
      var x = scope.gridsterItem.x;
      var y = scope.gridsterItem.y;
      scope.gridsterItem.x = position[0];
      scope.gridsterItem.y = position[1];
      var swapItem = scope.gridster.findItemWithItem(scope.gridsterItem);
      scope.gridsterItem.x = x;
      scope.gridsterItem.y = y;
      if (!swapItem) {
        return;
      }
      x = swapItem.x;
      y = swapItem.y;
      swapItem.x = scope.gridsterItem.x;
      swapItem.y = scope.gridsterItem.y;
      scope.gridsterItem.x = position[0];
      scope.gridsterItem.y = position[1];
      if (scope.gridster.checkCollision(swapItem) || scope.gridster.checkCollision(scope.gridsterItem)) {
        scope.gridsterItem.x = swapItem.x;
        scope.gridsterItem.y = swapItem.y;
        swapItem.x = x;
        swapItem.y = y;
      } else {
        swapItem.setSize(true);
        swapItem.checkItemChanges(swapItem, {x: x, y: y, cols: swapItem.cols, rows: swapItem.rows});
      }
    }

    return GridsterSwap;
  }
})();
