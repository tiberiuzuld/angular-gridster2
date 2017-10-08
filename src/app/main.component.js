(function () {
  'use strict';

  angular.module('gridster2App')
    .component('main', {
      templateUrl: 'app/main.html',
      controller: MainController,
      controllerAs: 'main'
    });

  /** @ngInject */
  function MainController($log, $scope, $mdSidenav) {
    var vm = this;
    vm.$onInit = function () {
      setTimeout(function () {
        vm.sidenav = $mdSidenav('left');
      }, 200);
      vm.options = {
        gridType: 'fit',
        compactType: 'none',
        itemChangeCallback: itemChange,
        itemResizeCallback: itemResize,
        itemInitCallback: itemInit,
        itemRemovedCallback: itemRemoved,
        margin: 10,
        outerMargin: true,
        mobileBreakpoint: 640,
        minCols: 1,
        maxCols: 100,
        minRows: 1,
        maxRows: 100,
        maxItemCols: 50,
        minItemCols: 1,
        maxItemRows: 50,
        minItemRows: 1,
        maxItemArea: 2500,
        minItemArea: 1,
        defaultItemCols: 1,
        defaultItemRows: 1,
        fixedColWidth: 250,
        fixedRowHeight: 250,
        enableEmptyCellClick: false,
        enableEmptyCellContextMenu: false,
        enableEmptyCellDrop: false,
        enableEmptyCellDrag: false,
        emptyCellClickCallback: vm.emptyCellClick,
        emptyCellContextMenuCallback: vm.emptyCellClick,
        emptyCellDropCallback: vm.emptyCellClick,
        emptyCellDragCallback: vm.emptyCellClick,
        emptyCellDragMaxCols: 50,
        emptyCellDragMaxRows: 50,
        draggable: {
          delayStart: 0,
          enabled: true,
          stop: eventStop
        },
        resizable: {
          enabled: true,
          stop: eventStop
        },
        swap: false,
        pushItems: true,
        disablePushOnDrag: false,
        disablePushOnResize: false,
        pushDirections: {north: true, east: true, south: true, west: true},
        pushResizeItems: false,
        displayGrid: 'onDrag&Resize',
        disableWindowResize: false
      };

      this.dashboard = [
        {cols: 2, rows: 1, y: 0, x: 0},
        {cols: 2, rows: 2, y: 0, x: 2, hasContent: true},
        {cols: 1, rows: 1, y: 0, x: 4},
        {cols: 1, rows: 1, y: 2, x: 5},
        {cols: undefined, rows: undefined, y: 1, x: 0},
        {cols: 1, rows: 1, y: undefined, x: undefined},
        {cols: 2, rows: 2, y: 3, x: 5, minItemRows: 2, minItemCols: 2, label: 'Min rows & cols = 2'},
        {cols: 2, rows: 2, y: 2, x: 0, maxItemRows: 2, maxItemCols: 2, label: 'Max rows & cols = 2'},
        {cols: 2, rows: 1, y: 2, x: 2, dragEnabled: true, resizeEnabled: true, label: 'Drag&Resize Enabled'},
        {cols: 1, rows: 1, y: 2, x: 4, dragEnabled: false, resizeEnabled: false, label: 'Drag&Resize Disabled'},
        {cols: 1, rows: 1, y: 2, x: 6, initCallback: itemInit}
      ];
    };

    vm.removeItem = function (event, item) {
      event.stopPropagation();
      event.preventDefault();
      vm.dashboard.splice(vm.dashboard.indexOf(item), 1);
      $scope.$applyAsync();
    };

    vm.addItem = function () {
      vm.dashboard.push({});
    };

    vm.emptyCellClick = function (event, item) {
      $log.info('empty cell click', event, item);
      vm.dashboard.push(item);
      $scope.$applyAsync();
    };

    function eventStop(item, itemComponent, event) {
      $log.info('eventStop', item, itemComponent, event);
    }

    function itemChange(item, itemComponent) {
      $log.info('itemChanged', item, itemComponent);
    }

    function itemResize(item, itemComponent) {
      $log.info('itemResized', item, itemComponent);
    }

    function itemInit(item, itemComponent) {
      $log.info('itemInitialized', item, itemComponent);
    }

    function itemRemoved(item, itemComponent) {
      $log.info('itemRemoved', item, itemComponent);
    }

    vm.prevent = function (event) {
      event.stopPropagation();
      event.preventDefault();
    };

    vm.changedOptions = function changedOptions() {
      vm.options.api.optionsChanged();
    }
  }
})();
