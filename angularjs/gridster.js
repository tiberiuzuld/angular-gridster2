/*
 Angular Gridster 2
 (c) 2017 Tiberiu Zuld
 License: MIT
 */

(function () {
  'use strict';

  angular.module('angular-gridster2', []);

})();

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
          if (e.touches && e.touches.length) {
            e.clientX = e.touches[0].clientX;
            e.clientY = e.touches[0].clientY;
          } else if (e.changedTouches && e.changedTouches.length) {
            e.clientX = e.changedTouches[0].clientX;
            e.clientY = e.changedTouches[0].clientY;
          }
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

(function () {
  'use strict';

  angular.module('angular-gridster2')
    .service('GridsterSwap', function () {
      return function (gridsterItem) {
        var vm = this;
        vm.swapedItem = undefined;
        vm.gridsterItem = gridsterItem;
        vm.gridster = gridsterItem.gridster;

        vm.destroy = function () {
          delete vm.gridster;
          delete vm.gridsterItem;
          delete vm.swapedItem;
        };

        vm.swapItems = function () {
          if (vm.gridster.$options.swap) {
            vm.checkSwapBack();
            vm.checkSwap(vm.gridsterItem);
          }
        };

        vm.checkSwapBack = function () {
          if (vm.swapedItem) {
            var x = vm.swapedItem.$item.x;
            var y = vm.swapedItem.$item.y;
            vm.swapedItem.$item.x = vm.swapedItem.item.x;
            vm.swapedItem.$item.y = vm.swapedItem.item.y;
            if (vm.gridster.checkCollision(vm.swapedItem.$item)) {
              vm.swapedItem.$item.x = x;
              vm.swapedItem.$item.y = y;
            } else {
              vm.swapedItem.setSize(true);
              vm.gridsterItem.$item.x = vm.gridsterItem.item.x;
              vm.gridsterItem.$item.y = vm.gridsterItem.item.y;
              vm.swapedItem = undefined;
            }

          }
        };

        vm.restoreSwapItem = function () {
          if (vm.swapedItem) {
            vm.swapedItem.$item.x = vm.swapedItem.item.x;
            vm.swapedItem.$item.y = vm.swapedItem.item.y;
            vm.swapedItem.setSize(true);
            vm.swapedItem = undefined;
          }
        };

        vm.setSwapItem = function () {
          if (vm.swapedItem) {
            vm.swapedItem.checkItemChanges(vm.swapedItem.$item, vm.swapedItem.item);
            vm.swapedItem = undefined;
          }
        };

        vm.checkSwap = function (pushedBy) {
          var gridsterItemCollision = vm.gridster.checkCollision(pushedBy.$item);
          if (gridsterItemCollision && gridsterItemCollision !== true && gridsterItemCollision.canBeDragged()) {
            var gridsterItemCollide = gridsterItemCollision;
            var copyCollisionX = gridsterItemCollide.$item.x;
            var copyCollisionY = gridsterItemCollide.$item.y;
            var copyX = pushedBy.$item.x;
            var copyY = pushedBy.$item.y;
            gridsterItemCollide.$item.x = pushedBy.item.x;
            gridsterItemCollide.$item.y = pushedBy.item.y;
            pushedBy.$item.x = gridsterItemCollide.item.x;
            pushedBy.$item.y = gridsterItemCollide.item.y;
            if (vm.gridster.checkCollision(gridsterItemCollide.$item) || vm.gridster.checkCollision(pushedBy.$item)) {
              pushedBy.$item.x = copyX;
              pushedBy.$item.y = copyY;
              gridsterItemCollide.$item.x = copyCollisionX;
              gridsterItemCollide.$item.y = copyCollisionY;
            } else {
              gridsterItemCollide.setSize(true);
              vm.swapedItem = gridsterItemCollide;
            }
          }
        };
        return vm;
      }
    });
})();

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

