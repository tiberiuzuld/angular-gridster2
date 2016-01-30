(function () {
  'use strict';

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
