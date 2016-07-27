(function () {
  'use strict';
  angular.module('angular-gridster2')
    .controller('GridsterController', GridsterController);

  /** @ngInject */
  function GridsterController($scope, gridsterConfig, $log) {
    var vm = this;
    vm.mobile = false;

    angular.extend(vm, gridsterConfig);

    vm.grid = [];

    function setGridDimensions() {
      var rows = vm.minRows, columns = vm.minCols;

      var widgetsIndex = vm.grid.length - 1;
      for (; widgetsIndex >= 0; widgetsIndex--) {
        rows = Math.max(rows, vm.grid[widgetsIndex].y + vm.grid[widgetsIndex].rows);
        columns = Math.max(columns, vm.grid[widgetsIndex].x + vm.grid[widgetsIndex].cols);
      }

      vm.columns = columns;
      vm.rows = rows;
    }

    function calculateLayout() {
      setGridDimensions();
      if (vm.gridType === 'fit') {
        vm.curColWidth = Math.floor((vm.curWidth + (vm.outerMargin ? -vm.margin : vm.margin)) / vm.columns);
        vm.curRowHeight = Math.floor((vm.curHeight + (vm.outerMargin ? -vm.margin : vm.margin)) / vm.rows);
        vm.element.addClass('fit');
        vm.element.removeClass('scrollVertical');
        vm.element.removeClass('scrollHorizontal');
      } else if (vm.gridType === 'scrollVertical') {
        vm.curColWidth = Math.floor((vm.curWidth + (vm.outerMargin ? -vm.margin : vm.margin)) / vm.columns);
        vm.curRowHeight = vm.curColWidth;
        vm.element.addClass('scrollVertical');
        vm.element.removeClass('fit');
        vm.element.removeClass('scrollHorizontal');
      } else if (vm.gridType === 'scrollHorizontal') {
        vm.curRowHeight = Math.floor((vm.curHeight + (vm.outerMargin ? -vm.margin : vm.margin)) / vm.rows);
        vm.curColWidth = vm.curRowHeight;
        vm.element.addClass('scrollHorizontal');
        vm.element.removeClass('fit');
        vm.element.removeClass('scrollVertical');
      }

      if (!vm.mobile && vm.mobileBreakpoint > vm.curWidth) {
        vm.mobile = !vm.mobile;
        vm.element.addClass('mobile');
      } else if (vm.mobile && vm.mobileBreakpoint < vm.curWidth) {
        vm.mobile = !vm.mobile;
        vm.element.removeClass('mobile');
      }

      var widgetsIndex = vm.grid.length - 1;
      for (; widgetsIndex >= 0; widgetsIndex--) {
        vm.grid[widgetsIndex].setSize();
        vm.grid[widgetsIndex].drag.toggle(vm.draggable.enabled);
        vm.grid[widgetsIndex].resize.toggle(vm.resizable.enabled);
      }

      $scope.$applyAsync(vm.detectScrollBarLayout);
    }

    vm.calculateLayout = _.debounce(calculateLayout, 5);

    vm.setOptions = function (options) {
      if (!options) {
        return;
      }

      angular.merge(vm, options);
      vm.calculateLayout();
    };

    vm.addItem = function (item) {
      if (angular.isUndefined(item.cols)) {
        item.cols = vm.defaultItemCols;
      }
      if (angular.isUndefined(item.rows)) {
        item.rows = vm.defaultItemRows;
      }
      if (angular.isUndefined(item.x) || angular.isUndefined(item.y)) {
        vm.autoPositionItem(item);
      } else if (vm.checkCollision(item)) {
        item.x = undefined;
        item.y = undefined;
        $log.warn('Can\'t be placed in the bounds of the dashboard, trying to auto position!', item);
        vm.autoPositionItem(item);
      }
      vm.grid.push(item);
      vm.calculateLayout();
      if (item.initCallback) {
        item.initCallback(item);
      }
    };

    vm.removeItem = function (item) {
      vm.grid.splice(vm.grid.indexOf(item), 1);
      vm.calculateLayout();
    };

    vm.checkCollision = function (item) {
      if (!(item.y > -1 && item.x > -1 && item.cols + item.x <= vm.maxCols && item.rows + item.y <= vm.maxRows)) {
        return true;
      }
      return vm.findItemWithItem(item);
    };

    vm.findItemWithItem = function (item) {
      var widgetsIndex = vm.grid.length - 1, widget;
      for (; widgetsIndex >= 0; widgetsIndex--) {
        widget = vm.grid[widgetsIndex];
        if (widget !== item && widget.x < item.x + item.cols && widget.x + widget.cols > item.x &&
          widget.y < item.y + item.rows && widget.y + widget.rows > item.y) {
          return widget;
        }
      }
    };

    vm.autoPositionItem = function (item) {
      setGridDimensions();
      var rowsIndex = 0, colsIndex;
      for (; rowsIndex < vm.rows; rowsIndex++) {
        item.y = rowsIndex;
        colsIndex = 0;
        for (; colsIndex < vm.columns; colsIndex++) {
          item.x = colsIndex;
          if (!vm.checkCollision(item)) {
            return;
          }
        }
      }
      if (vm.rows >= vm.columns && vm.maxCols > vm.columns) {
        item.x = vm.columns;
        item.y = 0;
      } else if (vm.maxRows > vm.rows) {
        item.y = vm.rows;
        item.x = 0;
      } else {
        $log.warn('Can\'t be placed in the bounds of the dashboard!', item);
      }
    };

    vm.pixelsToPosition = function (x, y) {
      if (vm.outerMargin) {
        x -= vm.margin;
        y -= vm.margin;
      }

      return [Math.abs(Math.round(x / vm.curColWidth)), Math.abs(Math.round(y / vm.curRowHeight))];
    }
  }
})();