(function () {
  'use strict';

  GridsterResizable.$inject = ["GridsterPush", "GridsterScroll", "GridsterUtils", "GridsterPushResize"];
  angular.module('angular-gridster2')
    .service('GridsterResizable', GridsterResizable);

  /** @ngInject */
  function GridsterResizable(GridsterPush, GridsterScroll, GridsterUtils, GridsterPushResize) {
    return function (gridsterItem, gridster) {
      var vm = this;

      vm.directionFunction = angular.noop;
      vm.dragStartFunction = angular.noop;
      vm.dragFunction = angular.noop;
      vm.dragStopFunction = angular.noop;
      vm.resizeEnabled = false;
      vm.push = undefined;
      vm.pushResize = undefined;
      vm.minHeight = 0;
      vm.minWidth = 0;
      vm.offsetTop = 0;
      vm.offsetLeft = 0;
      vm.diffTop = 0;
      vm.diffLeft = 0;
      vm.diffRight = 0;
      vm.diffBottom = 0;
      vm.margin = 0;
      vm.top = 0;
      vm.left = 0;
      vm.bottom = 0;
      vm.right = 0;
      vm.width = 0;
      vm.height = 0;
      vm.newPosition = 0;

      vm.gridsterItem = gridsterItem;
      vm.gridster = gridster;
      vm.lastMouse = {
        clientX: 0,
        clientY: 0
      };
      vm.itemBackup = [0, 0, 0, 0];
      vm.resizeEventScrollType = {
        w: false,
        e: false,
        n: false,
        s: false
      };

      vm.destroy = function () {
        delete vm.gridster;
        delete vm.gridsterItem;
      };

      vm.dragStart = function (e) {
        switch (e.which) {
          case 1:
            // left mouse button
            break;
          case 2:
          case 3:
            // right or middle mouse button
            return;
        }
        if (vm.gridster.$options.resizable.start) {
          vm.gridster.$options.resizable.start(vm.gridsterItem.item, vm.gridsterItem, e);
        }
        e.stopPropagation();
        e.preventDefault();
        vm.dragFunction = vm.dragMove.bind(vm);
        vm.dragStopFunction = vm.dragStop.bind(vm);
        document.addEventListener('mousemove', vm.dragFunction);
        document.addEventListener('mouseup', vm.dragStopFunction);
        window.addEventListener('blur', vm.dragStopFunction);
        vm.gridster.el.addEventListener('touchmove', vm.dragFunction);
        document.addEventListener('touchend', vm.dragStopFunction);
        document.addEventListener('touchcancel', vm.dragStopFunction);
        vm.gridsterItem.el.addClass('gridster-item-resizing');
        vm.lastMouse.clientX = e.clientX;
        vm.lastMouse.clientY = e.clientY;
        vm.left = vm.gridsterItem.left;
        vm.top = vm.gridsterItem.top;
        vm.width = vm.gridsterItem.width;
        vm.height = vm.gridsterItem.height;
        vm.bottom = vm.gridsterItem.top + vm.gridsterItem.height;
        vm.right = vm.gridsterItem.left + vm.gridsterItem.width;
        vm.margin = vm.gridster.$options.margin;
        vm.offsetLeft = vm.gridster.el.scrollLeft - vm.gridster.el.offsetLeft;
        vm.offsetTop = vm.gridster.el.scrollTop - vm.gridster.el.offsetTop;
        vm.diffLeft = e.clientX + vm.offsetLeft - vm.margin - vm.left;
        vm.diffRight = e.clientX + vm.offsetLeft - vm.margin - vm.right;
        vm.diffTop = e.clientY + vm.offsetTop - vm.margin - vm.top;
        vm.diffBottom = e.clientY + vm.offsetTop - vm.margin - vm.bottom;
        vm.minHeight = vm.gridster.positionYToPixels(vm.gridsterItem.$item.minItemRows ||
          vm.gridster.$options.minItemRows) - vm.margin;
        vm.minWidth = vm.gridster.positionXToPixels(vm.gridsterItem.$item.minItemCols ||
          vm.gridster.$options.minItemCols) - vm.margin;
        vm.gridster.movingItem = vm.gridsterItem.$item;
        vm.gridster.previewStyle();
        vm.push = new GridsterPush(vm.gridsterItem);
        vm.pushResize = new GridsterPushResize(vm.gridsterItem);
        vm.gridster.dragInProgress = true;
        vm.gridster.gridLines.updateGrid();

        if (e.target.classList.contains('handle-n')) {
          vm.resizeEventScrollType.n = true;
          vm.directionFunction = vm.handleN.bind(vm);
        } else if (e.target.classList.contains('handle-w')) {
          vm.resizeEventScrollType.w = true;
          vm.directionFunction = vm.handleW.bind(vm);
        } else if (e.target.classList.contains('handle-s')) {
          vm.resizeEventScrollType.s = true;
          vm.directionFunction = vm.handleS.bind(vm);
        } else if (e.target.classList.contains('handle-e')) {
          vm.resizeEventScrollType.e = true;
          vm.directionFunction = vm.handleE.bind(vm);
        } else if (e.target.classList.contains('handle-nw')) {
          vm.resizeEventScrollType.n = true;
          vm.resizeEventScrollType.w = true;
          vm.directionFunction = vm.handleNW.bind(vm);
        } else if (e.target.classList.contains('handle-ne')) {
          vm.resizeEventScrollType.n = true;
          vm.resizeEventScrollType.e = true;
          vm.directionFunction = vm.handleNE.bind(vm);
        } else if (e.target.classList.contains('handle-sw')) {
          vm.resizeEventScrollType.s = true;
          vm.resizeEventScrollType.w = true;
          vm.directionFunction = vm.handleSW.bind(vm);
        } else if (e.target.classList.contains('handle-se')) {
          vm.resizeEventScrollType.s = true;
          vm.resizeEventScrollType.e = true;
          vm.directionFunction = vm.handleSE.bind(vm);
        }
      };

      vm.dragMove = function (e) {
        e.stopPropagation();
        e.preventDefault();
        GridsterUtils.checkTouchEvent(e);
        vm.offsetTop = vm.gridster.el.scrollTop - vm.gridster.el.offsetTop;
        vm.offsetLeft = vm.gridster.el.scrollLeft - vm.gridster.el.offsetLeft;
        GridsterScroll(vm.gridsterItem, e, vm.lastMouse, vm.directionFunction, true, vm.resizeEventScrollType);
        vm.directionFunction(e);

        vm.lastMouse.clientX = e.clientX;
        vm.lastMouse.clientY = e.clientY;
        vm.gridster.gridLines.updateGrid();
      };

      vm.dragStop = function (e) {
        e.stopPropagation();
        e.preventDefault();
        GridsterScroll.cancelScroll();
        document.removeEventListener('mousemove', vm.dragFunction);
        document.removeEventListener('mouseup', vm.dragStopFunction);
        window.removeEventListener('blur', vm.dragStopFunction);
        vm.gridster.el.removeEventListener('touchmove', vm.dragFunction);
        document.removeEventListener('touchend', vm.dragStopFunction);
        document.removeEventListener('touchcancel', vm.dragStopFunction);
        vm.gridsterItem.el.removeClass('gridster-item-resizing');
        vm.gridster.dragInProgress = false;
        vm.gridster.gridLines.updateGrid();
        if (vm.gridster.$options.resizable.stop) {
          var promise = vm.gridster.$options.resizable.stop(vm.gridsterItem.item, vm.gridsterItem, e);
          if (promise && promise.then) {
            promise.then(vm.makeResize.bind(vm), vm.cancelResize.bind(vm));
          } else {
            vm.makeResize();
          }
        } else {
          vm.makeResize();
        }
        setTimeout(function () {
          vm.gridster.movingItem = null;
          vm.gridster.previewStyle();
        });
      };

      vm.cancelResize = function () {
        vm.gridsterItem.$item.cols = vm.gridsterItem.item.cols;
        vm.gridsterItem.$item.rows = vm.gridsterItem.item.rows;
        vm.gridsterItem.$item.x = vm.gridsterItem.item.x;
        vm.gridsterItem.$item.y = vm.gridsterItem.item.y;
        vm.gridsterItem.setSize(true);
        vm.push.restoreItems();
        vm.pushResize.restoreItems();
        vm.push.destroy();
        delete vm.push;
        vm.pushResize.destroy();
        delete vm.pushResize;
      };

      vm.makeResize = function () {
        vm.gridsterItem.setSize(true);
        vm.gridsterItem.checkItemChanges(vm.gridsterItem.$item, vm.gridsterItem.item);
        vm.push.setPushedItems();
        vm.pushResize.setPushedItems();
        vm.push.destroy();
        delete vm.push;
        vm.pushResize.destroy();
        delete vm.pushResize;
      };

      vm.handleN = function (e) {
        vm.top = e.clientY + vm.offsetTop - vm.margin - vm.diffTop;
        vm.height = vm.bottom - vm.top;
        if (vm.minHeight > vm.height) {
          vm.height = vm.minHeight;
          vm.top = vm.bottom - vm.minHeight;
        }
        vm.newPosition = vm.gridster.pixelsToPositionY(vm.top, Math.floor);
        if (vm.gridsterItem.$item.y !== vm.newPosition) {
          vm.itemBackup[1] = vm.gridsterItem.$item.y;
          vm.itemBackup[3] = vm.gridsterItem.$item.rows;
          vm.gridsterItem.$item.rows += vm.gridsterItem.$item.y - vm.newPosition;
          vm.gridsterItem.$item.y = vm.newPosition;
          vm.pushResize.pushItems(vm.pushResize.fromSouth, vm.gridster.$options.disablePushOnResize);
          vm.push.pushItems(vm.push.fromSouth);
          if (vm.gridster.checkCollision(vm.gridsterItem.$item)) {
            vm.gridsterItem.$item.y = vm.itemBackup[1];
            vm.gridsterItem.$item.rows = vm.itemBackup[3];
            vm.gridsterItem.el.css('top', vm.gridster.positionYToPixels(vm.gridsterItem.$item.y) + 'px');
            vm.gridsterItem.el.css('height', vm.gridster.positionYToPixels(vm.gridsterItem.$item.rows)
              - vm.gridster.$options.margin + 'px');
            return;
          } else {
            vm.gridster.previewStyle();
          }
          vm.pushResize.checkPushBack();
          vm.push.checkPushBack();
        }
        vm.gridsterItem.el.css('top', vm.top + 'px');
        vm.gridsterItem.el.css('height', vm.height + 'px');
      };

      vm.handleW = function (e) {
        vm.left = e.clientX + vm.offsetLeft - vm.margin - vm.diffLeft;
        vm.width = vm.right - vm.left;
        if (vm.minWidth > vm.width) {
          vm.width = vm.minWidth;
          vm.left = vm.right - vm.minWidth;
        }
        vm.newPosition = vm.gridster.pixelsToPositionX(vm.left, Math.floor);
        if (vm.gridsterItem.$item.x !== vm.newPosition) {
          vm.itemBackup[0] = vm.gridsterItem.$item.x;
          vm.itemBackup[2] = vm.gridsterItem.$item.cols;
          vm.gridsterItem.$item.cols += vm.gridsterItem.$item.x - vm.newPosition;
          vm.gridsterItem.$item.x = vm.newPosition;
          vm.pushResize.pushItems(vm.pushResize.fromEast);
          vm.push.pushItems(vm.push.fromEast, vm.gridster.$options.disablePushOnResize);
          if (vm.gridster.checkCollision(vm.gridsterItem.$item)) {
            vm.gridsterItem.$item.x = vm.itemBackup[0];
            vm.gridsterItem.$item.cols = vm.itemBackup[2];
            vm.gridsterItem.el.css('left',
              vm.gridster.positionXToPixels(vm.gridsterItem.$item.x) + 'px');
            vm.gridsterItem.el.css('width', vm.gridster.positionXToPixels(vm.gridsterItem.$item.cols)
              - vm.gridster.$options.margin + 'px');
            return;
          } else {
            vm.gridster.previewStyle();
          }
          vm.pushResize.checkPushBack();
          vm.push.checkPushBack();
        }
        vm.gridsterItem.el.css('left', vm.left + 'px');
        vm.gridsterItem.el.css('width', vm.width + 'px');
      };

      vm.handleS = function (e) {
        vm.height = e.clientY + vm.offsetTop - vm.margin - vm.diffBottom - vm.top;
        if (vm.minHeight > vm.height) {
          vm.height = vm.minHeight;
        }
        vm.bottom = vm.top + vm.height;
        vm.newPosition = vm.gridster.pixelsToPositionY(vm.bottom, Math.ceil);
        if ((vm.gridsterItem.$item.y + vm.gridsterItem.$item.rows) !== vm.newPosition) {
          vm.itemBackup[3] = vm.gridsterItem.$item.rows;
          vm.gridsterItem.$item.rows = vm.newPosition - vm.gridsterItem.$item.y;
          vm.pushResize.pushItems(vm.pushResize.fromNorth);
          vm.push.pushItems(vm.push.fromNorth, vm.gridster.$options.disablePushOnResize);
          if (vm.gridster.checkCollision(vm.gridsterItem.$item)) {
            vm.gridsterItem.$item.rows = vm.itemBackup[3];
            vm.gridsterItem.el.css('height', vm.gridster.positionYToPixels(vm.gridsterItem.$item.rows)
              - vm.gridster.$options.margin + 'px');
            return;
          } else {
            vm.gridster.previewStyle();
          }
          vm.pushResize.checkPushBack();
          vm.push.checkPushBack();
        }
        vm.gridsterItem.el.css('height', vm.height + 'px');
      };

      vm.handleE = function (e) {
        vm.width = e.clientX + vm.offsetLeft - vm.margin - vm.diffRight - vm.left;
        if (vm.minWidth > vm.width) {
          vm.width = vm.minWidth;
        }
        vm.right = vm.left + vm.width;
        vm.newPosition = vm.gridster.pixelsToPositionX(vm.right, Math.ceil);
        if ((vm.gridsterItem.$item.x + vm.gridsterItem.$item.cols) !== vm.newPosition) {
          vm.itemBackup[2] = vm.gridsterItem.$item.cols;
          vm.gridsterItem.$item.cols = vm.newPosition - vm.gridsterItem.$item.x;
          vm.pushResize.pushItems(vm.pushResize.fromWest);
          vm.push.pushItems(vm.push.fromWest, vm.gridster.$options.disablePushOnResize);
          if (vm.gridster.checkCollision(vm.gridsterItem.$item)) {
            vm.gridsterItem.$item.cols = vm.itemBackup[2];
            vm.gridsterItem.el.css('width', vm.gridster.positionXToPixels(vm.gridsterItem.$item.cols)
              - vm.gridster.$options.margin + 'px');
            return;
          } else {
            vm.gridster.previewStyle();
          }
          vm.pushResize.checkPushBack();
          vm.push.checkPushBack();
        }
        vm.gridsterItem.el.css('width', vm.width + 'px');
      };

      vm.handleNW = function (e) {
        vm.handleN(e);
        vm.handleW(e);
      };

      vm.handleNE = function (e) {
        vm.handleN(e);
        vm.handleE(e);
      };

      vm.handleSW = function (e) {
        vm.handleS(e);
        vm.handleW(e);
      };

      vm.handleSE = function (e) {
        vm.handleS(e);
        vm.handleE(e);
      };

      vm.toggle = function () {
        var handlers, handler, i;
        var enableDrag = vm.gridsterItem.canBeResized();
        if (!vm.resizeEnabled && enableDrag) {
          vm.resizeEnabled = !vm.resizeEnabled;
          vm.dragStartFunction = vm.dragStartDelay;
          handlers = vm.gridsterItem.nativeEl.querySelectorAll('.gridster-item-resizable-handler');
          i = handlers.length - 1;
          for (; i > -1; i--) {
            handler = handlers[i];
            handler.addEventListener('mousedown', vm.dragStartFunction);
            handler.addEventListener('touchstart', vm.dragStartFunction);
          }
        } else if (vm.resizeEnabled && !enableDrag) {
          vm.resizeEnabled = !vm.resizeEnabled;
          handlers = vm.gridsterItem.nativeEl.querySelectorAll('.gridster-item-resizable-handler');
          i = handlers.length - 1;
          for (; i > -1; i--) {
            handler = handlers[i];
            handler.removeEventListener('mousedown', vm.dragStartFunction);
            handler.removeEventListener('touchstart', vm.dragStartFunction);
          }
        }
      };


      vm.dragStartDelay = function (e) {
        GridsterUtils.checkTouchEvent(e);
        if (!vm.gridster.$options.resizable.delayStart) {
          vm.dragStart(e);
          return;
        }
        var timeout = setTimeout(function () {
          vm.dragStart(e);
          cancelDrag();
        }, vm.gridster.$options.resizable.delayStart);
        document.addEventListener('mouseup', cancelDrag);
        window.addEventListener('blur', cancelDrag);
        document.addEventListener('touchmove', cancelMove);
        document.addEventListener('touchend', cancelDrag);
        document.addEventListener('touchcancel', cancelDrag);

        function cancelMove(eventMove) {
          GridsterUtils.checkTouchEvent(eventMove);
          if (Math.abs(eventMove.clientX - e.clientX) > 9 || Math.abs(eventMove.clientY - e.clientY) > 9) {
            cancelDrag();
          }
        }

        function cancelDrag() {
          clearTimeout(timeout);
          window.removeEventListener('blur', cancelDrag);
          document.removeEventListener('mouseup', cancelDrag);
          document.removeEventListener('touchmove', cancelMove);
          document.removeEventListener('touchend', cancelDrag);
          document.removeEventListener('touchcancel', cancelDrag);
        }
      }
    };
  }
})();

