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
      vm.options = {
        gridType: 'fit',
        compactUp: true,
        compactLeft: true,
        itemChangeCallback: itemChange,
        margin: 10,
        outerMargin: true,
        draggable: {
          enabled: true,
          stop: eventStop
        },
        resizable: {
          enabled: true,
          stop: eventStop
        },
        swap: true
      };
      vm.dashboard = [
        {cols: 2, rows: 1, y: 0, x: 0},
        {cols: 2, rows: 2, y: 0, x: 2},
        {cols: 1, rows: 1, y: 0, x: 4},
        {cols: 1, rows: 1, y: 0, x: 5},
        {cols: 2, rows: 1, y: 1, x: 0},
        {cols: 1, rows: 1, y: undefined, x: undefined},
        {cols: 1, rows: 2, y: 1, x: 5},
        {cols: 1, rows: 3, y: 2, x: 0},
        {cols: 2, rows: 1, y: 2, x: 1},
        {cols: 1, rows: 1, y: 2, x: 3},
        {cols: 1, rows: 1, y: 3, x: 4, initCallback: itemInit}
      ];
    };

    vm.removeItem = function (item) {
      vm.dashboard.splice(vm.dashboard.indexOf(item), 1);
    };

    vm.addItem = function () {
      vm.dashboard.push({});
    };

    function eventStop(item, scope) {
      $log.info('eventStop', item, scope);
    }

    function itemChange(item, scope) {
      $log.info('itemChanged', item, scope);
    }

    function itemInit(item) {
      $log.info('itemInitialized', item);
    }
  }
})();
