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

  MainController.$inject = ["$log", "$scope", "$mdSidenav"];
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
        enableEmptyCellDrop: false,
        enableEmptyCellDrag: false,
        emptyCellClickCallback: vm.emptyCellClick,
        emptyCellDropCallback: vm.emptyCellClick,
        emptyCellDragCallback: vm.emptyCellClick,
        emptyCellDragMaxCols: 50,
        emptyCellDragMaxRows: 50,
        draggable: {
          enabled: true,
          stop: eventStop
        },
        resizable: {
          enabled: true,
          stop: eventStop
        },
        swap: false,
        pushItems: true,
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

    vm.prevent = function (event) {
      event.stopPropagation();
      event.preventDefault();
    };

    vm.changedOptions = function changedOptions() {
      vm.options.api.optionsChanged();
    }
  }
})();

angular.module('gridster2App').run(['$templateCache', function($templateCache) {$templateCache.put('app/main.html','<md-sidenav class="md-sidenav-left md-whiteframe-4dp" md-component-id=left><label class=md-headline>Grid Settings</label><div class="layout-row flex"><md-select aria-label="Grid type" ng-model=main.options.gridType ng-change=main.changedOptions() placeholder="Grid Type" class=flex><md-option value=fit>Fit to screen</md-option><md-option value=scrollVertical>Scroll Vertical</md-option><md-option value=scrollHorizontal>Scroll Horizontal</md-option><md-option value=fixed>Fixed</md-option><md-option value=verticalFixed>Vertical Fixed</md-option><md-option value=horizontalFixed>Horizontal Fixed</md-option></md-select><md-select aria-label="Compact type" ng-model=main.options.compactType ng-change=main.changedOptions() placeholder="Compact Type" class=flex><md-option value=none>None</md-option><md-option value=compactUp>Compact Up</md-option><md-option value=compactLeft>Compact Left</md-option><md-option value=compactLeft&Up>Compact Left & Up</md-option><md-option value=compactUp&Left>Compact Up & Left</md-option></md-select></div><div class="layout-row flex"><md-checkbox ng-model=main.options.swap ng-change=main.changedOptions()>Swap Items</md-checkbox><md-checkbox ng-model=main.options.pushItems ng-change=main.changedOptions()>Push Items</md-checkbox><md-checkbox ng-model=main.options.draggable.enabled ng-change=main.changedOptions()>Drag Items</md-checkbox><md-checkbox ng-model=main.options.resizable.enabled ng-change=main.changedOptions()>Resize Items</md-checkbox><md-checkbox ng-model=main.options.pushResizeItems ng-change=main.changedOptions()>Push Resize Items</md-checkbox></div><div class="layout-row flex"><md-input-container><input ng-model=main.options.minCols type=number placeholder="Min Grid Cols" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.maxCols type=number placeholder="Max Grid Cols" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.minRows type=number placeholder="Min Grid Rows" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.maxRows type=number placeholder="Max Grid Rows" ng-change=main.changedOptions()></md-input-container></div><div class="layout-row flex"><md-select aria-label="Display grid lines" ng-model=main.options.displayGrid placeholder="Display grid lines" ng-change=main.changedOptions()><md-option value=always>Always</md-option><md-option value=onDrag&Resize>On Drag & Resize</md-option><md-option value=none>None</md-option></md-select></div><div class="layout-row flex"><md-input-container><input ng-model=main.options.margin min=0 max=30 step=1 type=number placeholder=Margin ng-change=main.changedOptions()></md-input-container><md-checkbox ng-model=main.options.outerMargin ng-change=main.changedOptions()>Outer Margin</md-checkbox></div><div class="layout-row flex"><md-input-container><input ng-model=main.options.mobileBreakpoint type=number placeholder="Mobile Breakpoint" ng-change=main.changedOptions()></md-input-container><md-checkbox ng-model=main.options.disableWindowResize ng-change=main.changedOptions()>Disable window resize</md-checkbox></div><label class=md-headline>Item Settings</label><div class="layout-row flex"><md-input-container><input ng-model=main.options.maxItemCols type=number placeholder="Max Item Cols" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.minItemCols type=number placeholder="Min Item Cols" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.maxItemRows type=number placeholder="Max Item Rows" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.minItemRows type=number placeholder="Min Item Rows" ng-change=main.changedOptions()></md-input-container></div><div class="layout-row flex"><md-input-container><input ng-model=main.options.maxItemArea type=number placeholder="Max Item Area" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.minItemArea type=number placeholder="Min Item Area" ng-change=main.changedOptions()></md-input-container></div><div class="layout-row flex"><md-input-container><input ng-model=main.options.defaultItemRows type=number placeholder="Default Item Rows" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.defaultItemCols type=number placeholder="Default Item Cols" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.fixedColWidth type=number placeholder="Fixed Col Width" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.fixedRowHeight type=number placeholder="Fixed layout-row Height" ng-change=main.changedOptions()></md-input-container></div><div class="layout-row flex"><md-checkbox ng-model=main.options.keepFixedHeightInMobile ng-change=main.changedOptions()>Keep Fixed Height In Mobile</md-checkbox><md-checkbox ng-model=main.options.keepFixedWidthInMobile ng-change=main.changedOptions()>Keep Fixed Width In Mobile</md-checkbox></div><div class="layout-row flex"><md-checkbox ng-model=main.options.enableEmptyCellClick ng-change=main.changedOptions()>Enable click to add</md-checkbox><md-checkbox ng-model=main.options.enableEmptyCellDrop ng-change=main.changedOptions()>Enable drop to add</md-checkbox><md-checkbox ng-model=main.options.enableEmptyCellDrag ng-change=main.changedOptions()>Enable drag to add</md-checkbox></div><div class="layout-row flex"><md-input-container><input ng-model=main.options.emptyCellDragMaxCols type=number placeholder="Drag Max Cols" ng-change=main.changedOptions()></md-input-container><md-input-container><input ng-model=main.options.emptyCellDragMaxRows type=number placeholder="Drag Max Rows" ng-change=main.changedOptions()></md-input-container></div><div class="layout-row flex"><div class=flex></div><md-button class="md-fab md-mini md-primary" ng-click=main.addItem()><md-icon>add</md-icon><md-tooltip>Add widget</md-tooltip></md-button></div></md-sidenav><md-button class="md-fab md-mini md-primary sidenav-fab" ng-click=main.sidenav.toggle()><md-icon>settings</md-icon></md-button><gridster options=main.options class=flex><gridster-item item=item ng-repeat="item in main.dashboard"><div class=button-holder><div class=gridster-item-content ng-if=item.hasContent><div class=stuff>Some content to select and click without dragging the widget <a href=https://www.google.com target=_blank>Link to Google</a></div></div><div class=item-buttons ng-if=item.hasContent><md-button class="drag-handler md-raised md-icon-button"><md-icon>open_with</md-icon></md-button><md-button class="remove-button md-raised md-icon-button" ng-click="main.removeItem($event, item)" ng-mousedown=main.prevent($event)><md-icon>clear</md-icon><md-tooltip>Remove</md-tooltip></md-button></div><label ng-if=!item.hasContent ng-bind=::item.label></label><md-button class="md-icon-button md-fab-mini" ng-if=!item.hasContent ng-click="main.removeItem($event, item)" ng-mousedown=main.prevent($event)><md-icon>clear</md-icon><md-tooltip>Remove</md-tooltip></md-button></div></gridster-item></gridster>');}]);