(function () {
  'use strict';

  angular.module('angular-gridster2')
    .service('GridsterPushResize', GridsterPushResize);

  /** @ngInject */
  function GridsterPushResize() {
    return function (gridsterItem) {
      var vm = this;
      vm.pushedItems = [];
      vm.pushedItemsPath = [];
      vm.gridsterItem = gridsterItem;
      vm.gridster = gridsterItem.gridster;

      vm.fromSouth = 'fromSouth';
      vm.fromNorth = 'fromNorth';
      vm.fromEast = 'fromEast';
      vm.fromWest = 'fromWest';

      vm.destroy = function () {
        delete vm.gridster;
        delete vm.gridsterItem;
      };

      vm.pushItems = function (direction) {
        if (vm.gridster.$options.pushResizeItems) {
          vm.push(vm.gridsterItem, direction);
        }
      };

      vm.restoreItems = function () {
        var i = 0;
        var l = vm.pushedItems.length;
        var pushedItem;
        for (; i < l; i++) {
          pushedItem = vm.pushedItems[i];
          pushedItem.$item.x = pushedItem.item.x;
          pushedItem.$item.y = pushedItem.item.y;
          pushedItem.$item.cols = pushedItem.item.cols;
          pushedItem.$item.row = pushedItem.item.row;
          pushedItem.setSize(true);
        }
        vm.pushedItems = undefined;
        vm.pushedItemsPath = undefined;
      };

      vm.setPushedItems = function () {
        var i = 0;
        var l = vm.pushedItems.length;
        var pushedItem;
        for (; i < l; i++) {
          pushedItem = vm.pushedItems[i];
          pushedItem.checkItemChanges(pushedItem.$item, pushedItem.item);
        }
        vm.pushedItems = undefined;
        vm.pushedItemsPath = undefined;
      };

      vm.push = function (gridsterItem, direction) {
        var gridsterItemCollision = vm.gridster.checkCollision(gridsterItem.$item);
        if (gridsterItemCollision && gridsterItemCollision !== true &&
          gridsterItemCollision !== vm.gridsterItem && gridsterItemCollision.canBeResized()) {
          if (vm.tryPattern[direction].call(vm, gridsterItemCollision, gridsterItem, direction)) {
            return true;
          }
        } else if (gridsterItemCollision === false) {
          return true;
        }
        return false;
      };

      vm.trySouth = function (gridsterItemCollide, gridsterItem, direction) {
        var backUpY = gridsterItemCollide.$item.y;
        var backUpRows = gridsterItemCollide.$item.rows;
        gridsterItemCollide.$item.y = gridsterItem.$item.y + gridsterItem.$item.rows;
        gridsterItemCollide.$item.rows = backUpRows + backUpY - gridsterItemCollide.$item.y;
        if (!vm.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
          && !vm.gridster.checkGridCollision(gridsterItemCollide.$item)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          vm.push(gridsterItem, direction);
          return true;
        } else {
          gridsterItemCollide.$item.y = backUpY;
          gridsterItemCollide.$item.rows = backUpRows;
        }
        return false;
      };

      vm.tryNorth = function (gridsterItemCollide, gridsterItem, direction) {
        var backUpRows = gridsterItemCollide.$item.rows;
        gridsterItemCollide.$item.rows = gridsterItem.$item.y - gridsterItemCollide.$item.y;
        if (!vm.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
          && !vm.gridster.checkGridCollision(gridsterItemCollide.$item)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          vm.push(gridsterItem, direction);
          return true;
        } else {
          gridsterItemCollide.$item.rows = backUpRows;
        }
        return false;
      };

      vm.tryEast = function (gridsterItemCollide, gridsterItem, direction) {
        var backUpX = gridsterItemCollide.$item.x;
        var backUpCols = gridsterItemCollide.$item.cols;
        gridsterItemCollide.$item.x = gridsterItem.$item.x + gridsterItem.$item.cols;
        gridsterItemCollide.$item.cols = backUpCols + backUpX - gridsterItemCollide.$item.x;
        if (!vm.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
          && !vm.gridster.checkGridCollision(gridsterItemCollide.$item)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          vm.push(gridsterItem, direction);
          return true;
        } else {
          gridsterItemCollide.$item.x = backUpX;
          gridsterItemCollide.$item.cols = backUpCols;
        }
        return false;
      };

      vm.tryWest = function (gridsterItemCollide, gridsterItem, direction) {
        var backUpCols = gridsterItemCollide.$item.cols;
        gridsterItemCollide.$item.cols = gridsterItem.$item.x - gridsterItemCollide.$item.x;
        if (!vm.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
          && !vm.gridster.checkGridCollision(gridsterItemCollide.$item)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          vm.push(gridsterItem, direction);
          return true;
        } else {
          gridsterItemCollide.$item.cols = backUpCols;
        }
        return false;
      };

      vm.tryPattern = {
        fromEast: vm.tryWest,
        fromWest: vm.tryEast,
        fromNorth: vm.trySouth,
        fromSouth: vm.tryNorth
      };

      vm.addToPushed = function (gridsterItem) {
        if (vm.pushedItems.indexOf(gridsterItem) < 0) {
          vm.pushedItems.push(gridsterItem);
          vm.pushedItemsPath.push([
            {
              x: gridsterItem.item.x,
              y: gridsterItem.item.y,
              cols: gridsterItem.item.cols,
              rows: gridsterItem.item.rows
            },
            {
              x: gridsterItem.$item.x,
              y: gridsterItem.$item.y,
              cols: gridsterItem.$item.cols,
              rows: gridsterItem.$item.rows
            }]);
        } else {
          var i = vm.pushedItems.indexOf(gridsterItem);
          vm.pushedItemsPath[i].push(
            {
              x: gridsterItem.$item.x,
              y: gridsterItem.$item.y,
              cols: gridsterItem.$item.cols,
              rows: gridsterItem.$item.rows
            });
        }
      };

      vm.removeFromPushed = function (i) {
        if (i > -1) {
          vm.pushedItems.splice(i, 1);
          vm.pushedItemsPath.splice(i, 1);
        }
      };

      vm.checkPushBack = function () {
        var i = vm.pushedItems.length - 1;
        var change = false;
        for (; i > -1; i--) {
          if (vm.checkPushedItem(vm.pushedItems[i], i)) {
            change = true;
          }
        }
        if (change) {
          vm.checkPushBack();
        }
      };

      vm.checkPushedItem = function (pushedItem, i) {
        var path = vm.pushedItemsPath[i];
        var j = path.length - 2;
        var lastPosition, x, y, cols, rows;
        for (; j > -1; j--) {
          lastPosition = path[j];
          x = pushedItem.$item.x;
          y = pushedItem.$item.y;
          cols = pushedItem.$item.cols;
          rows = pushedItem.$item.rows;
          pushedItem.$item.x = lastPosition.x;
          pushedItem.$item.y = lastPosition.y;
          pushedItem.$item.cols = lastPosition.cols;
          pushedItem.$item.rows = lastPosition.rows;
          if (!vm.gridster.findItemWithItem(pushedItem.$item)) {
            pushedItem.setSize(true);
            path.splice(j + 1, path.length - 1 - j);
          } else {
            pushedItem.$item.x = x;
            pushedItem.$item.y = y;
            pushedItem.$item.cols = cols;
            pushedItem.$item.rows = rows;
          }
        }
        if (path.length < 2) {
          vm.removeFromPushed(i);
          return true;
        }
        return false;
      }
    }
  }
})();

(function () {
  'use strict';

  angular.module('angular-gridster2')
    .service('GridsterPush', GridsterPush);

  /** @ngInject */
  function GridsterPush() {
    return function (gridsterItem) {
      var vm = this;

      vm.pushedItems = [];
      vm.pushedItemsPath = [];
      vm.pushedItemsTemp = [];
      vm.pushedItemsTempPath = [];
      vm.gridsterItem = gridsterItem;
      vm.gridster = gridsterItem.gridster;
      vm.fromSouth = 'fromSouth';
      vm.fromNorth = 'fromNorth';
      vm.fromEast = 'fromEast';
      vm.fromWest = 'fromWest';

      vm.destroy = function () {
        delete vm.gridster;
        delete vm.gridsterItem;
      };

      vm.pushItems = function (direction, disabled) {
        if (vm.gridster.$options.pushItems && !disabled) {
          vm.pushedItemsOrder = [];
          if (!vm.push(vm.gridsterItem, direction)) {
            vm.restoreTempItems();
          }
          vm.pushedItemsOrder = [];
          vm.pushedItemsTemp = [];
          vm.pushedItemsTempPath = [];
        }
      };

      vm.restoreTempItems = function () {
        var i = vm.pushedItemsTemp.length - 1;
        for (; i > -1; i--) {
          vm.removeFromTempPushed(vm.pushedItemsTemp[i]);
        }
      };

      vm.restoreItems = function () {
        var i = 0;
        var l = vm.pushedItems.length;
        var pushedItem;
        for (; i < l; i++) {
          pushedItem = vm.pushedItems[i];
          pushedItem.$item.x = pushedItem.item.x;
          pushedItem.$item.y = pushedItem.item.y;
          pushedItem.setSize(true);
        }
        vm.pushedItems = undefined;
        vm.pushedItemsPath = undefined;
      };

      vm.setPushedItems = function () {
        var i = 0;
        var l = vm.pushedItems.length;
        var pushedItem;
        for (; i < l; i++) {
          pushedItem = vm.pushedItems[i];
          pushedItem.checkItemChanges(pushedItem.$item, pushedItem.item);
        }
        vm.pushedItems = undefined;
        vm.pushedItemsPath = undefined;
      };

      vm.push = function (gridsterItem, direction) {
        if (vm.gridster.checkGridCollision(gridsterItem.$item)) {
          return false;
        }
        var a = vm.gridster.findItemsWithItem(gridsterItem.$item);
        var i = a.length - 1, itemCollision;
        var makePush = true;
        var b = [];
        for (; i > -1; i--) {
          itemCollision = a[i];
          if (itemCollision === vm.gridsterItem) {
            makePush = false;
            break;
          }
          if (!itemCollision.canBeDragged()) {
            makePush = false;
            break;
          }
          if (vm.pushedItemsTemp.indexOf(itemCollision) > -1) {
            makePush = false;
            break;
          }
          if (vm.tryPattern[direction][0].call(vm, itemCollision, gridsterItem)) {
            vm.pushedItemsOrder.push(itemCollision);
            b.push(itemCollision);
          } else if (vm.tryPattern[direction][1].call(vm, itemCollision, gridsterItem)) {
            vm.pushedItemsOrder.push(itemCollision);
            b.push(itemCollision);
          } else if (vm.tryPattern[direction][2].call(vm, itemCollision, gridsterItem)) {
            vm.pushedItemsOrder.push(itemCollision);
            b.push(itemCollision);
          } else if (vm.tryPattern[direction][3].call(vm, itemCollision, gridsterItem)) {
            vm.pushedItemsOrder.push(itemCollision);
            b.push(itemCollision);
          } else {
            makePush = false;
            break;
          }
        }
        if (!makePush) {
          i = vm.pushedItemsOrder.lastIndexOf(b[0]);
          if (i > -1) {
            var j = vm.pushedItemsOrder.length - 1;
            for (; j >= i; j--) {
              itemCollision = vm.pushedItemsOrder[j];
              vm.pushedItemsOrder.pop();
              vm.removeFromTempPushed(itemCollision);
              vm.removeFromPushedItem(itemCollision);
            }
          }
        }
        return makePush;
      };

      vm.trySouth = function (gridsterItemCollide, gridsterItem) {
        if (!vm.gridster.$options.pushDirections.south) {
          return false;
        }
        vm.addToTempPushed(gridsterItemCollide);
        gridsterItemCollide.$item.y = gridsterItem.$item.y + gridsterItem.$item.rows;
        if (vm.push(gridsterItemCollide, vm.fromNorth)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          return true;
        } else {
          vm.removeFromTempPushed(gridsterItemCollide);
        }
        return false;
      };

      vm.tryNorth = function (gridsterItemCollide, gridsterItem) {
        if (!vm.gridster.$options.pushDirections.north) {
          return false;
        }
        vm.addToTempPushed(gridsterItemCollide);
        gridsterItemCollide.$item.y = gridsterItem.$item.y - gridsterItemCollide.$item.rows;
        if (vm.push(gridsterItemCollide, vm.fromSouth)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          return true;
        } else {
          vm.removeFromTempPushed(gridsterItemCollide);
        }
        return false;
      };

      vm.tryEast = function (gridsterItemCollide, gridsterItem) {
        if (!vm.gridster.$options.pushDirections.east) {
          return false;
        }
        vm.addToTempPushed(gridsterItemCollide);
        gridsterItemCollide.$item.x = gridsterItem.$item.x + gridsterItem.$item.cols;
        if (vm.push(gridsterItemCollide, vm.fromWest)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          return true;
        } else {
          vm.removeFromTempPushed(gridsterItemCollide);
        }
        return false;
      };

      vm.tryWest = function (gridsterItemCollide, gridsterItem) {
        if (!vm.gridster.$options.pushDirections.west) {
          return false;
        }
        vm.addToTempPushed(gridsterItemCollide);
        gridsterItemCollide.$item.x = gridsterItem.$item.x - gridsterItemCollide.$item.cols;
        if (vm.push(gridsterItemCollide, vm.fromEast)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          return true;
        } else {
          vm.removeFromTempPushed(gridsterItemCollide);
        }
        return false;
      };

      vm.tryPattern = {
        fromEast: [vm.tryWest, vm.trySouth, vm.tryNorth, vm.tryEast],
        fromWest: [vm.tryEast, vm.trySouth, vm.tryNorth, vm.tryWest],
        fromNorth: [vm.trySouth, vm.tryEast, vm.tryWest, vm.tryNorth],
        fromSouth: [vm.tryNorth, vm.tryEast, vm.tryWest, vm.trySouth]
      };

      vm.addToTempPushed = function (gridsterItem) {
        var i = vm.pushedItemsTemp.indexOf(gridsterItem);
        if (i === -1) {
          i = vm.pushedItemsTemp.push(gridsterItem) - 1;
          vm.pushedItemsTempPath[i] = [];
        }
        vm.pushedItemsTempPath[i].push({x: gridsterItem.$item.x, y: gridsterItem.$item.y});
      };

      vm.removeFromTempPushed = function (gridsterItem) {
        var i = vm.pushedItemsTemp.indexOf(gridsterItem);
        var tempPosition = vm.pushedItemsTempPath[i].pop();
        if (!tempPosition) {
          return;
        }
        gridsterItem.$item.x = tempPosition.x;
        gridsterItem.$item.y = tempPosition.y;
        gridsterItem.setSize(true);
        if (!vm.pushedItemsTempPath[i].length) {
          vm.pushedItemsTemp.splice(i, 1);
          vm.pushedItemsTempPath.splice(i, 1);
        }
      };

      vm.checkInTempPushed = function (gridsterItem) {
        return vm.pushedItemsTemp.indexOf(gridsterItem) > -1;
      };

      vm.addToPushed = function (gridsterItem) {
        if (vm.pushedItems.indexOf(gridsterItem) < 0) {
          vm.pushedItems.push(gridsterItem);
          vm.pushedItemsPath.push([{x: gridsterItem.item.x, y: gridsterItem.item.y}, {
            x: gridsterItem.$item.x,
            y: gridsterItem.$item.y
          }]);
        } else {
          var i = vm.pushedItems.indexOf(gridsterItem);
          vm.pushedItemsPath[i].push({x: gridsterItem.$item.x, y: gridsterItem.$item.y});
        }
      };

      vm.removeFromPushed = function (i) {
        if (i > -1) {
          vm.pushedItems.splice(i, 1);
          vm.pushedItemsPath.splice(i, 1);
        }
      };

      vm.checkPushBack = function () {
        var i = vm.pushedItems.length - 1;
        var change = false;
        for (; i > -1; i--) {
          if (vm.checkPushedItem(vm.pushedItems[i], i)) {
            change = true;
          }
        }
        if (change) {
          vm.checkPushBack();
        }
      };

      vm.removeFromPushedItem = function (gridsterItem) {
        var i = vm.pushedItems.indexOf(gridsterItem);
        if (i > -1) {
          vm.pushedItemsPath[i].pop();
          if (!vm.pushedItemsPath.length) {
            vm.pushedItems.splice(i, 1);
            vm.pushedItemsPath.splice(i, 1);
          }
        }
      };

      vm.checkPushedItem = function (pushedItem, i) {
        var path = vm.pushedItemsPath[i];
        var j = path.length - 2;
        var lastPosition, x, y;
        for (; j > -1; j--) {
          lastPosition = path[j];
          x = pushedItem.$item.x;
          y = pushedItem.$item.y;
          pushedItem.$item.x = lastPosition.x;
          pushedItem.$item.y = lastPosition.y;
          if (!vm.gridster.findItemWithItem(pushedItem.$item)) {
            pushedItem.setSize(true);
            path.splice(j + 1, path.length - 1 - j);
          } else {
            pushedItem.$item.x = x;
            pushedItem.$item.y = y;
          }
        }
        if (path.length < 2) {
          vm.removeFromPushed(i);
          return true;
        }
        return false;
      };
    }
  }
})();

