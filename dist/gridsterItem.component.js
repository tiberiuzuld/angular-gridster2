"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridster_component_1 = require("./gridster.component");
var gridsterDraggable_service_1 = require("./gridsterDraggable.service");
var gridsterResizable_service_1 = require("./gridsterResizable.service");
var gridsterUtils_service_1 = require("./gridsterUtils.service");
var GridsterItemComponent = (function () {
    function GridsterItemComponent(el, gridster, renderer) {
        this.renderer = renderer;
        this.itemChange = new core_1.EventEmitter();
        this.itemResize = new core_1.EventEmitter();
        this.el = el.nativeElement;
        this.$item = {
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
        this.gridster = gridster;
        this.drag = new gridsterDraggable_service_1.GridsterDraggable(this, gridster);
        this.resize = new gridsterResizable_service_1.GridsterResizable(this, gridster);
    }
    GridsterItemComponent.prototype.ngOnInit = function () {
        this.updateOptions();
        this.gridster.addItem(this);
    };
    GridsterItemComponent.prototype.updateOptions = function () {
        this.$item = gridsterUtils_service_1.GridsterUtils.merge(this.$item, this.item, this.$item);
    };
    GridsterItemComponent.prototype.ngOnDestroy = function () {
        this.gridster.removeItem(this);
    };
    GridsterItemComponent.prototype.setSize = function (noCheck) {
        if (this.gridster.mobile) {
            this.top = 0;
            this.left = 0;
            this.width = this.gridster.curWidth - (this.gridster.$options.outerMargin ? 2 * this.gridster.$options.margin : 0);
            this.height = this.width / 2;
        }
        else {
            this.top = this.$item.y * this.gridster.curRowHeight;
            this.left = this.$item.x * this.gridster.curColWidth;
            this.width = this.$item.cols * this.gridster.curColWidth - this.gridster.$options.margin;
            this.height = this.$item.rows * this.gridster.curRowHeight - this.gridster.$options.margin;
        }
        if (!noCheck && this.top === this.itemTop && this.left === this.itemLeft &&
            this.width === this.itemWidth && this.height === this.itemHeight) {
            return;
        }
        if (this.gridster.$options.outerMargin) {
            this.itemMargin = this.gridster.$options.margin;
        }
        else {
            this.itemMargin = 0;
        }
        this.renderer.setStyle(this.el, 'display', 'block');
        this.renderer.setStyle(this.el, 'top', this.top + 'px');
        this.renderer.setStyle(this.el, 'left', this.left + 'px');
        this.renderer.setStyle(this.el, 'width', this.width + 'px');
        this.renderer.setStyle(this.el, 'height', this.height + 'px');
        this.renderer.setStyle(this.el, 'margin', this.itemMargin + 'px');
        if (this.width !== this.itemWidth || this.height !== this.itemHeight) {
            this.itemResize.emit(this.$item);
            if (this.gridster.$options.itemResizeCallback) {
                this.gridster.$options.itemResizeCallback(this.item, this);
            }
        }
        this.itemTop = this.top;
        this.itemLeft = this.left;
        this.itemWidth = this.width;
        this.itemHeight = this.height;
    };
    GridsterItemComponent.prototype.itemChanged = function () {
        this.itemChange.emit(this.item);
        if (this.gridster.$options.itemChangeCallback) {
            this.gridster.$options.itemChangeCallback(this.item, this);
        }
    };
    GridsterItemComponent.prototype.checkItemChanges = function (newValue, oldValue) {
        if (newValue.rows === oldValue.rows && newValue.cols === oldValue.cols && newValue.x === oldValue.x && newValue.y === oldValue.y) {
            return;
        }
        if (this.gridster.checkCollision(this)) {
            this.$item.x = oldValue.x;
            this.$item.y = oldValue.y;
            this.$item.cols = oldValue.cols;
            this.$item.rows = oldValue.rows;
        }
        else {
            this.item.cols = this.$item.cols;
            this.item.rows = this.$item.rows;
            this.item.x = this.$item.x;
            this.item.y = this.$item.y;
            this.gridster.calculateLayout();
            this.itemChanged();
        }
    };
    return GridsterItemComponent;
}());
GridsterItemComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'gridster-item',
                template: "<ng-content></ng-content> <div (mousedown)=\"resize.dragStart($event)\" (touchstart)=\"resize.dragStart($event)\"      [hidden]=\"!gridster.$options.resizable.handles.s || !resize.resizeEnabled\"      class=\"gridster-item-resizable-handler handle-s\"></div> <div (mousedown)=\"resize.dragStart($event)\" (touchstart)=\"resize.dragStart($event)\"      [hidden]=\"!gridster.$options.resizable.handles.e || !resize.resizeEnabled\"      class=\"gridster-item-resizable-handler handle-e\"></div> <div (mousedown)=\"resize.dragStart($event)\" (touchstart)=\"resize.dragStart($event)\"      [hidden]=\"!gridster.$options.resizable.handles.n || !resize.resizeEnabled\"      class=\"gridster-item-resizable-handler handle-n\"></div> <div (mousedown)=\"resize.dragStart($event)\" (touchstart)=\"resize.dragStart($event)\"      [hidden]=\"!gridster.$options.resizable.handles.w || !resize.resizeEnabled\"      class=\"gridster-item-resizable-handler handle-w\"></div> <div (mousedown)=\"resize.dragStart($event)\" (touchstart)=\"resize.dragStart($event)\"      [hidden]=\"!gridster.$options.resizable.handles.se || !resize.resizeEnabled\"      class=\"gridster-item-resizable-handler handle-se\"></div> <div (mousedown)=\"resize.dragStart($event)\" (touchstart)=\"resize.dragStart($event)\"      [hidden]=\"!gridster.$options.resizable.handles.ne || !resize.resizeEnabled\"      class=\"gridster-item-resizable-handler handle-ne\"></div> <div (mousedown)=\"resize.dragStart($event)\" (touchstart)=\"resize.dragStart($event)\"      [hidden]=\"!gridster.$options.resizable.handles.sw || !resize.resizeEnabled\"      class=\"gridster-item-resizable-handler handle-sw\"></div> <div (mousedown)=\"resize.dragStart($event)\" (touchstart)=\"resize.dragStart($event)\"      [hidden]=\"!gridster.$options.resizable.handles.nw || !resize.resizeEnabled\"      class=\"gridster-item-resizable-handler handle-nw\"></div>",
                styles: [":host {   -webkit-user-select: none;   -moz-user-select: none;   -ms-user-select: none;   user-select: none;   box-sizing: border-box;   z-index: 1;   position: absolute;   overflow: hidden;   transition: .3s;   display: none;   background: white; }  :host(.gridster-item-moving) {   cursor: move; }  :host(.gridster-item-resizing), :host(.gridster-item-moving) {   transition: 0s;   z-index: 2;   box-shadow: 0 0 5px 5px rgba(0, 0, 0, .2), 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0 rgba(0, 0, 0, .12); }  .gridster-item-resizable-handler {   position: absolute;   z-index: 2; }  .gridster-item-resizable-handler.handle-n {   cursor: n-resize;   height: 10px;   right: 0;   top: 0;   left: 0; }  .gridster-item-resizable-handler.handle-e {   cursor: e-resize;   width: 10px;   bottom: 0;   right: 0;   top: 0; }  .gridster-item-resizable-handler.handle-s {   cursor: s-resize;   height: 10px;   right: 0;   bottom: 0;   left: 0; }  .gridster-item-resizable-handler.handle-w {   cursor: w-resize;   width: 10px;   left: 0;   top: 0;   bottom: 0; }  .gridster-item-resizable-handler.handle-ne {   cursor: ne-resize;   width: 10px;   height: 10px;   right: 0;   top: 0; }  .gridster-item-resizable-handler.handle-nw {   cursor: nw-resize;   width: 10px;   height: 10px;   left: 0;   top: 0; }  .gridster-item-resizable-handler.handle-se {   cursor: se-resize;   width: 0;   height: 0;   right: 0;   bottom: 0;   border-style: solid;   border-width: 0 0 10px 10px;   border-color: transparent; }  .gridster-item-resizable-handler.handle-sw {   cursor: sw-resize;   width: 10px;   height: 10px;   left: 0;   bottom: 0; }  :host /deep/ .gridster-item-content {   -webkit-user-select: auto;   -moz-user-select: auto;   -ms-user-select: auto;   user-select: auto; }  :host(:hover) .gridster-item-resizable-handler.handle-se {   border-color: transparent transparent #ccc }"]
            },] },
];
/** @nocollapse */
GridsterItemComponent.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: gridster_component_1.GridsterComponent, decorators: [{ type: core_1.Host },] },
    { type: core_1.Renderer2, },
]; };
GridsterItemComponent.propDecorators = {
    'item': [{ type: core_1.Input },],
    'itemChange': [{ type: core_1.Output },],
    'itemResize': [{ type: core_1.Output },],
};
exports.GridsterItemComponent = GridsterItemComponent;
//# sourceMappingURL=gridsterItem.component.js.map