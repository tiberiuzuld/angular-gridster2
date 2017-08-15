(function () {
  'use strict';

  angular.module('angular-gridster2')
    .service('GridsterUtils', function () {
      function merge(obj1, obj2, properties) {
        for (var p in obj2) {
          if (obj2.hasOwnProperty(p) && properties.hasOwnProperty(p)) {
            if (typeof obj2[p] === 'object') {
              obj1[p] = merge(obj1[p], obj2[p], properties[p]);
            } else {
              obj1[p] = obj2[p];
            }
          }
        }

        return obj1;
      }

      function debounce(func, wait) {
        var timeout;
        return function () {
          var context = this, args = arguments;
          var later = function () {
            timeout = null;
            func.apply(context, args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      }

      function checkTouchEvent(e) {
        if (e.clientX === undefined && e.touches) {
          e.clientX = e.touches[0].clientX;
          e.clientY = e.touches[0].clientY;
        }
      }

      function checkContentClassForEvent(gridster, e) {
        if (gridster.$options.draggable.ignoreContent) {
          if (!checkContentClass(e.target, e.currentTarget, gridster.$options.draggable.dragHandleClass)) {
            return true;
          }
        } else {
          if (checkContentClass(e.target, e.currentTarget, gridster.$options.draggable.ignoreContentClass)) {
            return true;
          }
        }
        return false;
      }

      function checkContentClass(target, current, contentClass) {
        if (target === current) {
          return false;
        }
        if (target.classList && target.classList.contains(contentClass)) {
          return true;
        } else {
          return checkContentClass(target.parentNode, current, contentClass);
        }
      }

      return {
        merge: merge,
        debounce: debounce,
        checkTouchEvent: checkTouchEvent,
        checkContentClassForEvent: checkContentClassForEvent
      }
    });
})();
