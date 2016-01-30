(function () {
  'use strict';

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
