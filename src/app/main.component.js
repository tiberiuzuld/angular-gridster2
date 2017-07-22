(function () {
  'use strict';

  angular.module('gridster2App')
    .component('main', {
      templateUrl: 'app/main.html',
      controller: MainController,
      controllerAs: 'main'
    });

  /** @ngInject */
  function MainController($log) {
    var vm = this;
    vm.$onInit = function () {
      this.options = {
        gridType: 'fit',
        compactType: 'none',
        itemChangeCallback: itemChange,
        itemResizeCallback: itemResize,
        itemInitCallback: itemInit,
        margin: 10,
        outerMargin: true,
        minCols: 1,
        maxCols: 100,
        minRows: 1,
        maxRows: 100,
        maxItemCols: 50,
        minItemCols: 1,
        maxItemRows: 50,
        minItemRows: 1,
        defaultItemCols: 1,
        defaultItemRows: 1,
        fixedColWidth: 250,
        fixedRowHeight: 250,
        draggable: {
          enabled: true,
          stop: eventStop
        },
        resizable: {
          enabled: true,
          stop: eventStop
        },
        swap: false,
        displayGrid: 'onDrag&Resize'
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
    };

    vm.addItem = function () {
      vm.dashboard.push({});
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

    vm.changedOptions = function changedOptions() {
      this.options.api.optionsChanged();
    }
  }
})();
