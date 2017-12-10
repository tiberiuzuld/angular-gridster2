(function () {
  'use strict';

  angular.module('angular-gridster2')
    .service('GridsterSwap', function () {
      return function (gridsterItem) {
        var vm = this;
        vm.swapedItem = undefined;
        vm.gridsterItem = gridsterItem;
        vm.gridster = gridsterItem.gridster;

        vm.destroy = function () {
          delete vm.gridster;
          delete vm.gridsterItem;
          delete vm.swapedItem;
        };

        vm.swapItems = function () {
          if (vm.gridster.$options.swap) {
            vm.checkSwapBack();
            vm.checkSwap(vm.gridsterItem);
          }
        };

        vm.checkSwapBack = function () {
          if (vm.swapedItem) {
            var x = vm.swapedItem.$item.x;
            var y = vm.swapedItem.$item.y;
            vm.swapedItem.$item.x = vm.swapedItem.item.x;
            vm.swapedItem.$item.y = vm.swapedItem.item.y;
            if (vm.gridster.checkCollision(vm.swapedItem.$item)) {
              vm.swapedItem.$item.x = x;
              vm.swapedItem.$item.y = y;
            } else {
              vm.swapedItem.setSize(true);
              vm.gridsterItem.$item.x = vm.gridsterItem.item.x;
              vm.gridsterItem.$item.y = vm.gridsterItem.item.y;
              vm.swapedItem = undefined;
            }

          }
        };

        vm.restoreSwapItem = function () {
          if (vm.swapedItem) {
            vm.swapedItem.$item.x = vm.swapedItem.item.x;
            vm.swapedItem.$item.y = vm.swapedItem.item.y;
            vm.swapedItem.setSize(true);
            vm.swapedItem = undefined;
          }
        };

        vm.setSwapItem = function () {
          if (vm.swapedItem) {
            vm.swapedItem.checkItemChanges(vm.swapedItem.$item, vm.swapedItem.item);
            vm.swapedItem = undefined;
          }
        };

        vm.checkSwap = function (pushedBy) {
          var gridsterItemCollision = vm.gridster.checkCollision(pushedBy.$item);
          if (gridsterItemCollision && gridsterItemCollision !== true && gridsterItemCollision.canBeDragged()) {
            var gridsterItemCollide = gridsterItemCollision;
            var copyCollisionX = gridsterItemCollide.$item.x;
            var copyCollisionY = gridsterItemCollide.$item.y;
            var copyX = pushedBy.$item.x;
            var copyY = pushedBy.$item.y;
            gridsterItemCollide.$item.x = pushedBy.item.x;
            gridsterItemCollide.$item.y = pushedBy.item.y;
            pushedBy.$item.x = gridsterItemCollide.item.x;
            pushedBy.$item.y = gridsterItemCollide.item.y;
            if (vm.gridster.checkCollision(gridsterItemCollide.$item) || vm.gridster.checkCollision(pushedBy.$item)) {
              pushedBy.$item.x = copyX;
              pushedBy.$item.y = copyY;
              gridsterItemCollide.$item.x = copyCollisionX;
              gridsterItemCollide.$item.y = copyCollisionY;
            } else {
              gridsterItemCollide.setSize(true);
              vm.swapedItem = gridsterItemCollide;
            }
          }
        };
        return vm;
      }
    });
})();
