(function () {
  'use strict';

  angular.module('angular-gridster2').factory('gridsterResizable', gridsterResizable);

  /** @ngInject */
  function gridsterResizable($document) {

    function GridsterResizable($element, scope) {

      var enabled, dragHandles = [], handlesIndex, dragHandleElement, scrollSensitivity, scrollSpeed, lastMouse = [0, 0],
        elemPosition = [0, 0], directionFunction, position = [0, 0], itemBackup = [0, 0, 0, 0], elemBottomOffset,
        elemRightOffset, itemCopy;

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
        itemCopy = angular.copy(scope.gridsterItem);
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
})();
