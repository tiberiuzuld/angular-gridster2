(function () {
  'use strict';

  angular.module('angular-gridster2').component('gridsterGrid', {
    templateUrl: 'gridster2/gridsterGrid.html',
    controller: GridsterGridController,
    require: {
      gridster: '^^gridster'
    }
  });

  /** @ngInject */
  function GridsterGridController($element, $scope) {
    var vm = this;

    vm.$onInit = function () {
      vm.gridster.gridLines = this;
      vm.columns = [];
      vm.rows = [];
      vm.height = 0;
      vm.width = 0;
      vm.margin = 0;
      vm.columnsHeight = 0;
      vm.rowsWidth = 0;
    };

    vm.updateGrid = function updateGrid(dragOn) {
      if (vm.gridster.$options.displayGrid === 'always' && !vm.gridster.mobile) {
        $element.css('display', 'block');
      } else if (vm.gridster.$options.displayGrid === 'onDrag&Resize' && dragOn) {
        $element.css('display', 'block');
      } else if (vm.gridster.$options.displayGrid === 'none' || !dragOn || vm.gridster.mobile) {
        $element.css('display', 'none');
        return;
      }
      vm.margin = vm.gridster.$options.margin;
      vm.height = vm.gridster.curRowHeight - vm.margin;
      vm.width = vm.gridster.curColWidth - vm.margin;
      vm.columns.length = Math.max(vm.gridster.columns, Math.floor(vm.gridster.curWidth / vm.gridster.curColWidth));
      vm.rows.length = Math.max(vm.gridster.rows, Math.floor(vm.gridster.curHeight / vm.gridster.curRowHeight));
      vm.columnsHeight = vm.gridster.curRowHeight * vm.rows.length;
      vm.rowsWidth = vm.gridster.curColWidth * vm.columns.length;
      $scope.$applyAsync();
    }
  }
})();
