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
var _ = require("lodash");
var gridsterConfig_constant_1 = require("./gridsterConfig.constant");
var detectElementResize_1 = require("./detectElementResize");
var GridsterComponent = (function () {
    function GridsterComponent(el) {
        this.el = el;
        this.state = {
            element: el.nativeElement,
            mobile: false,
            curWidth: 0,
            curHeight: 0,
            options: _.merge({}, gridsterConfig_constant_1.GridsterConfigService),
            scrollBarPresent: false,
            grid: [],
            columns: gridsterConfig_constant_1.GridsterConfigService.minCols,
            rows: gridsterConfig_constant_1.GridsterConfigService.minRows,
            curColWidth: 0,
            curRowHeight: 0
        };
    }
    ;
    GridsterComponent.prototype.ngOnInit = function () {
        this.options.optionsChanged = this.optionsChanged.bind(this);
        this.state.options = _.merge(this.state.options, this.options);
        this.setGridSize();
        this.detectScrollBarLayout = _.debounce(this.detectScrollBar.bind(this), 10);
        this.calculateLayoutDebounce = _.debounce(this.calculateLayout.bind(this), 5);
        this.state.element.addEventListener('transitionend', this.detectScrollBarLayout);
        this.calculateLayoutDebounce();
        this.onResizeFunction = this.onResize.bind(this);
        detectElementResize_1.addResizeListener(this.state.element, this.onResizeFunction);
    };
    ;
    GridsterComponent.prototype.optionsChanged = function () {
        this.state.options = _.merge(this.state.options, this.options);
        this.calculateLayout();
    };
    GridsterComponent.prototype.ngOnDestroy = function () {
        detectElementResize_1.removeResizeListener(this.state.element, this.onResizeFunction);
        if (typeof this.cleanCallback === 'function') {
            this.cleanCallback();
        }
    };
    ;
    GridsterComponent.prototype.onResize = function () {
        this.setGridSize();
        this.calculateLayoutDebounce();
    };
    ;
    GridsterComponent.prototype.detectScrollBar = function () {
        if (this.state.scrollBarPresent && this.state.element.scrollHeight <= this.state.element.offsetHeight &&
            this.state.element.offsetWidth - this.state.element.clientWidth >=
                this.state.element.scrollHeight - this.state.element.offsetHeight) {
            this.state.scrollBarPresent = !this.state.scrollBarPresent;
            this.onResize();
        }
        else if (!this.state.scrollBarPresent && this.state.element.scrollHeight > this.state.element.offsetHeight &&
            this.state.element.offsetWidth - this.state.element.clientWidth <
                this.state.element.scrollHeight - this.state.element.offsetHeight) {
            this.state.scrollBarPresent = !this.state.scrollBarPresent;
            this.onResize();
        }
        if (this.state.scrollBarPresent && this.state.element.scrollWidth <= this.state.element.offsetWidth &&
            this.state.element.offsetHeight - this.state.element.clientHeight >=
                this.state.element.scrollWidth - this.state.element.offsetWidth) {
            this.state.scrollBarPresent = !this.state.scrollBarPresent;
            this.onResize();
        }
        else if (!this.state.scrollBarPresent && this.state.element.scrollWidth > this.state.element.offsetWidth &&
            this.state.element.offsetHeight - this.state.element.clientHeight <
                this.state.element.scrollWidth - this.state.element.offsetWidth) {
            this.state.scrollBarPresent = !this.state.scrollBarPresent;
            this.onResize();
        }
    };
    ;
    GridsterComponent.prototype.setGridSize = function () {
        if (this.state.options.gridType === 'fit' && !this.state.mobile) {
            this.state.curWidth = this.state.element.offsetWidth;
            this.state.curHeight = this.state.element.offsetHeight;
        }
        else {
            this.state.curWidth = this.state.element.clientWidth;
            this.state.curHeight = this.state.element.clientHeight;
        }
    };
    ;
    GridsterComponent.prototype.setGridDimensions = function () {
        var rows = this.state.options.minRows, columns = this.state.options.minCols;
        var widgetsIndex = this.state.grid.length - 1;
        for (; widgetsIndex >= 0; widgetsIndex--) {
            rows = Math.max(rows, this.state.grid[widgetsIndex].y + this.state.grid[widgetsIndex].rows);
            columns = Math.max(columns, this.state.grid[widgetsIndex].x + this.state.grid[widgetsIndex].cols);
        }
        this.state.columns = columns;
        this.state.rows = rows;
    };
    ;
    GridsterComponent.prototype.calculateLayout = function () {
        // check to compact up
        this.checkCompactUp();
        // check to compact left
        this.checkCompactLeft();
        this.setGridDimensions();
        if (this.state.options.outerMargin) {
            this.state.curColWidth = Math.floor((this.state.curWidth - this.state.options.margin) / this.state.columns);
            this.state.curRowHeight = Math.floor((this.state.curHeight - this.state.options.margin) / this.state.rows);
        }
        else {
            this.state.curColWidth = Math.floor((this.state.curWidth + this.state.options.margin) / this.state.columns);
            this.state.curRowHeight = Math.floor((this.state.curHeight + this.state.options.margin) / this.state.rows);
        }
        if (this.state.options.gridType === 'fit') {
            this.state.element.classList.add('fit');
            this.state.element.classList.remove('scrollVertical');
            this.state.element.classList.remove('scrollHorizontal');
        }
        else if (this.state.options.gridType === 'scrollVertical') {
            this.state.curRowHeight = this.state.curColWidth;
            this.state.element.classList.add('scrollVertical');
            this.state.element.classList.remove('fit');
            this.state.element.classList.remove('scrollHorizontal');
        }
        else if (this.state.options.gridType === 'scrollHorizontal') {
            this.state.curColWidth = this.state.curRowHeight;
            this.state.element.classList.add('scrollHorizontal');
            this.state.element.classList.remove('fit');
            this.state.element.classList.remove('scrollVertical');
        }
        if (!this.state.mobile && this.state.options.mobileBreakpoint > this.state.curWidth) {
            this.state.mobile = !this.state.mobile;
            this.state.element.classList.add('mobile');
        }
        else if (this.state.mobile && this.state.options.mobileBreakpoint < this.state.curWidth) {
            this.state.mobile = !this.state.mobile;
            this.state.element.classList.remove('mobile');
        }
        var widgetsIndex = this.state.grid.length - 1;
        for (; widgetsIndex >= 0; widgetsIndex--) {
            this.state.grid[widgetsIndex].setSize();
            this.state.grid[widgetsIndex].drag.toggle(this.state.options.draggable.enabled);
        }
        this.detectScrollBarLayout();
    };
    ;
    GridsterComponent.prototype.addItem = function (item) {
        if (item.cols === undefined) {
            item.cols = this.state.options.defaultItemCols;
        }
        if (item.rows === undefined) {
            item.rows = this.state.options.defaultItemRows;
        }
        if (item.x === undefined || item.y === undefined) {
            this.autoPositionItem(item);
        }
        else if (this.checkCollision(item)) {
            console.warn('Can\'t be placed in the bounds of the dashboard, trying to auto position!/n' +
                JSON.stringify(item, ['cols', 'rows', 'x', 'y', 'id']));
            item.x = undefined;
            item.y = undefined;
            this.autoPositionItem(item);
        }
        this.state.grid.push(item);
        this.calculateLayoutDebounce();
        if (item.initCallback) {
            item.initCallback(item);
        }
    };
    GridsterComponent.prototype.removeItem = function (item) {
        this.state.grid.splice(this.state.grid.indexOf(item), 1);
        this.calculateLayoutDebounce();
    };
    GridsterComponent.prototype.checkCollision = function (item) {
        if (!(item.y > -1 && item.x > -1 && item.cols + item.x <= this.state.options.maxCols &&
            item.rows + item.y <= this.state.options.maxRows)) {
            return true;
        }
        return this.findItemWithItem(item);
    };
    GridsterComponent.prototype.findItemWithItem = function (item) {
        var widgetsIndex = this.state.grid.length - 1, widget;
        for (; widgetsIndex >= 0; widgetsIndex--) {
            widget = this.state.grid[widgetsIndex];
            if (widget !== item && widget.x < item.x + item.cols && widget.x + widget.cols > item.x &&
                widget.y < item.y + item.rows && widget.y + widget.rows > item.y) {
                return widget;
            }
        }
    };
    ;
    GridsterComponent.prototype.autoPositionItem = function (item) {
        this.setGridDimensions();
        var rowsIndex = 0, colsIndex;
        for (; rowsIndex < this.state.rows; rowsIndex++) {
            item.y = rowsIndex;
            colsIndex = 0;
            for (; colsIndex < this.state.columns; colsIndex++) {
                item.x = colsIndex;
                if (!this.checkCollision(item)) {
                    return;
                }
            }
        }
        if (this.state.rows >= this.state.columns && this.state.options.maxCols > this.state.columns) {
            item.x = this.state.columns;
            item.y = 0;
        }
        else if (this.state.options.maxRows > this.state.rows) {
            item.y = this.state.rows;
            item.x = 0;
        }
        else {
            console.warn('Can\'t be placed in the bounds of the dashboard!/n' +
                JSON.stringify(item, ['cols', 'rows', 'x', 'y', 'id']));
        }
    };
    GridsterComponent.prototype.pixelsToPosition = function (x, y) {
        if (this.state.options.outerMargin) {
            x -= this.state.options.margin;
            y -= this.state.options.margin;
        }
        return [Math.abs(Math.round(x / this.state.curColWidth)), Math.abs(Math.round(y / this.state.curRowHeight))];
    };
    ;
    GridsterComponent.prototype.checkCompactUp = function () {
        if (this.state.options.compactUp) {
            var widgetMovedUp = false, widget = void 0, moved = void 0;
            var l = this.state.grid.length;
            for (var i = 0; i < l; i++) {
                widget = this.state.grid[i];
                moved = this.moveUpTillCollision(widget);
                if (moved) {
                    widgetMovedUp = true;
                    widget.itemChanged();
                }
            }
            if (widgetMovedUp) {
                this.checkCompactUp();
                return widgetMovedUp;
            }
        }
    };
    GridsterComponent.prototype.moveUpTillCollision = function (item) {
        item.y -= 1;
        if (this.checkCollision(item)) {
            item.y += 1;
            return false;
        }
        else {
            this.moveUpTillCollision(item);
            return true;
        }
    };
    GridsterComponent.prototype.checkCompactLeft = function () {
        if (this.state.options.compactLeft) {
            var widgetMovedUp = false, widget = void 0, moved = void 0;
            var l = this.state.grid.length;
            for (var i = 0; i < l; i++) {
                widget = this.state.grid[i];
                moved = this.moveLeftTillCollision(widget);
                if (moved) {
                    widgetMovedUp = true;
                    widget.itemChanged();
                }
            }
            if (widgetMovedUp) {
                this.checkCompactLeft();
                return widgetMovedUp;
            }
        }
    };
    GridsterComponent.prototype.moveLeftTillCollision = function (item) {
        item.x -= 1;
        if (this.checkCollision(item)) {
            item.x += 1;
            return false;
        }
        else {
            this.moveUpTillCollision(item);
            return true;
        }
    };
    return GridsterComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], GridsterComponent.prototype, "options", void 0);
GridsterComponent = __decorate([
    core_1.Component({
        selector: 'gridster',
        template: '<ng-content></ng-content><gridster-preview></gridster-preview>',
        styles: [require('./gridster.css')]
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], GridsterComponent);
exports.GridsterComponent = GridsterComponent;
//# sourceMappingURL=gridster.component.js.map