(function () {
  'use strict';

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

      vm.toggle = function () {
        var handlers;
        var enableDrag = vm.gridsterItem.canBeResized();
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
