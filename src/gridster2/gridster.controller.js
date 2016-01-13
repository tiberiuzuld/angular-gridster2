(function () {
  'use strict';
  angular.module('angular-gridster2')
    .controller('GridsterController', gridsterController);

  /** @ngInject */
  function gridsterController($scope, gridsterConfig) {
    var vm = this, mobile;

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
      if (vm.colWidth === 'fit') {
        vm.curColWidth = Math.floor((vm.curWidth + (vm.outerMargin ? -vm.margin : vm.margin)) / vm.columns);
      } else {
        vm.curColWidth = vm.colWidth;
      }

      if (!mobile && vm.mobileBreakpoint > vm.curWidth) {
        mobile = !mobile;
        vm.element.addClass('mobile');
      } else if (mobile && vm.mobileBreakpoint < vm.curWidth) {
        mobile = !mobile;
        vm.element.removeClass('mobile');
      }

      if (vm.rowHeight === 'match' || vm.fitBreakpoint > vm.curWidth) {
        vm.element.addClass('scroll');
        vm.element.removeClass('fit');
        vm.curRowHeight = vm.curColWidth;
      } else if (vm.rowHeight === 'fit') {
        vm.element.addClass('fit');
        vm.element.removeClass('scroll');
        vm.curRowHeight = Math.floor((vm.curHeight + (vm.outerMargin ? -vm.margin : vm.margin)) / vm.rows);
      } else {
        vm.curRowHeight = vm.rowHeight;
      }

      var widgetsIndex = vm.grid.length - 1;
      for (; widgetsIndex >= 0; widgetsIndex--) {
        vm.grid[widgetsIndex].setSize(undefined, mobile);
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
      }
      vm.grid.push(item);
      vm.calculateLayout();
    };

    vm.removeItem = function (item) {
      vm.grid.splice(vm.grid.indexOf(item), 1);
      vm.calculateLayout();
    };

    vm.checkCollision = function (item) {
      if (!(item.y > -1 && item.x > -1 && item.cols + item.x <= vm.maxCols && item.rows + item.y <= vm.maxRows)) {
        return true;
      }
      var widgetsIndex = vm.grid.length - 1, widget;
      for (; widgetsIndex >= 0; widgetsIndex--) {
        widget = vm.grid[widgetsIndex];
        if (widget !== item && widget.x < item.x + item.cols && widget.x + widget.cols > item.x &&
          widget.y < item.y + item.rows && widget.y + widget.rows > item.y) {
          return true;
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
      if (vm.rows > vm.columns) {
        item.x = vm.columns;
        item.y = 0;
      } else {
        item.y = vm.rows;
        item.x = 0;
      }
    };

    vm.pixelsToPosition = function (x, y) {
      if (vm.outerMargin) {
        x -= 10;
        y -= 10;
      }

      return [Math.round(x / vm.curColWidth), Math.round(y / vm.curRowHeight)];
    }
  }
})();
