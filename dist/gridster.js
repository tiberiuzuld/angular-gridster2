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

  gridsterScroll.$inject = ["$interval"];
  angular.module('angular-gridster2').factory('gridsterScroll', gridsterScroll);

  /** @ngInject */
  function gridsterScroll($interval) {
    var scrollSensitivity, scrollSpeed, intervalDuration = 50, gridsterElement,
      resizeEvent, resizeEventType, intervalE, intervalW, intervalN, intervalS;

    function scroll(elemPosition, scope, e, lastMouse, calculateItemPosition, resize, resizeEventScrollType) {
      scrollSensitivity = scope.gridster.scrollSensitivity;
      scrollSpeed = scope.gridster.scrollSpeed;
      gridsterElement = scope.gridster.element[0];
      resizeEvent = resize;
      resizeEventType = resizeEventScrollType;

      var elemTopOffset = elemPosition[1] - gridsterElement.scrollTop;
      var elemBottomOffset = gridsterElement.offsetHeight + gridsterElement.scrollTop - elemPosition[1] - elemPosition[3];
      if (lastMouse.pageY < e.pageY && elemBottomOffset < scrollSensitivity) {
        cancelN();
        if ((resizeEvent && !resizeEventType.s) || intervalS) {
          return;
        }
        intervalS = startVertical(1, elemPosition, calculateItemPosition, lastMouse, resizeEventType);
      } else if (lastMouse.pageY > e.pageY && gridsterElement.scrollTop > 0 && elemTopOffset < scrollSensitivity) {
        cancelS();
        if ((resizeEvent && !resizeEventType.n) || intervalN) {
          return;
        }
        intervalN = startVertical(-1, elemPosition, calculateItemPosition, lastMouse);
      } else if (lastMouse.pageY !== e.pageY) {
        cancelVertical();
      }

      var elemRightOffset = gridsterElement.offsetWidth + gridsterElement.scrollLeft - elemPosition[0] - elemPosition[2];
      var elemLeftOffset = elemPosition[0] - gridsterElement.scrollLeft;
      if (lastMouse.pageX < e.pageX && elemRightOffset < scrollSensitivity) {
        cancelW();
        if ((resizeEvent && !resizeEventType.e) || intervalE) {
          return;
        }
        intervalE = startHorizontal(1, elemPosition, calculateItemPosition, lastMouse);
      } else if (lastMouse.pageX > e.pageX && gridsterElement.scrollLeft > 0 && elemLeftOffset < scrollSensitivity) {
        cancelE();
        if ((resizeEvent && !resizeEventType.w) || intervalW) {
          return;
        }
        intervalW = startHorizontal(-1, elemPosition, calculateItemPosition, lastMouse);
      } else if (lastMouse.pageX !== e.pageX) {
        cancelHorizontal();
      }
    }

    function startVertical(sign, elemPosition, calculateItemPosition, lastMouse) {
      return $interval(function () {
        if (!gridsterElement || sign === -1 && gridsterElement.scrollTop - scrollSpeed < 0) {
          cancelVertical();
        }
        gridsterElement.scrollTop += sign * scrollSpeed;
        if (resizeEvent) {
          if (resizeEventType.n) {
            elemPosition[1] += sign * scrollSpeed;
            elemPosition[3] -= sign * scrollSpeed;
          } else {
            elemPosition[3] += sign * scrollSpeed;
          }
        } else {
          elemPosition[1] += sign * scrollSpeed;
        }

        calculateItemPosition(lastMouse);
      }, intervalDuration, 0, false);
    }

    function startHorizontal(sign, elemPosition, calculateItemPosition, lastMouse) {
      return $interval(function () {
        if (!gridsterElement || sign === -1 && gridsterElement.scrollLeft - scrollSpeed < 0) {
          cancelHorizontal();
        }
        gridsterElement.scrollLeft += sign * scrollSpeed;
        if (resizeEvent) {
          if (resizeEventType.w) {
            elemPosition[0] += sign * scrollSpeed;
            elemPosition[2] -= sign * scrollSpeed;
          } else {
            elemPosition[2] += sign * scrollSpeed;
          }
        } else {
          elemPosition[0] += sign * scrollSpeed;
        }

        calculateItemPosition(lastMouse);
      }, intervalDuration, 0, false);
    }

    function cancelScroll() {
      cancelHorizontal();
      cancelVertical();
      scrollSensitivity = undefined;
      scrollSpeed = undefined;
      gridsterElement = undefined;
      resizeEventType = undefined;
    }

    function cancelHorizontal() {
      cancelE();
      cancelW();
    }

    function cancelVertical() {
      cancelN();
      cancelS();
    }

    function cancelE() {
      if (intervalE) {
        $interval.cancel(intervalE);
        intervalE = undefined;
      }
    }

    function cancelW() {
      if (intervalW) {
        $interval.cancel(intervalW);
        intervalW = undefined;
      }
    }

    function cancelS() {
      if (intervalS) {
        $interval.cancel(intervalS);
        intervalS = undefined;
      }
    }

    function cancelN() {
      if (intervalN) {
        $interval.cancel(intervalN);
        intervalN = undefined;
      }
    }

    return {
      scroll: scroll,
      cancelScroll: cancelScroll
    };

  }
})();

