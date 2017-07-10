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
      vm.gridster.previewStyle = vm.previewStyle.bind(this);
    };

    vm.previewStyle = function() {
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
        $element.css('height', (vm.gridster.movingItem.$item.rows * curRowHeight - margin) + 'px');
        $element.css('width', (vm.gridster.movingItem.$item.cols * curColWidth - margin) + 'px');
        $element.css('top', (vm.gridster.movingItem.$item.y * curRowHeight + margin) + 'px');
        $element.css('left', (vm.gridster.movingItem.$item.x * curColWidth + margin) + 'px');
        $element.css('marginBottom', margin + 'px');
      }
    }
  }
})();
