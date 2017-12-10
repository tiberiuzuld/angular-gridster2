(function () {
  'use strict';

  angular.module('angular-gridster2')
    .service('GridsterPushResize', GridsterPushResize);

  /** @ngInject */
  function GridsterPushResize() {
    return function (gridsterItem) {
      var vm = this;
      vm.pushedItems = [];
      vm.pushedItemsPath = [];
      vm.gridsterItem = gridsterItem;
      vm.gridster = gridsterItem.gridster;

      vm.fromSouth = 'fromSouth';
      vm.fromNorth = 'fromNorth';
      vm.fromEast = 'fromEast';
      vm.fromWest = 'fromWest';

      vm.destroy = function () {
        delete vm.gridster;
        delete vm.gridsterItem;
      };

      vm.pushItems = function (direction) {
        if (vm.gridster.$options.pushResizeItems) {
          vm.push(vm.gridsterItem, direction);
        }
      };

      vm.restoreItems = function () {
        var i = 0;
        var l = vm.pushedItems.length;
        var pushedItem;
        for (; i < l; i++) {
          pushedItem = vm.pushedItems[i];
          pushedItem.$item.x = pushedItem.item.x;
          pushedItem.$item.y = pushedItem.item.y;
          pushedItem.$item.cols = pushedItem.item.cols;
          pushedItem.$item.row = pushedItem.item.row;
          pushedItem.setSize(true);
        }
        vm.pushedItems = undefined;
        vm.pushedItemsPath = undefined;
      };

      vm.setPushedItems = function () {
        var i = 0;
        var l = vm.pushedItems.length;
        var pushedItem;
        for (; i < l; i++) {
          pushedItem = vm.pushedItems[i];
          pushedItem.checkItemChanges(pushedItem.$item, pushedItem.item);
        }
        vm.pushedItems = undefined;
        vm.pushedItemsPath = undefined;
      };

      vm.push = function (gridsterItem, direction) {
        var gridsterItemCollision = vm.gridster.checkCollision(gridsterItem.$item);
        if (gridsterItemCollision && gridsterItemCollision !== true &&
          gridsterItemCollision !== vm.gridsterItem && gridsterItemCollision.canBeResized()) {
          if (vm.tryPattern[direction].call(vm, gridsterItemCollision, gridsterItem, direction)) {
            return true;
          }
        } else if (gridsterItemCollision === false) {
          return true;
        }
        return false;
      };

      vm.trySouth = function (gridsterItemCollide, gridsterItem, direction) {
        var backUpY = gridsterItemCollide.$item.y;
        var backUpRows = gridsterItemCollide.$item.rows;
        gridsterItemCollide.$item.y = gridsterItem.$item.y + gridsterItem.$item.rows;
        gridsterItemCollide.$item.rows = backUpRows + backUpY - gridsterItemCollide.$item.y;
        if (!vm.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
          && !vm.gridster.checkGridCollision(gridsterItemCollide.$item)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          vm.push(gridsterItem, direction);
          return true;
        } else {
          gridsterItemCollide.$item.y = backUpY;
          gridsterItemCollide.$item.rows = backUpRows;
        }
        return false;
      };

      vm.tryNorth = function (gridsterItemCollide, gridsterItem, direction) {
        var backUpRows = gridsterItemCollide.$item.rows;
        gridsterItemCollide.$item.rows = gridsterItem.$item.y - gridsterItemCollide.$item.y;
        if (!vm.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
          && !vm.gridster.checkGridCollision(gridsterItemCollide.$item)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          vm.push(gridsterItem, direction);
          return true;
        } else {
          gridsterItemCollide.$item.rows = backUpRows;
        }
        return false;
      };

      vm.tryEast = function (gridsterItemCollide, gridsterItem, direction) {
        var backUpX = gridsterItemCollide.$item.x;
        var backUpCols = gridsterItemCollide.$item.cols;
        gridsterItemCollide.$item.x = gridsterItem.$item.x + gridsterItem.$item.cols;
        gridsterItemCollide.$item.cols = backUpCols + backUpX - gridsterItemCollide.$item.x;
        if (!vm.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
          && !vm.gridster.checkGridCollision(gridsterItemCollide.$item)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          vm.push(gridsterItem, direction);
          return true;
        } else {
          gridsterItemCollide.$item.x = backUpX;
          gridsterItemCollide.$item.cols = backUpCols;
        }
        return false;
      };

      vm.tryWest = function (gridsterItemCollide, gridsterItem, direction) {
        var backUpCols = gridsterItemCollide.$item.cols;
        gridsterItemCollide.$item.cols = gridsterItem.$item.x - gridsterItemCollide.$item.x;
        if (!vm.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
          && !vm.gridster.checkGridCollision(gridsterItemCollide.$item)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          vm.push(gridsterItem, direction);
          return true;
        } else {
          gridsterItemCollide.$item.cols = backUpCols;
        }
        return false;
      };

      vm.tryPattern = {
        fromEast: vm.tryWest,
        fromWest: vm.tryEast,
        fromNorth: vm.trySouth,
        fromSouth: vm.tryNorth
      };

      vm.addToPushed = function (gridsterItem) {
        if (vm.pushedItems.indexOf(gridsterItem) < 0) {
          vm.pushedItems.push(gridsterItem);
          vm.pushedItemsPath.push([
            {
              x: gridsterItem.item.x,
              y: gridsterItem.item.y,
              cols: gridsterItem.item.cols,
              rows: gridsterItem.item.rows
            },
            {
              x: gridsterItem.$item.x,
              y: gridsterItem.$item.y,
              cols: gridsterItem.$item.cols,
              rows: gridsterItem.$item.rows
            }]);
        } else {
          var i = vm.pushedItems.indexOf(gridsterItem);
          vm.pushedItemsPath[i].push(
            {
              x: gridsterItem.$item.x,
              y: gridsterItem.$item.y,
              cols: gridsterItem.$item.cols,
              rows: gridsterItem.$item.rows
            });
        }
      };

      vm.removeFromPushed = function (i) {
        if (i > -1) {
          vm.pushedItems.splice(i, 1);
          vm.pushedItemsPath.splice(i, 1);
        }
      };

      vm.checkPushBack = function () {
        var i = vm.pushedItems.length - 1;
        var change = false;
        for (; i > -1; i--) {
          if (vm.checkPushedItem(vm.pushedItems[i], i)) {
            change = true;
          }
        }
        if (change) {
          vm.checkPushBack();
        }
      };

      vm.checkPushedItem = function (pushedItem, i) {
        var path = vm.pushedItemsPath[i];
        var j = path.length - 2;
        var lastPosition, x, y, cols, rows;
        for (; j > -1; j--) {
          lastPosition = path[j];
          x = pushedItem.$item.x;
          y = pushedItem.$item.y;
          cols = pushedItem.$item.cols;
          rows = pushedItem.$item.rows;
          pushedItem.$item.x = lastPosition.x;
          pushedItem.$item.y = lastPosition.y;
          pushedItem.$item.cols = lastPosition.cols;
          pushedItem.$item.rows = lastPosition.rows;
          if (!vm.gridster.findItemWithItem(pushedItem.$item)) {
            pushedItem.setSize(true);
            path.splice(j + 1, path.length - 1 - j);
          } else {
            pushedItem.$item.x = x;
            pushedItem.$item.y = y;
            pushedItem.$item.cols = cols;
            pushedItem.$item.rows = rows;
          }
        }
        if (path.length < 2) {
          vm.removeFromPushed(i);
          return true;
        }
        return false;
      }
    }
  }
})();
