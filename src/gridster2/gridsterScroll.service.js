(function () {
  'use strict';

  angular.module('angular-gridster2')
    .service('GridsterScroll', function () {
      var scrollSensitivity;
      var scrollSpeed;
      var intervalDuration = 50;
      var gridsterElement;
      var resizeEvent;
      var resizeEventType;
      var intervalE;
      var intervalW;
      var intervalN;
      var intervalS;

      function scroll(gridsterItem, e, lastMouse, calculateItemPosition, resize, resizeEventScrollType) {
        var vm = this;
        scrollSensitivity = gridsterItem.gridster.$options.scrollSensitivity;
        scrollSpeed = gridsterItem.gridster.$options.scrollSpeed;
        gridsterElement = gridsterItem.gridster.el;
        resizeEvent = resize;
        resizeEventType = resizeEventScrollType;

        var offsetWidth = gridsterElement.offsetWidth;
        var offsetHeight = gridsterElement.offsetHeight;
        var offsetLeft = gridsterElement.scrollLeft;
        var offsetTop = gridsterElement.scrollTop;
        var elemTopOffset = gridsterItem.nativeEl.offsetTop - offsetTop;
        var elemBottomOffset = offsetHeight + offsetTop - gridsterItem.nativeEl.offsetTop - gridsterItem.nativeEl.offsetHeight;
        if (lastMouse.clientY < e.clientY && elemBottomOffset < scrollSensitivity) {
          cancelN();
          if ((resizeEvent && resizeEventType && !resizeEventType.s) || intervalS) {
            return;
          }
          intervalS = startVertical(1, calculateItemPosition, lastMouse);
        } else if (lastMouse.clientY > e.clientY && offsetTop > 0 && elemTopOffset < scrollSensitivity) {
          cancelS();
          if ((resizeEvent && resizeEventType &&!resizeEventType.n) || intervalN) {
            return;
          }
          intervalN = startVertical(-1, calculateItemPosition, lastMouse);
        } else if (lastMouse.clientY !== e.clientY) {
          cancelVertical();
        }

        var elemRightOffset = offsetLeft + offsetWidth - gridsterItem.nativeEl.offsetLeft - gridsterItem.nativeEl.offsetWidth;
        var elemLeftOffset = gridsterItem.nativeEl.offsetLeft - offsetLeft;
        if (lastMouse.clientX < e.clientX && elemRightOffset <= scrollSensitivity) {
          cancelW();
          if ((resizeEvent && resizeEventType && !resizeEventType.e) || intervalE) {
            return;
          }
          intervalE = startHorizontal(1, calculateItemPosition, lastMouse);
        } else if (lastMouse.clientX > e.clientX && offsetLeft > 0 && elemLeftOffset < scrollSensitivity) {
          cancelE();
          if ((resizeEvent && resizeEventType && !resizeEventType.w) || intervalW) {
            return;
          }
          intervalW = startHorizontal(-1, calculateItemPosition, lastMouse);
        } else if (lastMouse.clientX !== e.clientX) {
          cancelHorizontal();
        }
        return vm;
      }

      scroll.cancelScroll = cancelScroll;
      return scroll;

      function startVertical(sign, calculateItemPosition, lastMouse) {
        var clientY = lastMouse.clientY;
        return setInterval(function () {
          if (!gridsterElement || sign === -1 && gridsterElement.scrollTop - scrollSpeed < 0) {
            cancelVertical();
          }
          gridsterElement.scrollTop += sign * scrollSpeed;
          clientY += sign * scrollSpeed;
          calculateItemPosition({clientX: lastMouse.clientX, clientY: clientY});
        }, intervalDuration);
      }

      function startHorizontal(sign, calculateItemPosition, lastMouse) {
        var clientX = lastMouse.clientX;
        return setInterval(function () {
          if (!gridsterElement || sign === -1 && gridsterElement.scrollLeft - scrollSpeed < 0) {
            cancelHorizontal();
          }
          gridsterElement.scrollLeft += sign * scrollSpeed;
          clientX += sign * scrollSpeed;
          calculateItemPosition({clientX: clientX, clientY: lastMouse.clientY});
        }, intervalDuration);
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
          clearInterval(intervalE);
          intervalE = undefined;
        }
      }

      function cancelW() {
        if (intervalW) {
          clearInterval(intervalW);
          intervalW = undefined;
        }
      }

      function cancelS() {
        if (intervalS) {
          clearInterval(intervalS);
          intervalS = undefined;
        }
      }

      function cancelN() {
        if (intervalN) {
          clearInterval(intervalN);
          intervalN = undefined;
        }
      }

    });
})();
