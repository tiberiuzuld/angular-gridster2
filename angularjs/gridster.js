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

      return {
        merge: merge,
        debounce: debounce
      }
    });
})();

(function () {
  'use strict';

  angular.module('angular-gridster2')
    .service('GridsterSwap', function () {
      return function (gridsterItem, gridster) {
        var vm = this;
        vm.swapedItem = undefined;
        vm.gridsterItem = gridsterItem;
        vm.gridster = gridster;

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
          if (gridsterItemCollision && gridsterItemCollision !== true) {
            var gridsterItemCollide = gridsterItemCollision;
            gridsterItemCollide.$item.x = pushedBy.item.x;
            gridsterItemCollide.$item.y = pushedBy.item.y;
            pushedBy.$item.x = gridsterItemCollide.item.x;
            pushedBy.$item.y = gridsterItemCollide.item.y;
            if (vm.gridster.checkCollision(gridsterItemCollide.$item) || vm.gridster.checkCollision(pushedBy.$item)) {
              pushedBy.$item.x = gridsterItemCollide.$item.x;
              pushedBy.$item.y = gridsterItemCollide.$item.y;
              gridsterItemCollide.$item.x = gridsterItemCollide.item.x;
              gridsterItemCollide.$item.y = gridsterItemCollide.item.y;
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
        var elemTopOffset = gridsterItem.el.offsetTop - offsetTop;
        var elemBottomOffset = offsetHeight + offsetTop - gridsterItem.el.offsetTop - gridsterItem.el.offsetHeight;
        if (lastMouse.pageY < e.pageY && elemBottomOffset < scrollSensitivity) {
          cancelN();
          if ((resizeEvent && !resizeEventType.s) || intervalS) {
            return;
          }
          intervalS = startVertical(1, calculateItemPosition, lastMouse);
        } else if (lastMouse.pageY > e.pageY && offsetTop > 0 && elemTopOffset < scrollSensitivity) {
          cancelS();
          if ((resizeEvent && !resizeEventType.n) || intervalN) {
            return;
          }
          intervalN = startVertical(-1, calculateItemPosition, lastMouse);
        } else if (lastMouse.pageY !== e.pageY) {
          cancelVertical();
        }

        var elemRightOffset = offsetLeft + offsetWidth - gridsterItem.el.offsetLeft - gridsterItem.el.offsetWidth;
        var elemLeftOffset = gridsterItem.el.offsetLeft - offsetLeft;
        if (lastMouse.pageX < e.pageX && elemRightOffset <= scrollSensitivity) {
          cancelW();
          if ((resizeEvent && !resizeEventType.e) || intervalE) {
            return;
          }
          intervalE = startHorizontal(1, calculateItemPosition, lastMouse);
        } else if (lastMouse.pageX > e.pageX && offsetLeft > 0 && elemLeftOffset < scrollSensitivity) {
          cancelE();
          if ((resizeEvent && !resizeEventType.w) || intervalW) {
            return;
          }
          intervalW = startHorizontal(-1, calculateItemPosition, lastMouse);
        } else if (lastMouse.pageX !== e.pageX) {
          cancelHorizontal();
        }
        return vm;
      }

      scroll.cancelScroll = cancelScroll;
      return scroll;

      function startVertical(sign, calculateItemPosition, lastMouse) {
        var pageY = lastMouse.pageY;
        return setInterval(function () {
          if (!gridsterElement || sign === -1 && gridsterElement.scrollTop - scrollSpeed < 0) {
            cancelVertical();
          }
          gridsterElement.scrollTop += sign * scrollSpeed;
          pageY += sign * scrollSpeed;
          calculateItemPosition({pageX: lastMouse.pageX, pageY: pageY});
        }.bind(this), intervalDuration);
      }

      function startHorizontal(sign, calculateItemPosition, lastMouse) {
        var pageX = lastMouse.pageX;
        return setInterval(function () {
          if (!gridsterElement || sign === -1 && gridsterElement.scrollLeft - scrollSpeed < 0) {
            cancelHorizontal();
          }
          gridsterElement.scrollLeft += sign * scrollSpeed;
          pageX += sign * scrollSpeed;
          calculateItemPosition({pageX: pageX, pageY: lastMouse.pageY});
        }.bind(this), intervalDuration);
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

  GridsterResizable.$inject = ["GridsterPush", "GridsterScroll"];
  angular.module('angular-gridster2')
    .service('GridsterResizable', GridsterResizable);

  /** @ngInject */
  function GridsterResizable(GridsterPush, GridsterScroll) {
    return function (gridsterItem, gridster) {
      var vm = this;

      vm.enabled = false;
      vm.directionFunction = angular.noop;
      vm.dragStartFunction = angular.noop;
      vm.dragFunction = angular.noop;
      vm.dragStopFunction = angular.noop;
      vm.resizeEnabled = false;
      vm.push = undefined;
      vm.minHeight = 0;
      vm.minWidth = 0;
      vm.offsetTop = 0;
      vm.offsetLeft = 0;
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
        pageX: 0,
        pageY: 0
      };
      vm.itemBackup = [0, 0, 0, 0];
      vm.resizeEventScrollType = {w: false, e: false, n: false, s: false};

      function touchEvent(e) {
        e.pageX = e.touches[0].pageX;
        e.pageY = e.touches[0].pageY;
      }

      function getOffsetSum(originalElement) {
        var top = 0;
        var left = 0;
        var element = originalElement;
        while (element) {
          top = top + parseFloat(element.offsetTop);
          left = left + parseFloat(element.offsetLeft);
          element = element.offsetParent;
        }
        return {top: Math.round(top), left: Math.round(left)};
      }

      function getScrollSum(originalElement) {
        var top = 0;
        var left = 0;
        var element = originalElement;
        while (element) {
          top = top + parseFloat(element.scrollTop);
          left = left + parseFloat(element.scrollLeft);
          element = element.offsetParent;
        }
        return {scrollTop: Math.round(top), scrollLeft: Math.round(left)};
      }

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
        if (e.pageX === undefined && e.touches) {
          touchEvent(e);
        }
        vm.dragFunction = vm.dragMove.bind(this);
        vm.dragStopFunction = vm.dragStop.bind(this);
        document.addEventListener('mousemove', vm.dragFunction);
        document.addEventListener('mouseup', vm.dragStopFunction);
        document.addEventListener('touchmove', vm.dragFunction);
        document.addEventListener('touchend', vm.dragStopFunction);
        document.addEventListener('touchcancel', vm.dragStopFunction);
        vm.gridsterItem.el.addClass('gridster-item-resizing');
        vm.lastMouse.pageX = e.pageX;
        vm.lastMouse.pageY = e.pageY;
        vm.left = vm.gridsterItem.left;
        vm.top = vm.gridsterItem.top;
        vm.width = vm.gridsterItem.width;
        vm.height = vm.gridsterItem.height;
        vm.bottom = vm.gridsterItem.top + vm.gridsterItem.height;
        vm.right = vm.gridsterItem.left + vm.gridsterItem.width;
        vm.margin = vm.gridster.$options.margin;
        vm.minHeight = vm.gridster.positionYToPixels(vm.gridsterItem.$item.minItemRows || vm.gridster.$options.minItemRows)
          - vm.gridster.$options.margin;
        vm.minWidth = vm.gridster.positionXToPixels(vm.gridsterItem.$item.minItemCols || vm.gridster.$options.minItemCols)
          - vm.gridster.$options.margin;
        vm.gridster.movingItem = vm.gridsterItem;
        vm.gridster.previewStyle();
        vm.push = new GridsterPush(vm.gridsterItem, vm.gridster);
        vm.gridster.gridLines.updateGrid(true);

        if (e.currentTarget.classList.contains('handle-n')) {
          vm.resizeEventScrollType.n = true;
          vm.directionFunction = vm.handleN.bind(this);
        } else if (e.currentTarget.classList.contains('handle-w')) {
          vm.resizeEventScrollType.w = true;
          vm.directionFunction = vm.handleW.bind(this);
        } else if (e.currentTarget.classList.contains('handle-s')) {
          vm.resizeEventScrollType.s = true;
          vm.directionFunction = vm.handleS.bind(this);
        } else if (e.currentTarget.classList.contains('handle-e')) {
          vm.resizeEventScrollType.e = true;
          vm.directionFunction = vm.handleE.bind(this);
        } else if (e.currentTarget.classList.contains('handle-nw')) {
          vm.resizeEventScrollType.n = true;
          vm.resizeEventScrollType.w = true;
          vm.directionFunction = vm.handleNW.bind(this);
        } else if (e.currentTarget.classList.contains('handle-ne')) {
          vm.resizeEventScrollType.n = true;
          vm.resizeEventScrollType.e = true;
          vm.directionFunction = vm.handleNE.bind(this);
        } else if (e.currentTarget.classList.contains('handle-sw')) {
          vm.resizeEventScrollType.s = true;
          vm.resizeEventScrollType.w = true;
          vm.directionFunction = vm.handleSW.bind(this);
        } else if (e.currentTarget.classList.contains('handle-se')) {
          vm.resizeEventScrollType.s = true;
          vm.resizeEventScrollType.e = true;
          vm.directionFunction = vm.handleSE.bind(this);
        }
      };

      vm.dragMove = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.pageX === undefined && e.touches) {
          touchEvent(e);
        }
        vm.offsetTop = vm.gridster.el.scrollTop - vm.gridster.el.offsetTop;
        vm.offsetLeft = vm.gridster.el.scrollLeft - vm.gridster.el.offsetLeft;
        GridsterScroll(vm.gridsterItem, e, vm.lastMouse, vm.directionFunction, true, vm.resizeEventScrollType);
        vm.directionFunction(e);

        vm.lastMouse.pageX = e.pageX;
        vm.lastMouse.pageY = e.pageY;
      };

      vm.dragStop = function (e) {
        e.stopPropagation();
        e.preventDefault();
        GridsterScroll.cancelScroll();
        document.removeEventListener('mousemove', vm.dragFunction);
        document.removeEventListener('mouseup', vm.dragStopFunction);
        document.removeEventListener('touchmove', vm.dragFunction);
        document.removeEventListener('touchend', vm.dragStopFunction);
        document.removeEventListener('touchcancel', vm.dragStopFunction);
        vm.gridsterItem.el.removeClass('gridster-item-resizing');
        vm.gridster.movingItem = null;
        vm.gridster.previewStyle();
        vm.gridster.gridLines.updateGrid(false);
        if (vm.gridster.$options.resizable.stop) {
          var promise = vm.gridster.$options.resizable.stop(vm.gridsterItem.item, vm.gridsterItem, e);
          if (promise && promise.then) {
            promise.then(vm.makeResize.bind(this), vm.cancelResize.bind(this));
          } else {
            vm.makeResize();
          }
        } else {
          vm.makeResize();
        }
      };

      vm.cancelResize = function () {
        vm.gridsterItem.$item.cols = vm.gridsterItem.item.cols;
        vm.gridsterItem.$item.rows = vm.gridsterItem.item.rows;
        vm.gridsterItem.$item.x = vm.gridsterItem.item.x;
        vm.gridsterItem.$item.y = vm.gridsterItem.item.y;
        vm.gridsterItem.setSize(true);
        vm.push.restoreItems();
        vm.push = undefined;
      };

      vm.makeResize = function () {
        vm.gridsterItem.setSize(true);
        vm.gridsterItem.checkItemChanges(vm.gridsterItem.$item, vm.gridsterItem.item);
        vm.push.setPushedItems();
        vm.push = undefined;
      };

      vm.getRealCords = function (e) {
        var gridsterOffsets = getOffsetSum(vm.gridster.el);
        var pageY = e.pageY - gridsterOffsets.top + getScrollSum(vm.gridster.el).scrollTop;
        var pageX = e.pageX - gridsterOffsets.left + getScrollSum(vm.gridster.el).scrollLeft;
        return {pageY: pageY, pageX: pageX};
      };

      vm.handleN = function (e) {
        vm.top = vm.getRealCords(e).pageY - vm.margin;
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
          vm.push.checkPushBack();
        }
        vm.gridsterItem.el.css('top', vm.top + 'px');
        vm.gridsterItem.el.css('height', vm.height + 'px');
      };

      vm.handleW = function (e) {
        vm.left = vm.getRealCords(e).pageX - vm.margin;
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
          vm.push.pushItems(vm.push.fromEast);
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
          vm.push.checkPushBack();
        }
        vm.gridsterItem.el.css('left', vm.left + 'px');
        vm.gridsterItem.el.css('width', vm.width + 'px');
      };

      vm.handleS = function (e) {
        vm.height = vm.getRealCords(e).pageY - vm.margin - vm.gridsterItem.top;
        if (vm.minHeight > vm.height) {
          vm.height = vm.minHeight;
        }
        vm.bottom = vm.top + vm.height;
        vm.newPosition = vm.gridster.pixelsToPositionY(vm.bottom, Math.ceil);
        if ((vm.gridsterItem.$item.y + vm.gridsterItem.$item.rows) !== vm.newPosition) {
          vm.itemBackup[3] = vm.gridsterItem.$item.rows;
          vm.gridsterItem.$item.rows = vm.newPosition - vm.gridsterItem.$item.y;
          vm.push.pushItems(vm.push.fromNorth);
          if (vm.gridster.checkCollision(vm.gridsterItem.$item)) {
            vm.gridsterItem.$item.rows = vm.itemBackup[3];
            vm.gridsterItem.el.css('height', vm.gridster.positionYToPixels(vm.gridsterItem.$item.rows)
              - vm.gridster.$options.margin + 'px');
            return;
          } else {
            vm.gridster.previewStyle();
          }
          vm.push.checkPushBack();
        }
        vm.gridsterItem.el.css('height', vm.height + 'px');
      };

      vm.handleE = function (e) {
        vm.width = vm.getRealCords(e).pageX - vm.margin - vm.gridsterItem.left;
        if (vm.minWidth > vm.width) {
          vm.width = vm.minWidth;
        }
        vm.right = vm.left + vm.width;
        vm.newPosition = vm.gridster.pixelsToPositionX(vm.right, Math.ceil);
        if ((vm.gridsterItem.$item.x + vm.gridsterItem.$item.cols) !== vm.newPosition) {
          vm.itemBackup[2] = vm.gridsterItem.$item.cols;
          vm.gridsterItem.$item.cols = vm.newPosition - vm.gridsterItem.$item.x;
          vm.push.pushItems(vm.push.fromWest);
          if (vm.gridsterItem.$item.cols < 1 || vm.gridster.checkCollision(vm.gridsterItem.$item)) {
            vm.gridsterItem.$item.cols = vm.itemBackup[2];
            vm.gridsterItem.el.css('width', vm.gridster.positionXToPixels(vm.gridsterItem.$item.cols)
              - vm.gridster.$options.margin + 'px');
            return;
          } else {
            vm.gridster.previewStyle();
          }
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

      vm.toggle = function (enabled) {
        var handlers;
        var enableDrag = !vm.gridster.mobile &&
          (vm.gridsterItem.$item.resizeEnabled === undefined ? enabled : vm.gridsterItem.$item.resizeEnabled);
        if (!vm.resizeEnabled && enableDrag) {
          vm.resizeEnabled = !vm.resizeEnabled;
          vm.dragStartFunction = vm.dragStart.bind(this);
          handlers = vm.gridsterItem.nativeEl.querySelectorAll('.gridster-item-resizable-handler');
          handlers.forEach(function (handler) {
            handler.addEventListener('mousedown', vm.dragStartFunction);
            handler.addEventListener('touchstart', vm.dragStartFunction);
          });
        } else if (vm.resizeEnabled && !enableDrag) {
          vm.resizeEnabled = !vm.resizeEnabled;
          handlers = vm.gridsterItem.nativeEl.querySelectorAll('.gridster-item-resizable-handler');
          handlers.forEach(function (handler) {
            handler.removeEventListener('mousedown', vm.dragStartFunction);
            handler.removeEventListener('touchstart', vm.dragStartFunction);
          });
        }
      };
    };
  }
})();

(function () {
  'use strict';

  angular.module('angular-gridster2')
    .service('GridsterPush', GridsterPush);

  /** @ngInject */
  function GridsterPush() {
    return function (gridsterItem, gridster) {
      var vm = this;

      vm.pushedItems = [];
      vm.pushedItemsPath = [];
      vm.gridsterItem = gridsterItem;
      vm.gridster = gridster;
      vm.fromSouth = 'fromSouth';
      vm.fromNorth = 'fromNorth';
      vm.fromEast = 'fromEast';
      vm.fromWest = 'fromWest';

      vm.pushItems = function (direction) {
        if (vm.gridster.$options.pushItems) {
          vm.push(vm.gridsterItem, direction, vm.gridsterItem);
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

      vm.push = function (gridsterItem, direction, pushedBy) {
        var gridsterItemCollision = vm.gridster.checkCollision(gridsterItem.$item, pushedBy.$item);
        if (gridsterItemCollision && gridsterItemCollision !== true &&
          gridsterItemCollision !== vm.gridsterItem) {
          var gridsterItemCollide = gridsterItemCollision;
          if (vm.tryPattern[direction][0].call(this, gridsterItemCollide, gridsterItem, direction, pushedBy)) {
            return true;
          } else if (vm.tryPattern[direction][1].call(this, gridsterItemCollide, gridsterItem, direction, pushedBy)) {
            return true;
          } else if (vm.tryPattern[direction][2].call(this, gridsterItemCollide, gridsterItem, direction, pushedBy)) {
            return true;
          } else if (vm.tryPattern[direction][3].call(this, gridsterItemCollide, gridsterItem, direction, pushedBy)) {
            return true;
          }
        } else if (gridsterItemCollision === undefined) {
          return true;
        }
      };

      vm.trySouth = function (gridsterItemCollide, gridsterItem, direction, pushedBy) {
        var backUpY = gridsterItemCollide.$item.y;
        gridsterItemCollide.$item.y = gridsterItem.$item.y + gridsterItem.$item.rows;
        if (!vm.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
          && vm.push(gridsterItemCollide, vm.fromNorth, gridsterItem)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          vm.push(gridsterItem, direction, pushedBy);
          return true;
        } else {
          gridsterItemCollide.$item.y = backUpY;
        }
      };

      vm.tryNorth = function (gridsterItemCollide, gridsterItem, direction, pushedBy) {
        var backUpY = gridsterItemCollide.$item.y;
        gridsterItemCollide.$item.y = gridsterItem.$item.y - gridsterItemCollide.$item.rows;
        if (!vm.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
          && vm.push(gridsterItemCollide, vm.fromSouth, gridsterItem)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          vm.push(gridsterItem, direction, pushedBy);
          return true;
        } else {
          gridsterItemCollide.$item.y = backUpY;
        }
      };

      vm.tryEast = function (gridsterItemCollide, gridsterItem, direction, pushedBy) {
        var backUpX = gridsterItemCollide.$item.x;
        gridsterItemCollide.$item.x = gridsterItem.$item.x + gridsterItem.$item.cols;
        if (!vm.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
          && vm.push(gridsterItemCollide, vm.fromWest, gridsterItem)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          vm.push(gridsterItem, direction, pushedBy);
          return true;
        } else {
          gridsterItemCollide.$item.x = backUpX;
        }
      };

      vm.tryWest = function (gridsterItemCollide, gridsterItem, direction, pushedBy) {
        var backUpX = gridsterItemCollide.$item.x;
        gridsterItemCollide.$item.x = gridsterItem.$item.x - gridsterItemCollide.$item.cols;
        if (!vm.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
          && vm.push(gridsterItemCollide, vm.fromEast, gridsterItem)) {
          gridsterItemCollide.setSize(true);
          vm.addToPushed(gridsterItemCollide);
          vm.push(gridsterItem, direction, pushedBy);
          return true;
        } else {
          gridsterItemCollide.$item.x = backUpX;
        }
      };

      vm.tryPattern = {
        fromEast: [vm.tryWest, vm.trySouth, vm.tryNorth, vm.tryEast],
        fromWest: [vm.tryEast, vm.trySouth, vm.tryNorth, vm.tryWest],
        fromNorth: [vm.trySouth, vm.tryEast, vm.tryWest, vm.tryNorth],
        fromSouth: [vm.tryNorth, vm.tryEast, vm.tryWest, vm.trySouth]
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
        for (; i > -1; i--) {
          vm.checkPushedItem(vm.pushedItems[i], i);
        }
      };

      vm.checkPushedItem = function (pushedItem, i) {
        var path = vm.pushedItemsPath[i];
        var j = path.length - 2;
        var lastPosition;
        for (; j > -1; j--) {
          lastPosition = path[j];
          pushedItem.$item.x = lastPosition.x;
          pushedItem.$item.y = lastPosition.y;
          if (!vm.gridster.findItemWithItem(pushedItem.$item)) {
            pushedItem.setSize(true);
            path.splice(j + 1, path.length - 1 - j);
          } else {
            lastPosition = path[path.length - 1];
            pushedItem.$item.x = lastPosition.x;
            pushedItem.$item.y = lastPosition.y;
          }
        }
        if (path.length < 2) {
          vm.removeFromPushed(i);
        }
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
      maxItemRows: undefined,
      minItemRows: undefined,
      maxItemCols: undefined,
      minItemCols: undefined
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
      vm.gridster.removeItem(this);
    };

    vm.setSize = function (noCheck) {
      if (vm.gridster.mobile) {
        vm.top = 0;
        vm.left = 0;
        vm.width = vm.gridster.curWidth - (vm.gridster.$options.outerMargin ? 2 * vm.gridster.$options.margin : 0);
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
          vm.gridster.$options.itemResizeCallback(vm.item, this);
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
        vm.gridster.$options.itemChangeCallback(vm.item, this);
      }
    };

    vm.checkItemChanges = function (newValue, oldValue) {
      if (newValue.rows === oldValue.rows && newValue.cols === oldValue.cols && newValue.x === oldValue.x && newValue.y === oldValue.y) {
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
      vm.gridster.gridLines = this;
      vm.columns = [];
      vm.rows = [];
      vm.height = 0;
      vm.width = 0;
      vm.margin = 0;
      vm.columnsHeight = 0;
      vm.rowsWidth = 0;
    };

    vm.updateGrid = function updateGrid(dragOn) {
      if (vm.gridster.$options.displayGrid === 'always' && !vm.gridster.mobile) {
        $element.css('display', 'block');
      } else if (vm.gridster.$options.displayGrid === 'onDrag&Resize' && dragOn) {
        $element.css('display', 'block');
      } else if (vm.gridster.$options.displayGrid === 'none' || !dragOn || vm.gridster.mobile) {
        $element.css('display', 'none');
        return;
      }
      vm.margin = vm.gridster.$options.margin;
      vm.height = vm.gridster.curRowHeight - vm.margin;
      vm.width = vm.gridster.curColWidth - vm.margin;
      vm.columns.length = Math.max(vm.gridster.columns, Math.floor(vm.gridster.curWidth / vm.gridster.curColWidth));
      vm.rows.length = Math.max(vm.gridster.rows, Math.floor(vm.gridster.curHeight / vm.gridster.curRowHeight));
      vm.columnsHeight = vm.gridster.curRowHeight * vm.rows.length;
      vm.rowsWidth = vm.gridster.curColWidth * vm.columns.length;
      $scope.$applyAsync();
    }
  }
})();

(function () {
  'use strict';

  GridsterDraggable.$inject = ["GridsterPush", "GridsterSwap", "GridsterScroll"];
  angular.module('angular-gridster2')
    .service('GridsterDraggable', GridsterDraggable);

  /** @ngInject */
  function GridsterDraggable(GridsterPush, GridsterSwap, GridsterScroll) {
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
        pageX: 0,
        pageY: 0
      };
      vm.path = [];

      function touchEvent(e) {
        e.pageX = e.touches[0].pageX;
        e.pageY = e.touches[0].pageY;
      }

      vm.checkContentClass = function (target, current, contentClass) {
        if (target === current) {
          return false;
        }
        if (target.classList && target.classList.contains(contentClass)) {
          return true;
        } else {
          return vm.checkContentClass(target.parentNode, current, contentClass);
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

        if (vm.gridster.$options.draggable.ignoreContent) {
          if (!vm.checkContentClass(e.target, e.currentTarget, vm.gridster.$options.draggable.dragHandleClass)) {
            return;
          }
        } else {
          if (vm.checkContentClass(e.target, e.currentTarget, vm.gridster.$options.draggable.ignoreContentClass)) {
            return;
          }
        }

        if (vm.gridster.$options.draggable.start) {
          vm.gridster.$options.draggable.start(vm.gridsterItem.item, vm.gridsterItem, e);
        }

        e.stopPropagation();
        e.preventDefault();
        if (e.pageX === undefined && e.touches) {
          touchEvent(e);
        }
        vm.dragFunction = vm.dragMove.bind(this);
        vm.dragStopFunction = vm.dragStop.bind(this);

        document.addEventListener('mousemove', vm.dragFunction);
        document.addEventListener('mouseup', vm.dragStopFunction);
        document.addEventListener('touchmove', vm.dragFunction);
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
        vm.diffLeft = e.pageX + vm.offsetLeft - vm.margin - vm.left;
        vm.diffTop = e.pageY + vm.offsetTop - vm.margin - vm.top;
        vm.gridster.movingItem = vm.gridsterItem;
        vm.gridster.previewStyle();
        vm.push = new GridsterPush(vm.gridsterItem, vm.gridster);
        vm.swap = new GridsterSwap(vm.gridsterItem, vm.gridster);
        vm.gridster.gridLines.updateGrid(true);
        vm.path.push({x: vm.gridsterItem.item.x, y: vm.gridsterItem.item.y});
      };

      vm.dragMove = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.pageX === undefined && e.touches) {
          touchEvent(e);
        }
        vm.offsetLeft = vm.gridster.el.scrollLeft - vm.gridster.el.offsetLeft;
        vm.offsetTop = vm.gridster.el.scrollTop - vm.gridster.el.offsetTop;
        GridsterScroll(vm.gridsterItem, e, vm.lastMouse, vm.calculateItemPositionFromMousePosition.bind(this));

        vm.calculateItemPositionFromMousePosition(e);

        vm.lastMouse.pageX = e.pageX;
        vm.lastMouse.pageY = e.pageY;
      };

      vm.calculateItemPositionFromMousePosition = function (e) {
        vm.left = e.pageX + vm.offsetLeft - vm.margin - vm.diffLeft;
        vm.top = e.pageY + vm.offsetTop - vm.margin - vm.diffTop;
        vm.calculateItemPosition();
      };

      vm.dragStop = function (e) {
        e.stopPropagation();
        e.preventDefault();
        GridsterScroll.cancelScroll();
        document.removeEventListener('mousemove', vm.dragFunction);
        document.removeEventListener('mouseup', vm.dragStopFunction);
        document.removeEventListener('touchmove', vm.dragFunction);
        document.removeEventListener('touchend', vm.dragStopFunction);
        document.removeEventListener('touchcancel', vm.dragStopFunction);
        vm.gridsterItem.el.removeClass('gridster-item-moving');
        vm.gridster.movingItem = null;
        vm.gridster.previewStyle();
        vm.gridster.gridLines.updateGrid(false);
        vm.path = [];
        if (vm.gridster.$options.draggable.stop) {
          var promise = vm.gridster.$options.draggable.stop(vm.gridsterItem.item, vm.gridsterItem, e);
          if (promise && promise.then) {
            promise.then(vm.makeDrag.bind(this), vm.cancelDrag.bind(this));
          } else {
            vm.makeDrag();
          }
        } else {
          vm.makeDrag();
        }
      };

      vm.cancelDrag = function () {
        vm.gridsterItem.$item.x = vm.gridsterItem.item.x;
        vm.gridsterItem.$item.y = vm.gridsterItem.item.y;
        vm.gridsterItem.setSize(true);
        vm.push.restoreItems();
        vm.push = undefined;
        vm.swap.restoreSwapItem();
        vm.swap = undefined;
      };

      vm.makeDrag = function () {
        vm.gridsterItem.setSize(true);
        vm.gridsterItem.checkItemChanges(vm.gridsterItem.$item, vm.gridsterItem.item);
        vm.push.setPushedItems();
        vm.push = undefined;
        vm.swap.setSwapItem();
        vm.swap = undefined;
      };

      vm.calculateItemPosition = function () {
        vm.positionX = vm.gridster.pixelsToPositionX(vm.left, Math.round);
        vm.positionY = vm.gridster.pixelsToPositionY(vm.top, Math.round);
        vm.positionXBackup = vm.gridsterItem.$item.x;
        vm.positionYBackup = vm.gridsterItem.$item.y;
        vm.gridsterItem.$item.x = vm.positionX;
        vm.gridsterItem.$item.y = vm.positionY;
        if (vm.gridster.checkGridCollision(vm.gridsterItem.$item)) {
          vm.gridsterItem.$item.x = vm.positionXBackup;
          vm.gridsterItem.$item.y = vm.positionYBackup;
          return;
        }

        vm.gridsterItem.el.css('left', vm.left + 'px');
        vm.gridsterItem.el.css('top', vm.top + 'px');

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
          vm.push.pushItems(direction);
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

      vm.toggle = function (enable) {
        var enableDrag = !vm.gridster.mobile &&
          (vm.gridsterItem.$item.dragEnabled === undefined ? enable : vm.gridsterItem.$item.dragEnabled);
        if (!vm.enabled && enableDrag) {
          vm.enabled = !vm.enabled;
          vm.dragStartFunction = vm.dragStart.bind(this);
          vm.gridsterItem.nativeEl.addEventListener('mousedown', vm.dragStartFunction);
          vm.gridsterItem.nativeEl.addEventListener('touchstart', vm.dragStartFunction);
        } else if (vm.enabled && !enableDrag) {
          vm.enabled = !vm.enabled;
          vm.gridsterItem.nativeEl.removeEventListener('mousedown', vm.dragStartFunction);
          vm.gridsterItem.nativeEl.removeEventListener('touchstart', vm.dragStartFunction);
        }
      };
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
    fixedColWidth: 250, // fixed col width for gridType: 'fixed'
    fixedRowHeight: 250, // fixed row height for gridType: 'fixed'
    keepFixedHeightInMobile: false, // keep the height from fixed gridType in mobile layout
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
    margin: 10,  // margin between grid items
    outerMargin: true,  // if margins will apply to the sides of the container
    scrollSensitivity: 10,  // margin of the dashboard where to start scrolling
    scrollSpeed: 20,  // how much to scroll each mouse move when in the scrollSensitivity zone
    initCallback: undefined, // callback to call after grid has initialized
    itemChangeCallback: undefined,  // callback to call for each item when is changes x, y, rows, cols. Arguments: gridsterItem
    itemResizeCallback: undefined,  // callback to call for each item when width/height changes. Arguments: gridsterItem
    draggable: {
      enabled: false, // enable/disable draggable items
      ignoreContentClass: 'gridster-item-content', // default content class to ignore the drag event from
      ignoreContent: false, // if true drag will start only from elements from `dragHandleClass`
      dragHandleClass: 'drag-handler', // drag event only from this class. If `ignoreContent` is true.
      stop: undefined, // callback when dragging an item stops.  Accepts Promise return to cancel/approve drag.
      start: undefined // callback when dragging an item starts.
      // Arguments: item, gridsterItem, event
    },
    resizable: {
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
    displayGrid: 'onDrag&Resize' // display background grid of rows and columns
  });
})();

(function () {
  'use strict';

  GridsterController.$inject = ["$element", "GridsterConfig", "GridsterUtils", "$log", "$scope"];
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
  function GridsterController($element, GridsterConfig, GridsterUtils, $log, $scope) {
    var vm = this;

    vm.calculateLayoutDebounce = angular.noop;
    vm.onResizeFunction = angular.noop;
    vm.movingItem = undefined;
    vm.previewStyle = angular.noop;
    vm.mobile = false;
    vm.columns = 0;
    vm.rows = 0;
    vm.windowResize = angular.noop;
    vm.gridLines = undefined;

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

    vm.checkCollisionTwoItems = function checkCollisionTwoItems(item, item2) {
      return item.x < item2.x + item2.cols
        && item.x + item.cols > item2.x
        && item.y < item2.y + item2.rows
        && item.y + item.rows > item2.y;
    };

    vm.$onInit = function () {
      vm.$options = GridsterUtils.merge(vm.$options, vm.options, vm.$options);
      vm.options.api = {
        optionsChanged: vm.optionsChanged.bind(this),
        resize: vm.resize.bind(this),
        getNextPossiblePosition: vm.getNextPossiblePosition.bind(this)
      };
      vm.columns = vm.$options.minCols;
      vm.rows = vm.$options.minRows;
      vm.setGridSize();
      vm.calculateLayoutDebounce = GridsterUtils.debounce(vm.calculateLayout.bind(this), 5);
      vm.calculateLayoutDebounce();
      vm.onResizeFunction = vm.onResize.bind(this);
      window.addEventListener('resize', vm.onResizeFunction);
      if (vm.options.initCallback) {
        vm.options.initCallback();
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

    vm.optionsChanged = function optionsChanged() {
      vm.$options = GridsterUtils.merge(vm.$options, vm.options, vm.$options);
      var widgetsIndex = vm.grid.length - 1, widget;
      for (; widgetsIndex >= 0; widgetsIndex--) {
        widget = vm.grid[widgetsIndex];
        widget.updateOptions();
      }
      vm.calculateLayout();
    };

    vm.$onDestroy = function () {
      window.removeEventListener('resize', vm.onResizeFunction);
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
      vm.checkCompact();

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
        vm.curColWidth = vm.$options.fixedColWidth;
        vm.curRowHeight = vm.$options.fixedRowHeight;
        addClass = 'fixed';
        removeClass1 = 'fit';
        removeClass2 = 'scrollVertical';
        removeClass3 = 'scrollHorizontal';
      }
      $element.addClass(addClass);
      $element.removeClass(removeClass1);
      $element.removeClass(removeClass2);
      $element.removeClass(removeClass3);

      if (!vm.mobile && vm.$options.mobileBreakpoint > vm.curWidth) {
        vm.mobile = !vm.mobile;
        $element.addClass('mobile');
      } else if (vm.mobile && vm.$options.mobileBreakpoint < vm.curWidth) {
        vm.mobile = !vm.mobile;
        $element.removeClass('mobile');
      }
      if (vm.gridLines) {
        vm.gridLines.updateGrid(!!vm.movingItem);
      }

      var widgetsIndex = vm.grid.length - 1, widget;
      for (; widgetsIndex >= 0; widgetsIndex--) {
        widget = vm.grid[widgetsIndex];
        widget.setSize(false);
        widget.drag.toggle(vm.$options.draggable.enabled);
        widget.resize.toggle(vm.$options.resizable.enabled);
      }
      $scope.$applyAsync();
      setTimeout(vm.resize.bind(this), 100);
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
        $log.warn('Can\'t be placed in the bounds of the dashboard, trying to auto position!/n' +
          JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
        itemComponent.$item.x = undefined;
        itemComponent.$item.y = undefined;
        vm.autoPositionItem(itemComponent);
      }
      vm.grid.push(itemComponent);
      vm.calculateLayoutDebounce();
      if (itemComponent.$item.initCallback) {
        itemComponent.$item.initCallback(itemComponent);
      }
    };

    vm.removeItem = function removeItem(itemComponent) {
      vm.grid.splice(vm.grid.indexOf(itemComponent), 1);
      vm.calculateLayoutDebounce();
    };

    vm.checkCollision = function checkCollision(itemComponent, ignoreItem) {
      if (vm.checkGridCollision(itemComponent)) {
        return true;
      }
      return vm.findItemWithItem(itemComponent, ignoreItem);
    };

    vm.checkGridCollision = function checkGridCollision(itemComponent) {
      var noNegativePosition = itemComponent.y > -1 && itemComponent.x > -1;
      var maxGridCols = itemComponent.cols + itemComponent.x <= vm.$options.maxCols;
      var maxGridRows = itemComponent.rows + itemComponent.y <= vm.$options.maxRows;
      var maxItemCols = itemComponent.maxItemCols === undefined ? vm.$options.maxItemCols : itemComponent.maxItemCols;
      var minItemCols = itemComponent.minItemCols === undefined ? vm.$options.minItemCols : itemComponent.minItemCols;
      var maxItemRows = itemComponent.maxItemRows === undefined ? vm.$options.maxItemRows : itemComponent.maxItemRows;
      var minItemRows = itemComponent.minItemRows === undefined ? vm.$options.minItemRows : itemComponent.minItemRows;
      var inColsLimits = itemComponent.cols <= maxItemCols && itemComponent.cols >= minItemCols;
      var inRowsLimits = itemComponent.rows <= maxItemRows && itemComponent.rows >= minItemRows;
      return !(noNegativePosition && maxGridCols && maxGridRows && inColsLimits && inRowsLimits);
    };

    vm.findItemWithItem = function findItemWithItem(itemComponent, ignoreItem) {
      var widgetsIndex = vm.grid.length - 1, widget;
      for (; widgetsIndex >= 0; widgetsIndex--) {
        widget = vm.grid[widgetsIndex];
        if (widget.$item !== itemComponent && widget.$item !== ignoreItem
          && vm.checkCollisionTwoItems(widget.$item, itemComponent)) {
          return widget;
        }
      }
    };

    vm.autoPositionItem = function autoPositionItem(itemComponent) {
      if (vm.getNextPossiblePosition(itemComponent.$item)) {
        itemComponent.item.x = itemComponent.$item.x;
        itemComponent.item.y = itemComponent.$item.y;
        itemComponent.itemChanged();
      } else {
        itemComponent.notPlaced = true;
        $log.warn('Can\'t be placed in the bounds of the dashboard!/n' +
          JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
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
      var canAddToRows = vm.$options.maxRows > vm.rows + newItem.rows;
      var canAddToColumns = vm.$options.maxCols > vm.columns + newItem.cols;
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
    };

    vm.pixelsToPosition = function pixelsToPosition(x, y, roundingMethod) {
      return [vm.pixelsToPositionX(x, roundingMethod), vm.pixelsToPositionY(y, roundingMethod)];
    };

    vm.pixelsToPositionX = function pixelsToPositionX(x, roundingMethod) {
      return roundingMethod(x / vm.curColWidth);
    };

    vm.pixelsToPositionY = function pixelsToPositionY(y, roundingMethod) {
      return roundingMethod(y / vm.curRowHeight);
    };

    vm.positionXToPixels = function positionXToPixels(x) {
      return x * vm.curColWidth;
    };

    vm.positionYToPixels = function positionYToPixels(y) {
      return y * vm.curRowHeight;
    };

    vm.checkCompact = function checkCompact() {
      if (vm.$options.compactType !== 'none') {
        if (vm.$options.compactType === 'compactUp') {
          vm.checkCompactUp();
        } else if (vm.$options.compactType === 'compactLeft') {
          vm.checkCompactLeft();
        } else if (vm.$options.compactType === 'compactUp&Left') {
          vm.checkCompactUp();
          vm.checkCompactLeft();
        } else if (vm.$options.compactType === 'compactLeft&Up') {
          vm.checkCompactLeft();
          vm.checkCompactUp();
        }
      }
    };

    vm.checkCompactUp = function checkCompactUp() {
      var widgetMovedUp = false, widget, moved;
      var l = vm.grid.length;
      for (var i = 0; i < l; i++) {
        widget = vm.grid[i];
        moved = vm.moveUpTillCollision(widget);
        if (moved) {
          widgetMovedUp = true;
          widget.item.y = widget.$item.y;
          widget.itemChanged();
        }
      }
      if (widgetMovedUp) {
        vm.checkCompactUp();
        return widgetMovedUp;
      }
    };

    vm.moveUpTillCollision = function moveUpTillCollision(itemComponent) {
      itemComponent.$item.y -= 1;
      if (vm.checkCollision(itemComponent.$item)) {
        itemComponent.$item.y += 1;
        return false;
      } else {
        vm.moveUpTillCollision(itemComponent);
        return true;
      }
    };

    vm.checkCompactLeft = function checkCompactLeft() {
      var widgetMovedUp = false, widget, moved;
      var l = vm.grid.length;
      for (var i = 0; i < l; i++) {
        widget = vm.grid[i];
        moved = vm.moveLeftTillCollision(widget);
        if (moved) {
          widgetMovedUp = true;
          widget.item.x = widget.$item.x;
          widget.itemChanged();
        }
      }
      if (widgetMovedUp) {
        vm.checkCompactLeft();
        return widgetMovedUp;
      }
    };

    vm.moveLeftTillCollision = function moveLeftTillCollision(itemComponent) {
      itemComponent.$item.x -= 1;
      if (vm.checkCollision(itemComponent.$item)) {
        itemComponent.$item.x += 1;
        return false;
      } else {
        vm.moveUpTillCollision(itemComponent);
        return true;
      }
    }
  }
})();

angular.module('angular-gridster2').run(['$templateCache', function($templateCache) {$templateCache.put('gridster2/gridster.html','<gridster-grid class=gridster-grid></gridster-grid><ng-transclude></ng-transclude><gridster-preview class=gridster-preview></gridster-preview>');
$templateCache.put('gridster2/gridsterGrid.html','<div class=columns ng-style="{height: $ctrl.columnsHeight + \'px\'}"><div class=column ng-repeat="column in $ctrl.columns track by $index" ng-style="{\'min-width\': $ctrl.width + \'px\', \'margin-left\': $ctrl.margin + \'px\'}"></div></div><div class=rows ng-style="{width: $ctrl.rowsWidth + \'px\'}"><div class=row ng-repeat="row in $ctrl.rows track by $index" ng-style="{height: $ctrl.height + \'px\', \'margin-top\': $ctrl.margin + \'px\'}"></div></div>');
$templateCache.put('gridster2/gridsterItem.html','<ng-transclude></ng-transclude><div ng-hide="!GridsterItemCtrl.gridster.$options.resizable.handles.s || !GridsterItemCtrl.resize.resizeEnabled" class="gridster-item-resizable-handler handle-s ng-hide"></div><div ng-hide="!GridsterItemCtrl.gridster.$options.resizable.handles.e || !GridsterItemCtrl.resize.resizeEnabled" class="gridster-item-resizable-handler handle-e ng-hide"></div><div ng-hide="!GridsterItemCtrl.gridster.$options.resizable.handles.n || !GridsterItemCtrl.resize.resizeEnabled" class="gridster-item-resizable-handler handle-n ng-hide"></div><div ng-hide="!GridsterItemCtrl.gridster.$options.resizable.handles.w || !GridsterItemCtrl.resize.resizeEnabled" class="gridster-item-resizable-handler handle-w ng-hide"></div><div ng-hide="!GridsterItemCtrl.gridster.$options.resizable.handles.se || !GridsterItemCtrl.resize.resizeEnabled" class="gridster-item-resizable-handler handle-se ng-hide"></div><div ng-hide="!GridsterItemCtrl.gridster.$options.resizable.handles.ne || !GridsterItemCtrl.resize.resizeEnabled" class="gridster-item-resizable-handler handle-ne ng-hide"></div><div ng-hide="!GridsterItemCtrl.gridster.$options.resizable.handles.sw || !GridsterItemCtrl.resize.resizeEnabled" class="gridster-item-resizable-handler handle-sw ng-hide"></div><div ng-hide="!GridsterItemCtrl.gridster.$options.resizable.handles.nw || !GridsterItemCtrl.resize.resizeEnabled" class="gridster-item-resizable-handler handle-nw ng-hide"></div>');}]);