(function () {
  'use strict';

  angular.module('angular-gridster2').factory('gridsterDraggable', gridsterDraggable);

  /** @ngInject */
  function gridsterDraggable($document) {

    function GridsterDraggable($element, scope) {

      var enabled, lastMouse = [0, 0], elemPosition = [0, 0, 0, 0], position = [0, 0], positionBackup = [0, 0],
        scrollSensitivity, scrollSpeed, elemBottomOffset, elemRightOffset, itemCopy;

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
        itemCopy = angular.copy(scope.gridsterItem);
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
        scope.gridsterItem.checkItemChanges(scope.gridsterItem, itemCopy);
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
})();
