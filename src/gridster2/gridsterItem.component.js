(function () {
  'use strict';

  angular.module('angular-gridster2').component('gridsterItem', {
    templateUrl: 'gridster2/gridsterItem.html',
    controller: GridsterItemController,
    controllerAs: 'GridsterItemCtrl',
    bindings: {
      item: '<'
    },
    require: {
      gridster: '^^gridster'
    },
    transclude: true
  });

  /** @ngInject */
  function GridsterItemController($scope, $element, GridsterDraggable, GridsterResizable, GridsterUtils) {
    var vm = this;
    vm.$item = {
      cols: undefined,
      rows: undefined,
      x: undefined,
      y: undefined,
      initCallback: undefined,
      dragEnabled: undefined,
      resizeEnabled: undefined,
      maxItemRows: undefined,
      minItemRows: undefined,
      maxItemCols: undefined,
      minItemCols: undefined
    };
    vm.el = $element;
    vm.nativeEl = $element[0];
    vm.notPlaced = false;
    vm.itemTop = 0;
    vm.itemLeft = 0;
    vm.itemWidth = 0;
    vm.itemHeight = 0;
    vm.top = 0;
    vm.left = 0;
    vm.width = 0;
    vm.height = 0;
    vm.itemMargin = 0;

    vm.$onInit = function () {
      vm.drag = new GridsterDraggable(vm, vm.gridster);
      vm.resize = new GridsterResizable(vm, vm.gridster);
      vm.updateOptions();
      vm.gridster.addItem(vm);
    };

    vm.updateOptions = function () {
      vm.$item = GridsterUtils.merge(vm.$item, vm.item, vm.$item);
    };

    vm.$onDestroy = function () {
      vm.gridster.removeItem(this);
    };

    vm.setSize = function (noCheck) {
      if (vm.gridster.mobile) {
        vm.top = 0;
        vm.left = 0;
        vm.width = vm.gridster.curWidth - (vm.gridster.$options.outerMargin ? 2 * vm.gridster.$options.margin : 0);
        if (vm.gridster.$options.keepFixedHeightInMobile) {
          vm.height = vm.$item.rows * vm.gridster.$options.fixedRowHeight;
        } else {
          vm.height = vm.width / 2;
        }
      } else {
        vm.top = vm.$item.y * vm.gridster.curRowHeight;
        vm.left = vm.$item.x * vm.gridster.curColWidth;
        vm.width = vm.$item.cols * vm.gridster.curColWidth - vm.gridster.$options.margin;
        vm.height = vm.$item.rows * vm.gridster.curRowHeight - vm.gridster.$options.margin;
      }
      if (!noCheck && vm.top === vm.itemTop && vm.left === vm.itemLeft &&
        vm.width === vm.itemWidth && vm.height === vm.itemHeight) {
        return;
      }
      if (vm.gridster.$options.outerMargin) {
        vm.itemMargin = vm.gridster.$options.margin;
      } else {
        vm.itemMargin = 0;
      }

      $element.css('display', vm.notPlaced ? 'none' : 'block');
      $element.css('top', vm.top + 'px');
      $element.css('left', vm.left + 'px');
      $element.css('width', vm.width + 'px');
      $element.css('height', vm.height + 'px');
      $element.css('margin', vm.itemMargin + 'px');
      if (vm.width !== vm.itemWidth || vm.height !== vm.itemHeight) {
        $scope.$broadcast('gridster-item-resize', vm.item);
        if (vm.gridster.$options.itemResizeCallback) {
          vm.gridster.$options.itemResizeCallback(vm.item, this);
        }
      }
      vm.itemTop = vm.top;
      vm.itemLeft = vm.left;
      vm.itemWidth = vm.width;
      vm.itemHeight = vm.height;
    };

    vm.itemChanged = function () {
      $scope.$broadcast('gridster-item-change', vm.item);
      if (vm.gridster.$options.itemChangeCallback) {
        vm.gridster.$options.itemChangeCallback(vm.item, this);
      }
    };

    vm.checkItemChanges = function (newValue, oldValue) {
      if (newValue.rows === oldValue.rows && newValue.cols === oldValue.cols && newValue.x === oldValue.x && newValue.y === oldValue.y) {
        return;
      }
      if (vm.gridster.checkCollision(vm.$item)) {
        vm.$item.x = oldValue.x;
        vm.$item.y = oldValue.y;
        vm.$item.cols = oldValue.cols;
        vm.$item.rows = oldValue.rows;
      } else {
        vm.item.cols = vm.$item.cols;
        vm.item.rows = vm.$item.rows;
        vm.item.x = vm.$item.x;
        vm.item.y = vm.$item.y;
        vm.gridster.calculateLayout();
        vm.itemChanged();
      }
    };

    vm.canBeDragged = function canBeDragged() {
      return !vm.gridster.mobile &&
        (vm.$item.dragEnabled === undefined ? vm.gridster.$options.draggable.enabled : vm.$item.dragEnabled);
    };

    vm.canBeResized = function canBeResized() {
      return !vm.gridster.mobile &&
        (vm.$item.resizeEnabled === undefined ? vm.gridster.$options.resizable.enabled : vm.$item.resizeEnabled);
    }
  }
})();
