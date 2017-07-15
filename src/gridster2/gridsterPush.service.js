(function () {
  'use strict';

  angular.module('angular-gridster2')
    .service('GridsterPush', GridsterPush);

  /** @ngInject */
  function GridsterPush() {
    return function (gridsterItem, gridster) {
      var vm = this;

      vm.pushedItems = [];
      vm.pushedItemsPath = [];
      vm.gridsterItem = gridsterItem;
      vm.gridster = gridster;
      vm.fromSouth = 'fromSouth';
      vm.fromNorth = 'fromNorth';
      vm.fromEast = 'fromEast';
      vm.fromWest = 'fromWest';

      vm.pushItems = function (direction) {
        if (vm.gridster.$options.pushItems) {
          vm.push(vm.gridsterItem, direction, vm.gridsterItem);
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

      vm.push = function (gridsterItem, direction, pushedBy) {
        var gridsterItemCollision = vm.gridster.checkCollision(gridsterItem.$item, pushedBy.$item);
        if (gridsterItemCollision && gridsterItemCollision !== true &&
          gridsterItemCollision !== vm.gridsterItem && gridsterItemCollision.canBeDragged()) {
          var gridsterItemCollide = gridsterItemCollision;
          if (vm.tryPattern[direction][0].call(this, gridsterItemCollide, gridsterItem, direction, pushedBy)) {
            return true;
          } else if (vm.tryPattern[direction][1].call(this, gridsterItemCollide, gridsterItem, direction, pushedBy)) {
            return true;
          } else if (vm.tryPattern[direction][2].call(this, gridsterItemCollide, gridsterItem, direction, pushedBy)) {
            return true;
          } else if (vm.tryPattern[direction][3].call(this, gridsterItemCollide, gridsterItem, direction, pushedBy)) {
            return true;
          }
        } else if (gridsterItemCollision === undefined) {
          return true;
        }
      };

      vm.trySouth = function (gridsterItemCollide, gridsterItem, direction, pushedBy) {
        var backUpY = gridsterItemCollide.$item.y;
        gridsterItemCollide.$item.y = gridsterItem.$item.y + gridsterItem.$item.rows;
        if (!vm.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
          && vm.push(gridsterItemCollide, vm.fromNorth, gridsterItem)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          vm.push(gridsterItem, direction, pushedBy);
          return true;
        } else {
          gridsterItemCollide.$item.y = backUpY;
        }
      };

      vm.tryNorth = function (gridsterItemCollide, gridsterItem, direction, pushedBy) {
        var backUpY = gridsterItemCollide.$item.y;
        gridsterItemCollide.$item.y = gridsterItem.$item.y - gridsterItemCollide.$item.rows;
        if (!vm.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
          && vm.push(gridsterItemCollide, vm.fromSouth, gridsterItem)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          vm.push(gridsterItem, direction, pushedBy);
          return true;
        } else {
          gridsterItemCollide.$item.y = backUpY;
        }
      };

      vm.tryEast = function (gridsterItemCollide, gridsterItem, direction, pushedBy) {
        var backUpX = gridsterItemCollide.$item.x;
        gridsterItemCollide.$item.x = gridsterItem.$item.x + gridsterItem.$item.cols;
        if (!vm.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
          && vm.push(gridsterItemCollide, vm.fromWest, gridsterItem)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          vm.push(gridsterItem, direction, pushedBy);
          return true;
        } else {
          gridsterItemCollide.$item.x = backUpX;
        }
      };

      vm.tryWest = function (gridsterItemCollide, gridsterItem, direction, pushedBy) {
        var backUpX = gridsterItemCollide.$item.x;
        gridsterItemCollide.$item.x = gridsterItem.$item.x - gridsterItemCollide.$item.cols;
        if (!vm.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
          && vm.push(gridsterItemCollide, vm.fromEast, gridsterItem)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          vm.push(gridsterItem, direction, pushedBy);
          return true;
        } else {
          gridsterItemCollide.$item.x = backUpX;
        }
      };

      vm.tryPattern = {
        fromEast: [vm.tryWest, vm.trySouth, vm.tryNorth, vm.tryEast],
        fromWest: [vm.tryEast, vm.trySouth, vm.tryNorth, vm.tryWest],
        fromNorth: [vm.trySouth, vm.tryEast, vm.tryWest, vm.tryNorth],
        fromSouth: [vm.tryNorth, vm.tryEast, vm.tryWest, vm.trySouth]
      };

      vm.addToPushed = function (gridsterItem) {
        if (vm.pushedItems.indexOf(gridsterItem) < 0) {
          vm.pushedItems.push(gridsterItem);
          vm.pushedItemsPath.push([{x: gridsterItem.item.x, y: gridsterItem.item.y}, {
            x: gridsterItem.$item.x,
            y: gridsterItem.$item.y
          }]);
        } else {
          var i = vm.pushedItems.indexOf(gridsterItem);
          vm.pushedItemsPath[i].push({x: gridsterItem.$item.x, y: gridsterItem.$item.y});
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
        for (; i > -1; i--) {
          vm.checkPushedItem(vm.pushedItems[i], i);
        }
      };

      vm.checkPushedItem = function (pushedItem, i) {
        var path = vm.pushedItemsPath[i];
        var j = path.length - 2;
        var lastPosition;
        for (; j > -1; j--) {
          lastPosition = path[j];
          pushedItem.$item.x = lastPosition.x;
          pushedItem.$item.y = lastPosition.y;
          if (!vm.gridster.findItemWithItem(pushedItem.$item)) {
            pushedItem.setSize(true);
            path.splice(j + 1, path.length - 1 - j);
          } else {
            lastPosition = path[path.length - 1];
            pushedItem.$item.x = lastPosition.x;
            pushedItem.$item.y = lastPosition.y;
          }
        }
        if (path.length < 2) {
          vm.removeFromPushed(i);
        }
      };
    }
  }
})();
