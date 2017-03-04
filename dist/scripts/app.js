(function () {
  'use strict';

  angular.module('gridster2App', ['angular-gridster2', 'ngMaterial']);
})();

(function () {
  'use strict';

  config.$inject = ["$logProvider", "$compileProvider"];
  angular.module('gridster2App').config(config);

  /** @ngInject */
  function config($logProvider, $compileProvider) {
    // Disable debug
    $logProvider.debugEnabled(true);
    $compileProvider.debugInfoEnabled(true);

  }

})();

(function () {
  'use strict';

  MainController.$inject = ["$log"];
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

angular.module('gridster2App').run(['$templateCache', function($templateCache) {$templateCache.put('app/main.html','<md-toolbar><div class="md-toolbar-tools layout-row layout-align-space-between-center"><md-button class="md-fab md-mini" ng-click=main.addItem()><md-icon>add</md-icon><md-tooltip>Add widget</md-tooltip></md-button><md-select aria-label="Grid type" ng-model=main.options.gridType><md-option value=fit>Fit to screen</md-option><md-option value=scrollVertical>Scroll Vertical</md-option><md-option value=scrollHorizontal>Scroll Horizontal</md-option></md-select><md-checkbox ng-model=main.options.compactUp>Compact Up</md-checkbox><md-checkbox ng-model=main.options.compactLeft>Compact Left</md-checkbox><md-checkbox ng-model=main.options.swap>Swap Items</md-checkbox><md-checkbox ng-model=main.options.draggable.enabled>Drag Items</md-checkbox><md-checkbox ng-model=main.options.resizable.enabled>Resize Items</md-checkbox><div class="flex-30 layout-row layout-align-center-center"><div><span>Margin</span></div><md-slider aria-label=Margin class=flex min=0 max=30 ng-model=main.options.margin></md-slider><input type=number min=0 max=30 ng-model=main.options.margin></div><md-checkbox ng-model=main.options.outerMargin>Outer Margin</md-checkbox></div></md-toolbar><div gridster=main.options><div gridster-item=item ng-repeat="item in main.dashboard"><div class=button-holder><md-button class="md-fab md-primary md-mini" ng-click=main.removeItem(item)>X<md-tooltip>Remove</md-tooltip></md-button></div></div></div>');}]);