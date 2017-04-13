"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridsterConfig_constant_1 = require("./gridsterConfig.constant");
var gridsterUtils_service_1 = require("./gridsterUtils.service");
var GridsterComponent = (function () {
    function GridsterComponent(el, renderer) {
        this.renderer = renderer;
        this.el = el.nativeElement;
        this.state = {
            mobile: false,
            curWidth: 0,
            curHeight: 0,
            options: JSON.parse(JSON.stringify(gridsterConfig_constant_1.GridsterConfigService)),
            scrollBarPresent: false,
            grid: [],
            columns: gridsterConfig_constant_1.GridsterConfigService.minCols,
            rows: gridsterConfig_constant_1.GridsterConfigService.minRows,
            curColWidth: 0,
            curRowHeight: 0
        };
        this.state.options.draggable.stop = undefined;
        this.state.options.resizable.stop = undefined;
        this.state.options.itemChangeCallback = undefined;
        this.state.options.itemResizeCallback = undefined;
    }
    ;
    GridsterComponent.prototype.ngOnInit = function () {
        this.options.optionsChanged = this.optionsChanged.bind(this);
        this.state.options = gridsterUtils_service_1.GridsterUtils.merge(this.state.options, this.options, this.state.options);
        this.setGridSize();
        this.calculateLayoutDebounce = gridsterUtils_service_1.GridsterUtils.debounce(this.calculateLayout.bind(this), 5);
        this.calculateLayoutDebounce();
        this.onResizeFunction = this.onResize.bind(this);
        this.windowResize = this.renderer.listenGlobal('window', 'resize', this.onResizeFunction);
    };
    ;
    GridsterComponent.prototype.ngDoCheck = function () {
        var height;
        var width;
        if (this.state.options.gridType === 'fit' && !this.state.mobile) {
            width = this.el.offsetWidth;
            height = this.el.offsetHeight;
        }
        else {
            width = this.el.clientWidth;
            height = this.el.clientHeight;
        }
        if ((width !== this.state.curWidth || height !== this.state.curHeight) && this.checkIfToResize()) {
            this.onResize();
        }
    };
    GridsterComponent.prototype.optionsChanged = function () {
        this.state.options = gridsterUtils_service_1.GridsterUtils.merge(this.state.options, this.options, this.state.options);
        this.calculateLayout();
    };
    GridsterComponent.prototype.ngOnDestroy = function () {
        this.windowResize();
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
    GridsterComponent.prototype.checkIfToResize = function () {
        var clientWidth = this.el.clientWidth;
        var offsetWidth = this.el.offsetWidth;
        var scrollWidth = this.el.scrollWidth;
        var clientHeight = this.el.clientHeight;
        var offsetHeight = this.el.offsetHeight;
        var scrollHeight = this.el.scrollHeight;
        var verticalScrollPresent = clientWidth < offsetWidth && scrollHeight > offsetHeight && scrollHeight - offsetHeight < offsetWidth - clientWidth;
        var horizontalScrollPresent = clientHeight < offsetHeight && scrollWidth > offsetWidth && scrollWidth - offsetWidth < offsetHeight - clientHeight;
        if (verticalScrollPresent) {
            return false;
        }
        return !horizontalScrollPresent;
    };
    ;
    GridsterComponent.prototype.setGridSize = function () {
        var width = this.el.clientWidth;
        var height = this.el.clientHeight;
        if (this.state.options.gridType === 'fit' && !this.state.mobile) {
            width = this.el.offsetWidth;
            height = this.el.offsetHeight;
        }
        else {
            width = this.el.clientWidth;
            height = this.el.clientHeight;
        }
        this.state.curWidth = width;
        this.state.curHeight = height;
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
        var addClass;
        var removeClass1;
        var removeClass2;
        var removeClass3;
        if (this.state.options.gridType === 'fit') {
            addClass = 'fit';
            removeClass1 = 'scrollVertical';
            removeClass2 = 'scrollHorizontal';
            removeClass3 = 'fixed';
        }
        else if (this.state.options.gridType === 'scrollVertical') {
            this.state.curRowHeight = this.state.curColWidth;
            addClass = 'scrollVertical';
            removeClass1 = 'fit';
            removeClass2 = 'scrollHorizontal';
            removeClass3 = 'fixed';
        }
        else if (this.state.options.gridType === 'scrollHorizontal') {
            this.state.curColWidth = this.state.curRowHeight;
            addClass = 'scrollHorizontal';
            removeClass1 = 'fit';
            removeClass2 = 'scrollVertical';
            removeClass3 = 'fixed';
        }
        else if (this.state.options.gridType === 'fixed') {
            this.state.curColWidth = this.state.options.fixedColWidth;
            this.state.curRowHeight = this.state.options.fixedRowHeight;
            addClass = 'fixed';
            removeClass1 = 'fit';
            removeClass2 = 'scrollVertical';
            removeClass3 = 'scrollHorizontal';
        }
        this.renderer.setElementClass(this.el, addClass, true);
        this.renderer.setElementClass(this.el, removeClass1, false);
        this.renderer.setElementClass(this.el, removeClass2, false);
        this.renderer.setElementClass(this.el, removeClass3, false);
        if (!this.state.mobile && this.state.options.mobileBreakpoint > this.state.curWidth) {
            this.state.mobile = !this.state.mobile;
            this.renderer.setElementClass(this.el, 'mobile', true);
        }
        else if (this.state.mobile && this.state.options.mobileBreakpoint < this.state.curWidth) {
            this.state.mobile = !this.state.mobile;
            this.renderer.setElementClass(this.el, 'mobile', false);
        }
        var widgetsIndex = this.state.grid.length - 1;
        for (; widgetsIndex >= 0; widgetsIndex--) {
            this.state.grid[widgetsIndex].setSize();
            this.state.grid[widgetsIndex].drag.toggle(this.state.options.draggable.enabled);
            this.state.grid[widgetsIndex].resize.toggle(this.state.options.resizable.enabled);
        }
        setTimeout(this.ngDoCheck.bind(this), 100);
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
                JSON.stringify(item, ['cols', 'rows', 'x', 'y']));
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
        var noNegativePosition = item.y > -1 && item.x > -1;
        var maxGridCols = item.cols + item.x <= this.state.options.maxCols;
        var maxGridRows = item.rows + item.y <= this.state.options.maxRows;
        var maxItemCols = item.maxItemCols === undefined ? this.state.options.maxItemCols : item.maxItemCols;
        var minItemCols = item.minItemCols === undefined ? this.state.options.minItemCols : item.minItemCols;
        var maxItemRows = item.maxItemRows === undefined ? this.state.options.maxItemRows : item.maxItemRows;
        var minItemRows = item.minItemRows === undefined ? this.state.options.minItemRows : item.minItemRows;
        var inColsLimits = item.cols <= maxItemCols && item.cols >= minItemCols;
        var inRowsLimits = item.rows <= maxItemRows && item.rows >= minItemRows;
        if (!(noNegativePosition && maxGridCols && maxGridRows && inColsLimits && inRowsLimits)) {
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
                JSON.stringify(item, ['cols', 'rows', 'x', 'y']));
        }
    };
    GridsterComponent.prototype.pixelsToPosition = function (x, y, roundingMethod) {
        return [roundingMethod(Math.abs(x) / this.state.curColWidth), roundingMethod(Math.abs(y) / this.state.curRowHeight)];
    };
    ;
    GridsterComponent.prototype.positionXToPixels = function (x) {
        return x * this.state.curColWidth;
    };
    GridsterComponent.prototype.positionYToPixels = function (y) {
        return y * this.state.curRowHeight;
    };
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
GridsterComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'gridster',
                template: '<ng-content></ng-content><gridster-preview></gridster-preview>',
                styles: [":host {   position: relative;   display: flex;   overflow: auto;   flex: 1 auto;   background: grey;   width: 100%;   height: 100%; }  :host(.fit) {   overflow-x: hidden;   overflow-y: hidden; }  :host(.scrollVertical) {   overflow-x: hidden;   overflow-y: auto; }  :host(.scrollHorizontal) {   overflow-x: auto;   overflow-y: hidden; }  :host(.fixed) {   overflow: auto; }  :host(.mobile) {   overflow-x: hidden;   overflow-y: auto;   display: block; }  :host(.mobile) /deep/ gridster-item {   position: relative; }  :host gridster-preview {   background: rgba(0, 0, 0, 0.15);   position: absolute; }"]
            },] },
];
/** @nocollapse */
GridsterComponent.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: core_1.Renderer, },
]; };
GridsterComponent.propDecorators = {
    'options': [{ type: core_1.Input },],
};
exports.GridsterComponent = GridsterComponent;
//# sourceMappingURL=gridster.component.js.map