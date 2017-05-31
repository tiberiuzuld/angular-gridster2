"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridsterConfig_constant_1 = require("./gridsterConfig.constant");
var gridsterUtils_service_1 = require("./gridsterUtils.service");
var GridsterComponent = (function () {
    function GridsterComponent(el, renderer) {
        this.renderer = renderer;
        this.el = el.nativeElement;
        this.$options = JSON.parse(JSON.stringify(gridsterConfig_constant_1.GridsterConfigService));
        this.mobile = false;
        this.curWidth = 0;
        this.curHeight = 0;
        this.scrollBarPresent = false;
        this.grid = [];
        this.curColWidth = 0;
        this.curRowHeight = 0;
        this.$options.draggable.stop = undefined;
        this.$options.resizable.stop = undefined;
        this.$options.itemChangeCallback = undefined;
        this.$options.itemResizeCallback = undefined;
    }
    GridsterComponent.prototype.ngOnInit = function () {
        this.options.optionsChanged = this.optionsChanged.bind(this);
        this.$options = gridsterUtils_service_1.GridsterUtils.merge(this.$options, this.options, this.$options);
        this.columns = gridsterConfig_constant_1.GridsterConfigService.minCols;
        this.rows = gridsterConfig_constant_1.GridsterConfigService.minRows;
        this.setGridSize();
        this.calculateLayoutDebounce = gridsterUtils_service_1.GridsterUtils.debounce(this.calculateLayout.bind(this), 5);
        this.calculateLayoutDebounce();
        this.onResizeFunction = this.onResize.bind(this);
        this.windowResize = this.renderer.listen('window', 'resize', this.onResizeFunction);
    };
    GridsterComponent.prototype.ngDoCheck = function () {
        var height;
        var width;
        if (this.$options.gridType === 'fit' && !this.mobile) {
            width = this.el.offsetWidth;
            height = this.el.offsetHeight;
        }
        else {
            width = this.el.clientWidth;
            height = this.el.clientHeight;
        }
        if ((width !== this.curWidth || height !== this.curHeight) && this.checkIfToResize()) {
            this.onResize();
        }
    };
    GridsterComponent.prototype.optionsChanged = function () {
        this.$options = gridsterUtils_service_1.GridsterUtils.merge(this.$options, this.options, this.$options);
        var widgetsIndex = this.grid.length - 1, widget;
        for (; widgetsIndex >= 0; widgetsIndex--) {
            widget = this.grid[widgetsIndex];
            widget.updateOptions();
        }
        this.calculateLayout();
    };
    GridsterComponent.prototype.ngOnDestroy = function () {
        this.windowResize();
        if (typeof this.cleanCallback === 'function') {
            this.cleanCallback();
        }
    };
    GridsterComponent.prototype.onResize = function () {
        this.setGridSize();
        this.calculateLayoutDebounce();
    };
    GridsterComponent.prototype.checkIfToResize = function () {
        var clientWidth = this.el.clientWidth;
        var offsetWidth = this.el.offsetWidth;
        var scrollWidth = this.el.scrollWidth;
        var clientHeight = this.el.clientHeight;
        var offsetHeight = this.el.offsetHeight;
        var scrollHeight = this.el.scrollHeight;
        var verticalScrollPresent = clientWidth < offsetWidth && scrollHeight > offsetHeight
            && scrollHeight - offsetHeight < offsetWidth - clientWidth;
        var horizontalScrollPresent = clientHeight < offsetHeight
            && scrollWidth > offsetWidth && scrollWidth - offsetWidth < offsetHeight - clientHeight;
        if (verticalScrollPresent) {
            return false;
        }
        return !horizontalScrollPresent;
    };
    GridsterComponent.prototype.setGridSize = function () {
        var width = this.el.clientWidth;
        var height = this.el.clientHeight;
        if (this.$options.gridType === 'fit' && !this.mobile) {
            width = this.el.offsetWidth;
            height = this.el.offsetHeight;
        }
        else {
            width = this.el.clientWidth;
            height = this.el.clientHeight;
        }
        this.curWidth = width;
        this.curHeight = height;
    };
    GridsterComponent.prototype.setGridDimensions = function () {
        var rows = this.$options.minRows, columns = this.$options.minCols;
        var widgetsIndex = this.grid.length - 1;
        for (; widgetsIndex >= 0; widgetsIndex--) {
            rows = Math.max(rows, this.grid[widgetsIndex].$item.y + this.grid[widgetsIndex].$item.rows);
            columns = Math.max(columns, this.grid[widgetsIndex].$item.x + this.grid[widgetsIndex].$item.cols);
        }
        this.columns = columns;
        this.rows = rows;
    };
    GridsterComponent.prototype.calculateLayout = function () {
        // check to compact up
        this.checkCompactUp();
        // check to compact left
        this.checkCompactLeft();
        this.setGridDimensions();
        if (this.$options.outerMargin) {
            this.curColWidth = Math.floor((this.curWidth - this.$options.margin) / this.columns);
            this.curRowHeight = Math.floor((this.curHeight - this.$options.margin) / this.rows);
        }
        else {
            this.curColWidth = Math.floor((this.curWidth + this.$options.margin) / this.columns);
            this.curRowHeight = Math.floor((this.curHeight + this.$options.margin) / this.rows);
        }
        var addClass;
        var removeClass1;
        var removeClass2;
        var removeClass3;
        if (this.$options.gridType === 'fit') {
            addClass = 'fit';
            removeClass1 = 'scrollVertical';
            removeClass2 = 'scrollHorizontal';
            removeClass3 = 'fixed';
        }
        else if (this.$options.gridType === 'scrollVertical') {
            this.curRowHeight = this.curColWidth;
            addClass = 'scrollVertical';
            removeClass1 = 'fit';
            removeClass2 = 'scrollHorizontal';
            removeClass3 = 'fixed';
        }
        else if (this.$options.gridType === 'scrollHorizontal') {
            this.curColWidth = this.curRowHeight;
            addClass = 'scrollHorizontal';
            removeClass1 = 'fit';
            removeClass2 = 'scrollVertical';
            removeClass3 = 'fixed';
        }
        else if (this.$options.gridType === 'fixed') {
            this.curColWidth = this.$options.fixedColWidth;
            this.curRowHeight = this.$options.fixedRowHeight;
            addClass = 'fixed';
            removeClass1 = 'fit';
            removeClass2 = 'scrollVertical';
            removeClass3 = 'scrollHorizontal';
        }
        this.renderer.addClass(this.el, addClass);
        this.renderer.removeClass(this.el, removeClass1);
        this.renderer.removeClass(this.el, removeClass2);
        this.renderer.removeClass(this.el, removeClass3);
        if (!this.mobile && this.$options.mobileBreakpoint > this.curWidth) {
            this.mobile = !this.mobile;
            this.renderer.addClass(this.el, 'mobile');
        }
        else if (this.mobile && this.$options.mobileBreakpoint < this.curWidth) {
            this.mobile = !this.mobile;
            this.renderer.removeClass(this.el, 'mobile');
        }
        this.gridLines.updateGrid(!!this.movingItem);
        var widgetsIndex = this.grid.length - 1, widget;
        for (; widgetsIndex >= 0; widgetsIndex--) {
            widget = this.grid[widgetsIndex];
            widget.setSize(false);
            widget.drag.toggle(this.$options.draggable.enabled);
            widget.resize.toggle(this.$options.resizable.enabled);
        }
        setTimeout(this.ngDoCheck.bind(this), 100);
    };
    GridsterComponent.prototype.addItem = function (itemComponent) {
        if (itemComponent.$item.cols === undefined) {
            itemComponent.$item.cols = this.$options.defaultItemCols;
            itemComponent.item.cols = itemComponent.$item.cols;
            itemComponent.itemChanged();
        }
        if (itemComponent.$item.rows === undefined) {
            itemComponent.$item.rows = this.$options.defaultItemRows;
            itemComponent.item.rows = itemComponent.$item.rows;
            itemComponent.itemChanged();
        }
        if (itemComponent.$item.x === undefined || itemComponent.$item.y === undefined) {
            this.autoPositionItem(itemComponent);
        }
        else if (this.checkCollision(itemComponent)) {
            console.warn('Can\'t be placed in the bounds of the dashboard, trying to auto position!/n' +
                JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
            itemComponent.$item.x = undefined;
            itemComponent.$item.y = undefined;
            this.autoPositionItem(itemComponent);
        }
        this.grid.push(itemComponent);
        this.calculateLayoutDebounce();
        if (itemComponent.$item.initCallback) {
            itemComponent.$item.initCallback(itemComponent);
        }
    };
    GridsterComponent.prototype.removeItem = function (itemComponent) {
        this.grid.splice(this.grid.indexOf(itemComponent), 1);
        this.calculateLayoutDebounce();
    };
    GridsterComponent.prototype.checkCollision = function (itemComponent, ignoreItem) {
        if (this.checkGridCollision(itemComponent)) {
            return true;
        }
        return this.findItemWithItem(itemComponent, ignoreItem);
    };
    GridsterComponent.prototype.checkGridCollision = function (itemComponent) {
        var noNegativePosition = itemComponent.$item.y > -1 && itemComponent.$item.x > -1;
        var maxGridCols = itemComponent.$item.cols + itemComponent.$item.x <= this.$options.maxCols;
        var maxGridRows = itemComponent.$item.rows + itemComponent.$item.y <= this.$options.maxRows;
        var maxItemCols = itemComponent.$item.maxItemCols === undefined ? this.$options.maxItemCols : itemComponent.$item.maxItemCols;
        var minItemCols = itemComponent.$item.minItemCols === undefined ? this.$options.minItemCols : itemComponent.$item.minItemCols;
        var maxItemRows = itemComponent.$item.maxItemRows === undefined ? this.$options.maxItemRows : itemComponent.$item.maxItemRows;
        var minItemRows = itemComponent.$item.minItemRows === undefined ? this.$options.minItemRows : itemComponent.$item.minItemRows;
        var inColsLimits = itemComponent.$item.cols <= maxItemCols && itemComponent.$item.cols >= minItemCols;
        var inRowsLimits = itemComponent.$item.rows <= maxItemRows && itemComponent.$item.rows >= minItemRows;
        return !(noNegativePosition && maxGridCols && maxGridRows && inColsLimits && inRowsLimits);
    };
    GridsterComponent.prototype.findItemWithItem = function (itemComponent, ignoreItem) {
        var widgetsIndex = this.grid.length - 1, widget;
        for (; widgetsIndex >= 0; widgetsIndex--) {
            widget = this.grid[widgetsIndex];
            if (widget !== itemComponent && widget !== ignoreItem
                && widget.$item.x < itemComponent.$item.x + itemComponent.$item.cols
                && widget.$item.x + widget.$item.cols > itemComponent.$item.x
                && widget.$item.y < itemComponent.$item.y + itemComponent.$item.rows
                && widget.$item.y + widget.$item.rows > itemComponent.$item.y) {
                return widget;
            }
        }
    };
    GridsterComponent.prototype.autoPositionItem = function (itemComponent) {
        this.setGridDimensions();
        var rowsIndex = 0, colsIndex;
        for (; rowsIndex < this.rows; rowsIndex++) {
            itemComponent.$item.y = rowsIndex;
            colsIndex = 0;
            for (; colsIndex < this.columns; colsIndex++) {
                itemComponent.$item.x = colsIndex;
                if (!this.checkCollision(itemComponent)) {
                    itemComponent.item.x = itemComponent.$item.x;
                    itemComponent.item.y = itemComponent.$item.y;
                    itemComponent.itemChanged();
                    return;
                }
            }
        }
        if (this.rows >= this.columns && this.$options.maxCols > this.columns) {
            itemComponent.$item.x = this.columns;
            itemComponent.$item.y = 0;
            itemComponent.item.x = itemComponent.$item.x;
            itemComponent.item.y = itemComponent.$item.y;
            itemComponent.itemChanged();
        }
        else if (this.$options.maxRows > this.rows) {
            itemComponent.$item.y = this.rows;
            itemComponent.$item.x = 0;
            itemComponent.item.x = itemComponent.$item.x;
            itemComponent.item.y = itemComponent.$item.y;
            itemComponent.itemChanged();
        }
        else {
            console.warn('Can\'t be placed in the bounds of the dashboard!/n' +
                JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
        }
    };
    GridsterComponent.prototype.pixelsToPosition = function (x, y, roundingMethod) {
        return [this.pixelsToPositionX(x, roundingMethod), this.pixelsToPositionY(y, roundingMethod)];
    };
    GridsterComponent.prototype.pixelsToPositionX = function (x, roundingMethod) {
        return roundingMethod(x / this.curColWidth);
    };
    GridsterComponent.prototype.pixelsToPositionY = function (y, roundingMethod) {
        return roundingMethod(y / this.curRowHeight);
    };
    GridsterComponent.prototype.positionXToPixels = function (x) {
        return x * this.curColWidth;
    };
    GridsterComponent.prototype.positionYToPixels = function (y) {
        return y * this.curRowHeight;
    };
    GridsterComponent.prototype.checkCompactUp = function () {
        if (this.$options.compactUp) {
            var widgetMovedUp = false, widget = void 0, moved = void 0;
            var l = this.grid.length;
            for (var i = 0; i < l; i++) {
                widget = this.grid[i];
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
    GridsterComponent.prototype.moveUpTillCollision = function (itemComponent) {
        itemComponent.$item.y -= 1;
        if (this.checkCollision(itemComponent)) {
            itemComponent.$item.y += 1;
            return false;
        }
        else {
            this.moveUpTillCollision(itemComponent);
            return true;
        }
    };
    GridsterComponent.prototype.checkCompactLeft = function () {
        if (this.$options.compactLeft) {
            var widgetMovedUp = false, widget = void 0, moved = void 0;
            var l = this.grid.length;
            for (var i = 0; i < l; i++) {
                widget = this.grid[i];
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
    GridsterComponent.prototype.moveLeftTillCollision = function (itemComponent) {
        itemComponent.$item.x -= 1;
        if (this.checkCollision(itemComponent)) {
            itemComponent.$item.x += 1;
            return false;
        }
        else {
            this.moveUpTillCollision(itemComponent);
            return true;
        }
    };
    return GridsterComponent;
}());
GridsterComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'gridster',
                template: "<gridster-grid class=\"gridster-grid\"></gridster-grid> <ng-content></ng-content> <gridster-preview class=\"gridster-preview\"></gridster-preview>",
                styles: [":host {   position: relative;   display: flex;   overflow: auto;   flex: 1 auto;   background: grey;   width: 100%;   height: 100%; }  :host(.fit) {   overflow-x: hidden;   overflow-y: hidden; }  :host(.scrollVertical) {   overflow-x: hidden;   overflow-y: auto; }  :host(.scrollHorizontal) {   overflow-x: auto;   overflow-y: hidden; }  :host(.fixed) {   overflow: auto; }  :host(.mobile) {   overflow-x: hidden;   overflow-y: auto;   display: block; }  :host(.mobile) /deep/ gridster-item {   position: relative; }"]
            },] },
];
/** @nocollapse */
GridsterComponent.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: core_1.Renderer2, },
]; };
GridsterComponent.propDecorators = {
    'options': [{ type: core_1.Input },],
};
exports.GridsterComponent = GridsterComponent;
//# sourceMappingURL=gridster.component.js.map