(function () {
  'use strict';

  GridsterGridController.$inject = ["$element"];
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

(function () {
  'use strict';

  GridsterItemController.$inject = ["$scope", "$element", "GridsterDraggable", "GridsterResizable", "GridsterUtils"];
  angular.module('angular-gridster2').component('gridsterItem', {
    templateUrl: 'gridster2/gridsterItem.html',
    controller: GridsterItemController,
    controllerAs: 'GridsterItemCtrl',
    bindings: {
      item: '<'
    },
    require: {
      gridster: '^^gridster'
    },
    transclude: true
  });

  /** @ngInject */
  function GridsterItemController($scope, $element, GridsterDraggable, GridsterResizable, GridsterUtils) {
    var vm = this;
    vm.$item = {
      cols: undefined,
      rows: undefined,
      x: undefined,
      y: undefined,
      initCallback: undefined,
      dragEnabled: undefined,
      resizeEnabled: undefined,
      compactEnabled: undefined,
      maxItemRows: undefined,
      minItemRows: undefined,
      maxItemCols: undefined,
      minItemCols: undefined,
      maxItemArea: undefined,
      minItemArea: undefined
    };
    vm.el = $element;
    vm.nativeEl = $element[0];
    vm.notPlaced = false;
    vm.itemTop = 0;
    vm.itemLeft = 0;
    vm.itemWidth = 0;
    vm.itemHeight = 0;
    vm.top = 0;
    vm.left = 0;
    vm.width = 0;
    vm.height = 0;
    vm.itemMargin = 0;

    vm.$onInit = function () {
      vm.drag = new GridsterDraggable(vm, vm.gridster);
      vm.resize = new GridsterResizable(vm, vm.gridster);
      vm.updateOptions();
      vm.gridster.addItem(vm);
    };

    vm.updateOptions = function () {
      vm.$item = GridsterUtils.merge(vm.$item, vm.item, vm.$item);
    };

    vm.$onDestroy = function () {
      vm.gridster.removeItem(vm);
      delete vm.$item.initCallback;
      vm.drag.destroy();
      delete vm.drag;
      vm.resize.destroy();
      delete vm.resize;
    };

    vm.setSize = function (noCheck) {
      if (vm.gridster.mobile) {
        vm.top = 0;
        vm.left = 0;
        if (vm.gridster.$options.keepFixedWidthInMobile) {
          vm.width = vm.$item.cols * vm.gridster.$options.fixedColWidth;
        } else {
          vm.width = vm.gridster.curWidth - (vm.gridster.$options.outerMargin ? 2 * vm.gridster.$options.margin : 0);
        }
        if (vm.gridster.$options.keepFixedHeightInMobile) {
          vm.height = vm.$item.rows * vm.gridster.$options.fixedRowHeight;
        } else {
          vm.height = vm.width / 2;
        }
      } else {
        vm.top = vm.$item.y * vm.gridster.curRowHeight;
        vm.left = vm.$item.x * vm.gridster.curColWidth;
        vm.width = vm.$item.cols * vm.gridster.curColWidth - vm.gridster.$options.margin;
        vm.height = vm.$item.rows * vm.gridster.curRowHeight - vm.gridster.$options.margin;
      }
      if (!noCheck && vm.top === vm.itemTop && vm.left === vm.itemLeft &&
          vm.width === vm.itemWidth && vm.height === vm.itemHeight) {
        return;
      }
      if (vm.gridster.$options.outerMargin) {
        vm.itemMargin = vm.gridster.$options.margin;
      } else {
        vm.itemMargin = 0;
      }

      $element.css('display', vm.notPlaced ? 'none' : 'block');
      $element.css('top', vm.top + 'px');
      $element.css('left', vm.left + 'px');
      $element.css('width', vm.width + 'px');
      $element.css('height', vm.height + 'px');
      $element.css('margin', vm.itemMargin + 'px');
      if (vm.width !== vm.itemWidth || vm.height !== vm.itemHeight) {
        $scope.$broadcast('gridster-item-resize', vm.item);
        if (vm.gridster.$options.itemResizeCallback) {
          vm.gridster.$options.itemResizeCallback(vm.item, vm);
        }
      }
      vm.itemTop = vm.top;
      vm.itemLeft = vm.left;
      vm.itemWidth = vm.width;
      vm.itemHeight = vm.height;
    };

    vm.itemChanged = function () {
      $scope.$broadcast('gridster-item-change', vm.item);
      if (vm.gridster.$options.itemChangeCallback) {
        vm.gridster.$options.itemChangeCallback(vm.item, vm);
      }
    };

    vm.checkItemChanges = function (newValue, oldValue) {
      if (newValue.rows === oldValue.rows && newValue.cols === oldValue.cols && newValue.x === oldValue.x &&
          newValue.y === oldValue.y) {
        return;
      }
      if (vm.gridster.checkCollision(vm.$item)) {
        vm.$item.x = oldValue.x;
        vm.$item.y = oldValue.y;
        vm.$item.cols = oldValue.cols;
        vm.$item.rows = oldValue.rows;
      } else {
        vm.item.cols = vm.$item.cols;
        vm.item.rows = vm.$item.rows;
        vm.item.x = vm.$item.x;
        vm.item.y = vm.$item.y;
        vm.gridster.calculateLayout();
        vm.itemChanged();
      }
    };

    vm.canBeDragged = function canBeDragged() {
      return !vm.gridster.mobile &&
             (vm.$item.dragEnabled === undefined ? vm.gridster.$options.draggable.enabled : vm.$item.dragEnabled);
    };

    vm.canBeResized = function canBeResized() {
      return !vm.gridster.mobile &&
             (vm.$item.resizeEnabled === undefined ? vm.gridster.$options.resizable.enabled : vm.$item.resizeEnabled);
    }
  }
})();

(function () {
  'use strict';

  GridsterGridController.$inject = ["$element", "$scope"];
  angular.module('angular-gridster2').component('gridsterGrid', {
    templateUrl: 'gridster2/gridsterGrid.html',
    controller: GridsterGridController,
    require: {
      gridster: '^^gridster'
    }
  });

  /** @ngInject */
  function GridsterGridController($element, $scope) {
    var vm = this;

    vm.$onInit = function () {
      vm.gridster.gridLines = vm;
      vm.columns = [];
      vm.rows = [];
      vm.height = 0;
      vm.width = 0;
      vm.margin = 0;
      vm.columnsHeight = 0;
      vm.rowsWidth = 0;
    };

    vm.$onDestroy = function () {
      delete vm.gridster.gridLines;
    };

    vm.updateGrid = function updateGrid() {
      if (vm.gridster.$options.displayGrid === 'always' && !vm.gridster.mobile) {
        $element.css('display', 'block');
      } else if (vm.gridster.$options.displayGrid === 'onDrag&Resize' && vm.gridster.dragInProgress) {
        $element.css('display', 'block');
      } else if (vm.gridster.$options.displayGrid === 'none' || !vm.gridster.dragInProgress || vm.gridster.mobile) {
        $element.css('display', 'none');
        return;
      }
      vm.margin = vm.gridster.$options.margin;
      vm.height = vm.gridster.curRowHeight - vm.margin;
      vm.width = vm.gridster.curColWidth - vm.margin;
      vm.columns.length = Math.max(vm.gridster.columns, Math.floor(vm.gridster.curWidth / vm.gridster.curColWidth))|| 0;
      vm.rows.length = Math.max(vm.gridster.rows, Math.floor(vm.gridster.curHeight / vm.gridster.curRowHeight))|| 0;
      vm.columnsHeight = vm.gridster.curRowHeight * vm.rows.length;
      vm.rowsWidth = vm.gridster.curColWidth * vm.columns.length;
      $scope.$applyAsync();
    }
  }
})();

(function () {
  'use strict';

  GridsterEmptyCell.$inject = ["GridsterUtils"];
  angular.module('angular-gridster2')
    .service('GridsterEmptyCell', GridsterEmptyCell);

  /** @ngInject */
  function GridsterEmptyCell(GridsterUtils) {
    return function (gridster) {
      var vm = this;

      vm.destroy = function () {
        delete vm.gridster;
      };

      vm.updateOptions = function () {
        if (gridster.$options.enableEmptyCellClick && !vm.emptyCellClick && gridster.$options.emptyCellClickCallback) {
          vm.emptyCellClick = true;
          gridster.el.addEventListener('click', vm.emptyCellClickCb);
          gridster.el.addEventListener('touchend', vm.emptyCellClickCb);
        } else if (!gridster.$options.enableEmptyCellClick && vm.emptyCellClick) {
          vm.emptyCellClick = false;
          gridster.el.removeEventListener('click', vm.emptyCellClickCb);
          gridster.el.removeEventListener('touchend', vm.emptyCellClickCb);
        }
        if (gridster.$options.enableEmptyCellContextMenu && !vm.emptyCellContextMenu &&
          gridster.$options.emptyCellContextMenuCallback) {
          vm.emptyCellContextMenu = true;
          gridster.el.addEventListener('contextmenu', vm.emptyCellContextMenuCb);
        } else if (!gridster.$options.enableEmptyCellContextMenu && vm.emptyCellContextMenu) {
          vm.emptyCellContextMenu = false;
          gridster.el.removeEventListener('contextmenu', vm.emptyCellContextMenuCb);
        }
        if (gridster.$options.enableEmptyCellDrop && !vm.emptyCellDrop && gridster.$options.emptyCellDropCallback) {
          vm.emptyCellDrop = true;
          gridster.el.addEventListener('drop', vm.emptyCellDragDrop);
          gridster.el.addEventListener('dragover', vm.emptyCellDragOver);
        } else if (!gridster.$options.enableEmptyCellDrop && vm.emptyCellDrop) {
          vm.emptyCellDrop = false;
          gridster.el.removeEventListener('drop', vm.emptyCellDragDrop);
          gridster.el.removeEventListener('dragover', vm.emptyCellDragOver);
        }
        if (gridster.$options.enableEmptyCellDrag && !vm.emptyCellDrag && gridster.$options.emptyCellDragCallback) {
          vm.emptyCellDrag = true;
          gridster.el.addEventListener('mousedown', vm.emptyCellMouseDown);
          gridster.el.addEventListener('touchstart', vm.emptyCellMouseDown);
        } else if (!gridster.$options.enableEmptyCellDrag && vm.emptyCellDrag) {
          vm.emptyCellDrag = false;
          gridster.el.removeEventListener('mousedown', vm.emptyCellMouseDown);
          gridster.el.removeEventListener('touchstart', vm.emptyCellMouseDown);
        }
      };
      vm.emptyCellClickCb = function (e) {
        if (gridster.movingItem || GridsterUtils.checkContentClassForEvent(gridster, e)) {
          return;
        }
        var item = vm.getValidItemFromEvent(e);
        if (!item) {
          return;
        }
        gridster.$options.emptyCellClickCallback(e, item);
      };

      vm.emptyCellContextMenuCb = function (e) {
        if (gridster.movingItem || GridsterUtils.checkContentClassForEvent(gridster, e)) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        var item = vm.getValidItemFromEvent(e);
        if (!item) {
          return;
        }
        gridster.$options.emptyCellContextMenuCallback(e, item);
      };

      vm.emptyCellDragDrop = function (e) {
        var item = vm.getValidItemFromEvent(e);
        if (!item) {
          return;
        }
        gridster.$options.emptyCellDropCallback(e, item);
      };

      vm.emptyCellDragOver = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (vm.getValidItemFromEvent(e)) {
          e.dataTransfer.dropEffect = 'move';
        } else {
          e.dataTransfer.dropEffect = 'none';
        }
      };

      vm.emptyCellMouseDown = function (e) {
        if (GridsterUtils.checkContentClassForEvent(gridster, e)) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        var item = vm.getValidItemFromEvent(e);
        if (!item) {
          return;
        }
        vm.initialItem = item;
        gridster.movingItem = item;
        gridster.previewStyle();
        window.addEventListener('mousemove', vm.emptyCellMouseMove);
        window.addEventListener('touchmove', vm.emptyCellMouseMove);
        window.addEventListener('mouseup', vm.emptyCellMouseUp);
        window.addEventListener('touchend', vm.emptyCellMouseUp);
      };

      vm.emptyCellMouseMove = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var item = vm.getValidItemFromEvent(e, vm.initialItem);
        if (!item) {
          return;
        }

        gridster.movingItem = item;
        gridster.previewStyle();
      };

      vm.emptyCellMouseUp = function (e) {
        window.removeEventListener('mousemove', vm.emptyCellMouseMove);
        window.removeEventListener('touchmove', vm.emptyCellMouseMove);
        window.removeEventListener('mouseup', vm.emptyCellMouseUp);
        window.removeEventListener('touchend', vm.emptyCellMouseUp);
        var item = vm.getValidItemFromEvent(e, vm.initialItem);
        if (item) {
          gridster.movingItem = item;
        }
        gridster.$options.emptyCellDragCallback(e, gridster.movingItem);
        setTimeout(function () {
          gridster.movingItem = null;
          gridster.previewStyle();
        });
      };

      vm.getValidItemFromEvent = function (e, oldItem) {
        e.preventDefault();
        e.stopPropagation();
        GridsterUtils.checkTouchEvent(e);
        var rect = gridster.el.getBoundingClientRect();
        var x = e.clientX + gridster.el.scrollLeft - rect.left;
        var y = e.clientY + gridster.el.scrollTop - rect.top;
        var item = {
          x: gridster.pixelsToPositionX(x, Math.floor),
          y: gridster.pixelsToPositionY(y, Math.floor),
          cols: gridster.$options.defaultItemCols,
          rows: gridster.$options.defaultItemRows
        };
        if (oldItem) {
          item.cols = Math.min(Math.abs(oldItem.x - item.x) + 1, gridster.$options.emptyCellDragMaxCols);
          item.rows = Math.min(Math.abs(oldItem.y - item.y) + 1, gridster.$options.emptyCellDragMaxRows);
          if (oldItem.x < item.x) {
            item.x = oldItem.x;
          } else if (oldItem.x - item.x > gridster.$options.emptyCellDragMaxCols - 1) {
            item.x = gridster.movingItem.x;
          }
          if (oldItem.y < item.y) {
            item.y = oldItem.y;
          } else if (oldItem.y - item.y > gridster.$options.emptyCellDragMaxRows - 1) {
            item.y = gridster.movingItem.y;
          }
        }
        if (gridster.checkCollision(item)) {
          return;
        }
        return item;
      };
    };
  }
})();

