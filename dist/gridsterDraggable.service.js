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
var _ = require("lodash");
var gridsterSwap_service_1 = require("./gridsterSwap.service");
var gridsterScroll_service_1 = require("./gridsterScroll.service");
var GridsterDraggable = GridsterDraggable_1 = (function () {
    function GridsterDraggable(element, gridsterItem) {
        this.element = element;
        this.gridsterItem = gridsterItem;
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
        e.preventDefault();
        e.stopPropagation();
        if (e.pageX === undefined && e.touches) {
            GridsterDraggable_1.touchEvent(e);
        }
        this.dragFunction = this.dragMove.bind(this);
        this.dragStopFunction = this.dragStop.bind(this);
        document.addEventListener('mousemove', this.dragFunction);
        document.addEventListener('mouseup', this.dragStopFunction);
        document.addEventListener('touchmove', this.dragFunction);
        document.addEventListener('touchend', this.dragStopFunction);
        document.addEventListener('touchcancel', this.dragStopFunction);
        this.element.classList.add('gridster-item-moving');
        this.lastMouse.pageX = e.pageX;
        this.lastMouse.pageY = e.pageY;
        this.elemPosition[0] = parseInt(this.element.style.left, 10);
        this.elemPosition[1] = parseInt(this.element.style.top, 10);
        this.elemPosition[2] = this.element.offsetWidth;
        this.elemPosition[3] = this.element.offsetHeight;
        this.itemCopy = _.clone(this.gridsterItem.state.item);
        this.gridsterItem.gridster.movingItem = this.gridsterItem.state.item;
        this.gridsterItem.gridster.previewStyle();
    };
    GridsterDraggable.prototype.dragMove = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.pageX === undefined && e.touches) {
            GridsterDraggable_1.touchEvent(e);
        }
        this.elemPosition[0] += e.pageX - this.lastMouse.pageX;
        this.elemPosition[1] += e.pageY - this.lastMouse.pageY;
        gridsterScroll_service_1.scroll(this.elemPosition, this.gridsterItem, e, this.lastMouse, this.calculateItemPosition.bind(this));
        this.lastMouse.pageX = e.pageX;
        this.lastMouse.pageY = e.pageY;
        this.calculateItemPosition();
    };
    GridsterDraggable.prototype.dragStop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.gridsterItem.gridster.state.options.swap) {
            gridsterSwap_service_1.GridsterSwap.GridsterSwap(this.gridsterItem, this.elemPosition);
        }
        gridsterScroll_service_1.cancelScroll();
        document.removeEventListener('mousemove', this.dragFunction);
        document.removeEventListener('mouseup', this.dragStopFunction);
        document.removeEventListener('touchmove', this.dragFunction);
        document.removeEventListener('touchend', this.dragStopFunction);
        document.removeEventListener('touchcancel', this.dragStopFunction);
        this.element.classList.remove('gridster-item-moving');
        this.gridsterItem.gridster.movingItem = null;
        this.gridsterItem.setSize(true);
        this.gridsterItem.gridster.previewStyle();
        this.gridsterItem.checkItemChanges(this.gridsterItem.state.item, this.itemCopy);
        if (this.gridsterItem.gridster.state.options.draggable.stop) {
            this.gridsterItem.gridster.state.options.draggable.stop(this.gridsterItem.state.item, this.gridsterItem);
        }
    };
    GridsterDraggable.prototype.calculateItemPosition = function () {
        this.element.style.left = this.elemPosition[0] + 'px';
        this.element.style.top = this.elemPosition[1] + 'px';
        this.position = this.gridsterItem.gridster.pixelsToPosition(this.elemPosition[0], this.elemPosition[1]);
        if (this.position[0] !== this.gridsterItem.state.item.x || this.position[1] !== this.gridsterItem.state.item.y) {
            this.positionBackup[0] = this.gridsterItem.state.item.x;
            this.positionBackup[1] = this.gridsterItem.state.item.y;
            this.gridsterItem.state.item.x = this.position[0];
            this.gridsterItem.state.item.y = this.position[1];
            if (this.gridsterItem.gridster.checkCollision(this.gridsterItem.state.item)) {
                this.gridsterItem.state.item.x = this.positionBackup[0];
                this.gridsterItem.state.item.y = this.positionBackup[1];
            }
            else {
                this.gridsterItem.gridster.previewStyle();
            }
        }
    };
    GridsterDraggable.prototype.toggle = function (enable) {
        var enableDrag = this.gridsterItem.state.item.dragEnabled === undefined ? enable : this.gridsterItem.state.item.dragEnabled;
        if (!this.enabled && enableDrag) {
            this.enabled = !this.enabled;
            this.dragStartFunction = this.dragStart.bind(this);
            this.element.addEventListener('mousedown', this.dragStartFunction);
            this.element.addEventListener('touchstart', this.dragStartFunction);
        }
        else if (this.enabled && !enableDrag) {
            this.enabled = !this.enabled;
            this.element.removeEventListener('mousedown', this.dragStartFunction);
            this.element.removeEventListener('touchstart', this.dragStartFunction);
        }
    };
    return GridsterDraggable;
}());
GridsterDraggable = GridsterDraggable_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [HTMLElement, gridsterItem_component_1.GridsterItemComponent])
], GridsterDraggable);
exports.GridsterDraggable = GridsterDraggable;
var GridsterDraggable_1;
//# sourceMappingURL=gridsterDraggable.service.js.map