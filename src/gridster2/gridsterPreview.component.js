(function () {
  'use strict';

  angular.module('angular-gridster2').component('gridsterPreview', {
    controller: GridsterGridController,
    require: {
      gridster: '^^gridster'
    }
  });

  /** @ngInject */
  function GridsterGridController($element) {
    var vm = this;

    vm.$onInit = function () {
      vm.gridster.previewStyle = vm.previewStyle.bind(vm);
    };

    vm.$onDestroy = function () {
      delete vm.gridster.previewStyle;
    };

    vm.previewStyle = function () {
      if (!vm.gridster.movingItem) {
        $element.css('display', 'none');
      } else {
        var margin = 0;
        var curRowHeight = vm.gridster.curRowHeight;
        var curColWidth = vm.gridster.curColWidth;
        if (vm.gridster.$options.outerMargin) {
          margin = vm.gridster.$options.margin;
        }
        $element.css('display', 'block');
        $element.css('height', (vm.gridster.movingItem.rows * curRowHeight - margin) + 'px');
        $element.css('width', (vm.gridster.movingItem.cols * curColWidth - margin) + 'px');
        $element.css('top', (vm.gridster.movingItem.y * curRowHeight + margin) + 'px');
        $element.css('left', (vm.gridster.movingItem.x * curColWidth + margin) + 'px');
        $element.css('marginBottom', margin + 'px');
      }
    }
  }
})();