(function () {
  'use strict';

  GridsterDraggable.$inject = ["GridsterPush", "GridsterSwap", "GridsterScroll", "GridsterUtils"];
  angular.module('angular-gridster2')
    .service('GridsterDraggable', GridsterDraggable);

  /** @ngInject */
  function GridsterDraggable(GridsterPush, GridsterSwap, GridsterScroll, GridsterUtils) {
    return function (gridsterItem, gridster) {
      var vm = this;
      vm.offsetLeft = 0;
      vm.offsetTop = 0;
      vm.margin = 0;
      vm.diffTop = 0;
      vm.diffLeft = 0;
      vm.top = 0;
      vm.left = 0;
      vm.height = 0;
      vm.width = 0;
      vm.positionX = 0;
      vm.positionY = 0;
      vm.positionXBackup = 0;
      vm.positionYBackup = 0;
      vm.enabled = false;
      vm.dragStartFunction = angular.noop;
      vm.dragFunction = angular.noop;
      vm.dragStopFunction = angular.noop;
      vm.push = undefined;
      vm.swap = undefined;
      vm.gridsterItem = gridsterItem;
      vm.gridster = gridster;
      vm.lastMouse = {
        clientX: 0,
        clientY: 0
      };
      vm.path = [];

      vm.destroy = function () {
        delete vm.gridsterItem;
        delete vm.gridster;
        if (vm.mousedown) {
          vm.gridsterItem.nativeEl.removeEventListener('mousedown', vm.dragStartDelay);
          vm.gridsterItem.nativeEl.removeEventListener('touchstart', vm.dragStartDelay);
        }
      };

      vm.dragStart = function (e) {
        switch (e.which) {
          case 1:
            // left mouse button
            break;
          case 2:
          case 3:
            // right or middle mouse button
            return;
        }

        if (vm.gridster.$options.draggable.start) {
          vm.gridster.$options.draggable.start(vm.gridsterItem.item, vm.gridsterItem, e);
        }

        e.stopPropagation();
        e.preventDefault();
        vm.dragFunction = vm.dragMove.bind(vm);
        vm.dragStopFunction = vm.dragStop.bind(vm);

        document.addEventListener('mousemove', vm.dragFunction);
        document.addEventListener('mouseup', vm.dragStopFunction);
        window.addEventListener('blur', vm.dragStopFunction);
        vm.gridster.el.addEventListener('touchmove', vm.dragFunction);
        document.addEventListener('touchend', vm.dragStopFunction);
        document.addEventListener('touchcancel', vm.dragStopFunction);
        vm.gridsterItem.el.addClass('gridster-item-moving');
        vm.margin = vm.gridster.$options.margin;
        vm.offsetLeft = vm.gridster.el.scrollLeft - vm.gridster.el.offsetLeft;
        vm.offsetTop = vm.gridster.el.scrollTop - vm.gridster.el.offsetTop;
        vm.left = vm.gridsterItem.left;
        vm.top = vm.gridsterItem.top;
        vm.width = vm.gridsterItem.width;
        vm.height = vm.gridsterItem.height;
        vm.diffLeft = e.clientX + vm.offsetLeft - vm.margin - vm.left;
        vm.diffTop = e.clientY + vm.offsetTop - vm.margin - vm.top;
        vm.gridster.movingItem = vm.gridsterItem.$item;
        vm.gridster.previewStyle();
        vm.push = new GridsterPush(vm.gridsterItem);
        vm.swap = new GridsterSwap(vm.gridsterItem);
        vm.gridster.dragInProgress = true;
        vm.gridster.gridLines.updateGrid();
        vm.path.push({x: vm.gridsterItem.item.x, y: vm.gridsterItem.item.y});
      };

      vm.dragMove = function (e) {
        e.stopPropagation();
        e.preventDefault();
        GridsterUtils.checkTouchEvent(e);
        vm.offsetLeft = vm.gridster.el.scrollLeft - vm.gridster.el.offsetLeft;
        vm.offsetTop = vm.gridster.el.scrollTop - vm.gridster.el.offsetTop;
        GridsterScroll(vm.gridsterItem, e, vm.lastMouse, vm.calculateItemPositionFromMousePosition.bind(vm));

        vm.calculateItemPositionFromMousePosition(e);

        vm.lastMouse.clientX = e.clientX;
        vm.lastMouse.clientY = e.clientY;
        vm.gridster.gridLines.updateGrid();
      };

      vm.calculateItemPositionFromMousePosition = function (e) {
        vm.left = e.clientX + vm.offsetLeft - vm.margin - vm.diffLeft;
        vm.top = e.clientY + vm.offsetTop - vm.margin - vm.diffTop;
        vm.calculateItemPosition();
      };

      vm.dragStop = function (e) {
        e.stopPropagation();
        e.preventDefault();
        GridsterScroll.cancelScroll();
        document.removeEventListener('mousemove', vm.dragFunction);
        document.removeEventListener('mouseup', vm.dragStopFunction);
        window.removeEventListener('blur', vm.dragStopFunction);
        vm.gridster.el.removeEventListener('touchmove', vm.dragFunction);
        document.removeEventListener('touchend', vm.dragStopFunction);
        document.removeEventListener('touchcancel', vm.dragStopFunction);
        vm.gridsterItem.el.removeClass('gridster-item-moving');
        vm.gridster.dragInProgress = false;
        vm.gridster.gridLines.updateGrid();
        vm.gridster.gridLines.updateGrid(false);
        vm.path = [];
        if (vm.gridster.$options.draggable.stop) {
          var promise = vm.gridster.$options.draggable.stop(vm.gridsterItem.item, vm.gridsterItem, e);
          if (promise && promise.then) {
            promise.then(vm.makeDrag.bind(vm), vm.cancelDrag.bind(vm));
          } else {
            vm.makeDrag();
          }
        } else {
          vm.makeDrag();
        }
        setTimeout(function () {
          vm.gridster.movingItem = null;
          vm.gridster.previewStyle();
        });
      };

      vm.cancelDrag = function () {
        vm.gridsterItem.$item.x = vm.gridsterItem.item.x;
        vm.gridsterItem.$item.y = vm.gridsterItem.item.y;
        vm.gridsterItem.setSize(true);
        vm.push.restoreItems();
        vm.swap.restoreSwapItem();
        vm.push.destroy();
        delete vm.push;
        vm.swap.destroy();
        delete vm.swap;
      };

      vm.makeDrag = function () {
        vm.gridsterItem.setSize(true);
        vm.gridsterItem.checkItemChanges(vm.gridsterItem.$item, vm.gridsterItem.item);
        vm.push.setPushedItems();
        vm.swap.setSwapItem();
        vm.push.destroy();
        delete vm.push;
        vm.swap.destroy();
        delete vm.swap;
      };

      vm.calculateItemPosition = function () {
        vm.positionX = vm.gridster.pixelsToPositionX(vm.left, Math.round);
        vm.positionY = vm.gridster.pixelsToPositionY(vm.top, Math.round);
        vm.positionXBackup = vm.gridsterItem.$item.x;
        vm.positionYBackup = vm.gridsterItem.$item.y;
        vm.gridsterItem.$item.x = vm.positionX;
        if (vm.gridster.checkGridCollision(vm.gridsterItem.$item)) {
          vm.gridsterItem.$item.x = vm.positionXBackup;
        } else {
          vm.gridsterItem.el.css('left', vm.left + 'px');
        }
        vm.gridsterItem.$item.y = vm.positionY;
        if (vm.gridster.checkGridCollision(vm.gridsterItem.$item)) {
          vm.gridsterItem.$item.y = vm.positionYBackup;
        } else {
          vm.gridsterItem.el.css('top', vm.top + 'px');
        }

        if (vm.positionXBackup !== vm.gridsterItem.$item.x || vm.positionYBackup !== vm.gridsterItem.$item.y) {
          var lastPosition = vm.path[vm.path.length - 1];
          var direction;
          if (lastPosition.x < vm.gridsterItem.$item.x) {
            direction = vm.push.fromWest;
          } else if (lastPosition.x > vm.gridsterItem.$item.x) {
            direction = vm.push.fromEast;
          } else if (lastPosition.y < vm.gridsterItem.$item.y) {
            direction = vm.push.fromNorth;
          } else if (lastPosition.y > vm.gridsterItem.$item.y) {
            direction = vm.push.fromSouth;
          }
          vm.push.pushItems(direction, vm.gridster.$options.disablePushOnDrag);
          vm.swap.swapItems();
          if (vm.gridster.checkCollision(vm.gridsterItem.$item)) {
            vm.gridsterItem.$item.x = vm.positionXBackup;
            vm.gridsterItem.$item.y = vm.positionYBackup;
          } else {
            vm.path.push({x: vm.gridsterItem.$item.x, y: vm.gridsterItem.$item.y});
            vm.gridster.previewStyle();
          }
          vm.push.checkPushBack();
        }
      };

      vm.toggle = function () {
        var enableDrag = vm.gridsterItem.canBeDragged();
        if (!vm.enabled && enableDrag) {
          vm.enabled = !vm.enabled;
          vm.gridsterItem.nativeEl.addEventListener('mousedown', vm.dragStartDelay);
          vm.gridsterItem.nativeEl.addEventListener('touchstart', vm.dragStartDelay);
        } else if (vm.enabled && !enableDrag) {
          vm.enabled = !vm.enabled;
          vm.gridsterItem.nativeEl.removeEventListener('mousedown', vm.dragStartDelay);
          vm.gridsterItem.nativeEl.removeEventListener('touchstart', vm.dragStartDelay);
        }
      };

      vm.dragStartDelay = function (e) {
        GridsterUtils.checkTouchEvent(e);
        if (e.target.classList.contains('gridster-item-resizable-handler')) {
          return;
        }
        if (GridsterUtils.checkContentClassForEvent(vm.gridster, e)) {
          return;
        }
        if (!vm.gridster.$options.draggable.delayStart) {
          vm.dragStart(e);
          return;
        }
        var timeout = setTimeout(function () {
          vm.dragStart(e);
          cancelDrag();
        }, vm.gridster.$options.draggable.delayStart);
        document.addEventListener('mouseup', cancelDrag);
        window.addEventListener('blur', cancelDrag);
        document.addEventListener('touchmove', cancelMove);
        document.addEventListener('touchend', cancelDrag);
        document.addEventListener('touchcancel', cancelDrag);

        function cancelMove(eventMove) {
          GridsterUtils.checkTouchEvent(eventMove);
          if (Math.abs(eventMove.clientX - e.clientX) > 9 || Math.abs(eventMove.clientY - e.clientY) > 9) {
            cancelDrag();
          }
        }

        function cancelDrag() {
          clearTimeout(timeout);
          document.removeEventListener('mouseup', cancelDrag);
          window.removeEventListener('blur', cancelDrag);
          document.removeEventListener('touchmove', cancelMove);
          document.removeEventListener('touchend', cancelDrag);
          document.removeEventListener('touchcancel', cancelDrag);
        }
      }
    };
  }
})();

