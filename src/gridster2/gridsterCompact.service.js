(function () {
  'use strict';

  angular.module('angular-gridster2')
    .service('GridsterCompact', GridsterCompact);

  /** @ngInject */
  function GridsterCompact() {
    return function (gridster) {
      var vm = this;

      vm.destroy = function () {
        delete vm.gridster;
      };

      vm.checkCompact = function checkCompact() {
        if (gridster.$options.compactType !== 'none') {
          if (gridster.$options.compactType === 'compactUp') {
            vm.checkCompactUp();
          } else if (gridster.$options.compactType === 'compactLeft') {
            vm.checkCompactLeft();
          } else if (gridster.$options.compactType === 'compactUp&Left') {
            vm.checkCompactUp();
            vm.checkCompactLeft();
          } else if (gridster.$options.compactType === 'compactLeft&Up') {
            vm.checkCompactLeft();
            vm.checkCompactUp();
          }
        }
      };

      vm.checkCompactUp = function checkCompactUp() {
        var widgetMovedUp = false, widget, moved;
        var l = gridster.grid.length;
        for (var i = 0; i < l; i++) {
          widget = gridster.grid[i];
          if (widget.$item.compactEnabled === false) {
            continue;
          }
          moved = vm.moveUpTillCollision(widget);
          if (moved) {
            widgetMovedUp = true;
            widget.item.y = widget.$item.y;
            widget.itemChanged();
          }
        }
        if (widgetMovedUp) {
          vm.checkCompactUp();
        }
      };

      vm.moveUpTillCollision = function moveUpTillCollision(itemComponent) {
        itemComponent.$item.y -= 1;
        if (gridster.checkCollision(itemComponent.$item)) {
          itemComponent.$item.y += 1;
          return false;
        } else {
          vm.moveUpTillCollision(itemComponent);
          return true;
        }
      };

      vm.checkCompactLeft = function checkCompactLeft() {
        var widgetMovedLeft = false, widget, moved;
        var l = gridster.grid.length;
        for (var i = 0; i < l; i++) {
          widget = gridster.grid[i];
          if (widget.$item.compactEnabled === false) {
            continue;
          }
          moved = vm.moveLeftTillCollision(widget);
          if (moved) {
            widgetMovedLeft = true;
            widget.item.x = widget.$item.x;
            widget.itemChanged();
          }
        }
        if (widgetMovedLeft) {
          vm.checkCompactLeft();
        }
      };

      vm.moveLeftTillCollision = function moveLeftTillCollision(itemComponent) {
        itemComponent.$item.x -= 1;
        if (gridster.checkCollision(itemComponent.$item)) {
          itemComponent.$item.x += 1;
          return false;
        } else {
          vm.moveLeftTillCollision(itemComponent);
          return true;
        }
      }
    };
  }
})();
