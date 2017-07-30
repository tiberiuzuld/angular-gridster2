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

  MainController.$inject = ["$log", "$scope"];
  angular.module('gridster2App')
    .component('main', {
      templateUrl: 'app/main.html',
      controller: MainController,
      controllerAs: 'main'
    });

  /** @ngInject */
  function MainController($log, $scope) {
    var vm = this;
    vm.$onInit = function () {
      vm.options = {
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
        enableEmptyCellClickDrag: false,
        emptyCellClickCallback: vm.emptyCellClick.bind(vm),
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

    vm.prevent = function (event) {
      event.stopPropagation();
      event.preventDefault();
    };

    vm.changedOptions = function changedOptions() {
      vm.options.api.optionsChanged();
    }
  }
})();

angular.module('gridster2App').run(['$templateCache', function($templateCache) {$templateCache.put('app/main.html','<md-toolbar><div class="md-toolbar-tools layout-row layout-align-space-between-center layout-wrap"><md-button class="md-fab md-mini" ng-click=main.addItem()><md-icon>add</md-icon><md-tooltip>Add widget</md-tooltip></md-button><md-input-container><label>Grid type</label><md-select aria-label="Grid type" ng-model=main.options.gridType ng-change=main.changedOptions()><md-option value=fit>Fit to screen</md-option><md-option value=scrollVertical>Scroll Vertical</md-option><md-option value=scrollHorizontal>Scroll Horizontal</md-option><md-option value=fixed>Fixed</md-option><md-option value=verticalFixed>Vertical Fixed</md-option><md-option value=horizontalFixed>Horizontal Fixed</md-option></md-select></md-input-container><md-input-container><label>Compact Type</label><md-select aria-label="Compact type" ng-model=main.options.compactType ng-change=main.changedOptions() placeholder="Compact Type"><md-option value=none>None</md-option><md-option value=compactUp>Compact Up</md-option><md-option value=compactLeft>Compact Left</md-option><md-option value=compactLeft&Up>Compact Left & Up</md-option><md-option value=compactUp&Left>Compact Up & Left</md-option></md-select></md-input-container><md-checkbox ng-model=main.options.swap ng-change=main.changedOptions()>Swap Items</md-checkbox><md-checkbox ng-model=main.options.pushItems ng-change=main.changedOptions()>Push Items</md-checkbox><md-checkbox ng-model=main.options.draggable.enabled ng-change=main.changedOptions()>Drag Items</md-checkbox><md-checkbox ng-model=main.options.resizable.enabled ng-change=main.changedOptions()>Resize Items</md-checkbox><div class="flex-30 layout-row layout-align-center-center"><div><span>Margin</span></div><md-slider aria-label=Margin class=flex min=0 max=30 ng-model=main.options.margin ng-change=main.changedOptions()></md-slider></div><md-checkbox ng-model=main.options.outerMargin ng-change=main.changedOptions()>Outer Margin</md-checkbox><md-input-container><input ng-model=main.options.maxItemCols type=number placeholder="Max Item Cols" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.minItemCols type=number placeholder="Min Item Cols" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.maxItemRows type=number placeholder="Max Item Rows" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.minItemRows type=number placeholder="Min Item Rows" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.defaultItemRows type=number placeholder="Default Item Rows" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.defaultItemCols type=number placeholder="Default Item Cols" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.fixedColWidth type=number placeholder="Fixed Col Width" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.fixedRowHeight type=number placeholder="Fixed Row Height" ng-change=main.changedOptions()></md-input-container><md-checkbox ng-model=main.options.keepFixedHeightInMobile ng-change=main.changedOptions()>Keep Fixed Height In Mobile</md-checkbox><md-checkbox ng-model=main.options.keepFixedWidthInMobile ng-change=main.changedOptions()>Keep Fixed Width In Mobile</md-checkbox><md-checkbox ng-model=main.options.enableEmptyCellClickDrag ng-change=main.changedOptions()>Enable click to add</md-checkbox><md-input-container><input ng-model=main.options.minCols type=number placeholder="Min Grid Cols" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.maxCols type=number placeholder="Max Grid Cols" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.minRows type=number placeholder="Min Grid Rows" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.maxRows type=number placeholder="Max Grid Rows" ng-change=main.changedOptions()></md-input-container><md-input-container><label>Display grid lines</label><md-select aria-label="Display grid lines" ng-model=main.options.displayGrid placeholder="Display grid lines" ng-change=main.changedOptions()><md-option value=always>Always</md-option><md-option value=onDrag&Resize>On Drag & Resize</md-option><md-option value=none>None</md-option></md-select></md-input-container></div></md-toolbar><gridster options=main.options class=flex><gridster-item item=item ng-repeat="item in main.dashboard"><div class=button-holder><div class=gridster-item-content ng-if=item.hasContent><div class=stuff>Some content to select and click without dragging the widget</div></div><div class=item-buttons ng-if=item.hasContent><md-button class="drag-handler md-raised md-icon-button"><md-icon>open_with</md-icon></md-button><md-button class="remove-button md-raised md-icon-button" ng-click="main.removeItem($event, item)" ng-mousedown=main.prevent($event)><md-icon>clear</md-icon><md-tooltip>Remove</md-tooltip></md-button></div><label ng-if=!item.hasContent ng-bind=::item.label></label> <button class="md-icon-button md-fab-mini" ng-if=!item.hasContent ng-click="main.removeItem($event, item)" ng-mousedown=main.prevent($event)><md-icon>clear</md-icon><md-tooltip>Remove</md-tooltip></button></div></gridster-item></gridster>');}]);