(function () {
  'use strict';

  angular.module('angular-gridster2').constant('GridsterConfig', {
    gridType: 'fit', // 'fit' will fit the items in the container without scroll;
    // 'scrollVertical' will fit on width and height of the items will be the same as the width
    // 'scrollHorizontal' will fit on height and width of the items will be the same as the height
    // 'fixed' will set the rows and columns dimensions based on fixedColWidth and fixedRowHeight options
    // 'verticalFixed' will set the rows to fixedRowHeight and columns width will fit the space available
    // 'horizontalFixed' will set the columns to fixedColWidth and rows height will fit the space available
    fixedColWidth: 250, // fixed col width for gridType: 'fixed'
    fixedRowHeight: 250, // fixed row height for gridType: 'fixed'
    keepFixedHeightInMobile: false, // keep the height from fixed gridType in mobile layout
    keepFixedWidthInMobile: false, // keep the width from fixed gridType in mobile layout
    compactType: 'none', // compact items: 'none' | 'compactUp' | 'compactLeft' | 'compactUp&Left' | 'compactLeft&Up'
    mobileBreakpoint: 640, // if the screen is not wider that this, remove the grid layout and stack the items
    minCols: 1, // minimum amount of columns in the grid
    maxCols: 100, // maximum amount of columns in the grid
    minRows: 1, // minimum amount of rows in the grid
    maxRows: 100, // maximum amount of rows in the grid
    defaultItemCols: 1, // default width of an item in columns
    defaultItemRows: 1, // default height of an item in rows
    maxItemCols: 50, // max item number of cols
    maxItemRows: 50, // max item number of rows
    minItemCols: 1, // min item number of columns
    minItemRows: 1, // min item number of rows
    minItemArea: 1, // min item area: cols * rows
    maxItemArea: 2500, // max item area: cols * rows
    margin: 10,  // margin between grid items
    outerMargin: true,  // if margins will apply to the sides of the container
    scrollSensitivity: 10,  // margin of the dashboard where to start scrolling
    scrollSpeed: 20,  // how much to scroll each mouse move when in the scrollSensitivity zone
    initCallback: undefined, // callback to call after grid has initialized. Arguments: gridsterComponent
    destroyCallback: undefined, // callback to call after grid has destroyed. Arguments: gridsterComponent
    itemChangeCallback: undefined,  // callback to call for each item when is changes x, y, rows, cols.
    // Arguments: gridsterItem, gridsterItemComponent
    itemResizeCallback: undefined,  // callback to call for each item when width/height changes.
    // Arguments: gridsterItem, gridsterItemComponent
    itemInitCallback: undefined,  // callback to call for each item when is initialized.
    // Arguments: gridsterItem, gridsterItemComponent
    itemRemovedCallback: undefined,  // callback to call for each item when is initialized.
    // Arguments: gridsterItem, gridsterItemComponent
    enableEmptyCellClick: false, // enable empty cell click events
    enableEmptyCellContextMenu: false, // enable empty cell context menu (right click) events
    enableEmptyCellDrop: false, // enable empty cell drop events
    enableEmptyCellDrag: false, // enable empty cell drag events
    emptyCellClickCallback: undefined, // empty cell click callback
    emptyCellContextMenuCallback: undefined, // empty cell context menu (right click) callback
    emptyCellDropCallback: undefined, // empty cell drag drop callback. HTML5 Drag & Drop
    emptyCellDragCallback: undefined, // empty cell drag and create item like excel cell selection
    // Arguments: event, gridsterItem{x, y, rows: defaultItemRows, cols: defaultItemCols}
    emptyCellDragMaxCols: 50, // limit empty cell drag max cols
    emptyCellDragMaxRows: 50, // limit empty cell drag max rows
    draggable: {
      delayStart: 0, // milliseconds to delay the start of drag, useful for touch interaction
      enabled: false, // enable/disable draggable items
      ignoreContentClass: 'gridster-item-content', // default content class to ignore the drag event from
      ignoreContent: false, // if true drag will start only from elements from `dragHandleClass`
      dragHandleClass: 'drag-handler', // drag event only from this class. If `ignoreContent` is true.
      stop: undefined, // callback when dragging an item stops.  Accepts Promise return to cancel/approve drag.
      start: undefined // callback when dragging an item starts.
      // Arguments: item, gridsterItem, event
    },
    resizable: {
      delayStart: 0, // milliseconds to delay the start of drag, useful for touch interaction
      enabled: false, // enable/disable resizable items
      handles: {
        s: true,
        e: true,
        n: true,
        w: true,
        se: true,
        ne: true,
        sw: true,
        nw: true
      }, // resizable edges of an item
      stop: undefined, // callback when resizing an item stops. Accepts Promise return to cancel/approve resize.
      start: undefined // callback when resizing an item starts.
      // Arguments: item, gridsterItem, event
    },
    swap: true, // allow items to switch position if drop on top of another
    pushItems: false, // push items when resizing and dragging
    disablePushOnDrag: false, // disable push on drag
    disablePushOnResize: false, // disable push on resize
    pushDirections: {north: true, east: true, south: true, west: true}, // control the directions items are pushed
    pushResizeItems: false, // on resize of item will shrink adjacent items
    displayGrid: 'onDrag&Resize', // display background grid of rows and columns
    disableWindowResize: false, // disable the window on resize listener. This will stop grid to recalculate on window resize.
    disableWarnings: false // disable console log warnings about misplacement of grid items
  });
})();

