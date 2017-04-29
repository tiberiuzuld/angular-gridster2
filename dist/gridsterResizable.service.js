"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridsterItem_component_1 = require("./gridsterItem.component");
var gridsterScroll_service_1 = require("./gridsterScroll.service");
var gridsterPush_service_1 = require("./gridsterPush.service");
var gridster_component_1 = require("./gridster.component");
var GridsterResizable = (function () {
    function GridsterResizable(gridsterItem, gridster) {
        this.gridsterItem = gridsterItem;
        this.gridster = gridster;
        this.lastMouse = {
            pageX: 0,
            pageY: 0
        };
        this.elemPosition = [0, 0, 0, 0];
        this.position = [0, 0];
        this.itemBackup = [0, 0, 0, 0];
        this.resizeEventScrollType = { w: false, e: false, n: false, s: false };
    }
    GridsterResizable.touchEvent = function (e) {
        e.pageX = e.touches[0].pageX;
        e.pageY = e.touches[0].pageY;
    };
    GridsterResizable.prototype.dragStart = function (e) {
        switch (e.which) {
            case 1:
                // left mouse button
                break;
            case 2:
            case 3:
                // right or middle mouse button
                return;
        }
        e.stopPropagation();
        e.preventDefault();
        if (e.pageX === undefined && e.touches) {
            GridsterResizable.touchEvent(e);
        }
        this.dragFunction = this.dragMove.bind(this);
        this.dragStopFunction = this.dragStop.bind(this);
        this.mousemove = this.gridsterItem.renderer.listen('document', 'mousemove', this.dragFunction);
        this.mouseup = this.gridsterItem.renderer.listen('document', 'mouseup', this.dragStopFunction);
        this.touchmove = this.gridsterItem.renderer.listen('document', 'touchmove', this.dragFunction);
        this.touchend = this.gridsterItem.renderer.listen('document', 'touchend', this.dragStopFunction);
        this.touchcancel = this.gridsterItem.renderer.listen('document', 'touchcancel', this.dragStopFunction);
        this.gridsterItem.renderer.addClass(this.gridsterItem.el, 'gridster-item-resizing');
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
        this.gridster.gridLines.updateGrid(true);
        if (e.currentTarget.classList.contains('handle-n')) {
            this.resizeEventScrollType.n = true;
            this.directionFunction = this.handleN.bind(this);
        }
        else if (e.currentTarget.classList.contains('handle-w')) {
            this.resizeEventScrollType.w = true;
            this.directionFunction = this.handleW.bind(this);
        }
        else if (e.currentTarget.classList.contains('handle-s')) {
            this.resizeEventScrollType.s = true;
            this.directionFunction = this.handleS.bind(this);
        }
        else if (e.currentTarget.classList.contains('handle-e')) {
            this.resizeEventScrollType.e = true;
            this.directionFunction = this.handleE.bind(this);
        }
        else if (e.currentTarget.classList.contains('handle-nw')) {
            this.resizeEventScrollType.n = true;
            this.resizeEventScrollType.w = true;
            this.directionFunction = this.handleNW.bind(this);
        }
        else if (e.currentTarget.classList.contains('handle-ne')) {
            this.resizeEventScrollType.n = true;
            this.resizeEventScrollType.e = true;
            this.directionFunction = this.handleNE.bind(this);
        }
        else if (e.currentTarget.classList.contains('handle-sw')) {
            this.resizeEventScrollType.s = true;
            this.resizeEventScrollType.w = true;
            this.directionFunction = this.handleSW.bind(this);
        }
        else if (e.currentTarget.classList.contains('handle-se')) {
            this.resizeEventScrollType.s = true;
            this.resizeEventScrollType.e = true;
            this.directionFunction = this.handleSE.bind(this);
        }
    };
    GridsterResizable.prototype.dragMove = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.pageX === undefined && e.touches) {
            GridsterResizable.touchEvent(e);
        }
        gridsterScroll_service_1.scroll(this.elemPosition, this.gridsterItem, e, this.lastMouse, this.directionFunction, true, this.resizeEventScrollType);
        this.directionFunction(e);
        this.lastMouse.pageX = e.pageX;
        this.lastMouse.pageY = e.pageY;
    };
    GridsterResizable.prototype.dragStop = function (e) {
        e.stopPropagation();
        e.preventDefault();
        gridsterScroll_service_1.cancelScroll();
        this.mousemove();
        this.mouseup();
        this.touchmove();
        this.touchend();
        this.touchcancel();
        this.gridsterItem.renderer.removeClass(this.gridsterItem.el, 'gridster-item-resizing');
        this.gridster.movingItem = null;
        this.gridster.previewStyle();
        this.gridster.gridLines.updateGrid(false);
        if (this.gridster.$options.resizable.stop) {
            Promise.resolve(this.gridster.$options.resizable.stop(this.gridsterItem.item, this.gridsterItem, e))
                .then(this.makeResize.bind(this), this.cancelResize.bind(this));
        }
        else {
            this.makeResize();
        }
    };
    GridsterResizable.prototype.cancelResize = function () {
        this.gridsterItem.$item.cols = this.itemCopy.cols;
        this.gridsterItem.$item.rows = this.itemCopy.rows;
        this.gridsterItem.$item.x = this.itemCopy.x;
        this.gridsterItem.$item.y = this.itemCopy.y;
        this.gridsterItem.setSize(true);
        this.push.restoreItems();
        this.push = undefined;
    };
    GridsterResizable.prototype.makeResize = function () {
        this.gridsterItem.setSize(true);
        this.gridsterItem.checkItemChanges(this.gridsterItem.$item, this.itemCopy);
        this.push.setPushedItems();
        this.push = undefined;
    };
    GridsterResizable.prototype.handleN = function (e) {
        this.elemPosition[1] += e.pageY - this.lastMouse.pageY;
        this.elemPosition[3] += this.lastMouse.pageY - e.pageY;
        this.position = this.gridster.pixelsToPosition(this.elemPosition[0], this.elemPosition[1], Math.floor);
        if (this.gridsterItem.$item.y !== this.position[1]) {
            this.itemBackup[1] = this.gridsterItem.$item.y;
            this.itemBackup[3] = this.gridsterItem.$item.rows;
            this.gridsterItem.$item.rows += this.gridsterItem.$item.y - this.position[1];
            this.gridsterItem.$item.y = this.position[1];
            this.push.pushItems();
            if (this.gridsterItem.$item.y < 0 || this.gridsterItem.$item.rows < 1 ||
                this.gridster.checkCollision(this.gridsterItem)) {
                this.gridsterItem.$item.y = this.itemBackup[1];
                this.gridsterItem.$item.rows = this.itemBackup[3];
                this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'top', this.gridster.positionYToPixels(this.gridsterItem.$item.y) + 'px');
                this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', this.gridster.positionYToPixels(this.gridsterItem.$item.rows)
                    - this.gridster.$options.margin + 'px');
                return;
            }
            else {
                this.gridster.previewStyle();
            }
        }
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'top', this.elemPosition[1] + 'px');
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', this.elemPosition[3] + 'px');
    };
    GridsterResizable.prototype.handleW = function (e) {
        this.elemPosition[0] += e.pageX - this.lastMouse.pageX;
        this.elemPosition[2] += this.lastMouse.pageX - e.pageX;
        this.position = this.gridster.pixelsToPosition(this.elemPosition[0], this.elemPosition[1], Math.floor);
        if (this.gridsterItem.$item.x !== this.position[0]) {
            this.itemBackup[0] = this.gridsterItem.$item.x;
            this.itemBackup[2] = this.gridsterItem.$item.cols;
            this.gridsterItem.$item.cols += this.gridsterItem.$item.x - this.position[0];
            this.gridsterItem.$item.x = this.position[0];
            this.push.pushItems();
            if (this.gridsterItem.$item.x < 0 || this.gridsterItem.$item.cols < 1 ||
                this.gridster.checkCollision(this.gridsterItem)) {
                this.gridsterItem.$item.x = this.itemBackup[0];
                this.gridsterItem.$item.cols = this.itemBackup[2];
                this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'left', this.gridster.positionXToPixels(this.gridsterItem.$item.x) + 'px');
                this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', this.gridster.positionXToPixels(this.gridsterItem.$item.cols)
                    - this.gridster.$options.margin + 'px');
                return;
            }
            else {
                this.gridster.previewStyle();
            }
        }
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'left', this.elemPosition[0] + 'px');
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', this.elemPosition[2] + 'px');
    };
    GridsterResizable.prototype.handleS = function (e) {
        this.elemPosition[3] += e.pageY - this.lastMouse.pageY;
        this.position = this.gridster.pixelsToPosition(this.elemPosition[0], this.elemPosition[1] + this.elemPosition[3], Math.ceil);
        if ((this.gridsterItem.$item.y + this.gridsterItem.$item.rows) !== this.position[1]) {
            this.itemBackup[3] = this.gridsterItem.$item.rows;
            this.gridsterItem.$item.rows = this.position[1] - this.gridsterItem.$item.y;
            this.push.pushItems();
            if (this.gridsterItem.$item.rows < 1 || this.gridster.checkCollision(this.gridsterItem)) {
                this.gridsterItem.$item.rows = this.itemBackup[3];
                this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', this.gridster.positionYToPixels(this.gridsterItem.$item.rows)
                    - this.gridster.$options.margin + 'px');
                return;
            }
            else {
                this.gridster.previewStyle();
            }
        }
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', this.elemPosition[3] + 'px');
    };
    GridsterResizable.prototype.handleE = function (e) {
        this.elemPosition[2] += e.pageX - this.lastMouse.pageX;
        this.position = this.gridster.pixelsToPosition(this.elemPosition[0] + this.elemPosition[2], this.elemPosition[1], Math.ceil);
        if ((this.gridsterItem.$item.x + this.gridsterItem.$item.cols) !== this.position[0]) {
            this.itemBackup[2] = this.gridsterItem.$item.cols;
            this.gridsterItem.$item.cols = this.position[0] - this.gridsterItem.$item.x;
            this.push.pushItems();
            if (this.gridsterItem.$item.cols < 1 || this.gridster.checkCollision(this.gridsterItem)) {
                this.gridsterItem.$item.cols = this.itemBackup[2];
                this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', this.gridster.positionXToPixels(this.gridsterItem.$item.cols)
                    - this.gridster.$options.margin + 'px');
                return;
            }
            else {
                this.gridster.previewStyle();
            }
        }
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', this.elemPosition[2] + 'px');
    };
    GridsterResizable.prototype.handleNW = function (e) {
        this.handleN(e);
        this.handleW(e);
    };
    GridsterResizable.prototype.handleNE = function (e) {
        this.handleN(e);
        this.handleE(e);
    };
    GridsterResizable.prototype.handleSW = function (e) {
        this.handleS(e);
        this.handleW(e);
    };
    GridsterResizable.prototype.handleSE = function (e) {
        this.handleS(e);
        this.handleE(e);
    };
    GridsterResizable.prototype.toggle = function (enabled) {
        this.resizeEnabled = !this.gridster.mobile &&
            (this.gridsterItem.$item.resizeEnabled === undefined ? enabled : this.gridsterItem.$item.resizeEnabled);
    };
    return GridsterResizable;
}());
GridsterResizable.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
GridsterResizable.ctorParameters = function () { return [
    { type: gridsterItem_component_1.GridsterItemComponent, },
    { type: gridster_component_1.GridsterComponent, },
]; };
exports.GridsterResizable = GridsterResizable;
//# sourceMappingURL=gridsterResizable.service.js.map