(function () {
  'use strict';

  angular.module('angular-gridster2').component('gridster', {
    templateUrl: 'gridster2/gridster.html',
    controller: GridsterController,
    controllerAs: 'GridsterCtrl',
    bindings: {
      options: '<'
    },
    transclude: true
  });

  /** @ngInject */
  function GridsterController($element, GridsterConfig, GridsterUtils, $log, $scope, GridsterEmptyCell, GridsterCompact) {
    var vm = this;

    vm.calculateLayoutDebounce = angular.noop;
    vm.movingItem = undefined;
    vm.previewStyle = angular.noop;
    vm.mobile = false;
    vm.columns = 0;
    vm.rows = 0;
    vm.windowResize = angular.noop;
    vm.gridLines = undefined;
    vm.dragInProgress = false;

    vm.el = $element[0];
    vm.$options = JSON.parse(JSON.stringify(GridsterConfig));
    vm.mobile = false;
    vm.curWidth = 0;
    vm.curHeight = 0;
    vm.grid = [];
    vm.curColWidth = 0;
    vm.curRowHeight = 0;
    vm.$options.draggable.stop = undefined;
    vm.$options.draggable.start = undefined;
    vm.$options.resizable.stop = undefined;
    vm.$options.resizable.start = undefined;
    vm.$options.itemChangeCallback = undefined;
    vm.$options.itemResizeCallback = undefined;
    vm.$options.itemInitCallback = undefined;
    vm.$options.itemRemovedCallback = undefined;
    vm.$options.emptyCellClickCallback = undefined;
    vm.$options.emptyCellContextMenuCallback = undefined;
    vm.$options.emptyCellDropCallback = undefined;
    vm.$options.emptyCellDragCallback = undefined;

    vm.checkCollisionTwoItems = function checkCollisionTwoItems(item, item2) {
      return item.x < item2.x + item2.cols
        && item.x + item.cols > item2.x
        && item.y < item2.y + item2.rows
        && item.y + item.rows > item2.y;
    };

    vm.$onInit = function () {
      vm.emptyCell = new GridsterEmptyCell(vm);
      vm.compact = new GridsterCompact(vm);
      vm.setOptions();
      vm.options.api = {
        optionsChanged: vm.optionsChanged,
        resize: vm.onResize,
        getNextPossiblePosition: vm.getNextPossiblePosition
      };
      vm.columns = vm.$options.minCols;
      vm.rows = vm.$options.minRows;
      vm.setGridSize();
      vm.calculateLayoutDebounce = GridsterUtils.debounce(vm.calculateLayout, 5);
      vm.calculateLayoutDebounce();
      if (vm.options.initCallback) {
        vm.options.initCallback(vm);
      }
    };

    vm.resize = function resize() {
      var height;
      var width;
      if (vm.$options.gridType === 'fit' && !vm.mobile) {
        width = vm.el.offsetWidth;
        height = vm.el.offsetHeight;
      } else {
        width = vm.el.clientWidth;
        height = vm.el.clientHeight;
      }
      if ((width !== vm.curWidth || height !== vm.curHeight) && vm.checkIfToResize()) {
        vm.onResize();
      }
    };

    vm.setOptions = function setOptions() {
      vm.$options = GridsterUtils.merge(vm.$options, vm.options, vm.$options);
      if (!vm.$options.disableWindowResize && !vm.onResizeFunction) {
        vm.onResizeFunction = true;
        window.addEventListener('resize', vm.onResize);
      } else if (vm.$options.disableWindowResize && vm.onResizeFunction) {
        vm.onResizeFunction = false;
        window.removeEventListener('resize', vm.onResize);
      }
      vm.emptyCell.updateOptions();
    };

    vm.optionsChanged = function optionsChanged() {
      vm.setOptions();
      var widgetsIndex = vm.grid.length - 1, widget;
      for (; widgetsIndex >= 0; widgetsIndex--) {
        widget = vm.grid[widgetsIndex];
        widget.updateOptions();
      }
      vm.calculateLayout();
    };

    vm.$onDestroy = function () {
      if (vm.onResizeFunction) {
        vm.onResizeFunction = false;
        window.removeEventListener('resize', vm.onResize);
      }
    };

    vm.onResize = function onResize() {
      vm.setGridSize();
      vm.calculateLayoutDebounce();
    };

    vm.checkIfToResize = function checkIfToResize() {
      var clientWidth = vm.el.clientWidth;
      var offsetWidth = vm.el.offsetWidth;
      var scrollWidth = vm.el.scrollWidth;
      var clientHeight = vm.el.clientHeight;
      var offsetHeight = vm.el.offsetHeight;
      var scrollHeight = vm.el.scrollHeight;
      var verticalScrollPresent = clientWidth < offsetWidth && scrollHeight > offsetHeight
        && scrollHeight - offsetHeight < offsetWidth - clientWidth;
      var horizontalScrollPresent = clientHeight < offsetHeight
        && scrollWidth > offsetWidth && scrollWidth - offsetWidth < offsetHeight - clientHeight;
      if (verticalScrollPresent) {
        return false;
      }
      return !horizontalScrollPresent;
    };

    vm.setGridSize = function setGridSize() {
      var width = vm.el.clientWidth;
      var height = vm.el.clientHeight;
      if (vm.$options.gridType === 'fit' && !vm.mobile) {
        width = vm.el.offsetWidth;
        height = vm.el.offsetHeight;
      } else {
        width = vm.el.clientWidth;
        height = vm.el.clientHeight;
      }
      vm.curWidth = width;
      vm.curHeight = height;
    };

    vm.setGridDimensions = function setGridDimensions() {
      var rows = vm.$options.minRows, columns = vm.$options.minCols;

      var widgetsIndex = vm.grid.length - 1;
      for (; widgetsIndex >= 0; widgetsIndex--) {
        rows = Math.max(rows, vm.grid[widgetsIndex].$item.y + vm.grid[widgetsIndex].$item.rows);
        columns = Math.max(columns, vm.grid[widgetsIndex].$item.x + vm.grid[widgetsIndex].$item.cols);
      }

      vm.columns = columns;
      vm.rows = rows;
    };

    vm.calculateLayout = function calculateLayout() {
      // check to compact
      vm.compact.checkCompact();

      vm.setGridDimensions();
      if (vm.$options.outerMargin) {
        vm.curColWidth = Math.floor((vm.curWidth - vm.$options.margin) / vm.columns);
        vm.curRowHeight = Math.floor((vm.curHeight - vm.$options.margin) / vm.rows);
      } else {
        vm.curColWidth = Math.floor((vm.curWidth + vm.$options.margin) / vm.columns);
        vm.curRowHeight = Math.floor((vm.curHeight + vm.$options.margin) / vm.rows);
      }
      var addClass;
      var removeClass1;
      var removeClass2;
      var removeClass3;
      if (vm.$options.gridType === 'fit') {
        addClass = 'fit';
        removeClass1 = 'scrollVertical';
        removeClass2 = 'scrollHorizontal';
        removeClass3 = 'fixed';
      } else if (vm.$options.gridType === 'scrollVertical') {
        vm.curRowHeight = vm.curColWidth;
        addClass = 'scrollVertical';
        removeClass1 = 'fit';
        removeClass2 = 'scrollHorizontal';
        removeClass3 = 'fixed';
      } else if (vm.$options.gridType === 'scrollHorizontal') {
        vm.curColWidth = vm.curRowHeight;
        addClass = 'scrollHorizontal';
        removeClass1 = 'fit';
        removeClass2 = 'scrollVertical';
        removeClass3 = 'fixed';
      } else if (vm.$options.gridType === 'fixed') {
        vm.curColWidth = vm.$options.fixedColWidth;
        vm.curRowHeight = vm.$options.fixedRowHeight;
        addClass = 'fixed';
        removeClass1 = 'fit';
        removeClass2 = 'scrollVertical';
        removeClass3 = 'scrollHorizontal';
      } else if (vm.$options.gridType === 'verticalFixed') {
        vm.curRowHeight = vm.$options.fixedRowHeight;
        addClass = 'scrollVertical';
        removeClass1 = 'fit';
        removeClass2 = 'scrollHorizontal';
        removeClass3 = 'fixed';
      } else if (vm.$options.gridType === 'horizontalFixed') {
        vm.curColWidth = vm.$options.fixedColWidth;
        addClass = 'scrollHorizontal';
        removeClass1 = 'fit';
        removeClass2 = 'scrollVertical';
        removeClass3 = 'fixed';
      }
      $element.addClass(addClass);
      $element.removeClass(removeClass1);
      $element.removeClass(removeClass2);
      $element.removeClass(removeClass3);

      if (!vm.mobile && vm.$options.mobileBreakpoint > vm.curWidth) {
        vm.mobile = !vm.mobile;
        $element.addClass('mobile');
      } else if (vm.mobile && vm.$options.mobileBreakpoint < vm.curWidth) {
        vm.mobile = !vm.mobile;
        $element.removeClass('mobile');
      }
      if (vm.gridLines) {
        vm.gridLines.updateGrid();
      }

      var widgetsIndex = vm.grid.length - 1, widget;
      for (; widgetsIndex >= 0; widgetsIndex--) {
        widget = vm.grid[widgetsIndex];
        widget.setSize(false);
        widget.drag.toggle();
        widget.resize.toggle();
      }
      $scope.$applyAsync();
      setTimeout(vm.resize, 100);
    };

    vm.addItem = function addItem(itemComponent) {
      if (itemComponent.$item.cols === undefined) {
        itemComponent.$item.cols = vm.$options.defaultItemCols;
        itemComponent.item.cols = itemComponent.$item.cols;
        itemComponent.itemChanged();
      }
      if (itemComponent.$item.rows === undefined) {
        itemComponent.$item.rows = vm.$options.defaultItemRows;
        itemComponent.item.rows = itemComponent.$item.rows;
        itemComponent.itemChanged();
      }
      if (itemComponent.$item.x === undefined || itemComponent.$item.y === undefined) {
        vm.autoPositionItem(itemComponent);
      } else if (vm.checkCollision(itemComponent.$item)) {
        $log.warn('Can\'t be placed in the bounds of the dashboard, trying to auto position!/n' +
          JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
        itemComponent.$item.x = undefined;
        itemComponent.$item.y = undefined;
        vm.autoPositionItem(itemComponent);
      }
      vm.grid.push(itemComponent);
      vm.calculateLayoutDebounce();
      if (itemComponent.$item.initCallback) {
        itemComponent.$item.initCallback(itemComponent.item, itemComponent);
      }
      if (vm.$options.itemInitCallback) {
        vm.$options.itemInitCallback(itemComponent.item, itemComponent);
      }
    };

    vm.removeItem = function removeItem(itemComponent) {
      vm.grid.splice(vm.grid.indexOf(itemComponent), 1);
      vm.calculateLayoutDebounce();
      if (vm.$options.itemRemovedCallback) {
        vm.$options.itemRemovedCallback(itemComponent.item, itemComponent);
      }
    };

    vm.checkCollision = function checkCollision(item) {
      return vm.checkGridCollision(item) || vm.findItemWithItem(item);
    };

    vm.checkGridCollision = function checkGridCollision(item) {
      var noNegativePosition = item.y > -1 && item.x > -1;
      var maxGridCols = item.cols + item.x <= vm.$options.maxCols;
      var maxGridRows = item.rows + item.y <= vm.$options.maxRows;
      var maxItemCols = item.maxItemCols === undefined ? vm.$options.maxItemCols : item.maxItemCols;
      var minItemCols = item.minItemCols === undefined ? vm.$options.minItemCols : item.minItemCols;
      var maxItemRows = item.maxItemRows === undefined ? vm.$options.maxItemRows : item.maxItemRows;
      var minItemRows = item.minItemRows === undefined ? vm.$options.minItemRows : item.minItemRows;
      var inColsLimits = item.cols <= maxItemCols && item.cols >= minItemCols;
      var inRowsLimits = item.rows <= maxItemRows && item.rows >= minItemRows;
      var minAreaLimit = item.minItemArea === undefined ? vm.$options.minItemArea : item.minItemArea;
      var maxAreaLimit = item.maxItemArea === undefined ? vm.$options.maxItemArea : item.maxItemArea;
      var area = item.cols * item.rows;
      var inMinArea = minAreaLimit <= area;
      var inMaxArea = maxAreaLimit >= area;
      return !(noNegativePosition && maxGridCols && maxGridRows && inColsLimits && inRowsLimits && inMinArea && inMaxArea);
    };

    vm.findItemWithItem = function findItemWithItem(item) {
      var widgetsIndex = vm.grid.length - 1, widget;
      for (; widgetsIndex > -1; widgetsIndex--) {
        widget = vm.grid[widgetsIndex];
        if (widget.$item !== item && vm.checkCollisionTwoItems(widget.$item, item)) {
          return widget;
        }
      }
      return false;
    };

    vm.findItemsWithItem = function findItemWithItem(item) {
      var a = [];
      var widgetsIndex = vm.grid.length - 1, widget;
      for (; widgetsIndex > -1; widgetsIndex--) {
        widget = vm.grid[widgetsIndex];
        if (widget.$item !== item && vm.checkCollisionTwoItems(widget.$item, item)) {
          a.push(widget);
        }
      }
      return a;
    };

    vm.autoPositionItem = function autoPositionItem(itemComponent) {
      if (vm.getNextPossiblePosition(itemComponent.$item)) {
        itemComponent.item.x = itemComponent.$item.x;
        itemComponent.item.y = itemComponent.$item.y;
        itemComponent.itemChanged();
      } else {
        itemComponent.notPlaced = true;
        $log.warn('Can\'t be placed in the bounds of the dashboard!/n' +
          JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
      }
    };

    vm.getNextPossiblePosition = function getNextPossiblePosition(newItem) {
      if (newItem.cols === undefined) {
        newItem.cols = vm.$options.defaultItemCols;
      }
      if (newItem.rows === undefined) {
        newItem.rows = vm.$options.defaultItemRows;
      }
      vm.setGridDimensions();
      var rowsIndex = 0, colsIndex;
      for (; rowsIndex < vm.rows; rowsIndex++) {
        newItem.y = rowsIndex;
        colsIndex = 0;
        for (; colsIndex < vm.columns; colsIndex++) {
          newItem.x = colsIndex;
          if (!vm.checkCollision(newItem)) {
            return true;
          }
        }
      }
      var canAddToRows = vm.$options.maxRows >= vm.rows + newItem.rows;
      var canAddToColumns = vm.$options.maxCols >= vm.columns + newItem.cols;
      var addToRows = vm.rows <= vm.columns && canAddToRows;
      if (!addToRows && canAddToColumns) {
        newItem.x = vm.columns;
        newItem.y = 0;
        return true;
      } else if (canAddToRows) {
        newItem.y = vm.rows;
        newItem.x = 0;
        return true;
      }
      return false;
    };

    vm.pixelsToPosition = function pixelsToPosition(x, y, roundingMethod) {
      return [vm.pixelsToPositionX(x, roundingMethod), vm.pixelsToPositionY(y, roundingMethod)];
    };

    vm.pixelsToPositionX = function pixelsToPositionX(x, roundingMethod) {
      return Math.max(roundingMethod(x / vm.curColWidth), 0);
    };

    vm.pixelsToPositionY = function pixelsToPositionY(y, roundingMethod) {
      return Math.max(roundingMethod(y / vm.curRowHeight), 0);
    };

    vm.positionXToPixels = function positionXToPixels(x) {
      return x * vm.curColWidth;
    };

    vm.positionYToPixels = function positionYToPixels(y) {
      return y * vm.curRowHeight;
    };
  }
})();