(function () {
  'use strict';

  angular.module('angular-gridster2')
    .service('GridsterCompact', GridsterCompact);

  /** @ngInject */
  function GridsterCompact() {
    return function (gridster) {
      var vm = this;

      vm.destroy = function () {
        delete vm.gridster;
      };

      vm.checkCompact = function checkCompact() {
        if (gridster.$options.compactType !== 'none') {
          if (gridster.$options.compactType === 'compactUp') {
            vm.checkCompactUp();
          } else if (gridster.$options.compactType === 'compactLeft') {
            vm.checkCompactLeft();
          } else if (gridster.$options.compactType === 'compactUp&Left') {
            vm.checkCompactUp();
            vm.checkCompactLeft();
          } else if (gridster.$options.compactType === 'compactLeft&Up') {
            vm.checkCompactLeft();
            vm.checkCompactUp();
          }
        }
      };

      vm.checkCompactUp = function checkCompactUp() {
        var widgetMovedUp = false, widget, moved;
        var l = gridster.grid.length;
        for (var i = 0; i < l; i++) {
          widget = gridster.grid[i];
          if (widget.$item.compactEnabled === false) {
            continue;
          }
          moved = vm.moveUpTillCollision(widget);
          if (moved) {
            widgetMovedUp = true;
            widget.item.y = widget.$item.y;
            widget.itemChanged();
          }
        }
        if (widgetMovedUp) {
          vm.checkCompactUp();
        }
        return widgetMovedUp;
      };

      vm.moveUpTillCollision = function moveUpTillCollision(itemComponent) {
        itemComponent.$item.y -= 1;
        if (gridster.checkCollision(itemComponent.$item)) {
          itemComponent.$item.y += 1;
          return false;
        } else {
          vm.moveUpTillCollision(itemComponent);
          return true;
        }
      };

      vm.checkCompactLeft = function checkCompactLeft() {
        var widgetMovedLeft = false, widget, moved;
        var l = gridster.grid.length;
        for (var i = 0; i < l; i++) {
          widget = gridster.grid[i];
          if (widget.$item.compactEnabled === false) {
            continue;
          }
          moved = vm.moveLeftTillCollision(widget);
          if (moved) {
            widgetMovedLeft = true;
            widget.item.x = widget.$item.x;
            widget.itemChanged();
          }
        }
        if (widgetMovedLeft) {
          vm.checkCompactLeft();
        }
        return widgetMovedLeft;
      };

      vm.moveLeftTillCollision = function moveLeftTillCollision(itemComponent) {
        itemComponent.$item.x -= 1;
        if (gridster.checkCollision(itemComponent.$item)) {
          itemComponent.$item.x += 1;
          return false;
        } else {
          vm.moveLeftTillCollision(itemComponent);
          return true;
        }
      }
    };
  }
})();

