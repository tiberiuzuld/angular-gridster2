/*
 Angular Gridster 2
 (c) 2016 Tiberiu Zuld
 License: MIT
 */

(function () {
  'use strict';

  angular.module('angular-gridster2', []);

})();

(function () {
  'use strict';

  angular.module('angular-gridster2').factory('gridsterResizable', gridsterResizable);

  /** @ngInject */
  function gridsterResizable($document) {

    function GridsterResizable($element, scope) {

      var enabled, dragHandles = [], handlesIndex, dragHandleElement, scrollSensitivity, scrollSpeed, lastMouse = [0, 0],
        elemPosition = [0, 0], directionFunction, position = [0, 0], itemBackup = [0, 0, 0, 0], elemBottomOffset,
        elemRightOffset;

      function dragStart(e) {
        switch (e.which) {
          case 1:
            // left mouse button
            break;
          case 2:
          case 3:
            // right or middle mouse button
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (angular.isUndefined(e.pageX) && e.touches) {
          touchEvent(e);
        }
        $document[0].addEventListener('mousemove', dragMove);
        $document[0].addEventListener('mouseup', dragStop);
        $document[0].addEventListener('touchmove', dragMove);
        $document[0].addEventListener('touchend', dragStop);
        $document[0].addEventListener('touchcancel', dragStop);
        $element.addClass('gridster-item-resizing');
        lastMouse[0] = e.pageX;
        lastMouse[1] = e.pageY;
        elemPosition[0] = $element[0].offsetLeft;
        elemPosition[1] = $element[0].offsetTop;
        elemPosition[2] = $element[0].offsetWidth;
        elemPosition[3] = $element[0].offsetHeight;
        scope.gridster.movingItem = scope.gridsterItem;
        scope.gridster.previewStyle();

        scrollSensitivity = scope.gridster.scrollSensitivity;
        scrollSpeed = scope.gridster.scrollSpeed;

        if (this.classList.contains('handle-n')) {
          directionFunction = handleN;
        } else if (this.classList.contains('handle-w')) {
          directionFunction = handleW;
        } else if (this.classList.contains('handle-s')) {
          directionFunction = handleS;
        } else if (this.classList.contains('handle-e')) {
          directionFunction = handleE;
        } else if (this.classList.contains('handle-nw')) {
          directionFunction = handleNW;
        } else if (this.classList.contains('handle-ne')) {
          directionFunction = handleNE;
        } else if (this.classList.contains('handle-sw')) {
          directionFunction = handleSW;
        } else if (this.classList.contains('handle-se')) {
          directionFunction = handleSE;
        }
      }

      function dragMove(e) {
        e.preventDefault();
        e.stopPropagation();
        if (angular.isUndefined(e.pageX) && e.touches) {
          touchEvent(e);
        }

        elemBottomOffset = scope.gridster.element[0].offsetHeight + scope.gridster.element[0].scrollTop - elemPosition[1] - elemPosition[3];
        if (lastMouse[1] < e.pageY && elemBottomOffset < scrollSensitivity) {
          scope.gridster.element[0].scrollTop += scrollSpeed;
          elemPosition[3] += scrollSpeed - e.pageY + lastMouse[1];
        } else if (lastMouse[1] > e.pageY && scope.gridster.element[0].scrollTop > 0 &&
          elemPosition[1] - scope.gridster.element[0].scrollTop < scrollSensitivity) {
          scope.gridster.element[0].scrollTop -= scrollSpeed;
          elemPosition[3] -= scrollSpeed;
        }

        elemRightOffset = scope.gridster.element[0].offsetWidth + scope.gridster.element[0].scrollLeft - elemPosition[0] - elemPosition[2];
        if (lastMouse[0] < e.pageX && elemRightOffset < scrollSensitivity) {
          scope.gridster.element[0].scrollLeft += scrollSpeed;
          elemPosition[2] += scrollSpeed - e.pageX + lastMouse[0];
        } else if (lastMouse[0] > e.pageX && scope.gridster.element[0].scrollLeft > 0 &&
          elemPosition[2] - scope.gridster.element[0].scrollLeft < scrollSensitivity) {
          scope.gridster.element[0].scrollLeft -= scrollSpeed;
          elemPosition[2] -= scrollSpeed;
        }

        directionFunction(e);

        lastMouse[0] = e.pageX;
        lastMouse[1] = e.pageY;
      }

      function dragStop(e) {
        e.preventDefault();
        e.stopPropagation();
        $document[0].removeEventListener('mousemove', dragMove);
        $document[0].removeEventListener('mouseup', dragStop);
        $document[0].removeEventListener('touchmove', dragMove);
        $document[0].removeEventListener('touchend', dragStop);
        $document[0].removeEventListener('touchcancel', dragStop);
        $element.removeClass('gridster-item-resizing');
        scope.gridster.movingItem = null;
        scope.gridster.previewStyle();
        scope.gridsterItem.setSize(true);
        scope.$applyAsync();
        if (scope.gridster.resizable.stop) {
          scope.gridster.resizable.stop(scope.gridsterItem, scope);
        }
      }

      this.toggle = function (enable) {
        if (enable && !enabled) {
          enabled = !enabled;
          if (!dragHandles.length) {
            var handles = scope.gridster.resizable.handles;
            for (handlesIndex = 0; handlesIndex < handles.length; handlesIndex++) {
              dragHandleElement = angular.element('<div class="gridster-item-resizable-handler handle-' + handles[handlesIndex] + '"></div>');
              $element.append(dragHandleElement);
              dragHandleElement[0].addEventListener('mousedown', dragStart);
              dragHandleElement[0].addEventListener('touchstart', dragStart);
              dragHandles.push(dragHandleElement);
            }
          } else {
            handlesIndex = dragHandles.length - 1;
            for (; handlesIndex >= 0; handlesIndex--) {
              dragHandles[handlesIndex].css('display', 'block');
            }
          }
        } else if (!enable && enabled) {
          enabled = !enabled;
          handlesIndex = dragHandles.length - 1;
          for (; handlesIndex >= 0; handlesIndex--) {
            dragHandles[handlesIndex].css('display', 'none');
          }
        }
      };

      function touchEvent(e) {
        e.pageX = e.touches[0].pageX;
        e.pageY = e.touches[0].pageY;
      }

      function handleN(e) {
        elemPosition[1] += e.pageY - lastMouse[1];
        elemPosition[3] += lastMouse[1] - e.pageY;
        $element.css({'top': elemPosition[1] + 'px', 'height': elemPosition[3] + 'px'});
        position = scope.gridster.pixelsToPosition(elemPosition[0], elemPosition[1]);
        if (scope.gridsterItem.y !== position[1]) {
          itemBackup[1] = scope.gridsterItem.y;
          itemBackup[3] = scope.gridsterItem.rows;
          scope.gridsterItem.rows += scope.gridsterItem.y - position[1];
          scope.gridsterItem.y = position[1];
          if (scope.gridsterItem.y < 0 || scope.gridsterItem.rows < 1 || scope.gridster.checkCollision(scope.gridsterItem)) {
            scope.gridsterItem.y = itemBackup[1];
            scope.gridsterItem.rows = itemBackup[3];
          } else {
            scope.gridster.previewStyle();
          }
        }
      }

      function handleW(e) {
        elemPosition[0] += e.pageX - lastMouse[0];
        elemPosition[2] += lastMouse[0] - e.pageX;
        $element.css({'left': elemPosition[0] + 'px', 'width': elemPosition[2] + 'px'});
        position = scope.gridster.pixelsToPosition(elemPosition[0], elemPosition[1]);
        if (scope.gridsterItem.x !== position[0]) {
          itemBackup[0] = scope.gridsterItem.x;
          itemBackup[2] = scope.gridsterItem.cols;
          scope.gridsterItem.cols += scope.gridsterItem.x - position[0];
          scope.gridsterItem.x = position[0];
          if (scope.gridsterItem.x < 0 || scope.gridsterItem.cols < 1 || scope.gridster.checkCollision(scope.gridsterItem)) {
            scope.gridsterItem.x = itemBackup[0];
            scope.gridsterItem.cols = itemBackup[2];
          } else {
            scope.gridster.previewStyle();
          }
        }
      }

      function handleS(e) {
        elemPosition[3] += e.pageY - lastMouse[1];
        $element.css({'height': elemPosition[3] + 'px'});
        position = scope.gridster.pixelsToPosition(elemPosition[0], elemPosition[1] + elemPosition[3]);
        if ((scope.gridsterItem.y + scope.gridsterItem.rows) !== position[1]) {
          itemBackup[3] = scope.gridsterItem.rows;
          scope.gridsterItem.rows = position[1] - scope.gridsterItem.y;
          if (scope.gridsterItem.rows < 1 || scope.gridster.checkCollision(scope.gridsterItem)) {
            scope.gridsterItem.rows = itemBackup[3];
          } else {
            scope.gridster.previewStyle();
          }
        }
      }

      function handleE(e) {
        elemPosition[2] += e.pageX - lastMouse[0];
        $element.css({'width': elemPosition[2] + 'px'});
        position = scope.gridster.pixelsToPosition(elemPosition[0] + elemPosition[2], elemPosition[1]);
        if ((scope.gridsterItem.x + scope.gridsterItem.cols) !== position[0]) {
          itemBackup[2] = scope.gridsterItem.cols;
          scope.gridsterItem.cols = position[0] - scope.gridsterItem.x;
          if (scope.gridsterItem.cols < 1 || scope.gridster.checkCollision(scope.gridsterItem)) {
            scope.gridsterItem.cols = itemBackup[2];
          } else {
            scope.gridster.previewStyle();
          }
        }
      }

      function handleNW(e) {
        handleN(e);
        handleW(e);
      }

      function handleNE(e) {
        handleN(e);
        handleE(e);
      }

      function handleSW(e) {
        handleS(e);
        handleW(e);
      }

      function handleSE(e) {
        handleS(e);
        handleE(e);
      }
    }


    return GridsterResizable;
  }
  gridsterResizable.$inject = ["$document"];
})();

(function () {
  'use strict';
  angular.module('angular-gridster2').directive('gridsterPreview', gridsterPreview);

  function gridsterPreview() {
    return {
      restrict: 'A',
      replace: true,
      template: '<div class="gridster-item gridster-preview-holder"></div>',
      link: function (scope, element) {
        scope.gridster.previewStyleString = {};
        /**
         * @returns {Object} style object for preview element
         */
        scope.gridster.previewStyle = function () {
          if (!scope.gridster.movingItem) {
            element.css({
              display: 'none'
            });
          } else {
            element.css({
              display: 'block',
              height: (scope.gridster.movingItem.rows * scope.gridster.curRowHeight - scope.gridster.margin) + 'px',
              width: (scope.gridster.movingItem.cols * scope.gridster.curColWidth - scope.gridster.margin) + 'px',
              top: (scope.gridster.movingItem.y * scope.gridster.curRowHeight + (scope.gridster.outerMargin ? scope.gridster.margin : 0)) + 'px',
              left: (scope.gridster.movingItem.x * scope.gridster.curColWidth + (scope.gridster.outerMargin ? scope.gridster.margin : 0)) + 'px',
              marginBottom: (scope.gridster.outerMargin ? scope.gridster.margin : 0) + 'px'
            });
          }
        };
      }
    };
  }
})();

(function () {
  'use strict';

  angular.module('angular-gridster2').directive('gridsterItem', gridsterItem);

  /** @ngInject */
  function gridsterItem(gridsterDraggable, gridsterResizable) {
    function link(scope, element, attributes) {
      scope.gridsterItem = scope.$eval(attributes.gridsterItem);

      scope.gridsterItem.drag = new gridsterDraggable(element, scope);
      scope.gridsterItem.resize = new gridsterResizable(element, scope);

      scope.gridster.addItem(scope.gridsterItem);

      var itemTop, itemLeft, itemWidth, itemHeight, top, left, width, height, itemMarginBottom;

      function setSize(noCheck, mobile) {
        if (mobile) {
          top = (scope.gridster.outerMargin ? scope.gridster.margin : 0);
          left = (scope.gridster.outerMargin ? scope.gridster.margin : 0);
          width = scope.gridster.curWidth - (scope.gridster.outerMargin ? 2 * scope.gridster.margin : 0);
          height = width / 2;
        } else {
          top = (scope.gridsterItem.y * scope.gridster.curRowHeight + (scope.gridster.outerMargin ? scope.gridster.margin : 0));
          left = (scope.gridsterItem.x * scope.gridster.curColWidth + (scope.gridster.outerMargin ? scope.gridster.margin : 0));
          width = scope.gridsterItem.cols * scope.gridster.curColWidth - scope.gridster.margin;
          height = scope.gridsterItem.rows * scope.gridster.curRowHeight - scope.gridster.margin;
        }
        if (!noCheck && top === itemTop && left === itemLeft && width === itemWidth && height === itemHeight) {
          return;
        } else {
          if (width !== itemWidth || height !== itemHeight) {
            scope.$broadcast('gridster-item-resize');
          }
          itemTop = top;
          itemLeft = left;
          itemWidth = width;
          itemHeight = height;
          if (scope.gridster.outerMargin) {
            itemMarginBottom = scope.gridster.margin;
          } else {
            itemMarginBottom = 0;
          }
        }
        element.css({
          display: 'block',
          top: itemTop + 'px',
          left: itemLeft + 'px',
          width: itemWidth + 'px',
          height: itemHeight + 'px',
          marginBottom: itemMarginBottom + 'px'
        });
      }

      scope.gridsterItem.setSize = setSize;

      var init = true;
      scope.$watch('gridsterItem', function (newValue, oldValue) {
        if (init) {
          init = false;
          return;
        }

        if (newValue.rows < scope.gridster.minItemRows || newValue.cols < scope.gridster.minItemCols ||
          scope.gridster.checkCollision(scope.gridsterItem)) {
          scope.gridsterItem.x = oldValue.x;
          scope.gridsterItem.y = oldValue.y;
          scope.gridsterItem.cols = oldValue.cols;
          scope.gridsterItem.rows = oldValue.rows;
          init = true;
        } else {
          scope.$broadcast('gridster-item-change');
          scope.gridster.calculateLayout();
          if (scope.gridster.itemChangeCallback) {
            scope.gridster.itemChangeCallback(scope.gridsterItem, scope);
          }
        }

      }, true);

      scope.$on('$destroy', function () {
        scope.gridsterItem.drag.toggle(false);
        scope.gridster.removeItem(scope.gridsterItem);
      });
    }

    return {
      restrict: 'A',
      link: link
    }
  }
  gridsterItem.$inject = ["gridsterDraggable", "gridsterResizable"];
})();

(function () {
  'use strict';

  angular.module('angular-gridster2').factory('gridsterDraggable', gridsterDraggable);

  /** @ngInject */
  function gridsterDraggable($document) {

    function GridsterDraggable($element, scope) {

      var enabled, lastMouse = [0, 0], elemPosition = [0, 0, 0, 0], position = [0, 0], positionBackup = [0, 0],
        scrollSensitivity, scrollSpeed, elemBottomOffset, elemRightOffset;

      function dragStart(e) {
        switch (e.which) {
          case 1:
            // left mouse button
            break;
          case 2:
          case 3:
            // right or middle mouse button
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (angular.isUndefined(e.pageX) && e.touches) {
          touchEvent(e);
        }
        $document[0].addEventListener('mousemove', dragMove);
        $document[0].addEventListener('mouseup', dragStop);
        $document[0].addEventListener('touchmove', dragMove);
        $document[0].addEventListener('touchend', dragStop);
        $document[0].addEventListener('touchcancel', dragStop);
        $element.addClass('gridster-item-moving');
        lastMouse[0] = e.pageX;
        lastMouse[1] = e.pageY;
        elemPosition[0] = $element[0].offsetLeft;
        elemPosition[1] = $element[0].offsetTop;
        elemPosition[2] = $element[0].offsetWidth;
        elemPosition[3] = $element[0].offsetHeight;
        scope.gridster.movingItem = scope.gridsterItem;
        scope.gridster.previewStyle();

        scrollSensitivity = scope.gridster.scrollSensitivity;
        scrollSpeed = scope.gridster.scrollSpeed;
      }

      function dragMove(e) {
        e.preventDefault();
        e.stopPropagation();
        if (angular.isUndefined(e.pageX) && e.touches) {
          touchEvent(e);
        }
        elemPosition[0] += e.pageX - lastMouse[0];
        elemPosition[1] += e.pageY - lastMouse[1];
        elemBottomOffset = scope.gridster.element[0].offsetHeight + scope.gridster.element[0].scrollTop - elemPosition[1] - elemPosition[3];
        if (lastMouse[1] < e.pageY && elemBottomOffset < scrollSensitivity) {
          scope.gridster.element[0].scrollTop += scrollSpeed;
          elemPosition[1] += scrollSpeed - e.pageY + lastMouse[1];
        } else if (lastMouse[1] > e.pageY && scope.gridster.element[0].scrollTop > 0 &&
          elemPosition[1] - scope.gridster.element[0].scrollTop < scrollSensitivity) {
          scope.gridster.element[0].scrollTop -= scrollSpeed;
          elemPosition[1] -= scrollSpeed;
        }

        elemRightOffset = scope.gridster.element[0].offsetWidth + scope.gridster.element[0].scrollLeft - elemPosition[0] - elemPosition[2];
        if (lastMouse[0] < e.pageX && elemRightOffset < scrollSensitivity) {
          scope.gridster.element[0].scrollLeft += scrollSpeed;
          elemPosition[0] += scrollSpeed - e.pageX + lastMouse[0];
        } else if (lastMouse[0] > e.pageX && scope.gridster.element[0].scrollLeft > 0 &&
          elemPosition[0] - scope.gridster.element[0].scrollLeft < scrollSensitivity) {
          scope.gridster.element[0].scrollLeft -= scrollSpeed;
          elemPosition[0] -= scrollSpeed;
        }
        lastMouse[0] = e.pageX;
        lastMouse[1] = e.pageY;

        $element.css({
          'left': elemPosition[0] + 'px',
          'top': elemPosition[1] + 'px'
        })

        ;
        position = scope.gridster.pixelsToPosition(elemPosition[0], elemPosition[1]);
        if (position[0] !== scope.gridsterItem.x || position[1] !== scope.gridsterItem.y) {
          positionBackup[0] = scope.gridsterItem.x;
          positionBackup[1] = scope.gridsterItem.y;
          scope.gridsterItem.x = position[0];
          scope.gridsterItem.y = position[1];
          if (scope.gridster.checkCollision(scope.gridsterItem)) {
            scope.gridsterItem.x = positionBackup[0];
            scope.gridsterItem.y = positionBackup[1];
          } else {
            scope.gridster.previewStyle();
          }
        }
      }

      function dragStop(e) {
        e.preventDefault();
        e.stopPropagation();
        $document[0].removeEventListener('mousemove', dragMove);
        $document[0].removeEventListener('mouseup', dragStop);
        $document[0].removeEventListener('touchmove', dragMove);
        $document[0].removeEventListener('touchend', dragStop);
        $document[0].removeEventListener('touchcancel', dragStop);
        $element.removeClass('gridster-item-moving');
        scope.gridster.movingItem = null;
        scope.gridsterItem.setSize(true);
        scope.gridster.previewStyle();
        scope.$applyAsync();
        if (scope.gridster.draggable.stop) {
          scope.gridster.draggable.stop(scope.gridsterItem, scope);
        }
      }

      this.toggle = function (enable) {
        if (enable && !enabled) {
          enabled = !enabled;
          $element[0].addEventListener('mousedown', dragStart);
          $element[0].addEventListener('touchstart', dragStart);
        } else if (!enable && enabled) {
          enabled = !enabled;
          $element[0].removeEventListener('mousedown', dragStart);
          $element[0].removeEventListener('touchstart', dragStart);
        }
      };

      function touchEvent(e) {
        e.pageX = e.touches[0].pageX;
        e.pageY = e.touches[0].pageY;
      }

    }

    return GridsterDraggable;

  }
  gridsterDraggable.$inject = ["$document"];
})();

(function () {
  'use strict';
  angular.module('angular-gridster2').directive('gridster', gridster);

  /** @ngInject */
  function gridster($window, $compile) {

    function link(scope, element, attributes, gridster) {
      var gridsterPreview = '<div gridster-preview></div>';
      element.append($compile(gridsterPreview)(scope));
      var options = scope.$eval(attributes.gridster), scrollBarPresent;

      scope.$watch(attributes.gridster, function () {
        gridster.setOptions(options);
      }, true);

      function setGridSize() {
        if (gridster.rowHeight === 'fit' && gridster.fitBreakpoint < element[0].clientWidth) {
          gridster.curWidth = element[0].offsetWidth;
          gridster.curHeight = element[0].offsetHeight;
        } else {
          gridster.curWidth = element[0].clientWidth;
          gridster.curHeight = element[0].clientHeight;
        }
      }

      setGridSize();

      function onResize() {
        setGridSize();
        gridster.calculateLayout();
      }

      var detectScrollBar = function () {
        if (scrollBarPresent && element[0].scrollHeight <= element[0].offsetHeight &&
          element[0].offsetWidth - element[0].clientWidth >= element[0].scrollHeight - element[0].offsetHeight) {
          scrollBarPresent = !scrollBarPresent;
          gridster.onResize();
        } else if (!scrollBarPresent && element[0].scrollHeight > element[0].offsetHeight &&
          element[0].offsetWidth - element[0].clientWidth < element[0].scrollHeight - element[0].offsetHeight) {
          scrollBarPresent = !scrollBarPresent;
          gridster.onResize();
        }
      };

      gridster.detectScrollBarLayout = _.debounce(detectScrollBar, 10);
      element[0].addEventListener('transitionend', gridster.detectScrollBarLayout);


      gridster.onResize = onResize;

      $window.addResizeListener(element[0], onResize);

      gridster.element = element;

      scope.$on('$destroy', function () {
        $window.removeResizeListener(element[0], onResize);
        element[0].removeEventListener('transitionend', gridster.detectScrollBarLayout);
      });
    }

    return {
      restrict: 'A',
      controller: 'GridsterController',
      controllerAs: 'gridster',
      link: link
    };
  }
  gridster.$inject = ["$window", "$compile"];
})();

(function () {
  'use strict';
  angular.module('angular-gridster2')
    .controller('GridsterController', gridsterController);

  /** @ngInject */
  function gridsterController($scope, gridsterConfig) {
    var vm = this, mobile;

    angular.extend(vm, gridsterConfig);

    vm.grid = [];

    function setGridDimensions() {
      var rows = vm.minRows, columns = vm.minCols;

      var widgetsIndex = vm.grid.length - 1;
      for (; widgetsIndex >= 0; widgetsIndex--) {
        rows = Math.max(rows, vm.grid[widgetsIndex].y + vm.grid[widgetsIndex].rows);
        columns = Math.max(columns, vm.grid[widgetsIndex].x + vm.grid[widgetsIndex].cols);
      }

      vm.columns = columns;
      vm.rows = rows;
    }

    function calculateLayout() {
      setGridDimensions();
      if (vm.colWidth === 'fit') {
        vm.curColWidth = Math.floor((vm.curWidth + (vm.outerMargin ? -vm.margin : vm.margin)) / vm.columns);
      } else {
        vm.curColWidth = vm.colWidth;
      }

      if (!mobile && vm.mobileBreakpoint > vm.curWidth) {
        mobile = !mobile;
        vm.element.addClass('mobile');
      } else if (mobile && vm.mobileBreakpoint < vm.curWidth) {
        mobile = !mobile;
        vm.element.removeClass('mobile');
      }

      if (vm.rowHeight === 'match' || vm.fitBreakpoint > vm.curWidth) {
        vm.element.addClass('scroll');
        vm.element.removeClass('fit');
        vm.curRowHeight = vm.curColWidth;
      } else if (vm.rowHeight === 'fit') {
        vm.element.addClass('fit');
        vm.element.removeClass('scroll');
        vm.curRowHeight = Math.floor((vm.curHeight + (vm.outerMargin ? -vm.margin : vm.margin)) / vm.rows);
      } else {
        vm.curRowHeight = vm.rowHeight;
      }

      var widgetsIndex = vm.grid.length - 1;
      for (; widgetsIndex >= 0; widgetsIndex--) {
        vm.grid[widgetsIndex].setSize(undefined, mobile);
        vm.grid[widgetsIndex].drag.toggle(vm.draggable.enabled);
        vm.grid[widgetsIndex].resize.toggle(vm.resizable.enabled);
      }

      $scope.$applyAsync(vm.detectScrollBarLayout);
    }

    vm.calculateLayout = _.debounce(calculateLayout, 5);

    vm.setOptions = function (options) {
      if (!options) {
        return;
      }

      angular.merge(vm, options);
      vm.calculateLayout();
    };

    vm.addItem = function (item) {
      if (angular.isUndefined(item.cols)) {
        item.cols = vm.defaultItemCols;
      }
      if (angular.isUndefined(item.rows)) {
        item.rows = vm.defaultItemRows;
      }
      if (angular.isUndefined(item.x) || angular.isUndefined(item.y)) {
        vm.autoPositionItem(item);
      }
      vm.grid.push(item);
      vm.calculateLayout();
    };

    vm.removeItem = function (item) {
      vm.grid.splice(vm.grid.indexOf(item), 1);
      vm.calculateLayout();
    };

    vm.checkCollision = function (item) {
      if (!(item.y > -1 && item.x > -1 && item.cols + item.x <= vm.maxCols && item.rows + item.y <= vm.maxRows)) {
        return true;
      }
      var widgetsIndex = vm.grid.length - 1, widget;
      for (; widgetsIndex >= 0; widgetsIndex--) {
        widget = vm.grid[widgetsIndex];
        if (widget !== item && widget.x < item.x + item.cols && widget.x + widget.cols > item.x &&
          widget.y < item.y + item.rows && widget.y + widget.rows > item.y) {
          return true;
        }
      }
    };


    vm.autoPositionItem = function (item) {
      setGridDimensions();
      var rowsIndex = 0, colsIndex;
      for (; rowsIndex < vm.rows; rowsIndex++) {
        item.y = rowsIndex;
        colsIndex = 0;
        for (; colsIndex < vm.columns; colsIndex++) {
          item.x = colsIndex;
          if (!vm.checkCollision(item)) {
            return;
          }
        }
      }
      if (vm.rows > vm.columns) {
        item.x = vm.columns;
        item.y = 0;
      } else {
        item.y = vm.rows;
        item.x = 0;
      }
    };

    vm.pixelsToPosition = function (x, y) {
      if (vm.outerMargin) {
        x -= 10;
        y -= 10;
      }

      return [Math.round(x / vm.curColWidth), Math.round(y / vm.curRowHeight)];
    }
  }
  gridsterController.$inject = ["$scope", "gridsterConfig"];
})();

(function () {
  'use strict';

  angular.module('angular-gridster2')
    .constant('gridsterConfig', {
      colWidth: 'fit', // 'fit' will divide container width to the number of columns; number of pixels to set colWidth
      rowHeight: 'match', // 'match' will be equal to colWidth; 'fit' will divide container height to number of rows; number of pixels to set rowHeight
      fitBreakpoint: 1024, // if the screen is not wider that this, rowHeight 'fit' will be calculated as 'match'
      mobileBreakpoint: 640, // if the screen is not wider that this, remove the grid layout and stack the items
      minCols: 1,// minimum amount of columns in the grid
      maxCols: 100,// maximum amount of columns in the grid
      minRows: 1,// minimum amount of rows in the grid
      maxRows: 100,// maximum amount of rows in the grid
      defaultItemCols: 1, // default width of an item in columns
      defaultItemRows: 1, // default height of an item in rows
      minItemCols: 1, // min item number of columns
      minItemRows: 1, // min item number of rows
      margin: 10, //margin between grid items
      outerMargin: true, //if margins will apply to the sides of the container
      scrollSensitivity: 20, //margin of the dashboard where to start scrolling
      scrollSpeed: 10, //how much to scroll each mouse move when in the scrollSensitivity zone
      itemChangeCallback: undefined, //callback to call for each item when is changes x, y, rows, cols. Arguments:gridsterItem, scope
      draggable: {
        enabled: true, // enable/disable draggable items
        stop: undefined // callback when dragging an item stops. Arguments: gridsterItem, scope
      },
      resizable: {
        enabled: true, // enable/disable resizable items
        handles: ['s', 'e', 'n', 'w', 'se', 'ne', 'sw', 'nw'], // resizable edges of an item
        stop: undefined // callback when resizing an item stops. Arguments: gridsterItem, scope
      }
    });
})();
