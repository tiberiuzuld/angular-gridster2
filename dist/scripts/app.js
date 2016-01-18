(function () {
  'use strict';

  angular.module('gridster2App', ['angular-gridster2', 'ngMockE2E']);
})();

(function () {
  'use strict';

  angular.module('gridster2App').controller('IndexController', IndexController);

  /** @ngInject */
  function IndexController($log) {
    var vm = this;
    vm.options = {
      colWidth: 'fit',
      rowHeight: 'fit',
      itemChangeCallback: itemChange,
      margin: 10,
      outerMargin: true,
      draggable: {
        enabled: false,
        stop: eventStop
      },
      resizable: {
        enabled: false,
        stop: eventStop
      }
    };
    vm.dashboard = [
      {cols: 2, rows: 1, y: 0, x: 0},
      {cols: 2, rows: 2, y: 0, x: 2},
      {cols: 1, rows: 1, y: 0, x: 4},
      {cols: 1, rows: 1, y: 0, x: 5},
      {cols: 2, rows: 1, y: 1, x: 0},
      {cols: 1, rows: 1, y: 1, x: 4},
      {cols: 1, rows: 2, y: 1, x: 5},
      {cols: 1, rows: 3, y: 2, x: 0},
      {cols: 2, rows: 1, y: 2, x: 1},
      {cols: 1, rows: 1, y: 2, x: 3},
      {cols: 1, rows: 1, y: 3, x: 4, initCallback: itemInit}
    ];

    vm.removeItem = function (item) {
      vm.dashboard.splice(vm.dashboard.indexOf(item), 1);
    };

    vm.addItem = function () {
      vm.dashboard.push({});
    };

    vm.toggleFitToScreen = function () {
      if (vm.options.rowHeight === 'match') {
        vm.options.rowHeight = 'fit';
      } else {
        vm.options.rowHeight = 'match';
      }
    };

    vm.toggleDrag = function () {
      vm.options.draggable.enabled = !vm.options.draggable.enabled;
    };
    vm.toggleResize = function () {
      vm.options.resizable.enabled = !vm.options.resizable.enabled;
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
  IndexController.$inject = ["$log"];
})();

(function () {
  'use strict';

  angular.module('gridster2App').config(config);

  /** @ngInject */
  function config($logProvider, $compileProvider) {
    // Disable debug
    $logProvider.debugEnabled(true);
    $compileProvider.debugInfoEnabled(true);

  }
  config.$inject = ["$logProvider", "$compileProvider"];

})();