(function () {
  'use strict';

  GridsterController.$inject = ["$element", "GridsterConfig", "GridsterUtils", "$log", "$scope", "GridsterEmptyCell", "GridsterCompact"];
  angular.module('angular-gridster2').component('gridster', {
    templateUrl: 'gridster2/gridster.html',
    controller: GridsterController,
    controllerAs: 'GridsterCtrl',
    bindings: {
      options: '<'
    },
    transclude: true
  });

  /** @ngInject */
  function GridsterController($element, GridsterConfig, GridsterUtils, $log, $scope, GridsterEmptyCell, GridsterCompact) {
    var vm = this;

    vm.calculateLayoutDebounce = angular.noop;
    vm.movingItem = undefined;
    vm.previewStyle = angular.noop;
    vm.mobile = false;
    vm.columns = 0;
    vm.rows = 0;
    vm.windowResize = angular.noop;
    vm.gridLines = undefined;
    vm.dragInProgress = false;

    vm.el = $element[0];
    vm.$options = JSON.parse(JSON.stringify(GridsterConfig));
    vm.mobile = false;
    vm.curWidth = 0;
    vm.curHeight = 0;
    vm.grid = [];
    vm.curColWidth = 0;
    vm.curRowHeight = 0;
    vm.$options.draggable.stop = undefined;
    vm.$options.draggable.start = undefined;
    vm.$options.resizable.stop = undefined;
    vm.$options.resizable.start = undefined;
    vm.$options.itemChangeCallback = undefined;
    vm.$options.itemResizeCallback = undefined;
    vm.$options.itemInitCallback = undefined;
    vm.$options.itemRemovedCallback = undefined;
    vm.$options.emptyCellClickCallback = undefined;
    vm.$options.emptyCellContextMenuCallback = undefined;
    vm.$options.emptyCellDropCallback = undefined;
    vm.$options.emptyCellDragCallback = undefined;

    vm.checkCollisionTwoItems = function checkCollisionTwoItems(item, item2) {
      return item.x < item2.x + item2.cols
        && item.x + item.cols > item2.x
        && item.y < item2.y + item2.rows
        && item.y + item.rows > item2.y;
    };

    vm.$onInit = function () {
      if (vm.options.initCallback) {
        vm.options.initCallback(vm);
      }
    };

    vm.$onChanges = function (changes) {
      if (changes.options) {
        vm.emptyCell = new GridsterEmptyCell(vm);
        vm.compact = new GridsterCompact(vm);
        vm.setOptions();
        vm.options.api = {
          optionsChanged: vm.optionsChanged,
          resize: vm.onResize,
          getNextPossiblePosition: vm.getNextPossiblePosition
        };
        vm.columns = vm.$options.minCols;
        vm.rows = vm.$options.minRows;
        vm.setGridSize();
        vm.calculateLayoutDebounce = GridsterUtils.debounce(vm.calculateLayout, 5);
        vm.calculateLayoutDebounce();
      }
    };

    vm.resize = function resize() {
      var height;
      var width;
      if (vm.$options.gridType === 'fit' && !vm.mobile) {
        width = vm.el.offsetWidth;
        height = vm.el.offsetHeight;
      } else {
        width = vm.el.clientWidth;
        height = vm.el.clientHeight;
      }
      if ((width !== vm.curWidth || height !== vm.curHeight) && vm.checkIfToResize()) {
        vm.onResize();
      }
    };

    vm.setOptions = function setOptions() {
      vm.$options = GridsterUtils.merge(vm.$options, vm.options, vm.$options);
      if (!vm.$options.disableWindowResize && !vm.onResizeFunction) {
        vm.onResizeFunction = true;
        window.addEventListener('resize', vm.onResize);
      } else if (vm.$options.disableWindowResize && vm.onResizeFunction) {
        vm.onResizeFunction = false;
        window.removeEventListener('resize', vm.onResize);
      }
      vm.emptyCell.updateOptions();
    };

    vm.optionsChanged = function optionsChanged() {
      vm.setOptions();
      var widgetsIndex = vm.grid.length - 1, widget;
      for (; widgetsIndex >= 0; widgetsIndex--) {
        widget = vm.grid[widgetsIndex];
        widget.updateOptions();
      }
      vm.calculateLayout();
    };

    vm.$onDestroy = function () {
      if (vm.onResizeFunction) {
        vm.onResizeFunction = false;
        window.removeEventListener('resize', vm.onResize);
      }
      if (vm.options.destroyCallback) {
        vm.options.destroyCallback(vm);
      }
      if (vm.options.api) {
        vm.options.api.resize = undefined;
        vm.options.api.optionsChanged = undefined;
        vm.options.api.getNextPossiblePosition = undefined;
        vm.options.api = undefined;
      }
      vm.emptyCell.destroy();
      delete vm.emptyCell;
      vm.compact.destroy();
      delete vm.compact;
    };

    vm.onResize = function onResize() {
      vm.setGridSize();
      vm.calculateLayoutDebounce();
    };

    vm.checkIfToResize = function checkIfToResize() {
      var clientWidth = vm.el.clientWidth;
      var offsetWidth = vm.el.offsetWidth;
      var scrollWidth = vm.el.scrollWidth;
      var clientHeight = vm.el.clientHeight;
      var offsetHeight = vm.el.offsetHeight;
      var scrollHeight = vm.el.scrollHeight;
      var verticalScrollPresent = clientWidth < offsetWidth && scrollHeight > offsetHeight
        && scrollHeight - offsetHeight < offsetWidth - clientWidth;
      var horizontalScrollPresent = clientHeight < offsetHeight
        && scrollWidth > offsetWidth && scrollWidth - offsetWidth < offsetHeight - clientHeight;
      if (verticalScrollPresent) {
        return false;
      }
      return !horizontalScrollPresent;
    };

    vm.setGridSize = function setGridSize() {
      var width = vm.el.clientWidth;
      var height = vm.el.clientHeight;
      if (vm.$options.gridType === 'fit' && !vm.mobile) {
        width = vm.el.offsetWidth;
        height = vm.el.offsetHeight;
      } else {
        width = vm.el.clientWidth;
        height = vm.el.clientHeight;
      }
      vm.curWidth = width;
      vm.curHeight = height;
    };

    vm.setGridDimensions = function setGridDimensions() {
      vm.setGridSize();
      if (!vm.mobile && vm.$options.mobileBreakpoint > vm.curWidth) {
        vm.mobile = !vm.mobile;
        $element.addClass('mobile');
      } else if (vm.mobile && vm.$options.mobileBreakpoint < vm.curWidth) {
        vm.mobile = !vm.mobile;
        $element.removeClass('mobile');
      }
      var rows = vm.$options.minRows, columns = vm.$options.minCols;

      var widgetsIndex = vm.grid.length - 1;
      for (; widgetsIndex >= 0; widgetsIndex--) {
        rows = Math.max(rows, vm.grid[widgetsIndex].$item.y + vm.grid[widgetsIndex].$item.rows);
        columns = Math.max(columns, vm.grid[widgetsIndex].$item.x + vm.grid[widgetsIndex].$item.cols);
      }

      vm.columns = columns;
      vm.rows = rows;
    };

    vm.calculateLayout = function calculateLayout() {
      // check to compact
      if (vm.compact) {
        vm.compact.checkCompact();
      }

      vm.setGridDimensions();
      if (vm.$options.outerMargin) {
        vm.curColWidth = Math.floor((vm.curWidth - vm.$options.margin) / vm.columns);
        vm.curRowHeight = Math.floor((vm.curHeight - vm.$options.margin) / vm.rows);
      } else {
        vm.curColWidth = Math.floor((vm.curWidth + vm.$options.margin) / vm.columns);
        vm.curRowHeight = Math.floor((vm.curHeight + vm.$options.margin) / vm.rows);
      }
      var addClass;
      var removeClass1;
      var removeClass2;
      var removeClass3;
      if (vm.$options.gridType === 'fit') {
        addClass = 'fit';
        removeClass1 = 'scrollVertical';
        removeClass2 = 'scrollHorizontal';
        removeClass3 = 'fixed';
      } else if (vm.$options.gridType === 'scrollVertical') {
        vm.curRowHeight = vm.curColWidth;
        addClass = 'scrollVertical';
        removeClass1 = 'fit';
        removeClass2 = 'scrollHorizontal';
        removeClass3 = 'fixed';
      } else if (vm.$options.gridType === 'scrollHorizontal') {
        vm.curColWidth = vm.curRowHeight;
        addClass = 'scrollHorizontal';
        removeClass1 = 'fit';
        removeClass2 = 'scrollVertical';
        removeClass3 = 'fixed';
      } else if (vm.$options.gridType === 'fixed') {
        vm.curColWidth = vm.$options.fixedColWidth + vm.$options.margin;
        vm.curRowHeight = vm.$options.fixedRowHeight + vm.$options.margin;
        addClass = 'fixed';
        removeClass1 = 'fit';
        removeClass2 = 'scrollVertical';
        removeClass3 = 'scrollHorizontal';
      } else if (vm.$options.gridType === 'verticalFixed') {
        vm.curRowHeight = vm.$options.fixedRowHeight + vm.$options.margin;
        addClass = 'scrollVertical';
        removeClass1 = 'fit';
        removeClass2 = 'scrollHorizontal';
        removeClass3 = 'fixed';
      } else if (vm.$options.gridType === 'horizontalFixed') {
        vm.curColWidth = vm.$options.fixedColWidth + vm.$options.margin;
        addClass = 'scrollHorizontal';
        removeClass1 = 'fit';
        removeClass2 = 'scrollVertical';
        removeClass3 = 'fixed';
      }
      $element.addClass(addClass);
      $element.removeClass(removeClass1);
      $element.removeClass(removeClass2);
      $element.removeClass(removeClass3);

      if (vm.gridLines) {
        vm.gridLines.updateGrid();
      }

      var widgetsIndex = vm.grid.length - 1, widget;
      for (; widgetsIndex >= 0; widgetsIndex--) {
        widget = vm.grid[widgetsIndex];
        widget.setSize(false);
        widget.drag.toggle();
        widget.resize.toggle();
      }
      $scope.$applyAsync();
      setTimeout(vm.resize, 100);
    };

    vm.addItem = function addItem(itemComponent) {
      if (itemComponent.$item.cols === undefined) {
        itemComponent.$item.cols = vm.$options.defaultItemCols;
        itemComponent.item.cols = itemComponent.$item.cols;
        itemComponent.itemChanged();
      }
      if (itemComponent.$item.rows === undefined) {
        itemComponent.$item.rows = vm.$options.defaultItemRows;
        itemComponent.item.rows = itemComponent.$item.rows;
        itemComponent.itemChanged();
      }
      if (itemComponent.$item.x === undefined || itemComponent.$item.y === undefined) {
        vm.autoPositionItem(itemComponent);
      } else if (vm.checkCollision(itemComponent.$item)) {
        if (!vm.$options.disableWarnings) {
          $log.warn('Can\'t be placed in the bounds of the dashboard, trying to auto position!/n' +
            JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
        }
        itemComponent.$item.x = undefined;
        itemComponent.$item.y = undefined;
        vm.autoPositionItem(itemComponent);
      }
      vm.grid.push(itemComponent);
      vm.calculateLayoutDebounce();
      if (itemComponent.$item.initCallback) {
        itemComponent.$item.initCallback(itemComponent.item, itemComponent);
      }
      if (vm.$options.itemInitCallback) {
        vm.$options.itemInitCallback(itemComponent.item, itemComponent);
      }
    };

    vm.removeItem = function removeItem(itemComponent) {
      vm.grid.splice(vm.grid.indexOf(itemComponent), 1);
      vm.calculateLayoutDebounce();
      if (vm.$options.itemRemovedCallback) {
        vm.$options.itemRemovedCallback(itemComponent.item, itemComponent);
      }
    };

    vm.checkCollision = function checkCollision(item) {
      return vm.checkGridCollision(item) || vm.findItemWithItem(item);
    };

    vm.checkGridCollision = function checkGridCollision(item) {
      var noNegativePosition = item.y > -1 && item.x > -1;
      var maxGridCols = item.cols + item.x <= vm.$options.maxCols;
      var maxGridRows = item.rows + item.y <= vm.$options.maxRows;
      var maxItemCols = item.maxItemCols === undefined ? vm.$options.maxItemCols : item.maxItemCols;
      var minItemCols = item.minItemCols === undefined ? vm.$options.minItemCols : item.minItemCols;
      var maxItemRows = item.maxItemRows === undefined ? vm.$options.maxItemRows : item.maxItemRows;
      var minItemRows = item.minItemRows === undefined ? vm.$options.minItemRows : item.minItemRows;
      var inColsLimits = item.cols <= maxItemCols && item.cols >= minItemCols;
      var inRowsLimits = item.rows <= maxItemRows && item.rows >= minItemRows;
      var minAreaLimit = item.minItemArea === undefined ? vm.$options.minItemArea : item.minItemArea;
      var maxAreaLimit = item.maxItemArea === undefined ? vm.$options.maxItemArea : item.maxItemArea;
      var area = item.cols * item.rows;
      var inMinArea = minAreaLimit <= area;
      var inMaxArea = maxAreaLimit >= area;
      return !(noNegativePosition && maxGridCols && maxGridRows && inColsLimits && inRowsLimits && inMinArea && inMaxArea);
    };

    vm.findItemWithItem = function findItemWithItem(item) {
      var widgetsIndex = vm.grid.length - 1, widget;
      for (; widgetsIndex > -1; widgetsIndex--) {
        widget = vm.grid[widgetsIndex];
        if (widget.$item !== item && vm.checkCollisionTwoItems(widget.$item, item)) {
          return widget;
        }
      }
      return false;
    };

    vm.findItemsWithItem = function findItemWithItem(item) {
      var a = [];
      var widgetsIndex = vm.grid.length - 1, widget;
      for (; widgetsIndex > -1; widgetsIndex--) {
        widget = vm.grid[widgetsIndex];
        if (widget.$item !== item && vm.checkCollisionTwoItems(widget.$item, item)) {
          a.push(widget);
        }
      }
      return a;
    };

    vm.autoPositionItem = function autoPositionItem(itemComponent) {
      if (vm.getNextPossiblePosition(itemComponent.$item)) {
        itemComponent.item.x = itemComponent.$item.x;
        itemComponent.item.y = itemComponent.$item.y;
        itemComponent.itemChanged();
      } else {
        itemComponent.notPlaced = true;
        if (!vm.$options.disableWarnings) {
          $log.warn('Can\'t be placed in the bounds of the dashboard!/n' +
            JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
        }
      }
    };

    vm.getNextPossiblePosition = function getNextPossiblePosition(newItem) {
      if (newItem.cols === undefined) {
        newItem.cols = vm.$options.defaultItemCols;
      }
      if (newItem.rows === undefined) {
        newItem.rows = vm.$options.defaultItemRows;
      }
      vm.setGridDimensions();
      var rowsIndex = 0, colsIndex;
      for (; rowsIndex < vm.rows; rowsIndex++) {
        newItem.y = rowsIndex;
        colsIndex = 0;
        for (; colsIndex < vm.columns; colsIndex++) {
          newItem.x = colsIndex;
          if (!vm.checkCollision(newItem)) {
            return true;
          }
        }
      }
      var canAddToRows = vm.$options.maxRows >= vm.rows + newItem.rows;
      var canAddToColumns = vm.$options.maxCols >= vm.columns + newItem.cols;
      var addToRows = vm.rows <= vm.columns && canAddToRows;
      if (!addToRows && canAddToColumns) {
        newItem.x = vm.columns;
        newItem.y = 0;
        return true;
      } else if (canAddToRows) {
        newItem.y = vm.rows;
        newItem.x = 0;
        return true;
      }
      return false;
    };

    vm.pixelsToPosition = function pixelsToPosition(x, y, roundingMethod) {
      return [vm.pixelsToPositionX(x, roundingMethod), vm.pixelsToPositionY(y, roundingMethod)];
    };

    vm.pixelsToPositionX = function pixelsToPositionX(x, roundingMethod) {
      return Math.max(roundingMethod(x / vm.curColWidth), 0);
    };

    vm.pixelsToPositionY = function pixelsToPositionY(y, roundingMethod) {
      return Math.max(roundingMethod(y / vm.curRowHeight), 0);
    };

    vm.positionXToPixels = function positionXToPixels(x) {
      return x * vm.curColWidth;
    };

    vm.positionYToPixels = function positionYToPixels(y) {
      return y * vm.curRowHeight;
    };
  }
})();

angular.module('angular-gridster2').run(['$templateCache', function($templateCache) {$templateCache.put('gridster2/gridster.html','<gridster-grid class=gridster-grid></gridster-grid><ng-transclude></ng-transclude><gridster-preview class=gridster-preview></gridster-preview>');
$templateCache.put('gridster2/gridsterGrid.html','<div class=columns ng-style="{height: $ctrl.columnsHeight + \'px\'}"><div class=column ng-repeat="column in $ctrl.columns track by $index" ng-style="{\'min-width\': $ctrl.width + \'px\', \'margin-left\': ($first && !$ctrl.gridster.$options.outerMargin ? 0 : $ctrl.margin) + \'px\'}"></div></div><div class=rows ng-style="{width: $ctrl.rowsWidth + \'px\'}"><div class=row ng-repeat="row in $ctrl.rows track by $index" ng-style="{height: $ctrl.height + \'px\', \'margin-top\': ($first && !$ctrl.gridster.$options.outerMargin ? 0 :$ctrl.margin) + \'px\'}"></div></div>');
$templateCache.put('gridster2/gridsterItem.html','<ng-transclude></ng-transclude><div ng-hide="!GridsterItemCtrl.gridster.$options.resizable.handles.s || !GridsterItemCtrl.resize.resizeEnabled" class="gridster-item-resizable-handler handle-s ng-hide"></div><div ng-hide="!GridsterItemCtrl.gridster.$options.resizable.handles.e || !GridsterItemCtrl.resize.resizeEnabled" class="gridster-item-resizable-handler handle-e ng-hide"></div><div ng-hide="!GridsterItemCtrl.gridster.$options.resizable.handles.n || !GridsterItemCtrl.resize.resizeEnabled" class="gridster-item-resizable-handler handle-n ng-hide"></div><div ng-hide="!GridsterItemCtrl.gridster.$options.resizable.handles.w || !GridsterItemCtrl.resize.resizeEnabled" class="gridster-item-resizable-handler handle-w ng-hide"></div><div ng-hide="!GridsterItemCtrl.gridster.$options.resizable.handles.se || !GridsterItemCtrl.resize.resizeEnabled" class="gridster-item-resizable-handler handle-se ng-hide"></div><div ng-hide="!GridsterItemCtrl.gridster.$options.resizable.handles.ne || !GridsterItemCtrl.resize.resizeEnabled" class="gridster-item-resizable-handler handle-ne ng-hide"></div><div ng-hide="!GridsterItemCtrl.gridster.$options.resizable.handles.sw || !GridsterItemCtrl.resize.resizeEnabled" class="gridster-item-resizable-handler handle-sw ng-hide"></div><div ng-hide="!GridsterItemCtrl.gridster.$options.resizable.handles.nw || !GridsterItemCtrl.resize.resizeEnabled" class="gridster-item-resizable-handler handle-nw ng-hide"></div>');}]);