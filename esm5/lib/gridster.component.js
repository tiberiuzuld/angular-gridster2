import { ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, Renderer2, ViewEncapsulation } from '@angular/core';
import { GridsterCompact } from './gridsterCompact.service';
import { GridsterConfigService } from './gridsterConfig.constant';
import { GridsterEmptyCell } from './gridsterEmptyCell.service';
import { GridsterRenderer } from './gridsterRenderer.service';
import { GridsterUtils } from './gridsterUtils.service';
import * as i0 from "@angular/core";
function GridsterComponent_div_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 3);
} if (rf & 2) {
    var i_r41 = ctx.index;
    var ctx_r38 = i0.ɵɵnextContext();
    i0.ɵɵproperty("ngStyle", ctx_r38.gridRenderer.getGridColumnStyle(i_r41));
} }
function GridsterComponent_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 4);
} if (rf & 2) {
    var i_r43 = ctx.index;
    var ctx_r39 = i0.ɵɵnextContext();
    i0.ɵɵproperty("ngStyle", ctx_r39.gridRenderer.getGridRowStyle(i_r43));
} }
var _c0 = ["*"];
var GridsterComponent = /** @class */ (function () {
    function GridsterComponent(el, renderer, cdRef, zone) {
        this.renderer = renderer;
        this.cdRef = cdRef;
        this.zone = zone;
        this.columns = 0;
        this.rows = 0;
        this.gridColumns = [];
        this.gridRows = [];
        this.el = el.nativeElement;
        this.$options = JSON.parse(JSON.stringify(GridsterConfigService));
        this.calculateLayoutDebounce = GridsterUtils.debounce(this.calculateLayout.bind(this), 0);
        this.mobile = false;
        this.curWidth = 0;
        this.curHeight = 0;
        this.grid = [];
        this.curColWidth = 0;
        this.curRowHeight = 0;
        this.dragInProgress = false;
        this.emptyCell = new GridsterEmptyCell(this);
        this.compact = new GridsterCompact(this);
        this.gridRenderer = new GridsterRenderer(this);
    }
    GridsterComponent.prototype.checkCollisionTwoItems = function (item, item2) {
        var collision = item.x < item2.x + item2.cols
            && item.x + item.cols > item2.x
            && item.y < item2.y + item2.rows
            && item.y + item.rows > item2.y;
        if (!collision) {
            return false;
        }
        if (!this.$options.allowMultiLayer) {
            return true;
        }
        var defaultLayerIndex = this.$options.defaultLayerIndex;
        var layerIndex = item.layerIndex === undefined ? defaultLayerIndex : item.layerIndex;
        var layerIndex2 = item2.layerIndex === undefined ? defaultLayerIndex : item2.layerIndex;
        return layerIndex === layerIndex2;
    };
    GridsterComponent.prototype.ngOnInit = function () {
        if (this.options.initCallback) {
            this.options.initCallback(this);
        }
    };
    GridsterComponent.prototype.ngOnChanges = function (changes) {
        if (changes.options) {
            this.setOptions();
            this.options.api = {
                optionsChanged: this.optionsChanged.bind(this),
                resize: this.onResize.bind(this),
                getNextPossiblePosition: this.getNextPossiblePosition.bind(this),
                getFirstPossiblePosition: this.getFirstPossiblePosition.bind(this),
                getLastPossiblePosition: this.getLastPossiblePosition.bind(this),
            };
            this.columns = this.$options.minCols;
            this.rows = this.$options.minRows;
            this.setGridSize();
            this.calculateLayout();
        }
    };
    GridsterComponent.prototype.resize = function () {
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
    GridsterComponent.prototype.setOptions = function () {
        this.$options = GridsterUtils.merge(this.$options, this.options, this.$options);
        if (!this.$options.disableWindowResize && !this.windowResize) {
            this.windowResize = this.renderer.listen('window', 'resize', this.onResize.bind(this));
        }
        else if (this.$options.disableWindowResize && this.windowResize) {
            this.windowResize();
            this.windowResize = null;
        }
        this.emptyCell.updateOptions();
    };
    GridsterComponent.prototype.optionsChanged = function () {
        this.setOptions();
        var widgetsIndex = this.grid.length - 1;
        var widget;
        for (; widgetsIndex >= 0; widgetsIndex--) {
            widget = this.grid[widgetsIndex];
            widget.updateOptions();
        }
        this.calculateLayout();
    };
    GridsterComponent.prototype.ngOnDestroy = function () {
        if (this.windowResize) {
            this.windowResize();
        }
        if (this.options && this.options.destroyCallback) {
            this.options.destroyCallback(this);
        }
        if (this.options && this.options.api) {
            this.options.api.resize = undefined;
            this.options.api.optionsChanged = undefined;
            this.options.api.getNextPossiblePosition = undefined;
            this.options.api = undefined;
        }
        this.emptyCell.destroy();
        delete this.emptyCell;
        this.compact.destroy();
        delete this.compact;
    };
    GridsterComponent.prototype.onResize = function () {
        this.setGridSize();
        this.calculateLayout();
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
        var el = this.el;
        var width;
        var height;
        if (this.$options.setGridSize || this.$options.gridType === 'fit' && !this.mobile) {
            width = el.offsetWidth;
            height = el.offsetHeight;
        }
        else {
            width = el.clientWidth;
            height = el.clientHeight;
        }
        this.curWidth = width;
        this.curHeight = height;
    };
    GridsterComponent.prototype.setGridDimensions = function () {
        this.setGridSize();
        if (!this.mobile && this.$options.mobileBreakpoint > this.curWidth) {
            this.mobile = !this.mobile;
            this.renderer.addClass(this.el, 'mobile');
        }
        else if (this.mobile && this.$options.mobileBreakpoint < this.curWidth) {
            this.mobile = !this.mobile;
            this.renderer.removeClass(this.el, 'mobile');
        }
        var rows = this.$options.minRows;
        var columns = this.$options.minCols;
        var widgetsIndex = this.grid.length - 1;
        var widget;
        for (; widgetsIndex >= 0; widgetsIndex--) {
            widget = this.grid[widgetsIndex];
            if (!widget.notPlaced) {
                rows = Math.max(rows, widget.$item.y + widget.$item.rows);
                columns = Math.max(columns, widget.$item.x + widget.$item.cols);
            }
        }
        if (this.columns !== columns || this.rows !== rows) {
            this.columns = columns;
            this.rows = rows;
            if (this.options.gridSizeChangedCallback) {
                this.options.gridSizeChangedCallback(this);
            }
        }
    };
    GridsterComponent.prototype.calculateLayout = function () {
        if (this.compact) {
            this.compact.checkCompact();
        }
        this.setGridDimensions();
        if (this.$options.outerMargin) {
            var marginWidth = -this.$options.margin;
            if (this.$options.outerMarginLeft !== null) {
                marginWidth += this.$options.outerMarginLeft;
                this.renderer.setStyle(this.el, 'padding-left', this.$options.outerMarginLeft + 'px');
            }
            else {
                marginWidth += this.$options.margin;
                this.renderer.setStyle(this.el, 'padding-left', this.$options.margin + 'px');
            }
            if (this.$options.outerMarginRight !== null) {
                marginWidth += this.$options.outerMarginRight;
                this.renderer.setStyle(this.el, 'padding-right', this.$options.outerMarginRight + 'px');
            }
            else {
                marginWidth += this.$options.margin;
                this.renderer.setStyle(this.el, 'padding-right', this.$options.margin + 'px');
            }
            this.curColWidth = (this.curWidth - marginWidth) / this.columns;
            var marginHeight = -this.$options.margin;
            if (this.$options.outerMarginTop !== null) {
                marginHeight += this.$options.outerMarginTop;
                this.renderer.setStyle(this.el, 'padding-top', this.$options.outerMarginTop + 'px');
            }
            else {
                marginHeight += this.$options.margin;
                this.renderer.setStyle(this.el, 'padding-top', this.$options.margin + 'px');
            }
            if (this.$options.outerMarginBottom !== null) {
                marginHeight += this.$options.outerMarginBottom;
                this.renderer.setStyle(this.el, 'padding-bottom', this.$options.outerMarginBottom + 'px');
            }
            else {
                marginHeight += this.$options.margin;
                this.renderer.setStyle(this.el, 'padding-bottom', this.$options.margin + 'px');
            }
            this.curRowHeight = (this.curHeight - marginHeight) / this.rows;
        }
        else {
            this.curColWidth = (this.curWidth + this.$options.margin) / this.columns;
            this.curRowHeight = (this.curHeight + this.$options.margin) / this.rows;
            this.renderer.setStyle(this.el, 'padding-left', 0 + 'px');
            this.renderer.setStyle(this.el, 'padding-right', 0 + 'px');
            this.renderer.setStyle(this.el, 'padding-top', 0 + 'px');
            this.renderer.setStyle(this.el, 'padding-bottom', 0 + 'px');
        }
        this.gridRenderer.updateGridster();
        this.updateGrid();
        if (this.$options.setGridSize) {
            this.renderer.setStyle(this.el, 'width', (this.columns * this.curColWidth + this.$options.margin) + 'px');
            this.renderer.setStyle(this.el, 'height', (this.rows * this.curRowHeight + this.$options.margin) + 'px');
        }
        else {
            this.renderer.setStyle(this.el, 'width', '');
            this.renderer.setStyle(this.el, 'height', '');
        }
        var widgetsIndex = this.grid.length - 1;
        var widget;
        for (; widgetsIndex >= 0; widgetsIndex--) {
            widget = this.grid[widgetsIndex];
            widget.setSize();
            widget.drag.toggle();
            widget.resize.toggle();
        }
        setTimeout(this.resize.bind(this), 100);
    };
    GridsterComponent.prototype.updateGrid = function () {
        if (this.$options.displayGrid === 'always' && !this.mobile) {
            this.renderer.addClass(this.el, 'display-grid');
        }
        else if (this.$options.displayGrid === 'onDrag&Resize' && this.dragInProgress) {
            this.renderer.addClass(this.el, 'display-grid');
        }
        else if (this.$options.displayGrid === 'none' || !this.dragInProgress || this.mobile) {
            this.renderer.removeClass(this.el, 'display-grid');
        }
        this.setGridDimensions();
        this.gridColumns.length = GridsterComponent.getNewArrayLength(this.columns, this.curWidth, this.curColWidth);
        this.gridRows.length = GridsterComponent.getNewArrayLength(this.rows, this.curHeight, this.curRowHeight);
        this.cdRef.markForCheck();
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
        if (itemComponent.$item.x === -1 || itemComponent.$item.y === -1) {
            this.autoPositionItem(itemComponent);
        }
        else if (this.checkCollision(itemComponent.$item)) {
            if (!this.$options.disableWarnings) {
                itemComponent.notPlaced = true;
                console.warn('Can\'t be placed in the bounds of the dashboard, trying to auto position!/n' +
                    JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
            }
            if (!this.$options.disableAutoPositionOnConflict) {
                this.autoPositionItem(itemComponent);
            }
            else {
                itemComponent.notPlaced = true;
            }
        }
        this.grid.push(itemComponent);
        this.calculateLayoutDebounce();
    };
    GridsterComponent.prototype.removeItem = function (itemComponent) {
        this.grid.splice(this.grid.indexOf(itemComponent), 1);
        this.calculateLayoutDebounce();
        if (this.options.itemRemovedCallback) {
            this.options.itemRemovedCallback(itemComponent.item, itemComponent);
        }
    };
    GridsterComponent.prototype.checkCollision = function (item) {
        var collision = false;
        if (this.options.itemValidateCallback) {
            collision = !this.options.itemValidateCallback(item);
        }
        if (!collision && this.checkGridCollision(item)) {
            collision = true;
        }
        if (!collision) {
            var c = this.findItemWithItem(item);
            if (c) {
                collision = c;
            }
        }
        return collision;
    };
    GridsterComponent.prototype.checkGridCollision = function (item) {
        var noNegativePosition = item.y > -1 && item.x > -1;
        var maxGridCols = item.cols + item.x <= this.$options.maxCols;
        var maxGridRows = item.rows + item.y <= this.$options.maxRows;
        var maxItemCols = item.maxItemCols === undefined ? this.$options.maxItemCols : item.maxItemCols;
        var minItemCols = item.minItemCols === undefined ? this.$options.minItemCols : item.minItemCols;
        var maxItemRows = item.maxItemRows === undefined ? this.$options.maxItemRows : item.maxItemRows;
        var minItemRows = item.minItemRows === undefined ? this.$options.minItemRows : item.minItemRows;
        var inColsLimits = item.cols <= maxItemCols && item.cols >= minItemCols;
        var inRowsLimits = item.rows <= maxItemRows && item.rows >= minItemRows;
        var minAreaLimit = item.minItemArea === undefined ? this.$options.minItemArea : item.minItemArea;
        var maxAreaLimit = item.maxItemArea === undefined ? this.$options.maxItemArea : item.maxItemArea;
        var area = item.cols * item.rows;
        var inMinArea = minAreaLimit <= area;
        var inMaxArea = maxAreaLimit >= area;
        return !(noNegativePosition && maxGridCols && maxGridRows && inColsLimits && inRowsLimits && inMinArea && inMaxArea);
    };
    GridsterComponent.prototype.findItemWithItem = function (item) {
        var widgetsIndex = this.grid.length - 1;
        var widget;
        for (; widgetsIndex > -1; widgetsIndex--) {
            widget = this.grid[widgetsIndex];
            if (widget.$item !== item && this.checkCollisionTwoItems(widget.$item, item)) {
                return widget;
            }
        }
        return false;
    };
    GridsterComponent.prototype.findItemsWithItem = function (item) {
        var a = [];
        var widgetsIndex = this.grid.length - 1;
        var widget;
        for (; widgetsIndex > -1; widgetsIndex--) {
            widget = this.grid[widgetsIndex];
            if (widget.$item !== item && this.checkCollisionTwoItems(widget.$item, item)) {
                a.push(widget);
            }
        }
        return a;
    };
    GridsterComponent.prototype.autoPositionItem = function (itemComponent) {
        if (this.getNextPossiblePosition(itemComponent.$item)) {
            itemComponent.notPlaced = false;
            itemComponent.item.x = itemComponent.$item.x;
            itemComponent.item.y = itemComponent.$item.y;
            itemComponent.itemChanged();
        }
        else {
            itemComponent.notPlaced = true;
            if (!this.$options.disableWarnings) {
                console.warn('Can\'t be placed in the bounds of the dashboard!/n' +
                    JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
            }
        }
    };
    GridsterComponent.prototype.getNextPossiblePosition = function (newItem, startingFrom) {
        if (startingFrom === void 0) { startingFrom = {}; }
        if (newItem.cols === -1) {
            newItem.cols = this.$options.defaultItemCols;
        }
        if (newItem.rows === -1) {
            newItem.rows = this.$options.defaultItemRows;
        }
        this.setGridDimensions();
        var rowsIndex = startingFrom.y || 0;
        var colsIndex;
        for (; rowsIndex < this.rows; rowsIndex++) {
            newItem.y = rowsIndex;
            colsIndex = startingFrom.x || 0;
            for (; colsIndex < this.columns; colsIndex++) {
                newItem.x = colsIndex;
                if (!this.checkCollision(newItem)) {
                    return true;
                }
            }
        }
        var canAddToRows = this.$options.maxRows >= this.rows + newItem.rows;
        var canAddToColumns = this.$options.maxCols >= this.columns + newItem.cols;
        var addToRows = this.rows <= this.columns && canAddToRows;
        if (!addToRows && canAddToColumns) {
            newItem.x = this.columns;
            newItem.y = 0;
            return true;
        }
        else if (canAddToRows) {
            newItem.y = this.rows;
            newItem.x = 0;
            return true;
        }
        return false;
    };
    GridsterComponent.prototype.getFirstPossiblePosition = function (item) {
        var tmpItem = Object.assign({}, item);
        this.getNextPossiblePosition(tmpItem);
        return tmpItem;
    };
    GridsterComponent.prototype.getLastPossiblePosition = function (item) {
        var farthestItem = { y: 0, x: 0 };
        farthestItem = this.grid.reduce(function (prev, curr) {
            var currCoords = { y: curr.$item.y + curr.$item.rows - 1, x: curr.$item.x + curr.$item.cols - 1 };
            if (GridsterUtils.compareItems(prev, currCoords) === 1) {
                return currCoords;
            }
            else {
                return prev;
            }
        }, farthestItem);
        var tmpItem = Object.assign({}, item);
        this.getNextPossiblePosition(tmpItem, farthestItem);
        return tmpItem;
    };
    GridsterComponent.prototype.pixelsToPositionX = function (x, roundingMethod, noLimit) {
        var position = roundingMethod(x / this.curColWidth);
        if (noLimit) {
            return position;
        }
        else {
            return Math.max(position, 0);
        }
    };
    GridsterComponent.prototype.pixelsToPositionY = function (y, roundingMethod, noLimit) {
        var position = roundingMethod(y / this.curRowHeight);
        if (noLimit) {
            return position;
        }
        else {
            return Math.max(position, 0);
        }
    };
    GridsterComponent.prototype.positionXToPixels = function (x) {
        return x * this.curColWidth;
    };
    GridsterComponent.prototype.positionYToPixels = function (y) {
        return y * this.curRowHeight;
    };
    // ------ Functions for swapWhileDragging option
    // identical to checkCollision() except that here we add bondaries.
    GridsterComponent.checkCollisionTwoItemsForSwaping = function (item, item2) {
        // if the cols or rows of the items are 1 , doesnt make any sense to set a boundary. Only if the item is bigger we set a boundary
        var horizontalBoundaryItem1 = item.cols === 1 ? 0 : 1;
        var horizontalBoundaryItem2 = item2.cols === 1 ? 0 : 1;
        var verticalBoundaryItem1 = item.rows === 1 ? 0 : 1;
        var verticalBoundaryItem2 = item2.rows === 1 ? 0 : 1;
        return item.x + horizontalBoundaryItem1 < item2.x + item2.cols
            && item.x + item.cols > item2.x + horizontalBoundaryItem2
            && item.y + verticalBoundaryItem1 < item2.y + item2.rows
            && item.y + item.rows > item2.y + verticalBoundaryItem2;
    };
    // identical to checkCollision() except that this function calls findItemWithItemForSwaping() instead of findItemWithItem()
    GridsterComponent.prototype.checkCollisionForSwaping = function (item) {
        var collision = false;
        if (this.options.itemValidateCallback) {
            collision = !this.options.itemValidateCallback(item);
        }
        if (!collision && this.checkGridCollision(item)) {
            collision = true;
        }
        if (!collision) {
            var c = this.findItemWithItemForSwaping(item);
            if (c) {
                collision = c;
            }
        }
        return collision;
    };
    // identical to findItemWithItem() except that this function calls checkCollisionTwoItemsForSwaping() instead of checkCollisionTwoItems()
    GridsterComponent.prototype.findItemWithItemForSwaping = function (item) {
        var widgetsIndex = this.grid.length - 1;
        var widget;
        for (; widgetsIndex > -1; widgetsIndex--) {
            widget = this.grid[widgetsIndex];
            if (widget.$item !== item && GridsterComponent.checkCollisionTwoItemsForSwaping(widget.$item, item)) {
                return widget;
            }
        }
        return false;
    };
    // ------ End of functions for swapWhileDragging option
    // tslint:disable-next-line:member-ordering
    GridsterComponent.getNewArrayLength = function (length, overallSize, size) {
        var newLength = Math.max(length, Math.floor(overallSize / size));
        if (newLength < 0) {
            return 0;
        }
        if (Number.isFinite(newLength)) {
            return Math.floor(newLength);
        }
        return 0;
    };
    GridsterComponent.ɵfac = function GridsterComponent_Factory(t) { return new (t || GridsterComponent)(i0.ɵɵdirectiveInject(ElementRef), i0.ɵɵdirectiveInject(Renderer2), i0.ɵɵdirectiveInject(ChangeDetectorRef), i0.ɵɵdirectiveInject(NgZone)); };
    GridsterComponent.ɵcmp = i0.ɵɵdefineComponent({ type: GridsterComponent, selectors: [["gridster"]], inputs: { options: "options" }, features: [i0.ɵɵNgOnChangesFeature], ngContentSelectors: _c0, decls: 4, vars: 2, consts: [["class", "gridster-column", 3, "ngStyle", 4, "ngFor", "ngForOf"], ["class", "gridster-row", 3, "ngStyle", 4, "ngFor", "ngForOf"], [1, "gridster-preview"], [1, "gridster-column", 3, "ngStyle"], [1, "gridster-row", 3, "ngStyle"]], template: function GridsterComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵtemplate(0, GridsterComponent_div_0_Template, 1, 1, "div", 0);
            i0.ɵɵtemplate(1, GridsterComponent_div_1_Template, 1, 1, "div", 1);
            i0.ɵɵprojection(2);
            i0.ɵɵelement(3, "gridster-preview", 2);
        } if (rf & 2) {
            i0.ɵɵproperty("ngForOf", ctx.gridColumns);
            i0.ɵɵadvance(1);
            i0.ɵɵproperty("ngForOf", ctx.gridRows);
        } }, styles: ["gridster{position:relative;box-sizing:border-box;background:grey;width:100%;height:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:block}gridster.fit{overflow-x:hidden;overflow-y:hidden}gridster.scrollVertical{overflow-x:hidden;overflow-y:auto}gridster.scrollHorizontal{overflow-x:auto;overflow-y:hidden}gridster.fixed{overflow:auto}gridster.mobile{overflow-x:hidden;overflow-y:auto}gridster.mobile gridster-item{position:relative}gridster .gridster-column,gridster .gridster-row{position:absolute;display:none;transition:.3s;box-sizing:border-box}gridster.display-grid .gridster-column,gridster.display-grid .gridster-row{display:block}gridster .gridster-column{border-left:1px solid #fff;border-right:1px solid #fff}gridster .gridster-row{border-top:1px solid #fff;border-bottom:1px solid #fff}"], encapsulation: 2 });
    return GridsterComponent;
}());
export { GridsterComponent };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(GridsterComponent, [{
        type: Component,
        args: [{
                selector: 'gridster',
                templateUrl: './gridster.html',
                styleUrls: ['./gridster.css'],
                encapsulation: ViewEncapsulation.None
            }]
    }], function () { return [{ type: i0.ElementRef, decorators: [{
                type: Inject,
                args: [ElementRef]
            }] }, { type: i0.Renderer2, decorators: [{
                type: Inject,
                args: [Renderer2]
            }] }, { type: i0.ChangeDetectorRef, decorators: [{
                type: Inject,
                args: [ChangeDetectorRef]
            }] }, { type: i0.NgZone, decorators: [{
                type: Inject,
                args: [NgZone]
            }] }]; }, { options: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1ncmlkc3RlcjIvIiwic291cmNlcyI6WyJsaWIvZ3JpZHN0ZXIuY29tcG9uZW50LnRzIiwibGliL2dyaWRzdGVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUlOLFNBQVMsRUFFVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBRTFELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBR2hFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBRzlELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQzVELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQzs7O0lDeEJ0RCx5QkFDMEQ7Ozs7SUFBckQsd0VBQThDOzs7SUFDbkQseUJBQ3VEOzs7O0lBQWxELHFFQUEyQzs7O0FEdUJoRDtJQTZCRSwyQkFBZ0MsRUFBYyxFQUE0QixRQUFtQixFQUMvQyxLQUF3QixFQUNuQyxJQUFZO1FBRjJCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDL0MsVUFBSyxHQUFMLEtBQUssQ0FBbUI7UUFDbkMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQWQvQyxZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ1osU0FBSSxHQUFHLENBQUMsQ0FBQztRQUdULGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLGFBQVEsR0FBRyxFQUFFLENBQUM7UUFVWixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFGLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7UUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxrREFBc0IsR0FBdEIsVUFBdUIsSUFBa0IsRUFBRSxLQUFtQjtRQUM1RCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUk7ZUFDMUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDO2VBQzVCLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSTtlQUM3QixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2QsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRTtZQUNsQyxPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsSUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDO1FBQzFELElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN2RixJQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsVUFBVSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDMUYsT0FBTyxVQUFVLEtBQUssV0FBVyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxvQ0FBUSxHQUFSO1FBQ0UsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTtZQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNqQztJQUNILENBQUM7SUFFRCx1Q0FBVyxHQUFYLFVBQVksT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQ25CLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRztnQkFDakIsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDOUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDaEMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ2hFLHdCQUF3QixFQUFFLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNsRSx1QkFBdUIsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUNqRSxDQUFDO1lBQ0YsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztZQUNyQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRUQsa0NBQU0sR0FBTjtRQUNFLElBQUksTUFBTSxDQUFDO1FBQ1gsSUFBSSxLQUFLLENBQUM7UUFDVixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxLQUFLLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDcEQsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDO1lBQzVCLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQztTQUMvQjthQUFNO1lBQ0wsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDO1lBQzVCLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQztTQUMvQjtRQUNELElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLFFBQVEsSUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRTtZQUNwRixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakI7SUFDSCxDQUFDO0lBRUQsc0NBQVUsR0FBVjtRQUNFLElBQUksQ0FBQyxRQUFRLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hGLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUM1RCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUN4RjthQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ2pFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztTQUMxQjtRQUNELElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDakMsQ0FBQztJQUVELDBDQUFjLEdBQWQ7UUFDRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxZQUFZLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELElBQUksTUFBc0MsQ0FBQztRQUMzQyxPQUFPLFlBQVksSUFBSSxDQUFDLEVBQUUsWUFBWSxFQUFFLEVBQUU7WUFDeEMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3hCO1FBQ0QsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCx1Q0FBVyxHQUFYO1FBQ0UsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUNyQjtRQUNELElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRTtZQUNoRCxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNwQztRQUNELElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRTtZQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUM7WUFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEdBQUcsU0FBUyxDQUFDO1lBQ3JELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQztTQUM5QjtRQUNELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDekIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDdkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxvQ0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsMkNBQWUsR0FBZjtRQUNFLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDO1FBQ3hDLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDO1FBQ3hDLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDO1FBQ3hDLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDO1FBQzFDLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDO1FBQzFDLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDO1FBQzFDLElBQU0scUJBQXFCLEdBQUcsV0FBVyxHQUFHLFdBQVcsSUFBSSxZQUFZLEdBQUcsWUFBWTtlQUNqRixZQUFZLEdBQUcsWUFBWSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDN0QsSUFBTSx1QkFBdUIsR0FBRyxZQUFZLEdBQUcsWUFBWTtlQUN0RCxXQUFXLEdBQUcsV0FBVyxJQUFJLFdBQVcsR0FBRyxXQUFXLEdBQUcsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUMxRixJQUFJLHFCQUFxQixFQUFFO1lBQ3pCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLENBQUMsdUJBQXVCLENBQUM7SUFDbEMsQ0FBQztJQUVELHVDQUFXLEdBQVg7UUFDRSxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ25CLElBQUksS0FBSyxDQUFDO1FBQ1YsSUFBSSxNQUFNLENBQUM7UUFDWCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxLQUFLLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDakYsS0FBSyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDdkIsTUFBTSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUM7U0FDMUI7YUFBTTtZQUNMLEtBQUssR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDO1lBQ3ZCLE1BQU0sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDO1NBQzFCO1FBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7SUFDMUIsQ0FBQztJQUVELDZDQUFpQixHQUFqQjtRQUNFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUMzQzthQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDeEUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUM5QztRQUNELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQ2pDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBRXBDLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUN4QyxJQUFJLE1BQU0sQ0FBQztRQUNYLE9BQU8sWUFBWSxJQUFJLENBQUMsRUFBRSxZQUFZLEVBQUUsRUFBRTtZQUN4QyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtnQkFDckIsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzFELE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2pFO1NBQ0Y7UUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ2xELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM1QztTQUNGO0lBQ0gsQ0FBQztJQUVELDJDQUFlLEdBQWY7UUFDRSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUM3QjtRQUVELElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7WUFDN0IsSUFBSSxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUN4QyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxLQUFLLElBQUksRUFBRTtnQkFDMUMsV0FBVyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDO2dCQUM3QyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsQ0FBQzthQUN2RjtpQkFBTTtnQkFDTCxXQUFXLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDO2FBQzlFO1lBQ0QsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixLQUFLLElBQUksRUFBRTtnQkFDM0MsV0FBVyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzlDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsZUFBZSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLENBQUM7YUFDekY7aUJBQU07Z0JBQ0wsV0FBVyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQzthQUMvRTtZQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDaEUsSUFBSSxZQUFZLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUN6QyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxLQUFLLElBQUksRUFBRTtnQkFDekMsWUFBWSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO2dCQUM3QyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsQ0FBQzthQUNyRjtpQkFBTTtnQkFDTCxZQUFZLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDO2FBQzdFO1lBQ0QsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixLQUFLLElBQUksRUFBRTtnQkFDNUMsWUFBWSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUM7Z0JBQ2hELElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsQ0FBQzthQUMzRjtpQkFBTTtnQkFDTCxZQUFZLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUM7YUFDaEY7WUFDRCxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQ2pFO2FBQU07WUFDTCxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDekUsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3hFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsY0FBYyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxhQUFhLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1NBQzdEO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVuQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFFbEIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRTtZQUM3QixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQzFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDMUc7YUFBTTtZQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQy9DO1FBRUQsSUFBSSxZQUFZLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELElBQUksTUFBc0MsQ0FBQztRQUMzQyxPQUFPLFlBQVksSUFBSSxDQUFDLEVBQUUsWUFBWSxFQUFFLEVBQUU7WUFDeEMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDckIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUN4QjtRQUVELFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsc0NBQVUsR0FBVjtRQUNFLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEtBQUssUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUMxRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1NBQ2pEO2FBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsS0FBSyxlQUFlLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUMvRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1NBQ2pEO2FBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDdEYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQztTQUNwRDtRQUNELElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0csSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN6RyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRCxtQ0FBTyxHQUFQLFVBQVEsYUFBNkM7UUFDbkQsSUFBSSxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7WUFDMUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUM7WUFDekQsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDbkQsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQzdCO1FBQ0QsSUFBSSxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7WUFDMUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUM7WUFDekQsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDbkQsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQzdCO1FBQ0QsSUFBSSxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUNoRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDdEM7YUFBTSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ25ELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRTtnQkFDbEMsYUFBYSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsNkVBQTZFO29CQUN4RixJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbkU7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyw2QkFBNkIsRUFBRTtnQkFDaEQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQ3RDO2lCQUFNO2dCQUNMLGFBQWEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2FBQ2hDO1NBQ0Y7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRUQsc0NBQVUsR0FBVixVQUFXLGFBQTZDO1FBQ3RELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQy9CLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRTtZQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDckU7SUFDSCxDQUFDO0lBRUQsMENBQWMsR0FBZCxVQUFlLElBQWtCO1FBQy9CLElBQUksU0FBUyxHQUE2QyxLQUFLLENBQUM7UUFDaEUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFO1lBQ3JDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEQ7UUFDRCxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMvQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQ2xCO1FBQ0QsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNkLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsRUFBRTtnQkFDTCxTQUFTLEdBQUcsQ0FBQyxDQUFDO2FBQ2Y7U0FDRjtRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCw4Q0FBa0IsR0FBbEIsVUFBbUIsSUFBa0I7UUFDbkMsSUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdEQsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQ2hFLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUNoRSxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDbEcsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ2xHLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNsRyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDbEcsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxXQUFXLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxXQUFXLENBQUM7UUFDMUUsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxXQUFXLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxXQUFXLENBQUM7UUFDMUUsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ25HLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNuRyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDbkMsSUFBTSxTQUFTLEdBQUcsWUFBWSxJQUFJLElBQUksQ0FBQztRQUN2QyxJQUFNLFNBQVMsR0FBRyxZQUFZLElBQUksSUFBSSxDQUFDO1FBQ3ZDLE9BQU8sQ0FBQyxDQUFDLGtCQUFrQixJQUFJLFdBQVcsSUFBSSxXQUFXLElBQUksWUFBWSxJQUFJLFlBQVksSUFBSSxTQUFTLElBQUksU0FBUyxDQUFDLENBQUM7SUFDdkgsQ0FBQztJQUVELDRDQUFnQixHQUFoQixVQUFpQixJQUFrQjtRQUNqQyxJQUFJLFlBQVksR0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDaEQsSUFBSSxNQUFzQyxDQUFDO1FBQzNDLE9BQU8sWUFBWSxHQUFHLENBQUMsQ0FBQyxFQUFFLFlBQVksRUFBRSxFQUFFO1lBQ3hDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2pDLElBQUksTUFBTSxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUU7Z0JBQzVFLE9BQU8sTUFBTSxDQUFDO2FBQ2Y7U0FDRjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELDZDQUFpQixHQUFqQixVQUFrQixJQUFrQjtRQUNsQyxJQUFNLENBQUMsR0FBMEMsRUFBRSxDQUFDO1FBQ3BELElBQUksWUFBWSxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNoRCxJQUFJLE1BQXNDLENBQUM7UUFDM0MsT0FBTyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEVBQUUsWUFBWSxFQUFFLEVBQUU7WUFDeEMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDakMsSUFBSSxNQUFNLENBQUMsS0FBSyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDNUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUNoQjtTQUNGO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQsNENBQWdCLEdBQWhCLFVBQWlCLGFBQTZDO1FBQzVELElBQUksSUFBSSxDQUFDLHVCQUF1QixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNyRCxhQUFhLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUNoQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM3QyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM3QyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDN0I7YUFBTTtZQUNMLGFBQWEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRTtnQkFDbEMsT0FBTyxDQUFDLElBQUksQ0FBQyxvREFBb0Q7b0JBQy9ELElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNuRTtTQUNGO0lBQ0gsQ0FBQztJQUVELG1EQUF1QixHQUF2QixVQUF3QixPQUFxQixFQUFFLFlBQTZDO1FBQTdDLDZCQUFBLEVBQUEsaUJBQTZDO1FBQzFGLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRTtZQUN2QixPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDO1NBQzlDO1FBQ0QsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ3ZCLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUM7U0FDOUM7UUFDRCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN6QixJQUFJLFNBQVMsR0FBRyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxJQUFJLFNBQVMsQ0FBQztRQUNkLE9BQU8sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUU7WUFDekMsT0FBTyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7WUFDdEIsU0FBUyxHQUFHLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLE9BQU8sU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUU7Z0JBQzVDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO2dCQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRTtvQkFDakMsT0FBTyxJQUFJLENBQUM7aUJBQ2I7YUFDRjtTQUNGO1FBQ0QsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ3ZFLElBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUM3RSxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksWUFBWSxDQUFDO1FBQzVELElBQUksQ0FBQyxTQUFTLElBQUksZUFBZSxFQUFFO1lBQ2pDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUN6QixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNkLE9BQU8sSUFBSSxDQUFDO1NBQ2I7YUFBTSxJQUFJLFlBQVksRUFBRTtZQUN2QixPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDdEIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDZCxPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsb0RBQXdCLEdBQXhCLFVBQXlCLElBQWtCO1FBQ3pDLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QyxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQsbURBQXVCLEdBQXZCLFVBQXdCLElBQWtCO1FBQ3hDLElBQUksWUFBWSxHQUE2QixFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDO1FBQzFELFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQVMsRUFBRSxJQUFvQztZQUM5RSxJQUFNLFVBQVUsR0FBRyxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBQyxDQUFDO1lBQ2xHLElBQUksYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN0RCxPQUFPLFVBQVUsQ0FBQzthQUNuQjtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQzthQUNiO1FBQ0gsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRWpCLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDcEQsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVELDZDQUFpQixHQUFqQixVQUFrQixDQUFTLEVBQUUsY0FBcUMsRUFBRSxPQUFpQjtRQUNuRixJQUFNLFFBQVEsR0FBRyxjQUFjLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0RCxJQUFJLE9BQU8sRUFBRTtZQUNYLE9BQU8sUUFBUSxDQUFDO1NBQ2pCO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzlCO0lBQ0gsQ0FBQztJQUVELDZDQUFpQixHQUFqQixVQUFrQixDQUFTLEVBQUUsY0FBcUMsRUFBRSxPQUFpQjtRQUNuRixJQUFNLFFBQVEsR0FBRyxjQUFjLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN2RCxJQUFJLE9BQU8sRUFBRTtZQUNYLE9BQU8sUUFBUSxDQUFDO1NBQ2pCO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzlCO0lBQ0gsQ0FBQztJQUVELDZDQUFpQixHQUFqQixVQUFrQixDQUFTO1FBQ3pCLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDOUIsQ0FBQztJQUVELDZDQUFpQixHQUFqQixVQUFrQixDQUFTO1FBQ3pCLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDL0IsQ0FBQztJQUVELGdEQUFnRDtJQUVoRCxtRUFBbUU7SUFDNUQsa0RBQWdDLEdBQXZDLFVBQXdDLElBQWtCLEVBQUUsS0FBbUI7UUFDN0UsaUlBQWlJO1FBQ2pJLElBQU0sdUJBQXVCLEdBQUcsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hELElBQU0sdUJBQXVCLEdBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pELElBQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELElBQU0scUJBQXFCLEdBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBRyx1QkFBdUIsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJO2VBQ3pELElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLHVCQUF1QjtlQUN0RCxJQUFJLENBQUMsQ0FBQyxHQUFHLHFCQUFxQixHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUk7ZUFDckQsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcscUJBQXFCLENBQUM7SUFDNUQsQ0FBQztJQUVELDJIQUEySDtJQUMzSCxvREFBd0IsR0FBeEIsVUFBeUIsSUFBa0I7UUFDekMsSUFBSSxTQUFTLEdBQTZDLEtBQUssQ0FBQztRQUNoRSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUU7WUFDckMsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0RDtRQUNELElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQy9DLFNBQVMsR0FBRyxJQUFJLENBQUM7U0FDbEI7UUFDRCxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2QsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxFQUFFO2dCQUNMLFNBQVMsR0FBRyxDQUFDLENBQUM7YUFDZjtTQUNGO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVELHlJQUF5STtJQUN6SSxzREFBMEIsR0FBMUIsVUFBMkIsSUFBa0I7UUFDM0MsSUFBSSxZQUFZLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELElBQUksTUFBc0MsQ0FBQztRQUMzQyxPQUFPLFlBQVksR0FBRyxDQUFDLENBQUMsRUFBRSxZQUFZLEVBQUUsRUFBRTtZQUN4QyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNqQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEtBQUssSUFBSSxJQUFJLGlCQUFpQixDQUFDLGdDQUFnQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUU7Z0JBQ25HLE9BQU8sTUFBTSxDQUFDO2FBQ2Y7U0FDRjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELHVEQUF1RDtJQUV2RCwyQ0FBMkM7SUFDNUIsbUNBQWlCLEdBQWhDLFVBQWlDLE1BQWMsRUFBRSxXQUFtQixFQUFFLElBQVk7UUFDaEYsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVuRSxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQUU7WUFDakIsT0FBTyxDQUFDLENBQUM7U0FDVjtRQUVELElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM5QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDOUI7UUFFRCxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7c0ZBbGlCVSxpQkFBaUIsdUJBdUJSLFVBQVUsd0JBQTBCLFNBQVMsd0JBQzdDLGlCQUFpQix3QkFDakIsTUFBTTswREF6QmYsaUJBQWlCOztZQ2hDOUIsa0VBQ29EO1lBQ3BELGtFQUNpRDtZQUNqRCxrQkFBWTtZQUNaLHNDQUE4RDs7WUFMakMseUNBQWtEO1lBRXJELGVBQTRDO1lBQTVDLHNDQUE0Qzs7NEJERnRFO0NBbWtCQyxBQXppQkQsSUF5aUJDO1NBbmlCWSxpQkFBaUI7a0RBQWpCLGlCQUFpQjtjQU43QixTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFdBQVcsRUFBRSxpQkFBaUI7Z0JBQzlCLFNBQVMsRUFBRSxDQUFDLGdCQUFnQixDQUFDO2dCQUM3QixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTthQUN0Qzs7c0JBd0JjLE1BQU07dUJBQUMsVUFBVTs7c0JBQW1CLE1BQU07dUJBQUMsU0FBUzs7c0JBQ3BELE1BQU07dUJBQUMsaUJBQWlCOztzQkFDeEIsTUFBTTt1QkFBQyxNQUFNOztrQkF4QnpCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0dyaWRzdGVyQ29tcG9uZW50SW50ZXJmYWNlfSBmcm9tICcuL2dyaWRzdGVyLmludGVyZmFjZSc7XG5pbXBvcnQge0dyaWRzdGVyQ29tcGFjdH0gZnJvbSAnLi9ncmlkc3RlckNvbXBhY3Quc2VydmljZSc7XG5cbmltcG9ydCB7R3JpZHN0ZXJDb25maWdTZXJ2aWNlfSBmcm9tICcuL2dyaWRzdGVyQ29uZmlnLmNvbnN0YW50JztcbmltcG9ydCB7R3JpZHN0ZXJDb25maWd9IGZyb20gJy4vZ3JpZHN0ZXJDb25maWcuaW50ZXJmYWNlJztcbmltcG9ydCB7R3JpZHN0ZXJDb25maWdTfSBmcm9tICcuL2dyaWRzdGVyQ29uZmlnUy5pbnRlcmZhY2UnO1xuaW1wb3J0IHtHcmlkc3RlckVtcHR5Q2VsbH0gZnJvbSAnLi9ncmlkc3RlckVtcHR5Q2VsbC5zZXJ2aWNlJztcbmltcG9ydCB7R3JpZHN0ZXJJdGVtfSBmcm9tICcuL2dyaWRzdGVySXRlbS5pbnRlcmZhY2UnO1xuaW1wb3J0IHtHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2V9IGZyb20gJy4vZ3JpZHN0ZXJJdGVtQ29tcG9uZW50LmludGVyZmFjZSc7XG5pbXBvcnQge0dyaWRzdGVyUmVuZGVyZXJ9IGZyb20gJy4vZ3JpZHN0ZXJSZW5kZXJlci5zZXJ2aWNlJztcbmltcG9ydCB7R3JpZHN0ZXJVdGlsc30gZnJvbSAnLi9ncmlkc3RlclV0aWxzLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdncmlkc3RlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9ncmlkc3Rlci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZ3JpZHN0ZXIuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgR3JpZHN0ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBHcmlkc3RlckNvbXBvbmVudEludGVyZmFjZSB7XG4gIEBJbnB1dCgpIG9wdGlvbnM6IEdyaWRzdGVyQ29uZmlnO1xuICBjYWxjdWxhdGVMYXlvdXREZWJvdW5jZTogKCkgPT4gdm9pZDtcbiAgbW92aW5nSXRlbTogR3JpZHN0ZXJJdGVtIHwgbnVsbDtcbiAgcHJldmlld1N0eWxlOiAoKSA9PiB2b2lkO1xuICBlbDogYW55O1xuICAkb3B0aW9uczogR3JpZHN0ZXJDb25maWdTO1xuICBtb2JpbGU6IGJvb2xlYW47XG4gIGN1cldpZHRoOiBudW1iZXI7XG4gIGN1ckhlaWdodDogbnVtYmVyO1xuICBncmlkOiBBcnJheTxHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2U+O1xuICBjb2x1bW5zID0gMDtcbiAgcm93cyA9IDA7XG4gIGN1ckNvbFdpZHRoOiBudW1iZXI7XG4gIGN1clJvd0hlaWdodDogbnVtYmVyO1xuICBncmlkQ29sdW1ucyA9IFtdO1xuICBncmlkUm93cyA9IFtdO1xuICB3aW5kb3dSZXNpemU6ICgoKSA9PiB2b2lkKSB8IG51bGw7XG4gIGRyYWdJblByb2dyZXNzOiBib29sZWFuO1xuICBlbXB0eUNlbGw6IEdyaWRzdGVyRW1wdHlDZWxsO1xuICBjb21wYWN0OiBHcmlkc3RlckNvbXBhY3Q7XG4gIGdyaWRSZW5kZXJlcjogR3JpZHN0ZXJSZW5kZXJlcjtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KEVsZW1lbnRSZWYpIGVsOiBFbGVtZW50UmVmLCBASW5qZWN0KFJlbmRlcmVyMikgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgICAgICAgIEBJbmplY3QoQ2hhbmdlRGV0ZWN0b3JSZWYpIHB1YmxpYyBjZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIEBJbmplY3QoTmdab25lKSBwdWJsaWMgem9uZTogTmdab25lKSB7XG4gICAgdGhpcy5lbCA9IGVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy4kb3B0aW9ucyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoR3JpZHN0ZXJDb25maWdTZXJ2aWNlKSk7XG4gICAgdGhpcy5jYWxjdWxhdGVMYXlvdXREZWJvdW5jZSA9IEdyaWRzdGVyVXRpbHMuZGVib3VuY2UodGhpcy5jYWxjdWxhdGVMYXlvdXQuYmluZCh0aGlzKSwgMCk7XG4gICAgdGhpcy5tb2JpbGUgPSBmYWxzZTtcbiAgICB0aGlzLmN1cldpZHRoID0gMDtcbiAgICB0aGlzLmN1ckhlaWdodCA9IDA7XG4gICAgdGhpcy5ncmlkID0gW107XG4gICAgdGhpcy5jdXJDb2xXaWR0aCA9IDA7XG4gICAgdGhpcy5jdXJSb3dIZWlnaHQgPSAwO1xuICAgIHRoaXMuZHJhZ0luUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICB0aGlzLmVtcHR5Q2VsbCA9IG5ldyBHcmlkc3RlckVtcHR5Q2VsbCh0aGlzKTtcbiAgICB0aGlzLmNvbXBhY3QgPSBuZXcgR3JpZHN0ZXJDb21wYWN0KHRoaXMpO1xuICAgIHRoaXMuZ3JpZFJlbmRlcmVyID0gbmV3IEdyaWRzdGVyUmVuZGVyZXIodGhpcyk7XG4gIH1cblxuICBjaGVja0NvbGxpc2lvblR3b0l0ZW1zKGl0ZW06IEdyaWRzdGVySXRlbSwgaXRlbTI6IEdyaWRzdGVySXRlbSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGNvbGxpc2lvbiA9IGl0ZW0ueCA8IGl0ZW0yLnggKyBpdGVtMi5jb2xzXG4gICAgICAmJiBpdGVtLnggKyBpdGVtLmNvbHMgPiBpdGVtMi54XG4gICAgICAmJiBpdGVtLnkgPCBpdGVtMi55ICsgaXRlbTIucm93c1xuICAgICAgJiYgaXRlbS55ICsgaXRlbS5yb3dzID4gaXRlbTIueTtcbiAgICBpZiAoIWNvbGxpc2lvbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuJG9wdGlvbnMuYWxsb3dNdWx0aUxheWVyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3QgZGVmYXVsdExheWVySW5kZXggPSB0aGlzLiRvcHRpb25zLmRlZmF1bHRMYXllckluZGV4O1xuICAgIGNvbnN0IGxheWVySW5kZXggPSBpdGVtLmxheWVySW5kZXggPT09IHVuZGVmaW5lZCA/IGRlZmF1bHRMYXllckluZGV4IDogaXRlbS5sYXllckluZGV4O1xuICAgIGNvbnN0IGxheWVySW5kZXgyID0gaXRlbTIubGF5ZXJJbmRleCA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdExheWVySW5kZXggOiBpdGVtMi5sYXllckluZGV4O1xuICAgIHJldHVybiBsYXllckluZGV4ID09PSBsYXllckluZGV4MjtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuaW5pdENhbGxiYWNrKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuaW5pdENhbGxiYWNrKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5vcHRpb25zKSB7XG4gICAgICB0aGlzLnNldE9wdGlvbnMoKTtcbiAgICAgIHRoaXMub3B0aW9ucy5hcGkgPSB7XG4gICAgICAgIG9wdGlvbnNDaGFuZ2VkOiB0aGlzLm9wdGlvbnNDaGFuZ2VkLmJpbmQodGhpcyksXG4gICAgICAgIHJlc2l6ZTogdGhpcy5vblJlc2l6ZS5iaW5kKHRoaXMpLFxuICAgICAgICBnZXROZXh0UG9zc2libGVQb3NpdGlvbjogdGhpcy5nZXROZXh0UG9zc2libGVQb3NpdGlvbi5iaW5kKHRoaXMpLFxuICAgICAgICBnZXRGaXJzdFBvc3NpYmxlUG9zaXRpb246IHRoaXMuZ2V0Rmlyc3RQb3NzaWJsZVBvc2l0aW9uLmJpbmQodGhpcyksXG4gICAgICAgIGdldExhc3RQb3NzaWJsZVBvc2l0aW9uOiB0aGlzLmdldExhc3RQb3NzaWJsZVBvc2l0aW9uLmJpbmQodGhpcyksXG4gICAgICB9O1xuICAgICAgdGhpcy5jb2x1bW5zID0gdGhpcy4kb3B0aW9ucy5taW5Db2xzO1xuICAgICAgdGhpcy5yb3dzID0gdGhpcy4kb3B0aW9ucy5taW5Sb3dzO1xuICAgICAgdGhpcy5zZXRHcmlkU2l6ZSgpO1xuICAgICAgdGhpcy5jYWxjdWxhdGVMYXlvdXQoKTtcbiAgICB9XG4gIH1cblxuICByZXNpemUoKTogdm9pZCB7XG4gICAgbGV0IGhlaWdodDtcbiAgICBsZXQgd2lkdGg7XG4gICAgaWYgKHRoaXMuJG9wdGlvbnMuZ3JpZFR5cGUgPT09ICdmaXQnICYmICF0aGlzLm1vYmlsZSkge1xuICAgICAgd2lkdGggPSB0aGlzLmVsLm9mZnNldFdpZHRoO1xuICAgICAgaGVpZ2h0ID0gdGhpcy5lbC5vZmZzZXRIZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpZHRoID0gdGhpcy5lbC5jbGllbnRXaWR0aDtcbiAgICAgIGhlaWdodCA9IHRoaXMuZWwuY2xpZW50SGVpZ2h0O1xuICAgIH1cbiAgICBpZiAoKHdpZHRoICE9PSB0aGlzLmN1cldpZHRoIHx8IGhlaWdodCAhPT0gdGhpcy5jdXJIZWlnaHQpICYmIHRoaXMuY2hlY2tJZlRvUmVzaXplKCkpIHtcbiAgICAgIHRoaXMub25SZXNpemUoKTtcbiAgICB9XG4gIH1cblxuICBzZXRPcHRpb25zKCk6IHZvaWQge1xuICAgIHRoaXMuJG9wdGlvbnMgPSBHcmlkc3RlclV0aWxzLm1lcmdlKHRoaXMuJG9wdGlvbnMsIHRoaXMub3B0aW9ucywgdGhpcy4kb3B0aW9ucyk7XG4gICAgaWYgKCF0aGlzLiRvcHRpb25zLmRpc2FibGVXaW5kb3dSZXNpemUgJiYgIXRoaXMud2luZG93UmVzaXplKSB7XG4gICAgICB0aGlzLndpbmRvd1Jlc2l6ZSA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCd3aW5kb3cnLCAncmVzaXplJywgdGhpcy5vblJlc2l6ZS5iaW5kKHRoaXMpKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuJG9wdGlvbnMuZGlzYWJsZVdpbmRvd1Jlc2l6ZSAmJiB0aGlzLndpbmRvd1Jlc2l6ZSkge1xuICAgICAgdGhpcy53aW5kb3dSZXNpemUoKTtcbiAgICAgIHRoaXMud2luZG93UmVzaXplID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5lbXB0eUNlbGwudXBkYXRlT3B0aW9ucygpO1xuICB9XG5cbiAgb3B0aW9uc0NoYW5nZWQoKTogdm9pZCB7XG4gICAgdGhpcy5zZXRPcHRpb25zKCk7XG4gICAgbGV0IHdpZGdldHNJbmRleDogbnVtYmVyID0gdGhpcy5ncmlkLmxlbmd0aCAtIDE7XG4gICAgbGV0IHdpZGdldDogR3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlO1xuICAgIGZvciAoOyB3aWRnZXRzSW5kZXggPj0gMDsgd2lkZ2V0c0luZGV4LS0pIHtcbiAgICAgIHdpZGdldCA9IHRoaXMuZ3JpZFt3aWRnZXRzSW5kZXhdO1xuICAgICAgd2lkZ2V0LnVwZGF0ZU9wdGlvbnMoKTtcbiAgICB9XG4gICAgdGhpcy5jYWxjdWxhdGVMYXlvdXQoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLndpbmRvd1Jlc2l6ZSkge1xuICAgICAgdGhpcy53aW5kb3dSZXNpemUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuZGVzdHJveUNhbGxiYWNrKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZGVzdHJveUNhbGxiYWNrKHRoaXMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5hcGkpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5hcGkucmVzaXplID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5vcHRpb25zLmFwaS5vcHRpb25zQ2hhbmdlZCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMub3B0aW9ucy5hcGkuZ2V0TmV4dFBvc3NpYmxlUG9zaXRpb24gPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLm9wdGlvbnMuYXBpID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLmVtcHR5Q2VsbC5kZXN0cm95KCk7XG4gICAgZGVsZXRlIHRoaXMuZW1wdHlDZWxsO1xuICAgIHRoaXMuY29tcGFjdC5kZXN0cm95KCk7XG4gICAgZGVsZXRlIHRoaXMuY29tcGFjdDtcbiAgfVxuXG4gIG9uUmVzaXplKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0R3JpZFNpemUoKTtcbiAgICB0aGlzLmNhbGN1bGF0ZUxheW91dCgpO1xuICB9XG5cbiAgY2hlY2tJZlRvUmVzaXplKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGNsaWVudFdpZHRoID0gdGhpcy5lbC5jbGllbnRXaWR0aDtcbiAgICBjb25zdCBvZmZzZXRXaWR0aCA9IHRoaXMuZWwub2Zmc2V0V2lkdGg7XG4gICAgY29uc3Qgc2Nyb2xsV2lkdGggPSB0aGlzLmVsLnNjcm9sbFdpZHRoO1xuICAgIGNvbnN0IGNsaWVudEhlaWdodCA9IHRoaXMuZWwuY2xpZW50SGVpZ2h0O1xuICAgIGNvbnN0IG9mZnNldEhlaWdodCA9IHRoaXMuZWwub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IHNjcm9sbEhlaWdodCA9IHRoaXMuZWwuc2Nyb2xsSGVpZ2h0O1xuICAgIGNvbnN0IHZlcnRpY2FsU2Nyb2xsUHJlc2VudCA9IGNsaWVudFdpZHRoIDwgb2Zmc2V0V2lkdGggJiYgc2Nyb2xsSGVpZ2h0ID4gb2Zmc2V0SGVpZ2h0XG4gICAgICAmJiBzY3JvbGxIZWlnaHQgLSBvZmZzZXRIZWlnaHQgPCBvZmZzZXRXaWR0aCAtIGNsaWVudFdpZHRoO1xuICAgIGNvbnN0IGhvcml6b250YWxTY3JvbGxQcmVzZW50ID0gY2xpZW50SGVpZ2h0IDwgb2Zmc2V0SGVpZ2h0XG4gICAgICAmJiBzY3JvbGxXaWR0aCA+IG9mZnNldFdpZHRoICYmIHNjcm9sbFdpZHRoIC0gb2Zmc2V0V2lkdGggPCBvZmZzZXRIZWlnaHQgLSBjbGllbnRIZWlnaHQ7XG4gICAgaWYgKHZlcnRpY2FsU2Nyb2xsUHJlc2VudCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gIWhvcml6b250YWxTY3JvbGxQcmVzZW50O1xuICB9XG5cbiAgc2V0R3JpZFNpemUoKTogdm9pZCB7XG4gICAgY29uc3QgZWwgPSB0aGlzLmVsO1xuICAgIGxldCB3aWR0aDtcbiAgICBsZXQgaGVpZ2h0O1xuICAgIGlmICh0aGlzLiRvcHRpb25zLnNldEdyaWRTaXplIHx8IHRoaXMuJG9wdGlvbnMuZ3JpZFR5cGUgPT09ICdmaXQnICYmICF0aGlzLm1vYmlsZSkge1xuICAgICAgd2lkdGggPSBlbC5vZmZzZXRXaWR0aDtcbiAgICAgIGhlaWdodCA9IGVsLm9mZnNldEhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgd2lkdGggPSBlbC5jbGllbnRXaWR0aDtcbiAgICAgIGhlaWdodCA9IGVsLmNsaWVudEhlaWdodDtcbiAgICB9XG4gICAgdGhpcy5jdXJXaWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuY3VySGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG5cbiAgc2V0R3JpZERpbWVuc2lvbnMoKTogdm9pZCB7XG4gICAgdGhpcy5zZXRHcmlkU2l6ZSgpO1xuICAgIGlmICghdGhpcy5tb2JpbGUgJiYgdGhpcy4kb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50ID4gdGhpcy5jdXJXaWR0aCkge1xuICAgICAgdGhpcy5tb2JpbGUgPSAhdGhpcy5tb2JpbGU7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWwsICdtb2JpbGUnKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubW9iaWxlICYmIHRoaXMuJG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludCA8IHRoaXMuY3VyV2lkdGgpIHtcbiAgICAgIHRoaXMubW9iaWxlID0gIXRoaXMubW9iaWxlO1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsLCAnbW9iaWxlJyk7XG4gICAgfVxuICAgIGxldCByb3dzID0gdGhpcy4kb3B0aW9ucy5taW5Sb3dzO1xuICAgIGxldCBjb2x1bW5zID0gdGhpcy4kb3B0aW9ucy5taW5Db2xzO1xuXG4gICAgbGV0IHdpZGdldHNJbmRleCA9IHRoaXMuZ3JpZC5sZW5ndGggLSAxO1xuICAgIGxldCB3aWRnZXQ7XG4gICAgZm9yICg7IHdpZGdldHNJbmRleCA+PSAwOyB3aWRnZXRzSW5kZXgtLSkge1xuICAgICAgd2lkZ2V0ID0gdGhpcy5ncmlkW3dpZGdldHNJbmRleF07XG4gICAgICBpZiAoIXdpZGdldC5ub3RQbGFjZWQpIHtcbiAgICAgICAgcm93cyA9IE1hdGgubWF4KHJvd3MsIHdpZGdldC4kaXRlbS55ICsgd2lkZ2V0LiRpdGVtLnJvd3MpO1xuICAgICAgICBjb2x1bW5zID0gTWF0aC5tYXgoY29sdW1ucywgd2lkZ2V0LiRpdGVtLnggKyB3aWRnZXQuJGl0ZW0uY29scyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29sdW1ucyAhPT0gY29sdW1ucyB8fCB0aGlzLnJvd3MgIT09IHJvd3MpIHtcbiAgICAgIHRoaXMuY29sdW1ucyA9IGNvbHVtbnM7XG4gICAgICB0aGlzLnJvd3MgPSByb3dzO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5ncmlkU2l6ZUNoYW5nZWRDYWxsYmFjaykge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZ3JpZFNpemVDaGFuZ2VkQ2FsbGJhY2sodGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2FsY3VsYXRlTGF5b3V0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbXBhY3QpIHtcbiAgICAgIHRoaXMuY29tcGFjdC5jaGVja0NvbXBhY3QoKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldEdyaWREaW1lbnNpb25zKCk7XG4gICAgaWYgKHRoaXMuJG9wdGlvbnMub3V0ZXJNYXJnaW4pIHtcbiAgICAgIGxldCBtYXJnaW5XaWR0aCA9IC10aGlzLiRvcHRpb25zLm1hcmdpbjtcbiAgICAgIGlmICh0aGlzLiRvcHRpb25zLm91dGVyTWFyZ2luTGVmdCAhPT0gbnVsbCkge1xuICAgICAgICBtYXJnaW5XaWR0aCArPSB0aGlzLiRvcHRpb25zLm91dGVyTWFyZ2luTGVmdDtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAncGFkZGluZy1sZWZ0JywgdGhpcy4kb3B0aW9ucy5vdXRlck1hcmdpbkxlZnQgKyAncHgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1hcmdpbldpZHRoICs9IHRoaXMuJG9wdGlvbnMubWFyZ2luO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwsICdwYWRkaW5nLWxlZnQnLCB0aGlzLiRvcHRpb25zLm1hcmdpbiArICdweCcpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuJG9wdGlvbnMub3V0ZXJNYXJnaW5SaWdodCAhPT0gbnVsbCkge1xuICAgICAgICBtYXJnaW5XaWR0aCArPSB0aGlzLiRvcHRpb25zLm91dGVyTWFyZ2luUmlnaHQ7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbCwgJ3BhZGRpbmctcmlnaHQnLCB0aGlzLiRvcHRpb25zLm91dGVyTWFyZ2luUmlnaHQgKyAncHgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1hcmdpbldpZHRoICs9IHRoaXMuJG9wdGlvbnMubWFyZ2luO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwsICdwYWRkaW5nLXJpZ2h0JywgdGhpcy4kb3B0aW9ucy5tYXJnaW4gKyAncHgnKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY3VyQ29sV2lkdGggPSAodGhpcy5jdXJXaWR0aCAtIG1hcmdpbldpZHRoKSAvIHRoaXMuY29sdW1ucztcbiAgICAgIGxldCBtYXJnaW5IZWlnaHQgPSAtdGhpcy4kb3B0aW9ucy5tYXJnaW47XG4gICAgICBpZiAodGhpcy4kb3B0aW9ucy5vdXRlck1hcmdpblRvcCAhPT0gbnVsbCkge1xuICAgICAgICBtYXJnaW5IZWlnaHQgKz0gdGhpcy4kb3B0aW9ucy5vdXRlck1hcmdpblRvcDtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAncGFkZGluZy10b3AnLCB0aGlzLiRvcHRpb25zLm91dGVyTWFyZ2luVG9wICsgJ3B4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXJnaW5IZWlnaHQgKz0gdGhpcy4kb3B0aW9ucy5tYXJnaW47XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbCwgJ3BhZGRpbmctdG9wJywgdGhpcy4kb3B0aW9ucy5tYXJnaW4gKyAncHgnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLiRvcHRpb25zLm91dGVyTWFyZ2luQm90dG9tICE9PSBudWxsKSB7XG4gICAgICAgIG1hcmdpbkhlaWdodCArPSB0aGlzLiRvcHRpb25zLm91dGVyTWFyZ2luQm90dG9tO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwsICdwYWRkaW5nLWJvdHRvbScsIHRoaXMuJG9wdGlvbnMub3V0ZXJNYXJnaW5Cb3R0b20gKyAncHgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1hcmdpbkhlaWdodCArPSB0aGlzLiRvcHRpb25zLm1hcmdpbjtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAncGFkZGluZy1ib3R0b20nLCB0aGlzLiRvcHRpb25zLm1hcmdpbiArICdweCcpO1xuICAgICAgfVxuICAgICAgdGhpcy5jdXJSb3dIZWlnaHQgPSAodGhpcy5jdXJIZWlnaHQgLSBtYXJnaW5IZWlnaHQpIC8gdGhpcy5yb3dzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1ckNvbFdpZHRoID0gKHRoaXMuY3VyV2lkdGggKyB0aGlzLiRvcHRpb25zLm1hcmdpbikgLyB0aGlzLmNvbHVtbnM7XG4gICAgICB0aGlzLmN1clJvd0hlaWdodCA9ICh0aGlzLmN1ckhlaWdodCArIHRoaXMuJG9wdGlvbnMubWFyZ2luKSAvIHRoaXMucm93cztcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbCwgJ3BhZGRpbmctbGVmdCcsIDAgKyAncHgnKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbCwgJ3BhZGRpbmctcmlnaHQnLCAwICsgJ3B4Jyk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwsICdwYWRkaW5nLXRvcCcsIDAgKyAncHgnKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbCwgJ3BhZGRpbmctYm90dG9tJywgMCArICdweCcpO1xuICAgIH1cbiAgICB0aGlzLmdyaWRSZW5kZXJlci51cGRhdGVHcmlkc3RlcigpO1xuXG4gICAgdGhpcy51cGRhdGVHcmlkKCk7XG5cbiAgICBpZiAodGhpcy4kb3B0aW9ucy5zZXRHcmlkU2l6ZSkge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAnd2lkdGgnLCAodGhpcy5jb2x1bW5zICogdGhpcy5jdXJDb2xXaWR0aCArIHRoaXMuJG9wdGlvbnMubWFyZ2luKSArICdweCcpO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAnaGVpZ2h0JywgKHRoaXMucm93cyAqIHRoaXMuY3VyUm93SGVpZ2h0ICsgdGhpcy4kb3B0aW9ucy5tYXJnaW4pICsgJ3B4Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbCwgJ3dpZHRoJywgJycpO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAnaGVpZ2h0JywgJycpO1xuICAgIH1cblxuICAgIGxldCB3aWRnZXRzSW5kZXg6IG51bWJlciA9IHRoaXMuZ3JpZC5sZW5ndGggLSAxO1xuICAgIGxldCB3aWRnZXQ6IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZTtcbiAgICBmb3IgKDsgd2lkZ2V0c0luZGV4ID49IDA7IHdpZGdldHNJbmRleC0tKSB7XG4gICAgICB3aWRnZXQgPSB0aGlzLmdyaWRbd2lkZ2V0c0luZGV4XTtcbiAgICAgIHdpZGdldC5zZXRTaXplKCk7XG4gICAgICB3aWRnZXQuZHJhZy50b2dnbGUoKTtcbiAgICAgIHdpZGdldC5yZXNpemUudG9nZ2xlKCk7XG4gICAgfVxuXG4gICAgc2V0VGltZW91dCh0aGlzLnJlc2l6ZS5iaW5kKHRoaXMpLCAxMDApO1xuICB9XG5cbiAgdXBkYXRlR3JpZCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy4kb3B0aW9ucy5kaXNwbGF5R3JpZCA9PT0gJ2Fsd2F5cycgJiYgIXRoaXMubW9iaWxlKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWwsICdkaXNwbGF5LWdyaWQnKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuJG9wdGlvbnMuZGlzcGxheUdyaWQgPT09ICdvbkRyYWcmUmVzaXplJyAmJiB0aGlzLmRyYWdJblByb2dyZXNzKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWwsICdkaXNwbGF5LWdyaWQnKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuJG9wdGlvbnMuZGlzcGxheUdyaWQgPT09ICdub25lJyB8fCAhdGhpcy5kcmFnSW5Qcm9ncmVzcyB8fCB0aGlzLm1vYmlsZSkge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsLCAnZGlzcGxheS1ncmlkJyk7XG4gICAgfVxuICAgIHRoaXMuc2V0R3JpZERpbWVuc2lvbnMoKTtcbiAgICB0aGlzLmdyaWRDb2x1bW5zLmxlbmd0aCA9IEdyaWRzdGVyQ29tcG9uZW50LmdldE5ld0FycmF5TGVuZ3RoKHRoaXMuY29sdW1ucywgdGhpcy5jdXJXaWR0aCwgdGhpcy5jdXJDb2xXaWR0aCk7XG4gICAgdGhpcy5ncmlkUm93cy5sZW5ndGggPSBHcmlkc3RlckNvbXBvbmVudC5nZXROZXdBcnJheUxlbmd0aCh0aGlzLnJvd3MsIHRoaXMuY3VySGVpZ2h0LCB0aGlzLmN1clJvd0hlaWdodCk7XG4gICAgdGhpcy5jZFJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGFkZEl0ZW0oaXRlbUNvbXBvbmVudDogR3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlKTogdm9pZCB7XG4gICAgaWYgKGl0ZW1Db21wb25lbnQuJGl0ZW0uY29scyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpdGVtQ29tcG9uZW50LiRpdGVtLmNvbHMgPSB0aGlzLiRvcHRpb25zLmRlZmF1bHRJdGVtQ29scztcbiAgICAgIGl0ZW1Db21wb25lbnQuaXRlbS5jb2xzID0gaXRlbUNvbXBvbmVudC4kaXRlbS5jb2xzO1xuICAgICAgaXRlbUNvbXBvbmVudC5pdGVtQ2hhbmdlZCgpO1xuICAgIH1cbiAgICBpZiAoaXRlbUNvbXBvbmVudC4kaXRlbS5yb3dzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGl0ZW1Db21wb25lbnQuJGl0ZW0ucm93cyA9IHRoaXMuJG9wdGlvbnMuZGVmYXVsdEl0ZW1Sb3dzO1xuICAgICAgaXRlbUNvbXBvbmVudC5pdGVtLnJvd3MgPSBpdGVtQ29tcG9uZW50LiRpdGVtLnJvd3M7XG4gICAgICBpdGVtQ29tcG9uZW50Lml0ZW1DaGFuZ2VkKCk7XG4gICAgfVxuICAgIGlmIChpdGVtQ29tcG9uZW50LiRpdGVtLnggPT09IC0xIHx8IGl0ZW1Db21wb25lbnQuJGl0ZW0ueSA9PT0gLTEpIHtcbiAgICAgIHRoaXMuYXV0b1Bvc2l0aW9uSXRlbShpdGVtQ29tcG9uZW50KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY2hlY2tDb2xsaXNpb24oaXRlbUNvbXBvbmVudC4kaXRlbSkpIHtcbiAgICAgIGlmICghdGhpcy4kb3B0aW9ucy5kaXNhYmxlV2FybmluZ3MpIHtcbiAgICAgICAgaXRlbUNvbXBvbmVudC5ub3RQbGFjZWQgPSB0cnVlO1xuICAgICAgICBjb25zb2xlLndhcm4oJ0NhblxcJ3QgYmUgcGxhY2VkIGluIHRoZSBib3VuZHMgb2YgdGhlIGRhc2hib2FyZCwgdHJ5aW5nIHRvIGF1dG8gcG9zaXRpb24hL24nICtcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeShpdGVtQ29tcG9uZW50Lml0ZW0sIFsnY29scycsICdyb3dzJywgJ3gnLCAneSddKSk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuJG9wdGlvbnMuZGlzYWJsZUF1dG9Qb3NpdGlvbk9uQ29uZmxpY3QpIHtcbiAgICAgICAgdGhpcy5hdXRvUG9zaXRpb25JdGVtKGl0ZW1Db21wb25lbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXRlbUNvbXBvbmVudC5ub3RQbGFjZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmdyaWQucHVzaChpdGVtQ29tcG9uZW50KTtcbiAgICB0aGlzLmNhbGN1bGF0ZUxheW91dERlYm91bmNlKCk7XG4gIH1cblxuICByZW1vdmVJdGVtKGl0ZW1Db21wb25lbnQ6IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZSk6IHZvaWQge1xuICAgIHRoaXMuZ3JpZC5zcGxpY2UodGhpcy5ncmlkLmluZGV4T2YoaXRlbUNvbXBvbmVudCksIDEpO1xuICAgIHRoaXMuY2FsY3VsYXRlTGF5b3V0RGVib3VuY2UoKTtcbiAgICBpZiAodGhpcy5vcHRpb25zLml0ZW1SZW1vdmVkQ2FsbGJhY2spIHtcbiAgICAgIHRoaXMub3B0aW9ucy5pdGVtUmVtb3ZlZENhbGxiYWNrKGl0ZW1Db21wb25lbnQuaXRlbSwgaXRlbUNvbXBvbmVudCk7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tDb2xsaXNpb24oaXRlbTogR3JpZHN0ZXJJdGVtKTogR3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlIHwgYm9vbGVhbiB7XG4gICAgbGV0IGNvbGxpc2lvbjogR3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlIHwgYm9vbGVhbiA9IGZhbHNlO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuaXRlbVZhbGlkYXRlQ2FsbGJhY2spIHtcbiAgICAgIGNvbGxpc2lvbiA9ICF0aGlzLm9wdGlvbnMuaXRlbVZhbGlkYXRlQ2FsbGJhY2soaXRlbSk7XG4gICAgfVxuICAgIGlmICghY29sbGlzaW9uICYmIHRoaXMuY2hlY2tHcmlkQ29sbGlzaW9uKGl0ZW0pKSB7XG4gICAgICBjb2xsaXNpb24gPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIWNvbGxpc2lvbikge1xuICAgICAgY29uc3QgYyA9IHRoaXMuZmluZEl0ZW1XaXRoSXRlbShpdGVtKTtcbiAgICAgIGlmIChjKSB7XG4gICAgICAgIGNvbGxpc2lvbiA9IGM7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb2xsaXNpb247XG4gIH1cblxuICBjaGVja0dyaWRDb2xsaXNpb24oaXRlbTogR3JpZHN0ZXJJdGVtKTogYm9vbGVhbiB7XG4gICAgY29uc3Qgbm9OZWdhdGl2ZVBvc2l0aW9uID0gaXRlbS55ID4gLTEgJiYgaXRlbS54ID4gLTE7XG4gICAgY29uc3QgbWF4R3JpZENvbHMgPSBpdGVtLmNvbHMgKyBpdGVtLnggPD0gdGhpcy4kb3B0aW9ucy5tYXhDb2xzO1xuICAgIGNvbnN0IG1heEdyaWRSb3dzID0gaXRlbS5yb3dzICsgaXRlbS55IDw9IHRoaXMuJG9wdGlvbnMubWF4Um93cztcbiAgICBjb25zdCBtYXhJdGVtQ29scyA9IGl0ZW0ubWF4SXRlbUNvbHMgPT09IHVuZGVmaW5lZCA/IHRoaXMuJG9wdGlvbnMubWF4SXRlbUNvbHMgOiBpdGVtLm1heEl0ZW1Db2xzO1xuICAgIGNvbnN0IG1pbkl0ZW1Db2xzID0gaXRlbS5taW5JdGVtQ29scyA9PT0gdW5kZWZpbmVkID8gdGhpcy4kb3B0aW9ucy5taW5JdGVtQ29scyA6IGl0ZW0ubWluSXRlbUNvbHM7XG4gICAgY29uc3QgbWF4SXRlbVJvd3MgPSBpdGVtLm1heEl0ZW1Sb3dzID09PSB1bmRlZmluZWQgPyB0aGlzLiRvcHRpb25zLm1heEl0ZW1Sb3dzIDogaXRlbS5tYXhJdGVtUm93cztcbiAgICBjb25zdCBtaW5JdGVtUm93cyA9IGl0ZW0ubWluSXRlbVJvd3MgPT09IHVuZGVmaW5lZCA/IHRoaXMuJG9wdGlvbnMubWluSXRlbVJvd3MgOiBpdGVtLm1pbkl0ZW1Sb3dzO1xuICAgIGNvbnN0IGluQ29sc0xpbWl0cyA9IGl0ZW0uY29scyA8PSBtYXhJdGVtQ29scyAmJiBpdGVtLmNvbHMgPj0gbWluSXRlbUNvbHM7XG4gICAgY29uc3QgaW5Sb3dzTGltaXRzID0gaXRlbS5yb3dzIDw9IG1heEl0ZW1Sb3dzICYmIGl0ZW0ucm93cyA+PSBtaW5JdGVtUm93cztcbiAgICBjb25zdCBtaW5BcmVhTGltaXQgPSBpdGVtLm1pbkl0ZW1BcmVhID09PSB1bmRlZmluZWQgPyB0aGlzLiRvcHRpb25zLm1pbkl0ZW1BcmVhIDogaXRlbS5taW5JdGVtQXJlYTtcbiAgICBjb25zdCBtYXhBcmVhTGltaXQgPSBpdGVtLm1heEl0ZW1BcmVhID09PSB1bmRlZmluZWQgPyB0aGlzLiRvcHRpb25zLm1heEl0ZW1BcmVhIDogaXRlbS5tYXhJdGVtQXJlYTtcbiAgICBjb25zdCBhcmVhID0gaXRlbS5jb2xzICogaXRlbS5yb3dzO1xuICAgIGNvbnN0IGluTWluQXJlYSA9IG1pbkFyZWFMaW1pdCA8PSBhcmVhO1xuICAgIGNvbnN0IGluTWF4QXJlYSA9IG1heEFyZWFMaW1pdCA+PSBhcmVhO1xuICAgIHJldHVybiAhKG5vTmVnYXRpdmVQb3NpdGlvbiAmJiBtYXhHcmlkQ29scyAmJiBtYXhHcmlkUm93cyAmJiBpbkNvbHNMaW1pdHMgJiYgaW5Sb3dzTGltaXRzICYmIGluTWluQXJlYSAmJiBpbk1heEFyZWEpO1xuICB9XG5cbiAgZmluZEl0ZW1XaXRoSXRlbShpdGVtOiBHcmlkc3Rlckl0ZW0pOiBHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2UgfCBib29sZWFuIHtcbiAgICBsZXQgd2lkZ2V0c0luZGV4OiBudW1iZXIgPSB0aGlzLmdyaWQubGVuZ3RoIC0gMTtcbiAgICBsZXQgd2lkZ2V0OiBHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2U7XG4gICAgZm9yICg7IHdpZGdldHNJbmRleCA+IC0xOyB3aWRnZXRzSW5kZXgtLSkge1xuICAgICAgd2lkZ2V0ID0gdGhpcy5ncmlkW3dpZGdldHNJbmRleF07XG4gICAgICBpZiAod2lkZ2V0LiRpdGVtICE9PSBpdGVtICYmIHRoaXMuY2hlY2tDb2xsaXNpb25Ud29JdGVtcyh3aWRnZXQuJGl0ZW0sIGl0ZW0pKSB7XG4gICAgICAgIHJldHVybiB3aWRnZXQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZpbmRJdGVtc1dpdGhJdGVtKGl0ZW06IEdyaWRzdGVySXRlbSk6IEFycmF5PEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZT4ge1xuICAgIGNvbnN0IGE6IEFycmF5PEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZT4gPSBbXTtcbiAgICBsZXQgd2lkZ2V0c0luZGV4OiBudW1iZXIgPSB0aGlzLmdyaWQubGVuZ3RoIC0gMTtcbiAgICBsZXQgd2lkZ2V0OiBHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2U7XG4gICAgZm9yICg7IHdpZGdldHNJbmRleCA+IC0xOyB3aWRnZXRzSW5kZXgtLSkge1xuICAgICAgd2lkZ2V0ID0gdGhpcy5ncmlkW3dpZGdldHNJbmRleF07XG4gICAgICBpZiAod2lkZ2V0LiRpdGVtICE9PSBpdGVtICYmIHRoaXMuY2hlY2tDb2xsaXNpb25Ud29JdGVtcyh3aWRnZXQuJGl0ZW0sIGl0ZW0pKSB7XG4gICAgICAgIGEucHVzaCh3aWRnZXQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYTtcbiAgfVxuXG4gIGF1dG9Qb3NpdGlvbkl0ZW0oaXRlbUNvbXBvbmVudDogR3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZ2V0TmV4dFBvc3NpYmxlUG9zaXRpb24oaXRlbUNvbXBvbmVudC4kaXRlbSkpIHtcbiAgICAgIGl0ZW1Db21wb25lbnQubm90UGxhY2VkID0gZmFsc2U7XG4gICAgICBpdGVtQ29tcG9uZW50Lml0ZW0ueCA9IGl0ZW1Db21wb25lbnQuJGl0ZW0ueDtcbiAgICAgIGl0ZW1Db21wb25lbnQuaXRlbS55ID0gaXRlbUNvbXBvbmVudC4kaXRlbS55O1xuICAgICAgaXRlbUNvbXBvbmVudC5pdGVtQ2hhbmdlZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpdGVtQ29tcG9uZW50Lm5vdFBsYWNlZCA9IHRydWU7XG4gICAgICBpZiAoIXRoaXMuJG9wdGlvbnMuZGlzYWJsZVdhcm5pbmdzKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQ2FuXFwndCBiZSBwbGFjZWQgaW4gdGhlIGJvdW5kcyBvZiB0aGUgZGFzaGJvYXJkIS9uJyArXG4gICAgICAgICAgSlNPTi5zdHJpbmdpZnkoaXRlbUNvbXBvbmVudC5pdGVtLCBbJ2NvbHMnLCAncm93cycsICd4JywgJ3knXSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldE5leHRQb3NzaWJsZVBvc2l0aW9uKG5ld0l0ZW06IEdyaWRzdGVySXRlbSwgc3RhcnRpbmdGcm9tOiB7IHk/OiBudW1iZXIsIHg/OiBudW1iZXIgfSA9IHt9KTogYm9vbGVhbiB7XG4gICAgaWYgKG5ld0l0ZW0uY29scyA9PT0gLTEpIHtcbiAgICAgIG5ld0l0ZW0uY29scyA9IHRoaXMuJG9wdGlvbnMuZGVmYXVsdEl0ZW1Db2xzO1xuICAgIH1cbiAgICBpZiAobmV3SXRlbS5yb3dzID09PSAtMSkge1xuICAgICAgbmV3SXRlbS5yb3dzID0gdGhpcy4kb3B0aW9ucy5kZWZhdWx0SXRlbVJvd3M7XG4gICAgfVxuICAgIHRoaXMuc2V0R3JpZERpbWVuc2lvbnMoKTtcbiAgICBsZXQgcm93c0luZGV4ID0gc3RhcnRpbmdGcm9tLnkgfHwgMDtcbiAgICBsZXQgY29sc0luZGV4O1xuICAgIGZvciAoOyByb3dzSW5kZXggPCB0aGlzLnJvd3M7IHJvd3NJbmRleCsrKSB7XG4gICAgICBuZXdJdGVtLnkgPSByb3dzSW5kZXg7XG4gICAgICBjb2xzSW5kZXggPSBzdGFydGluZ0Zyb20ueCB8fCAwO1xuICAgICAgZm9yICg7IGNvbHNJbmRleCA8IHRoaXMuY29sdW1uczsgY29sc0luZGV4KyspIHtcbiAgICAgICAgbmV3SXRlbS54ID0gY29sc0luZGV4O1xuICAgICAgICBpZiAoIXRoaXMuY2hlY2tDb2xsaXNpb24obmV3SXRlbSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBjYW5BZGRUb1Jvd3MgPSB0aGlzLiRvcHRpb25zLm1heFJvd3MgPj0gdGhpcy5yb3dzICsgbmV3SXRlbS5yb3dzO1xuICAgIGNvbnN0IGNhbkFkZFRvQ29sdW1ucyA9IHRoaXMuJG9wdGlvbnMubWF4Q29scyA+PSB0aGlzLmNvbHVtbnMgKyBuZXdJdGVtLmNvbHM7XG4gICAgY29uc3QgYWRkVG9Sb3dzID0gdGhpcy5yb3dzIDw9IHRoaXMuY29sdW1ucyAmJiBjYW5BZGRUb1Jvd3M7XG4gICAgaWYgKCFhZGRUb1Jvd3MgJiYgY2FuQWRkVG9Db2x1bW5zKSB7XG4gICAgICBuZXdJdGVtLnggPSB0aGlzLmNvbHVtbnM7XG4gICAgICBuZXdJdGVtLnkgPSAwO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmIChjYW5BZGRUb1Jvd3MpIHtcbiAgICAgIG5ld0l0ZW0ueSA9IHRoaXMucm93cztcbiAgICAgIG5ld0l0ZW0ueCA9IDA7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0Rmlyc3RQb3NzaWJsZVBvc2l0aW9uKGl0ZW06IEdyaWRzdGVySXRlbSk6IEdyaWRzdGVySXRlbSB7XG4gICAgY29uc3QgdG1wSXRlbSA9IE9iamVjdC5hc3NpZ24oe30sIGl0ZW0pO1xuICAgIHRoaXMuZ2V0TmV4dFBvc3NpYmxlUG9zaXRpb24odG1wSXRlbSk7XG4gICAgcmV0dXJuIHRtcEl0ZW07XG4gIH1cblxuICBnZXRMYXN0UG9zc2libGVQb3NpdGlvbihpdGVtOiBHcmlkc3Rlckl0ZW0pOiBHcmlkc3Rlckl0ZW0ge1xuICAgIGxldCBmYXJ0aGVzdEl0ZW06IHsgeTogbnVtYmVyLCB4OiBudW1iZXIgfSA9IHt5OiAwLCB4OiAwfTtcbiAgICBmYXJ0aGVzdEl0ZW0gPSB0aGlzLmdyaWQucmVkdWNlKChwcmV2OiBhbnksIGN1cnI6IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZSkgPT4ge1xuICAgICAgY29uc3QgY3VyckNvb3JkcyA9IHt5OiBjdXJyLiRpdGVtLnkgKyBjdXJyLiRpdGVtLnJvd3MgLSAxLCB4OiBjdXJyLiRpdGVtLnggKyBjdXJyLiRpdGVtLmNvbHMgLSAxfTtcbiAgICAgIGlmIChHcmlkc3RlclV0aWxzLmNvbXBhcmVJdGVtcyhwcmV2LCBjdXJyQ29vcmRzKSA9PT0gMSkge1xuICAgICAgICByZXR1cm4gY3VyckNvb3JkcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgfVxuICAgIH0sIGZhcnRoZXN0SXRlbSk7XG5cbiAgICBjb25zdCB0bXBJdGVtID0gT2JqZWN0LmFzc2lnbih7fSwgaXRlbSk7XG4gICAgdGhpcy5nZXROZXh0UG9zc2libGVQb3NpdGlvbih0bXBJdGVtLCBmYXJ0aGVzdEl0ZW0pO1xuICAgIHJldHVybiB0bXBJdGVtO1xuICB9XG5cbiAgcGl4ZWxzVG9Qb3NpdGlvblgoeDogbnVtYmVyLCByb3VuZGluZ01ldGhvZDogKHg6IG51bWJlcikgPT4gbnVtYmVyLCBub0xpbWl0PzogYm9vbGVhbik6IG51bWJlciB7XG4gICAgY29uc3QgcG9zaXRpb24gPSByb3VuZGluZ01ldGhvZCh4IC8gdGhpcy5jdXJDb2xXaWR0aCk7XG4gICAgaWYgKG5vTGltaXQpIHtcbiAgICAgIHJldHVybiBwb3NpdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE1hdGgubWF4KHBvc2l0aW9uLCAwKTtcbiAgICB9XG4gIH1cblxuICBwaXhlbHNUb1Bvc2l0aW9uWSh5OiBudW1iZXIsIHJvdW5kaW5nTWV0aG9kOiAoeDogbnVtYmVyKSA9PiBudW1iZXIsIG5vTGltaXQ/OiBib29sZWFuKTogbnVtYmVyIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHJvdW5kaW5nTWV0aG9kKHkgLyB0aGlzLmN1clJvd0hlaWdodCk7XG4gICAgaWYgKG5vTGltaXQpIHtcbiAgICAgIHJldHVybiBwb3NpdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE1hdGgubWF4KHBvc2l0aW9uLCAwKTtcbiAgICB9XG4gIH1cblxuICBwb3NpdGlvblhUb1BpeGVscyh4OiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiB4ICogdGhpcy5jdXJDb2xXaWR0aDtcbiAgfVxuXG4gIHBvc2l0aW9uWVRvUGl4ZWxzKHk6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHkgKiB0aGlzLmN1clJvd0hlaWdodDtcbiAgfVxuXG4gIC8vIC0tLS0tLSBGdW5jdGlvbnMgZm9yIHN3YXBXaGlsZURyYWdnaW5nIG9wdGlvblxuXG4gIC8vIGlkZW50aWNhbCB0byBjaGVja0NvbGxpc2lvbigpIGV4Y2VwdCB0aGF0IGhlcmUgd2UgYWRkIGJvbmRhcmllcy5cbiAgc3RhdGljIGNoZWNrQ29sbGlzaW9uVHdvSXRlbXNGb3JTd2FwaW5nKGl0ZW06IEdyaWRzdGVySXRlbSwgaXRlbTI6IEdyaWRzdGVySXRlbSk6IGJvb2xlYW4ge1xuICAgIC8vIGlmIHRoZSBjb2xzIG9yIHJvd3Mgb2YgdGhlIGl0ZW1zIGFyZSAxICwgZG9lc250IG1ha2UgYW55IHNlbnNlIHRvIHNldCBhIGJvdW5kYXJ5LiBPbmx5IGlmIHRoZSBpdGVtIGlzIGJpZ2dlciB3ZSBzZXQgYSBib3VuZGFyeVxuICAgIGNvbnN0IGhvcml6b250YWxCb3VuZGFyeUl0ZW0xID0gaXRlbS5jb2xzID09PSAxID8gMCA6IDE7XG4gICAgY29uc3QgaG9yaXpvbnRhbEJvdW5kYXJ5SXRlbTIgPSBpdGVtMi5jb2xzID09PSAxID8gMCA6IDE7XG4gICAgY29uc3QgdmVydGljYWxCb3VuZGFyeUl0ZW0xID0gaXRlbS5yb3dzID09PSAxID8gMCA6IDE7XG4gICAgY29uc3QgdmVydGljYWxCb3VuZGFyeUl0ZW0yID0gaXRlbTIucm93cyA9PT0gMSA/IDAgOiAxO1xuICAgIHJldHVybiBpdGVtLnggKyBob3Jpem9udGFsQm91bmRhcnlJdGVtMSA8IGl0ZW0yLnggKyBpdGVtMi5jb2xzXG4gICAgICAmJiBpdGVtLnggKyBpdGVtLmNvbHMgPiBpdGVtMi54ICsgaG9yaXpvbnRhbEJvdW5kYXJ5SXRlbTJcbiAgICAgICYmIGl0ZW0ueSArIHZlcnRpY2FsQm91bmRhcnlJdGVtMSA8IGl0ZW0yLnkgKyBpdGVtMi5yb3dzXG4gICAgICAmJiBpdGVtLnkgKyBpdGVtLnJvd3MgPiBpdGVtMi55ICsgdmVydGljYWxCb3VuZGFyeUl0ZW0yO1xuICB9XG5cbiAgLy8gaWRlbnRpY2FsIHRvIGNoZWNrQ29sbGlzaW9uKCkgZXhjZXB0IHRoYXQgdGhpcyBmdW5jdGlvbiBjYWxscyBmaW5kSXRlbVdpdGhJdGVtRm9yU3dhcGluZygpIGluc3RlYWQgb2YgZmluZEl0ZW1XaXRoSXRlbSgpXG4gIGNoZWNrQ29sbGlzaW9uRm9yU3dhcGluZyhpdGVtOiBHcmlkc3Rlckl0ZW0pOiBHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2UgfCBib29sZWFuIHtcbiAgICBsZXQgY29sbGlzaW9uOiBHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2UgfCBib29sZWFuID0gZmFsc2U7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5pdGVtVmFsaWRhdGVDYWxsYmFjaykge1xuICAgICAgY29sbGlzaW9uID0gIXRoaXMub3B0aW9ucy5pdGVtVmFsaWRhdGVDYWxsYmFjayhpdGVtKTtcbiAgICB9XG4gICAgaWYgKCFjb2xsaXNpb24gJiYgdGhpcy5jaGVja0dyaWRDb2xsaXNpb24oaXRlbSkpIHtcbiAgICAgIGNvbGxpc2lvbiA9IHRydWU7XG4gICAgfVxuICAgIGlmICghY29sbGlzaW9uKSB7XG4gICAgICBjb25zdCBjID0gdGhpcy5maW5kSXRlbVdpdGhJdGVtRm9yU3dhcGluZyhpdGVtKTtcbiAgICAgIGlmIChjKSB7XG4gICAgICAgIGNvbGxpc2lvbiA9IGM7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb2xsaXNpb247XG4gIH1cblxuICAvLyBpZGVudGljYWwgdG8gZmluZEl0ZW1XaXRoSXRlbSgpIGV4Y2VwdCB0aGF0IHRoaXMgZnVuY3Rpb24gY2FsbHMgY2hlY2tDb2xsaXNpb25Ud29JdGVtc0ZvclN3YXBpbmcoKSBpbnN0ZWFkIG9mIGNoZWNrQ29sbGlzaW9uVHdvSXRlbXMoKVxuICBmaW5kSXRlbVdpdGhJdGVtRm9yU3dhcGluZyhpdGVtOiBHcmlkc3Rlckl0ZW0pOiBHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2UgfCBib29sZWFuIHtcbiAgICBsZXQgd2lkZ2V0c0luZGV4OiBudW1iZXIgPSB0aGlzLmdyaWQubGVuZ3RoIC0gMTtcbiAgICBsZXQgd2lkZ2V0OiBHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2U7XG4gICAgZm9yICg7IHdpZGdldHNJbmRleCA+IC0xOyB3aWRnZXRzSW5kZXgtLSkge1xuICAgICAgd2lkZ2V0ID0gdGhpcy5ncmlkW3dpZGdldHNJbmRleF07XG4gICAgICBpZiAod2lkZ2V0LiRpdGVtICE9PSBpdGVtICYmIEdyaWRzdGVyQ29tcG9uZW50LmNoZWNrQ29sbGlzaW9uVHdvSXRlbXNGb3JTd2FwaW5nKHdpZGdldC4kaXRlbSwgaXRlbSkpIHtcbiAgICAgICAgcmV0dXJuIHdpZGdldDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gLS0tLS0tIEVuZCBvZiBmdW5jdGlvbnMgZm9yIHN3YXBXaGlsZURyYWdnaW5nIG9wdGlvblxuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptZW1iZXItb3JkZXJpbmdcbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0TmV3QXJyYXlMZW5ndGgobGVuZ3RoOiBudW1iZXIsIG92ZXJhbGxTaXplOiBudW1iZXIsIHNpemU6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3QgbmV3TGVuZ3RoID0gTWF0aC5tYXgobGVuZ3RoLCBNYXRoLmZsb29yKG92ZXJhbGxTaXplIC8gc2l6ZSkpO1xuXG4gICAgaWYgKG5ld0xlbmd0aCA8IDApIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUobmV3TGVuZ3RoKSkge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IobmV3TGVuZ3RoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cImdyaWRzdGVyLWNvbHVtblwiICpuZ0Zvcj1cImxldCBjb2x1bW4gb2YgZ3JpZENvbHVtbnM7IGxldCBpID0gaW5kZXg7XCJcbiAgICAgW25nU3R5bGVdPVwiZ3JpZFJlbmRlcmVyLmdldEdyaWRDb2x1bW5TdHlsZShpKVwiPjwvZGl2PlxuPGRpdiBjbGFzcz1cImdyaWRzdGVyLXJvd1wiICpuZ0Zvcj1cImxldCByb3cgb2YgZ3JpZFJvd3M7IGxldCBpID0gaW5kZXg7XCJcbiAgICAgW25nU3R5bGVdPVwiZ3JpZFJlbmRlcmVyLmdldEdyaWRSb3dTdHlsZShpKVwiPjwvZGl2PlxuPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuPGdyaWRzdGVyLXByZXZpZXcgY2xhc3M9XCJncmlkc3Rlci1wcmV2aWV3XCI+PC9ncmlkc3Rlci1wcmV2aWV3PlxuIl19