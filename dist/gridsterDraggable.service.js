"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridsterSwap_service_1 = require("./gridsterSwap.service");
var gridsterScroll_service_1 = require("./gridsterScroll.service");
var gridsterItem_component_1 = require("./gridsterItem.component");
var gridster_component_1 = require("./gridster.component");
var gridsterPush_service_1 = require("./gridsterPush.service");
var GridsterDraggable = (function () {
    function GridsterDraggable(gridsterItem, gridster) {
        this.gridsterItem = gridsterItem;
        this.gridster = gridster;
        this.lastMouse = {
            pageX: 0,
            pageY: 0
        };
        this.elemPosition = [0, 0, 0, 0];
        this.position = [0, 0];
        this.positionBackup = [0, 0];
    }
    GridsterDraggable.touchEvent = function (e) {
        e.pageX = e.touches[0].pageX;
        e.pageY = e.touches[0].pageY;
    };
    GridsterDraggable.prototype.checkContentClass = function (target, current, contentClass) {
        if (target === current) {
            return false;
        }
        if (target.classList && target.classList.contains(contentClass)) {
            return true;
        }
        else {
            return this.checkContentClass(target.parentNode, current, contentClass);
        }
    };
    GridsterDraggable.prototype.dragStart = function (e) {
        switch (e.which) {
            case 1:
                // left mouse button
                break;
            case 2:
            case 3:
                // right or middle mouse button
                return;
        }
        var contentClass = this.gridster.$options.draggable.ignoreContentClass;
        if (this.checkContentClass(e.target, e.currentTarget, contentClass)) {
            return;
        }
        e.stopPropagation();
        e.preventDefault();
        if (e.pageX === undefined && e.touches) {
            GridsterDraggable.touchEvent(e);
        }
        this.dragFunction = this.dragMove.bind(this);
        this.dragStopFunction = this.dragStop.bind(this);
        this.mousemove = this.gridsterItem.renderer.listen('document', 'mousemove', this.dragFunction);
        this.mouseup = this.gridsterItem.renderer.listen('document', 'mouseup', this.dragStopFunction);
        this.touchmove = this.gridsterItem.renderer.listen('document', 'touchmove', this.dragFunction);
        this.touchend = this.gridsterItem.renderer.listen('document', 'touchend', this.dragStopFunction);
        this.touchcancel = this.gridsterItem.renderer.listen('document', 'touchcancel', this.dragStopFunction);
        this.gridsterItem.renderer.addClass(this.gridsterItem.el, 'gridster-item-moving');
        this.lastMouse.pageX = e.pageX;
        this.lastMouse.pageY = e.pageY;
        this.elemPosition[0] = this.gridsterItem.left;
        this.elemPosition[1] = this.gridsterItem.top;
        this.elemPosition[2] = this.gridsterItem.width;
        this.elemPosition[3] = this.gridsterItem.height;
        this.itemCopy = JSON.parse(JSON.stringify(this.gridsterItem.$item, ['rows', 'cols', 'x', 'y']));
        this.gridster.movingItem = this.gridsterItem;
        this.gridster.previewStyle();
        this.push = new gridsterPush_service_1.GridsterPush(this.gridsterItem, this.gridster);
    };
    GridsterDraggable.prototype.dragMove = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.pageX === undefined && e.touches) {
            GridsterDraggable.touchEvent(e);
        }
        this.elemPosition[0] += e.pageX - this.lastMouse.pageX;
        this.elemPosition[1] += e.pageY - this.lastMouse.pageY;
        gridsterScroll_service_1.scroll(this.elemPosition, this.gridsterItem, e, this.lastMouse, this.calculateItemPosition.bind(this));
        this.lastMouse.pageX = e.pageX;
        this.lastMouse.pageY = e.pageY;
        this.calculateItemPosition();
    };
    GridsterDraggable.prototype.dragStop = function (e) {
        e.stopPropagation();
        e.preventDefault();
        gridsterScroll_service_1.cancelScroll();
        this.mousemove();
        this.mouseup();
        this.touchmove();
        this.touchend();
        this.touchcancel();
        this.gridsterItem.renderer.removeClass(this.gridsterItem.el, 'gridster-item-moving');
        this.gridster.movingItem = null;
        this.gridster.previewStyle();
        if (this.gridster.$options.draggable.stop) {
            Promise.resolve(this.gridster.$options.draggable.stop(this.gridsterItem.item, this.gridsterItem, e))
                .then(this.makeDrag.bind(this), this.cancelDrag.bind(this));
        }
        else {
            this.makeDrag();
        }
    };
    GridsterDraggable.prototype.cancelDrag = function () {
        this.gridsterItem.$item.x = this.itemCopy.x;
        this.gridsterItem.$item.y = this.itemCopy.y;
        this.gridsterItem.setSize(true);
        this.push.restoreItems();
        this.push = undefined;
    };
    GridsterDraggable.prototype.makeDrag = function () {
        if (this.gridster.$options.swap) {
            gridsterSwap_service_1.GridsterSwap.GridsterSwap(this.gridsterItem, this.elemPosition);
        }
        this.gridsterItem.setSize(true);
        this.gridsterItem.checkItemChanges(this.gridsterItem.$item, this.itemCopy);
        this.push.setPushedItems();
        this.push = undefined;
    };
    GridsterDraggable.prototype.calculateItemPosition = function () {
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'left', this.elemPosition[0] + 'px');
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'top', this.elemPosition[1] + 'px');
        this.position = this.gridster.pixelsToPosition(this.elemPosition[0], this.elemPosition[1], Math.round);
        if (this.position[0] !== this.gridsterItem.$item.x || this.position[1] !== this.gridsterItem.$item.y) {
            this.positionBackup[0] = this.gridsterItem.$item.x;
            this.positionBackup[1] = this.gridsterItem.$item.y;
            this.gridsterItem.$item.x = this.position[0];
            this.gridsterItem.$item.y = this.position[1];
            this.push.pushItems();
            if (this.gridster.checkCollision(this.gridsterItem)) {
                this.gridsterItem.$item.x = this.positionBackup[0];
                this.gridsterItem.$item.y = this.positionBackup[1];
            }
            else {
                this.gridster.previewStyle();
            }
        }
    };
    GridsterDraggable.prototype.toggle = function (enable) {
        var enableDrag = !this.gridster.mobile &&
            (this.gridsterItem.$item.dragEnabled === undefined ? enable : this.gridsterItem.$item.dragEnabled);
        if (!this.enabled && enableDrag) {
            this.enabled = !this.enabled;
            this.dragStartFunction = this.dragStart.bind(this);
            this.mousedown = this.gridsterItem.renderer.listen(this.gridsterItem.el, 'mousedown', this.dragStartFunction);
            this.touchstart = this.gridsterItem.renderer.listen(this.gridsterItem.el, 'touchstart', this.dragStartFunction);
        }
        else if (this.enabled && !enableDrag) {
            this.enabled = !this.enabled;
            this.mousedown();
            this.touchstart();
        }
    };
    return GridsterDraggable;
}());
GridsterDraggable.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
GridsterDraggable.ctorParameters = function () { return [
    { type: gridsterItem_component_1.GridsterItemComponent, },
    { type: gridster_component_1.GridsterComponent, },
]; };
exports.GridsterDraggable = GridsterDraggable;
//# sourceMappingURL=gridsterDraggable.service.js.map