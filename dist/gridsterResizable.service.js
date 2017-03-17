"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridsterItem_component_1 = require("./gridsterItem.component");
var gridsterScroll_service_1 = require("./gridsterScroll.service");
var _ = require("lodash");
var GridsterResizable = GridsterResizable_1 = (function () {
    function GridsterResizable(element, gridsterItem) {
        this.gridsterScroll = new gridsterScroll_service_1.GridsterScroll();
        this.element = element;
        this.gridsterItem = gridsterItem;
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
        e.preventDefault();
        e.stopPropagation();
        if (e.pageX === undefined && e.touches) {
            GridsterResizable_1.touchEvent(e);
        }
        this.dragFunction = this.dragMove.bind(this);
        this.dragStopFunction = this.dragStop.bind(this);
        document.addEventListener('mousemove', this.dragFunction);
        document.addEventListener('mouseup', this.dragStopFunction);
        document.addEventListener('touchmove', this.dragFunction);
        document.addEventListener('touchend', this.dragStopFunction);
        document.addEventListener('touchcancel', this.dragStopFunction);
        this.element.classList.add('gridster-item-resizing');
        this.lastMouse.pageX = e.pageX;
        this.lastMouse.pageY = e.pageY;
        this.elemPosition[0] = parseInt(this.element.style.left, 10);
        this.elemPosition[1] = parseInt(this.element.style.top, 10);
        this.elemPosition[2] = this.element.offsetWidth;
        this.elemPosition[3] = this.element.offsetHeight;
        this.itemCopy = _.clone(this.gridsterItem.state.item);
        this.gridsterItem.gridster.movingItem = this.gridsterItem.state.item;
        this.gridsterItem.gridster.previewStyle();
        if (e.srcElement.classList.contains('handle-n')) {
            this.resizeEventScrollType.n = true;
            this.directionFunction = this.handleN.bind(this);
        }
        else if (e.srcElement.classList.contains('handle-w')) {
            this.resizeEventScrollType.w = true;
            this.directionFunction = this.handleW.bind(this);
        }
        else if (e.srcElement.classList.contains('handle-s')) {
            this.resizeEventScrollType.s = true;
            this.directionFunction = this.handleS.bind(this);
        }
        else if (e.srcElement.classList.contains('handle-e')) {
            this.resizeEventScrollType.e = true;
            this.directionFunction = this.handleE.bind(this);
        }
        else if (e.srcElement.classList.contains('handle-nw')) {
            this.resizeEventScrollType.n = true;
            this.resizeEventScrollType.w = true;
            this.directionFunction = this.handleNW.bind(this);
        }
        else if (e.srcElement.classList.contains('handle-ne')) {
            this.resizeEventScrollType.n = true;
            this.resizeEventScrollType.e = true;
            this.directionFunction = this.handleNE.bind(this);
        }
        else if (e.srcElement.classList.contains('handle-sw')) {
            this.resizeEventScrollType.s = true;
            this.resizeEventScrollType.w = true;
            this.directionFunction = this.handleSW.bind(this);
        }
        else if (e.srcElement.classList.contains('handle-se')) {
            this.resizeEventScrollType.s = true;
            this.resizeEventScrollType.e = true;
            this.directionFunction = this.handleSE.bind(this);
        }
    };
    GridsterResizable.prototype.dragMove = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.pageX === undefined && e.touches) {
            GridsterResizable_1.touchEvent(e);
        }
        this.gridsterScroll.scroll(this.elemPosition, this.gridsterItem, e, this.lastMouse, this.directionFunction, true, this.resizeEventScrollType);
        this.directionFunction(e);
        this.lastMouse.pageX = e.pageX;
        this.lastMouse.pageY = e.pageY;
    };
    GridsterResizable.prototype.dragStop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.gridsterScroll.cancelScroll();
        document.removeEventListener('mousemove', this.dragFunction);
        document.removeEventListener('mouseup', this.dragStopFunction);
        document.removeEventListener('touchmove', this.dragFunction);
        document.removeEventListener('touchend', this.dragStopFunction);
        document.removeEventListener('touchcancel', this.dragStopFunction);
        this.element.classList.remove('gridster-item-resizing');
        this.gridsterItem.gridster.movingItem = null;
        this.gridsterItem.gridster.previewStyle();
        this.gridsterItem.state.item.setSize(true);
        this.gridsterItem.state.item.checkItemChanges(this.gridsterItem.state.item, this.itemCopy);
        if (this.gridsterItem.gridster.state.options.resizable.stop) {
            this.gridsterItem.gridster.state.options.resizable.stop(this.gridsterItem.state.item, this.gridsterItem);
        }
    };
    GridsterResizable.prototype.handleN = function (e) {
        this.elemPosition[1] += e.pageY - this.lastMouse.pageY;
        this.elemPosition[3] += this.lastMouse.pageY - e.pageY;
        this.element.style.top = this.elemPosition[1] + 'px';
        this.element.style.height = this.elemPosition[3] + 'px';
        this.position = this.gridsterItem.gridster.pixelsToPosition(this.elemPosition[0], this.elemPosition[1]);
        if (this.gridsterItem.state.item.y !== this.position[1]) {
            this.itemBackup[1] = this.gridsterItem.state.item.y;
            this.itemBackup[3] = this.gridsterItem.state.item.rows;
            this.gridsterItem.state.item.rows += this.gridsterItem.state.item.y - this.position[1];
            this.gridsterItem.state.item.y = this.position[1];
            if (this.gridsterItem.state.item.y < 0 || this.gridsterItem.state.item.rows < 1 ||
                this.gridsterItem.gridster.checkCollision(this.gridsterItem.state.item)) {
                this.gridsterItem.state.item.y = this.itemBackup[1];
                this.gridsterItem.state.item.rows = this.itemBackup[3];
            }
            else {
                this.gridsterItem.gridster.previewStyle();
            }
        }
    };
    GridsterResizable.prototype.handleW = function (e) {
        this.elemPosition[0] += e.pageX - this.lastMouse.pageX;
        this.elemPosition[2] += this.lastMouse.pageX - e.pageX;
        this.element.style.left = this.elemPosition[0] + 'px';
        this.element.style.width = this.elemPosition[2] + 'px';
        this.position = this.gridsterItem.gridster.pixelsToPosition(this.elemPosition[0], this.elemPosition[1]);
        if (this.gridsterItem.state.item.x !== this.position[0]) {
            this.itemBackup[0] = this.gridsterItem.state.item.x;
            this.itemBackup[2] = this.gridsterItem.state.item.cols;
            this.gridsterItem.state.item.cols += this.gridsterItem.state.item.x - this.position[0];
            this.gridsterItem.state.item.x = this.position[0];
            if (this.gridsterItem.state.item.x < 0 || this.gridsterItem.state.item.cols < 1 ||
                this.gridsterItem.gridster.checkCollision(this.gridsterItem.state.item)) {
                this.gridsterItem.state.item.x = this.itemBackup[0];
                this.gridsterItem.state.item.cols = this.itemBackup[2];
            }
            else {
                this.gridsterItem.gridster.previewStyle();
            }
        }
    };
    GridsterResizable.prototype.handleS = function (e) {
        this.elemPosition[3] += e.pageY - this.lastMouse.pageY;
        this.element.style.height = this.elemPosition[3] + 'px';
        this.position = this.gridsterItem.gridster.pixelsToPosition(this.elemPosition[0], this.elemPosition[1] + this.elemPosition[3]);
        if ((this.gridsterItem.state.item.y + this.gridsterItem.state.item.rows) !== this.position[1]) {
            this.itemBackup[3] = this.gridsterItem.state.item.rows;
            this.gridsterItem.state.item.rows = this.position[1] - this.gridsterItem.state.item.y;
            if (this.gridsterItem.state.item.rows < 1 || this.gridsterItem.gridster.checkCollision(this.gridsterItem.state.item)) {
                this.gridsterItem.state.item.rows = this.itemBackup[3];
            }
            else {
                this.gridsterItem.gridster.previewStyle();
            }
        }
    };
    GridsterResizable.prototype.handleE = function (e) {
        this.elemPosition[2] += e.pageX - this.lastMouse.pageX;
        this.element.style.width = this.elemPosition[2] + 'px';
        this.position = this.gridsterItem.gridster.pixelsToPosition(this.elemPosition[0] + this.elemPosition[2], this.elemPosition[1]);
        if ((this.gridsterItem.state.item.x + this.gridsterItem.state.item.cols) !== this.position[0]) {
            this.itemBackup[2] = this.gridsterItem.state.item.cols;
            this.gridsterItem.state.item.cols = this.position[0] - this.gridsterItem.state.item.x;
            if (this.gridsterItem.state.item.cols < 1 || this.gridsterItem.gridster.checkCollision(this.gridsterItem.state.item)) {
                this.gridsterItem.state.item.cols = this.itemBackup[2];
            }
            else {
                this.gridsterItem.gridster.previewStyle();
            }
        }
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
    return GridsterResizable;
}());
GridsterResizable = GridsterResizable_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [HTMLElement, gridsterItem_component_1.GridsterItemComponent])
], GridsterResizable);
exports.GridsterResizable = GridsterResizable;
var GridsterResizable_1;
//# sourceMappingURL=gridsterResizable.service.js.map