(function () {
  'use strict';

  gridsterResizable.$inject = ["$document", "gridsterScroll"];
  angular.module('angular-gridster2').factory('gridsterResizable', gridsterResizable);

  /** @ngInject */
  function gridsterResizable($document, gridsterScroll) {

    function GridsterResizable($element, scope) {

      var enabled, dragHandles = [], handlesIndex, dragHandleElement, lastMouse = {},
        elemPosition = [0, 0], directionFunction, position = [0, 0], itemBackup = [0, 0, 0, 0], itemCopy,
        resizeEventScrollType;

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
        lastMouse.pageX = e.pageX;
        lastMouse.pageY = e.pageY;
        elemPosition[0] = parseInt($element[0].style.left, 10);
        elemPosition[1] = parseInt($element[0].style.top, 10);
        elemPosition[2] = $element[0].offsetWidth;
        elemPosition[3] = $element[0].offsetHeight;
        itemCopy = angular.copy(scope.gridsterItem);
        scope.gridster.movingItem = scope.gridsterItem;
        scope.gridster.previewStyle();

        resizeEventScrollType = {};
        if (this.classList.contains('handle-n')) {
          resizeEventScrollType.n = true;
          directionFunction = handleN;
        } else if (this.classList.contains('handle-w')) {
          resizeEventScrollType.w = true;
          directionFunction = handleW;
        } else if (this.classList.contains('handle-s')) {
          resizeEventScrollType.s = true;
          directionFunction = handleS;
        } else if (this.classList.contains('handle-e')) {
          resizeEventScrollType.e = true;
          directionFunction = handleE;
        } else if (this.classList.contains('handle-nw')) {
          resizeEventScrollType.n = true;
          resizeEventScrollType.w = true;
          directionFunction = handleNW;
        } else if (this.classList.contains('handle-ne')) {
          resizeEventScrollType.n = true;
          resizeEventScrollType.e = true;
          directionFunction = handleNE;
        } else if (this.classList.contains('handle-sw')) {
          resizeEventScrollType.s = true;
          resizeEventScrollType.w = true;
          directionFunction = handleSW;
        } else if (this.classList.contains('handle-se')) {
          resizeEventScrollType.s = true;
          resizeEventScrollType.e = true;
          directionFunction = handleSE;
        }
      }

      function dragMove(e) {
        e.preventDefault();
        e.stopPropagation();
        if (angular.isUndefined(e.pageX) && e.touches) {
          touchEvent(e);
        }

        gridsterScroll.scroll(elemPosition, scope, e, lastMouse, directionFunction, true, resizeEventScrollType);

        directionFunction(e);

        lastMouse.pageX = e.pageX;
        lastMouse.pageY = e.pageY;
      }

      function dragStop(e) {
        e.preventDefault();
        e.stopPropagation();
        gridsterScroll.cancelScroll();
        $document[0].removeEventListener('mousemove', dragMove);
        $document[0].removeEventListener('mouseup', dragStop);
        $document[0].removeEventListener('touchmove', dragMove);
        $document[0].removeEventListener('touchend', dragStop);
        $document[0].removeEventListener('touchcancel', dragStop);
        $element.removeClass('gridster-item-resizing');
        scope.gridster.movingItem = null;
        scope.gridster.previewStyle();
        scope.gridsterItem.setSize(true);
        scope.gridsterItem.checkItemChanges(scope.gridsterItem, itemCopy);
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
        elemPosition[1] += e.pageY - lastMouse.pageY;
        elemPosition[3] += lastMouse.pageY - e.pageY;
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
        elemPosition[0] += e.pageX - lastMouse.pageX;
        elemPosition[2] += lastMouse.pageX - e.pageX;
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
        elemPosition[3] += e.pageY - lastMouse.pageY;
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
        elemPosition[2] += e.pageX - lastMouse.pageX;
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
})();

(function () {
  'use strict';
  angular.module('angular-gridster2').directive('gridsterPreview', gridsterPreview);

  function gridsterPreview() {
    return {
      restrict: 'A',
      replace: true,
      template: '<div class="gridster-preview-holder"></div>',
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

  gridsterItem.$inject = ["gridsterDraggable", "gridsterResizable"];
  angular.module('angular-gridster2').directive('gridsterItem', gridsterItem);

  /** @ngInject */
  function gridsterItem(gridsterDraggable, gridsterResizable) {
    function link(scope, element, attributes) {
      var item = scope.$eval(attributes.gridsterItem);
      scope.gridsterItem = {
        cols: item.cols,
        rows: item.rows,
        x: item.x,
        y: item.y,
        initCallback: item.initCallback,
        setSize: setSize,
        checkItemChanges: checkItemChanges,
        drag: new gridsterDraggable(element, scope),
        resize: new gridsterResizable(element, scope)
      };

      var itemTop, itemLeft, itemWidth, itemHeight, top, left, width, height, itemMargin;

      function setSize(noCheck) {
        if (scope.gridster.mobile) {
          top = 0;
          left = 0;
          width = scope.gridster.curWidth - (scope.gridster.outerMargin ? 2 * scope.gridster.margin : 0);
          height = width / 2;
        } else {
          top = scope.gridsterItem.y * scope.gridster.curRowHeight;
          left = scope.gridsterItem.x * scope.gridster.curColWidth;
          width = scope.gridsterItem.cols * scope.gridster.curColWidth - scope.gridster.margin;
          height = scope.gridsterItem.rows * scope.gridster.curRowHeight - scope.gridster.margin;
        }
        if (!noCheck && top === itemTop && left === itemLeft && width === itemWidth && height === itemHeight) {
          return;
        }
        if (scope.gridster.outerMargin) {
          itemMargin = scope.gridster.margin;
        } else {
          itemMargin = 0;
        }
        element.css({
          display: 'block',
          top: top + 'px',
          left: left + 'px',
          width: width + 'px',
          height: height + 'px',
          margin: itemMargin + 'px'
        });
        if (width !== itemWidth || height !== itemHeight) {
          scope.$broadcast('gridster-item-resize');
        }
        itemTop = top;
        itemLeft = left;
        itemWidth = width;
        itemHeight = height;
      }

      function checkItemChanges(newValue, oldValue) {
        if (newValue.rows === oldValue.rows && newValue.cols === oldValue.cols && newValue.x === oldValue.x && newValue.y === oldValue.y) {
          return;
        }
        if (newValue.rows < scope.gridster.minItemRows || newValue.cols < scope.gridster.minItemCols ||
          scope.gridster.checkCollision(scope.gridsterItem)) {
          scope.gridsterItem.x = oldValue.x;
          scope.gridsterItem.y = oldValue.y;
          scope.gridsterItem.cols = oldValue.cols;
          scope.gridsterItem.rows = oldValue.rows;
        } else {
          item.cols = scope.gridsterItem.cols;
          item.rows = scope.gridsterItem.rows;
          item.x = scope.gridsterItem.x;
          item.y = scope.gridsterItem.y;
          scope.$broadcast('gridster-item-change');
          scope.gridster.calculateLayout();
          if (scope.gridster.itemChangeCallback) {
            scope.gridster.itemChangeCallback(scope.gridsterItem, scope);
          }
        }
      }

      scope.$on('$destroy', function () {
        scope.gridsterItem.drag.toggle(false);
        scope.gridster.removeItem(scope.gridsterItem);
      });

      scope.gridster.addItem(scope.gridsterItem);
    }

    return {
      restrict: 'A',
      link: link
    }
  }
})();

(function () {
  'use strict';

  gridsterDraggable.$inject = ["$document", "gridsterScroll"];
  angular.module('angular-gridster2').factory('gridsterDraggable', gridsterDraggable);

  /** @ngInject */
  function gridsterDraggable($document, gridsterScroll) {

    function GridsterDraggable($element, scope) {

      var enabled, lastMouse = {}, elemPosition = [0, 0, 0, 0], position = [0, 0], positionBackup = [0, 0], itemCopy;

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
        lastMouse.pageX = e.pageX;
        lastMouse.pageY = e.pageY;
        elemPosition[0] = parseInt($element[0].style.left, 10);
        elemPosition[1] = parseInt($element[0].style.top, 10);
        elemPosition[2] = $element[0].offsetWidth;
        elemPosition[3] = $element[0].offsetHeight;
        itemCopy = angular.copy(scope.gridsterItem);
        scope.gridster.movingItem = scope.gridsterItem;
        scope.gridster.previewStyle();

      }

      function dragMove(e) {
        e.preventDefault();
        e.stopPropagation();
        if (angular.isUndefined(e.pageX) && e.touches) {
          touchEvent(e);
        }
        elemPosition[0] += e.pageX - lastMouse.pageX;
        elemPosition[1] += e.pageY - lastMouse.pageY;

        gridsterScroll.scroll(elemPosition, scope, e, lastMouse, calculateItemPosition);

        lastMouse.pageX = e.pageX;
        lastMouse.pageY = e.pageY;

        calculateItemPosition();
      }

      function dragStop(e) {
        e.preventDefault();
        e.stopPropagation();
        gridsterScroll.cancelScroll();
        $document[0].removeEventListener('mousemove', dragMove);
        $document[0].removeEventListener('mouseup', dragStop);
        $document[0].removeEventListener('touchmove', dragMove);
        $document[0].removeEventListener('touchend', dragStop);
        $document[0].removeEventListener('touchcancel', dragStop);
        $element.removeClass('gridster-item-moving');
        scope.gridster.movingItem = null;
        scope.gridsterItem.setSize(true);
        scope.gridster.previewStyle();
        scope.gridsterItem.checkItemChanges(scope.gridsterItem, itemCopy);
        if (scope.gridster.draggable.stop) {
          scope.gridster.draggable.stop(scope.gridsterItem, scope);
        }
      }

      function calculateItemPosition() {
        $element.css({
          'left': elemPosition[0] + 'px',
          'top': elemPosition[1] + 'px'
        });
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
})();

(function () {
  'use strict';
  gridster.$inject = ["$window", "$compile"];
  angular.module('angular-gridster2').directive('gridster', gridster);

  /** @ngInject */
  function gridster($window, $compile) {

    function link(scope, element, attributes, gridster) {
      var gridsterPreview = '<div gridster-preview></div>';
      element.append($compile(gridsterPreview)(scope));
      var scrollBarPresent;

      scope.$watch(attributes.gridster, function (options) {
        gridster.setOptions(options);
      }, true);

      function setGridSize() {
        if (gridster.gridType === 'fit' && !gridster.mobile) {
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

        if (scrollBarPresent && element[0].scrollWidth <= element[0].offsetWidth &&
          element[0].offsetHeight - element[0].clientHeight >= element[0].scrollWidth - element[0].offsetWidth) {
          scrollBarPresent = !scrollBarPresent;
          gridster.onResize();
        } else if (!scrollBarPresent && element[0].scrollWidth > element[0].offsetWidth &&
          element[0].offsetHeight - element[0].clientHeight < element[0].scrollWidth - element[0].offsetWidth) {
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
})();

(function () {
  'use strict';
  GridsterController.$inject = ["$scope", "gridsterConfig", "$log"];
  angular.module('angular-gridster2')
    .controller('GridsterController', GridsterController);

  /** @ngInject */
  function GridsterController($scope, gridsterConfig, $log) {
    var vm = this;
    vm.mobile = false;

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
      if (vm.gridType === 'fit') {
        vm.curColWidth = Math.floor((vm.curWidth + (vm.outerMargin ? -vm.margin : vm.margin)) / vm.columns);
        vm.curRowHeight = Math.floor((vm.curHeight + (vm.outerMargin ? -vm.margin : vm.margin)) / vm.rows);
        vm.element.addClass('fit');
        vm.element.removeClass('scrollVertical');
        vm.element.removeClass('scrollHorizontal');
      } else if (vm.gridType === 'scrollVertical') {
        vm.curColWidth = Math.floor((vm.curWidth + (vm.outerMargin ? -vm.margin : vm.margin)) / vm.columns);
        vm.curRowHeight = vm.curColWidth;
        vm.element.addClass('scrollVertical');
        vm.element.removeClass('fit');
        vm.element.removeClass('scrollHorizontal');
      } else if (vm.gridType === 'scrollHorizontal') {
        vm.curRowHeight = Math.floor((vm.curHeight + (vm.outerMargin ? -vm.margin : vm.margin)) / vm.rows);
        vm.curColWidth = vm.curRowHeight;
        vm.element.addClass('scrollHorizontal');
        vm.element.removeClass('fit');
        vm.element.removeClass('scrollVertical');
      }

      if (!vm.mobile && vm.mobileBreakpoint > vm.curWidth) {
        vm.mobile = !vm.mobile;
        vm.element.addClass('mobile');
      } else if (vm.mobile && vm.mobileBreakpoint < vm.curWidth) {
        vm.mobile = !vm.mobile;
        vm.element.removeClass('mobile');
      }

      var widgetsIndex = vm.grid.length - 1;
      for (; widgetsIndex >= 0; widgetsIndex--) {
        vm.grid[widgetsIndex].setSize();
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
      } else if (vm.checkCollision(item)) {
        $log.warn('Can\'t be placed in the bounds of the dashboard!', item);
        return;
      }
      vm.grid.push(item);
      vm.calculateLayout();
      if (item.initCallback) {
        item.initCallback(item);
      }
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
      if (vm.rows >= vm.columns && vm.maxCols > vm.columns) {
        item.x = vm.columns;
        item.y = 0;
      } else if (vm.maxRows > vm.rows) {
        item.y = vm.rows;
        item.x = 0;
      } else {
        $log.warn('Can\'t be placed in the bounds of the dashboard!', item);
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
})();

(function () {
  'use strict';

  angular.module('angular-gridster2')
    .constant('gridsterConfig', {
      gridType: 'fit', // 'fit' will fit the items in the container without scroll;
      // 'scrollVertical' will fit on width and height of the items will be the same as the width
      // 'scrollHorizontal' will fit on height and width of the items will be the same as the height
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
      scrollSensitivity: 10, //margin of the dashboard where to start scrolling
      scrollSpeed: 10, //how much to scroll each mouse move when in the scrollSensitivity zone
      itemChangeCallback: undefined, //callback to call for each item when is changes x, y, rows, cols. Arguments:gridsterItem, scope
      draggable: {
        enabled: false, // enable/disable draggable items
        stop: undefined // callback when dragging an item stops. Arguments: gridsterItem, scope
      },
      resizable: {
        enabled: false, // enable/disable resizable items
        handles: ['s', 'e', 'n', 'w', 'se', 'ne', 'sw', 'nw'], // resizable edges of an item
        stop: undefined // callback when resizing an item stops. Arguments: gridsterItem, scope
      }
    });
})();
