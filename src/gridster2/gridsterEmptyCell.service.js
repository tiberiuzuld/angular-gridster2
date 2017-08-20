(function () {
  'use strict';

  angular.module('angular-gridster2')
    .service('GridsterEmptyCell', GridsterEmptyCell);

  /** @ngInject */
  function GridsterEmptyCell(GridsterUtils) {
    return function (gridster) {
      var vm = this;
      vm.updateOptions = function () {
        if (gridster.$options.enableEmptyCellClick && !vm.emptyCellClick && gridster.$options.emptyCellClickCallback) {
          vm.emptyCellClick = true;
          gridster.el.addEventListener('click', vm.emptyCellClickCb);
        } else if (!gridster.$options.enableEmptyCellClick && vm.emptyCellClick) {
          vm.emptyCellClick = false;
          gridster.el.removeEventListener('click', vm.emptyCellClickCb);
        }
        if (gridster.$options.enableEmptyCellDrop && !vm.emptyCellDrop && gridster.$options.emptyCellDropCallback) {
          vm.emptyCellDrop = true;
          gridster.el.addEventListener('drop', vm.emptyCellDragDrop);
          gridster.el.addEventListener('dragover', vm.emptyCellDragOver);
        } else if (!gridster.$options.enableEmptyCellDrop && vm.emptyCellDrop) {
          vm.emptyCellDrop = false;
          gridster.el.removeEventListener('drop', vm.emptyCellDragDrop);
          gridster.el.removeEventListener('dragover', vm.emptyCellDragOver);
        }
        if (gridster.$options.enableEmptyCellDrag && !vm.emptyCellDrag && gridster.$options.emptyCellDragCallback) {
          vm.emptyCellDrag = true;
          gridster.el.addEventListener('mousedown', vm.emptyCellMouseDown);
        } else if (!gridster.$options.enableEmptyCellDrag && vm.emptyCellDrag) {
          vm.emptyCellDrag = false;
          gridster.el.removeEventListener('mousedown', vm.emptyCellMouseDown);
        }
      };
      vm.emptyCellClickCb = function (e) {
        if (gridster.movingItem || GridsterUtils.checkContentClassForEvent(gridster, e)) {
          return;
        }
        var item = vm.getValidItemFromEvent(e);
        if (!item) {
          return;
        }
        gridster.$options.emptyCellClickCallback(event, item);
      };

      vm.emptyCellDragDrop = function (e) {
        var item = vm.getValidItemFromEvent(e);
        if (!item) {
          return;
        }
        gridster.$options.emptyCellDropCallback(event, item);
      };

      vm.emptyCellDragOver = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (vm.getValidItemFromEvent(e)) {
          e.dataTransfer.dropEffect = 'move';
        } else {
          e.dataTransfer.dropEffect = 'none';
        }
      };

      vm.emptyCellMouseDown = function (e) {
        if (GridsterUtils.checkContentClassForEvent(gridster, e)) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        var item = vm.getValidItemFromEvent(e);
        if (!item) {
          return;
        }
        vm.initialItem = item;
        gridster.movingItem = item;
        gridster.previewStyle();
        window.addEventListener('mousemove', vm.emptyCellMouseMove);
        window.addEventListener('mouseup', vm.emptyCellMouseUp);
      };

      vm.emptyCellMouseMove = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var item = vm.getValidItemFromEvent(e, vm.initialItem);
        if (!item) {
          return;
        }

        gridster.movingItem = item;
        gridster.previewStyle();
      };

      vm.emptyCellMouseUp = function (e) {
        window.removeEventListener('mousemove', vm.emptyCellMouseMove);
        window.removeEventListener('mouseup', vm.emptyCellMouseUp);
        var item = vm.getValidItemFromEvent(e, vm.initialItem);
        if (item) {
          gridster.movingItem = item;
        }
        gridster.$options.emptyCellDragCallback(e, gridster.movingItem);
        setTimeout(function () {
          gridster.movingItem = null;
          gridster.previewStyle();
        });
      };

      vm.getValidItemFromEvent = function (e, oldItem) {
        e.preventDefault();
        e.stopPropagation();
        GridsterUtils.checkTouchEvent(e);
        var rect = gridster.el.getBoundingClientRect();
        var x = e.clientX + gridster.el.scrollLeft - rect.left;
        var y = e.clientY + gridster.el.scrollTop - rect.top;
        var item = {
          x: gridster.pixelsToPositionX(x, Math.floor),
          y: gridster.pixelsToPositionY(y, Math.floor),
          cols: gridster.$options.defaultItemCols,
          rows: gridster.$options.defaultItemRows
        };
        if (oldItem) {
          item.cols = Math.min(Math.abs(oldItem.x - item.x) + 1, gridster.$options.emptyCellDragMaxCols);
          item.rows = Math.min(Math.abs(oldItem.y - item.y) + 1, gridster.$options.emptyCellDragMaxRows);
          if (oldItem.x < item.x) {
            item.x = oldItem.x;
          } else if (oldItem.x - item.x > gridster.$options.emptyCellDragMaxCols - 1) {
            item.x = gridster.movingItem.x;
          }
          if (oldItem.y < item.y) {
            item.y = oldItem.y;
          } else if (oldItem.y - item.y > gridster.$options.emptyCellDragMaxRows - 1) {
            item.y = gridster.movingItem.y;
          }
        }
        if (gridster.checkCollision(item)) {
          return;
        }
        return item;
      };
    };
  }
})();
