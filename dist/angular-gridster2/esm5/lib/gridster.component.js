import { __decorate, __metadata, __param } from "tslib";
import { ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { GridsterCompact } from './gridsterCompact.service';
import { GridsterConfigService } from './gridsterConfig.constant';
import { GridsterEmptyCell } from './gridsterEmptyCell.service';
import { GridsterRenderer } from './gridsterRenderer.service';
import { GridsterUtils } from './gridsterUtils.service';
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
    GridsterComponent_1 = GridsterComponent;
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
        this.gridColumns.length = GridsterComponent_1.getNewArrayLength(this.columns, this.curWidth, this.curColWidth);
        this.gridRows.length = GridsterComponent_1.getNewArrayLength(this.rows, this.curHeight, this.curRowHeight);
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
            if (widget.$item !== item && GridsterComponent_1.checkCollisionTwoItemsForSwaping(widget.$item, item)) {
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
    var GridsterComponent_1;
    GridsterComponent.ctorParameters = function () { return [
        { type: ElementRef, decorators: [{ type: Inject, args: [ElementRef,] }] },
        { type: Renderer2, decorators: [{ type: Inject, args: [Renderer2,] }] },
        { type: ChangeDetectorRef, decorators: [{ type: Inject, args: [ChangeDetectorRef,] }] },
        { type: NgZone, decorators: [{ type: Inject, args: [NgZone,] }] }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], GridsterComponent.prototype, "options", void 0);
    GridsterComponent = GridsterComponent_1 = __decorate([
        Component({
            selector: 'gridster',
            template: "<div class=\"gridster-column\" *ngFor=\"let column of gridColumns; let i = index;\"\n     [ngStyle]=\"gridRenderer.getGridColumnStyle(i)\"></div>\n<div class=\"gridster-row\" *ngFor=\"let row of gridRows; let i = index;\"\n     [ngStyle]=\"gridRenderer.getGridRowStyle(i)\"></div>\n<ng-content></ng-content>\n<gridster-preview class=\"gridster-preview\"></gridster-preview>\n",
            encapsulation: ViewEncapsulation.None,
            styles: ["gridster{position:relative;box-sizing:border-box;background:grey;width:100%;height:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:block}gridster.fit{overflow-x:hidden;overflow-y:hidden}gridster.scrollVertical{overflow-x:hidden;overflow-y:auto}gridster.scrollHorizontal{overflow-x:auto;overflow-y:hidden}gridster.fixed{overflow:auto}gridster.mobile{overflow-x:hidden;overflow-y:auto}gridster.mobile gridster-item{position:relative}gridster .gridster-column,gridster .gridster-row{position:absolute;display:none;transition:.3s;box-sizing:border-box}gridster.display-grid .gridster-column,gridster.display-grid .gridster-row{display:block}gridster .gridster-column{border-left:1px solid #fff;border-right:1px solid #fff}gridster .gridster-row{border-top:1px solid #fff;border-bottom:1px solid #fff}"]
        }),
        __param(0, Inject(ElementRef)), __param(1, Inject(Renderer2)),
        __param(2, Inject(ChangeDetectorRef)),
        __param(3, Inject(NgZone)),
        __metadata("design:paramtypes", [ElementRef, Renderer2,
            ChangeDetectorRef,
            NgZone])
    ], GridsterComponent);
    return GridsterComponent;
}());
export { GridsterComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1ncmlkc3RlcjIvIiwic291cmNlcyI6WyJsaWIvZ3JpZHN0ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxNQUFNLEVBQ04sU0FBUyxFQUNULGFBQWEsRUFDYixpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBRTFELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBR2hFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBRzlELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQzVELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQVF0RDtJQXVCRSwyQkFBZ0MsRUFBYyxFQUE0QixRQUFtQixFQUMvQyxLQUF3QixFQUNuQyxJQUFZO1FBRjJCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDL0MsVUFBSyxHQUFMLEtBQUssQ0FBbUI7UUFDbkMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQWQvQyxZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ1osU0FBSSxHQUFHLENBQUMsQ0FBQztRQUdULGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLGFBQVEsR0FBRyxFQUFFLENBQUM7UUFVWixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1FB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bmlCRCxJQW1pQkM7U0FuaUJZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgUmVuZGVyZXIyLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7R3JpZHN0ZXJDb21wb25lbnRJbnRlcmZhY2V9IGZyb20gJy4vZ3JpZHN0ZXIuaW50ZXJmYWNlJztcbmltcG9ydCB7R3JpZHN0ZXJDb21wYWN0fSBmcm9tICcuL2dyaWRzdGVyQ29tcGFjdC5zZXJ2aWNlJztcblxuaW1wb3J0IHtHcmlkc3RlckNvbmZpZ1NlcnZpY2V9IGZyb20gJy4vZ3JpZHN0ZXJDb25maWcuY29uc3RhbnQnO1xuaW1wb3J0IHtHcmlkc3RlckNvbmZpZ30gZnJvbSAnLi9ncmlkc3RlckNvbmZpZy5pbnRlcmZhY2UnO1xuaW1wb3J0IHtHcmlkc3RlckNvbmZpZ1N9IGZyb20gJy4vZ3JpZHN0ZXJDb25maWdTLmludGVyZmFjZSc7XG5pbXBvcnQge0dyaWRzdGVyRW1wdHlDZWxsfSBmcm9tICcuL2dyaWRzdGVyRW1wdHlDZWxsLnNlcnZpY2UnO1xuaW1wb3J0IHtHcmlkc3Rlckl0ZW19IGZyb20gJy4vZ3JpZHN0ZXJJdGVtLmludGVyZmFjZSc7XG5pbXBvcnQge0dyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZX0gZnJvbSAnLi9ncmlkc3Rlckl0ZW1Db21wb25lbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7R3JpZHN0ZXJSZW5kZXJlcn0gZnJvbSAnLi9ncmlkc3RlclJlbmRlcmVyLnNlcnZpY2UnO1xuaW1wb3J0IHtHcmlkc3RlclV0aWxzfSBmcm9tICcuL2dyaWRzdGVyVXRpbHMuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2dyaWRzdGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2dyaWRzdGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9ncmlkc3Rlci5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBHcmlkc3RlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIEdyaWRzdGVyQ29tcG9uZW50SW50ZXJmYWNlIHtcbiAgQElucHV0KCkgb3B0aW9uczogR3JpZHN0ZXJDb25maWc7XG4gIGNhbGN1bGF0ZUxheW91dERlYm91bmNlOiAoKSA9PiB2b2lkO1xuICBtb3ZpbmdJdGVtOiBHcmlkc3Rlckl0ZW0gfCBudWxsO1xuICBwcmV2aWV3U3R5bGU6ICgpID0+IHZvaWQ7XG4gIGVsOiBhbnk7XG4gICRvcHRpb25zOiBHcmlkc3RlckNvbmZpZ1M7XG4gIG1vYmlsZTogYm9vbGVhbjtcbiAgY3VyV2lkdGg6IG51bWJlcjtcbiAgY3VySGVpZ2h0OiBudW1iZXI7XG4gIGdyaWQ6IEFycmF5PEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZT47XG4gIGNvbHVtbnMgPSAwO1xuICByb3dzID0gMDtcbiAgY3VyQ29sV2lkdGg6IG51bWJlcjtcbiAgY3VyUm93SGVpZ2h0OiBudW1iZXI7XG4gIGdyaWRDb2x1bW5zID0gW107XG4gIGdyaWRSb3dzID0gW107XG4gIHdpbmRvd1Jlc2l6ZTogKCgpID0+IHZvaWQpIHwgbnVsbDtcbiAgZHJhZ0luUHJvZ3Jlc3M6IGJvb2xlYW47XG4gIGVtcHR5Q2VsbDogR3JpZHN0ZXJFbXB0eUNlbGw7XG4gIGNvbXBhY3Q6IEdyaWRzdGVyQ29tcGFjdDtcbiAgZ3JpZFJlbmRlcmVyOiBHcmlkc3RlclJlbmRlcmVyO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRWxlbWVudFJlZikgZWw6IEVsZW1lbnRSZWYsIEBJbmplY3QoUmVuZGVyZXIyKSBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgICAgICAgQEluamVjdChDaGFuZ2VEZXRlY3RvclJlZikgcHVibGljIGNkUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgQEluamVjdChOZ1pvbmUpIHB1YmxpYyB6b25lOiBOZ1pvbmUpIHtcbiAgICB0aGlzLmVsID0gZWwubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLiRvcHRpb25zID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShHcmlkc3RlckNvbmZpZ1NlcnZpY2UpKTtcbiAgICB0aGlzLmNhbGN1bGF0ZUxheW91dERlYm91bmNlID0gR3JpZHN0ZXJVdGlscy5kZWJvdW5jZSh0aGlzLmNhbGN1bGF0ZUxheW91dC5iaW5kKHRoaXMpLCAwKTtcbiAgICB0aGlzLm1vYmlsZSA9IGZhbHNlO1xuICAgIHRoaXMuY3VyV2lkdGggPSAwO1xuICAgIHRoaXMuY3VySGVpZ2h0ID0gMDtcbiAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICB0aGlzLmN1ckNvbFdpZHRoID0gMDtcbiAgICB0aGlzLmN1clJvd0hlaWdodCA9IDA7XG4gICAgdGhpcy5kcmFnSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgIHRoaXMuZW1wdHlDZWxsID0gbmV3IEdyaWRzdGVyRW1wdHlDZWxsKHRoaXMpO1xuICAgIHRoaXMuY29tcGFjdCA9IG5ldyBHcmlkc3RlckNvbXBhY3QodGhpcyk7XG4gICAgdGhpcy5ncmlkUmVuZGVyZXIgPSBuZXcgR3JpZHN0ZXJSZW5kZXJlcih0aGlzKTtcbiAgfVxuXG4gIGNoZWNrQ29sbGlzaW9uVHdvSXRlbXMoaXRlbTogR3JpZHN0ZXJJdGVtLCBpdGVtMjogR3JpZHN0ZXJJdGVtKTogYm9vbGVhbiB7XG4gICAgY29uc3QgY29sbGlzaW9uID0gaXRlbS54IDwgaXRlbTIueCArIGl0ZW0yLmNvbHNcbiAgICAgICYmIGl0ZW0ueCArIGl0ZW0uY29scyA+IGl0ZW0yLnhcbiAgICAgICYmIGl0ZW0ueSA8IGl0ZW0yLnkgKyBpdGVtMi5yb3dzXG4gICAgICAmJiBpdGVtLnkgKyBpdGVtLnJvd3MgPiBpdGVtMi55O1xuICAgIGlmICghY29sbGlzaW9uKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghdGhpcy4kb3B0aW9ucy5hbGxvd011bHRpTGF5ZXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBkZWZhdWx0TGF5ZXJJbmRleCA9IHRoaXMuJG9wdGlvbnMuZGVmYXVsdExheWVySW5kZXg7XG4gICAgY29uc3QgbGF5ZXJJbmRleCA9IGl0ZW0ubGF5ZXJJbmRleCA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdExheWVySW5kZXggOiBpdGVtLmxheWVySW5kZXg7XG4gICAgY29uc3QgbGF5ZXJJbmRleDIgPSBpdGVtMi5sYXllckluZGV4ID09PSB1bmRlZmluZWQgPyBkZWZhdWx0TGF5ZXJJbmRleCA6IGl0ZW0yLmxheWVySW5kZXg7XG4gICAgcmV0dXJuIGxheWVySW5kZXggPT09IGxheWVySW5kZXgyO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5pbml0Q2FsbGJhY2spIHtcbiAgICAgIHRoaXMub3B0aW9ucy5pbml0Q2FsbGJhY2sodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLm9wdGlvbnMpIHtcbiAgICAgIHRoaXMuc2V0T3B0aW9ucygpO1xuICAgICAgdGhpcy5vcHRpb25zLmFwaSA9IHtcbiAgICAgICAgb3B0aW9uc0NoYW5nZWQ6IHRoaXMub3B0aW9uc0NoYW5nZWQuYmluZCh0aGlzKSxcbiAgICAgICAgcmVzaXplOiB0aGlzLm9uUmVzaXplLmJpbmQodGhpcyksXG4gICAgICAgIGdldE5leHRQb3NzaWJsZVBvc2l0aW9uOiB0aGlzLmdldE5leHRQb3NzaWJsZVBvc2l0aW9uLmJpbmQodGhpcyksXG4gICAgICAgIGdldEZpcnN0UG9zc2libGVQb3NpdGlvbjogdGhpcy5nZXRGaXJzdFBvc3NpYmxlUG9zaXRpb24uYmluZCh0aGlzKSxcbiAgICAgICAgZ2V0TGFzdFBvc3NpYmxlUG9zaXRpb246IHRoaXMuZ2V0TGFzdFBvc3NpYmxlUG9zaXRpb24uYmluZCh0aGlzKSxcbiAgICAgIH07XG4gICAgICB0aGlzLmNvbHVtbnMgPSB0aGlzLiRvcHRpb25zLm1pbkNvbHM7XG4gICAgICB0aGlzLnJvd3MgPSB0aGlzLiRvcHRpb25zLm1pblJvd3M7XG4gICAgICB0aGlzLnNldEdyaWRTaXplKCk7XG4gICAgICB0aGlzLmNhbGN1bGF0ZUxheW91dCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlc2l6ZSgpOiB2b2lkIHtcbiAgICBsZXQgaGVpZ2h0O1xuICAgIGxldCB3aWR0aDtcbiAgICBpZiAodGhpcy4kb3B0aW9ucy5ncmlkVHlwZSA9PT0gJ2ZpdCcgJiYgIXRoaXMubW9iaWxlKSB7XG4gICAgICB3aWR0aCA9IHRoaXMuZWwub2Zmc2V0V2lkdGg7XG4gICAgICBoZWlnaHQgPSB0aGlzLmVsLm9mZnNldEhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgd2lkdGggPSB0aGlzLmVsLmNsaWVudFdpZHRoO1xuICAgICAgaGVpZ2h0ID0gdGhpcy5lbC5jbGllbnRIZWlnaHQ7XG4gICAgfVxuICAgIGlmICgod2lkdGggIT09IHRoaXMuY3VyV2lkdGggfHwgaGVpZ2h0ICE9PSB0aGlzLmN1ckhlaWdodCkgJiYgdGhpcy5jaGVja0lmVG9SZXNpemUoKSkge1xuICAgICAgdGhpcy5vblJlc2l6ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHNldE9wdGlvbnMoKTogdm9pZCB7XG4gICAgdGhpcy4kb3B0aW9ucyA9IEdyaWRzdGVyVXRpbHMubWVyZ2UodGhpcy4kb3B0aW9ucywgdGhpcy5vcHRpb25zLCB0aGlzLiRvcHRpb25zKTtcbiAgICBpZiAoIXRoaXMuJG9wdGlvbnMuZGlzYWJsZVdpbmRvd1Jlc2l6ZSAmJiAhdGhpcy53aW5kb3dSZXNpemUpIHtcbiAgICAgIHRoaXMud2luZG93UmVzaXplID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ3dpbmRvdycsICdyZXNpemUnLCB0aGlzLm9uUmVzaXplLmJpbmQodGhpcykpO1xuICAgIH0gZWxzZSBpZiAodGhpcy4kb3B0aW9ucy5kaXNhYmxlV2luZG93UmVzaXplICYmIHRoaXMud2luZG93UmVzaXplKSB7XG4gICAgICB0aGlzLndpbmRvd1Jlc2l6ZSgpO1xuICAgICAgdGhpcy53aW5kb3dSZXNpemUgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLmVtcHR5Q2VsbC51cGRhdGVPcHRpb25zKCk7XG4gIH1cblxuICBvcHRpb25zQ2hhbmdlZCgpOiB2b2lkIHtcbiAgICB0aGlzLnNldE9wdGlvbnMoKTtcbiAgICBsZXQgd2lkZ2V0c0luZGV4OiBudW1iZXIgPSB0aGlzLmdyaWQubGVuZ3RoIC0gMTtcbiAgICBsZXQgd2lkZ2V0OiBHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2U7XG4gICAgZm9yICg7IHdpZGdldHNJbmRleCA+PSAwOyB3aWRnZXRzSW5kZXgtLSkge1xuICAgICAgd2lkZ2V0ID0gdGhpcy5ncmlkW3dpZGdldHNJbmRleF07XG4gICAgICB3aWRnZXQudXBkYXRlT3B0aW9ucygpO1xuICAgIH1cbiAgICB0aGlzLmNhbGN1bGF0ZUxheW91dCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMud2luZG93UmVzaXplKSB7XG4gICAgICB0aGlzLndpbmRvd1Jlc2l6ZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5kZXN0cm95Q2FsbGJhY2spIHtcbiAgICAgIHRoaXMub3B0aW9ucy5kZXN0cm95Q2FsbGJhY2sodGhpcyk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmFwaSkge1xuICAgICAgdGhpcy5vcHRpb25zLmFwaS5yZXNpemUgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLm9wdGlvbnMuYXBpLm9wdGlvbnNDaGFuZ2VkID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5vcHRpb25zLmFwaS5nZXROZXh0UG9zc2libGVQb3NpdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMub3B0aW9ucy5hcGkgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMuZW1wdHlDZWxsLmRlc3Ryb3koKTtcbiAgICBkZWxldGUgdGhpcy5lbXB0eUNlbGw7XG4gICAgdGhpcy5jb21wYWN0LmRlc3Ryb3koKTtcbiAgICBkZWxldGUgdGhpcy5jb21wYWN0O1xuICB9XG5cbiAgb25SZXNpemUoKTogdm9pZCB7XG4gICAgdGhpcy5zZXRHcmlkU2l6ZSgpO1xuICAgIHRoaXMuY2FsY3VsYXRlTGF5b3V0KCk7XG4gIH1cblxuICBjaGVja0lmVG9SZXNpemUoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgY2xpZW50V2lkdGggPSB0aGlzLmVsLmNsaWVudFdpZHRoO1xuICAgIGNvbnN0IG9mZnNldFdpZHRoID0gdGhpcy5lbC5vZmZzZXRXaWR0aDtcbiAgICBjb25zdCBzY3JvbGxXaWR0aCA9IHRoaXMuZWwuc2Nyb2xsV2lkdGg7XG4gICAgY29uc3QgY2xpZW50SGVpZ2h0ID0gdGhpcy5lbC5jbGllbnRIZWlnaHQ7XG4gICAgY29uc3Qgb2Zmc2V0SGVpZ2h0ID0gdGhpcy5lbC5vZmZzZXRIZWlnaHQ7XG4gICAgY29uc3Qgc2Nyb2xsSGVpZ2h0ID0gdGhpcy5lbC5zY3JvbGxIZWlnaHQ7XG4gICAgY29uc3QgdmVydGljYWxTY3JvbGxQcmVzZW50ID0gY2xpZW50V2lkdGggPCBvZmZzZXRXaWR0aCAmJiBzY3JvbGxIZWlnaHQgPiBvZmZzZXRIZWlnaHRcbiAgICAgICYmIHNjcm9sbEhlaWdodCAtIG9mZnNldEhlaWdodCA8IG9mZnNldFdpZHRoIC0gY2xpZW50V2lkdGg7XG4gICAgY29uc3QgaG9yaXpvbnRhbFNjcm9sbFByZXNlbnQgPSBjbGllbnRIZWlnaHQgPCBvZmZzZXRIZWlnaHRcbiAgICAgICYmIHNjcm9sbFdpZHRoID4gb2Zmc2V0V2lkdGggJiYgc2Nyb2xsV2lkdGggLSBvZmZzZXRXaWR0aCA8IG9mZnNldEhlaWdodCAtIGNsaWVudEhlaWdodDtcbiAgICBpZiAodmVydGljYWxTY3JvbGxQcmVzZW50KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAhaG9yaXpvbnRhbFNjcm9sbFByZXNlbnQ7XG4gIH1cblxuICBzZXRHcmlkU2l6ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBlbCA9IHRoaXMuZWw7XG4gICAgbGV0IHdpZHRoO1xuICAgIGxldCBoZWlnaHQ7XG4gICAgaWYgKHRoaXMuJG9wdGlvbnMuc2V0R3JpZFNpemUgfHwgdGhpcy4kb3B0aW9ucy5ncmlkVHlwZSA9PT0gJ2ZpdCcgJiYgIXRoaXMubW9iaWxlKSB7XG4gICAgICB3aWR0aCA9IGVsLm9mZnNldFdpZHRoO1xuICAgICAgaGVpZ2h0ID0gZWwub2Zmc2V0SGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICB3aWR0aCA9IGVsLmNsaWVudFdpZHRoO1xuICAgICAgaGVpZ2h0ID0gZWwuY2xpZW50SGVpZ2h0O1xuICAgIH1cbiAgICB0aGlzLmN1cldpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5jdXJIZWlnaHQgPSBoZWlnaHQ7XG4gIH1cblxuICBzZXRHcmlkRGltZW5zaW9ucygpOiB2b2lkIHtcbiAgICB0aGlzLnNldEdyaWRTaXplKCk7XG4gICAgaWYgKCF0aGlzLm1vYmlsZSAmJiB0aGlzLiRvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnQgPiB0aGlzLmN1cldpZHRoKSB7XG4gICAgICB0aGlzLm1vYmlsZSA9ICF0aGlzLm1vYmlsZTtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbCwgJ21vYmlsZScpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tb2JpbGUgJiYgdGhpcy4kb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50IDwgdGhpcy5jdXJXaWR0aCkge1xuICAgICAgdGhpcy5tb2JpbGUgPSAhdGhpcy5tb2JpbGU7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWwsICdtb2JpbGUnKTtcbiAgICB9XG4gICAgbGV0IHJvd3MgPSB0aGlzLiRvcHRpb25zLm1pblJvd3M7XG4gICAgbGV0IGNvbHVtbnMgPSB0aGlzLiRvcHRpb25zLm1pbkNvbHM7XG5cbiAgICBsZXQgd2lkZ2V0c0luZGV4ID0gdGhpcy5ncmlkLmxlbmd0aCAtIDE7XG4gICAgbGV0IHdpZGdldDtcbiAgICBmb3IgKDsgd2lkZ2V0c0luZGV4ID49IDA7IHdpZGdldHNJbmRleC0tKSB7XG4gICAgICB3aWRnZXQgPSB0aGlzLmdyaWRbd2lkZ2V0c0luZGV4XTtcbiAgICAgIGlmICghd2lkZ2V0Lm5vdFBsYWNlZCkge1xuICAgICAgICByb3dzID0gTWF0aC5tYXgocm93cywgd2lkZ2V0LiRpdGVtLnkgKyB3aWRnZXQuJGl0ZW0ucm93cyk7XG4gICAgICAgIGNvbHVtbnMgPSBNYXRoLm1heChjb2x1bW5zLCB3aWRnZXQuJGl0ZW0ueCArIHdpZGdldC4kaXRlbS5jb2xzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb2x1bW5zICE9PSBjb2x1bW5zIHx8IHRoaXMucm93cyAhPT0gcm93cykge1xuICAgICAgdGhpcy5jb2x1bW5zID0gY29sdW1ucztcbiAgICAgIHRoaXMucm93cyA9IHJvd3M7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmdyaWRTaXplQ2hhbmdlZENhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5ncmlkU2l6ZUNoYW5nZWRDYWxsYmFjayh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjYWxjdWxhdGVMYXlvdXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29tcGFjdCkge1xuICAgICAgdGhpcy5jb21wYWN0LmNoZWNrQ29tcGFjdCgpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0R3JpZERpbWVuc2lvbnMoKTtcbiAgICBpZiAodGhpcy4kb3B0aW9ucy5vdXRlck1hcmdpbikge1xuICAgICAgbGV0IG1hcmdpbldpZHRoID0gLXRoaXMuJG9wdGlvbnMubWFyZ2luO1xuICAgICAgaWYgKHRoaXMuJG9wdGlvbnMub3V0ZXJNYXJnaW5MZWZ0ICE9PSBudWxsKSB7XG4gICAgICAgIG1hcmdpbldpZHRoICs9IHRoaXMuJG9wdGlvbnMub3V0ZXJNYXJnaW5MZWZ0O1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwsICdwYWRkaW5nLWxlZnQnLCB0aGlzLiRvcHRpb25zLm91dGVyTWFyZ2luTGVmdCArICdweCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWFyZ2luV2lkdGggKz0gdGhpcy4kb3B0aW9ucy5tYXJnaW47XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbCwgJ3BhZGRpbmctbGVmdCcsIHRoaXMuJG9wdGlvbnMubWFyZ2luICsgJ3B4Jyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy4kb3B0aW9ucy5vdXRlck1hcmdpblJpZ2h0ICE9PSBudWxsKSB7XG4gICAgICAgIG1hcmdpbldpZHRoICs9IHRoaXMuJG9wdGlvbnMub3V0ZXJNYXJnaW5SaWdodDtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAncGFkZGluZy1yaWdodCcsIHRoaXMuJG9wdGlvbnMub3V0ZXJNYXJnaW5SaWdodCArICdweCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWFyZ2luV2lkdGggKz0gdGhpcy4kb3B0aW9ucy5tYXJnaW47XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbCwgJ3BhZGRpbmctcmlnaHQnLCB0aGlzLiRvcHRpb25zLm1hcmdpbiArICdweCcpO1xuICAgICAgfVxuICAgICAgdGhpcy5jdXJDb2xXaWR0aCA9ICh0aGlzLmN1cldpZHRoIC0gbWFyZ2luV2lkdGgpIC8gdGhpcy5jb2x1bW5zO1xuICAgICAgbGV0IG1hcmdpbkhlaWdodCA9IC10aGlzLiRvcHRpb25zLm1hcmdpbjtcbiAgICAgIGlmICh0aGlzLiRvcHRpb25zLm91dGVyTWFyZ2luVG9wICE9PSBudWxsKSB7XG4gICAgICAgIG1hcmdpbkhlaWdodCArPSB0aGlzLiRvcHRpb25zLm91dGVyTWFyZ2luVG9wO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwsICdwYWRkaW5nLXRvcCcsIHRoaXMuJG9wdGlvbnMub3V0ZXJNYXJnaW5Ub3AgKyAncHgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1hcmdpbkhlaWdodCArPSB0aGlzLiRvcHRpb25zLm1hcmdpbjtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAncGFkZGluZy10b3AnLCB0aGlzLiRvcHRpb25zLm1hcmdpbiArICdweCcpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuJG9wdGlvbnMub3V0ZXJNYXJnaW5Cb3R0b20gIT09IG51bGwpIHtcbiAgICAgICAgbWFyZ2luSGVpZ2h0ICs9IHRoaXMuJG9wdGlvbnMub3V0ZXJNYXJnaW5Cb3R0b207XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbCwgJ3BhZGRpbmctYm90dG9tJywgdGhpcy4kb3B0aW9ucy5vdXRlck1hcmdpbkJvdHRvbSArICdweCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWFyZ2luSGVpZ2h0ICs9IHRoaXMuJG9wdGlvbnMubWFyZ2luO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwsICdwYWRkaW5nLWJvdHRvbScsIHRoaXMuJG9wdGlvbnMubWFyZ2luICsgJ3B4Jyk7XG4gICAgICB9XG4gICAgICB0aGlzLmN1clJvd0hlaWdodCA9ICh0aGlzLmN1ckhlaWdodCAtIG1hcmdpbkhlaWdodCkgLyB0aGlzLnJvd3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3VyQ29sV2lkdGggPSAodGhpcy5jdXJXaWR0aCArIHRoaXMuJG9wdGlvbnMubWFyZ2luKSAvIHRoaXMuY29sdW1ucztcbiAgICAgIHRoaXMuY3VyUm93SGVpZ2h0ID0gKHRoaXMuY3VySGVpZ2h0ICsgdGhpcy4kb3B0aW9ucy5tYXJnaW4pIC8gdGhpcy5yb3dzO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAncGFkZGluZy1sZWZ0JywgMCArICdweCcpO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAncGFkZGluZy1yaWdodCcsIDAgKyAncHgnKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbCwgJ3BhZGRpbmctdG9wJywgMCArICdweCcpO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAncGFkZGluZy1ib3R0b20nLCAwICsgJ3B4Jyk7XG4gICAgfVxuICAgIHRoaXMuZ3JpZFJlbmRlcmVyLnVwZGF0ZUdyaWRzdGVyKCk7XG5cbiAgICB0aGlzLnVwZGF0ZUdyaWQoKTtcblxuICAgIGlmICh0aGlzLiRvcHRpb25zLnNldEdyaWRTaXplKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwsICd3aWR0aCcsICh0aGlzLmNvbHVtbnMgKiB0aGlzLmN1ckNvbFdpZHRoICsgdGhpcy4kb3B0aW9ucy5tYXJnaW4pICsgJ3B4Jyk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwsICdoZWlnaHQnLCAodGhpcy5yb3dzICogdGhpcy5jdXJSb3dIZWlnaHQgKyB0aGlzLiRvcHRpb25zLm1hcmdpbikgKyAncHgnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAnd2lkdGgnLCAnJyk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwsICdoZWlnaHQnLCAnJyk7XG4gICAgfVxuXG4gICAgbGV0IHdpZGdldHNJbmRleDogbnVtYmVyID0gdGhpcy5ncmlkLmxlbmd0aCAtIDE7XG4gICAgbGV0IHdpZGdldDogR3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlO1xuICAgIGZvciAoOyB3aWRnZXRzSW5kZXggPj0gMDsgd2lkZ2V0c0luZGV4LS0pIHtcbiAgICAgIHdpZGdldCA9IHRoaXMuZ3JpZFt3aWRnZXRzSW5kZXhdO1xuICAgICAgd2lkZ2V0LnNldFNpemUoKTtcbiAgICAgIHdpZGdldC5kcmFnLnRvZ2dsZSgpO1xuICAgICAgd2lkZ2V0LnJlc2l6ZS50b2dnbGUoKTtcbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KHRoaXMucmVzaXplLmJpbmQodGhpcyksIDEwMCk7XG4gIH1cblxuICB1cGRhdGVHcmlkKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLiRvcHRpb25zLmRpc3BsYXlHcmlkID09PSAnYWx3YXlzJyAmJiAhdGhpcy5tb2JpbGUpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbCwgJ2Rpc3BsYXktZ3JpZCcpO1xuICAgIH0gZWxzZSBpZiAodGhpcy4kb3B0aW9ucy5kaXNwbGF5R3JpZCA9PT0gJ29uRHJhZyZSZXNpemUnICYmIHRoaXMuZHJhZ0luUHJvZ3Jlc3MpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbCwgJ2Rpc3BsYXktZ3JpZCcpO1xuICAgIH0gZWxzZSBpZiAodGhpcy4kb3B0aW9ucy5kaXNwbGF5R3JpZCA9PT0gJ25vbmUnIHx8ICF0aGlzLmRyYWdJblByb2dyZXNzIHx8IHRoaXMubW9iaWxlKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWwsICdkaXNwbGF5LWdyaWQnKTtcbiAgICB9XG4gICAgdGhpcy5zZXRHcmlkRGltZW5zaW9ucygpO1xuICAgIHRoaXMuZ3JpZENvbHVtbnMubGVuZ3RoID0gR3JpZHN0ZXJDb21wb25lbnQuZ2V0TmV3QXJyYXlMZW5ndGgodGhpcy5jb2x1bW5zLCB0aGlzLmN1cldpZHRoLCB0aGlzLmN1ckNvbFdpZHRoKTtcbiAgICB0aGlzLmdyaWRSb3dzLmxlbmd0aCA9IEdyaWRzdGVyQ29tcG9uZW50LmdldE5ld0FycmF5TGVuZ3RoKHRoaXMucm93cywgdGhpcy5jdXJIZWlnaHQsIHRoaXMuY3VyUm93SGVpZ2h0KTtcbiAgICB0aGlzLmNkUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgYWRkSXRlbShpdGVtQ29tcG9uZW50OiBHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2UpOiB2b2lkIHtcbiAgICBpZiAoaXRlbUNvbXBvbmVudC4kaXRlbS5jb2xzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGl0ZW1Db21wb25lbnQuJGl0ZW0uY29scyA9IHRoaXMuJG9wdGlvbnMuZGVmYXVsdEl0ZW1Db2xzO1xuICAgICAgaXRlbUNvbXBvbmVudC5pdGVtLmNvbHMgPSBpdGVtQ29tcG9uZW50LiRpdGVtLmNvbHM7XG4gICAgICBpdGVtQ29tcG9uZW50Lml0ZW1DaGFuZ2VkKCk7XG4gICAgfVxuICAgIGlmIChpdGVtQ29tcG9uZW50LiRpdGVtLnJvd3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaXRlbUNvbXBvbmVudC4kaXRlbS5yb3dzID0gdGhpcy4kb3B0aW9ucy5kZWZhdWx0SXRlbVJvd3M7XG4gICAgICBpdGVtQ29tcG9uZW50Lml0ZW0ucm93cyA9IGl0ZW1Db21wb25lbnQuJGl0ZW0ucm93cztcbiAgICAgIGl0ZW1Db21wb25lbnQuaXRlbUNoYW5nZWQoKTtcbiAgICB9XG4gICAgaWYgKGl0ZW1Db21wb25lbnQuJGl0ZW0ueCA9PT0gLTEgfHwgaXRlbUNvbXBvbmVudC4kaXRlbS55ID09PSAtMSkge1xuICAgICAgdGhpcy5hdXRvUG9zaXRpb25JdGVtKGl0ZW1Db21wb25lbnQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jaGVja0NvbGxpc2lvbihpdGVtQ29tcG9uZW50LiRpdGVtKSkge1xuICAgICAgaWYgKCF0aGlzLiRvcHRpb25zLmRpc2FibGVXYXJuaW5ncykge1xuICAgICAgICBpdGVtQ29tcG9uZW50Lm5vdFBsYWNlZCA9IHRydWU7XG4gICAgICAgIGNvbnNvbGUud2FybignQ2FuXFwndCBiZSBwbGFjZWQgaW4gdGhlIGJvdW5kcyBvZiB0aGUgZGFzaGJvYXJkLCB0cnlpbmcgdG8gYXV0byBwb3NpdGlvbiEvbicgK1xuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGl0ZW1Db21wb25lbnQuaXRlbSwgWydjb2xzJywgJ3Jvd3MnLCAneCcsICd5J10pKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy4kb3B0aW9ucy5kaXNhYmxlQXV0b1Bvc2l0aW9uT25Db25mbGljdCkge1xuICAgICAgICB0aGlzLmF1dG9Qb3NpdGlvbkl0ZW0oaXRlbUNvbXBvbmVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdGVtQ29tcG9uZW50Lm5vdFBsYWNlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZ3JpZC5wdXNoKGl0ZW1Db21wb25lbnQpO1xuICAgIHRoaXMuY2FsY3VsYXRlTGF5b3V0RGVib3VuY2UoKTtcbiAgfVxuXG4gIHJlbW92ZUl0ZW0oaXRlbUNvbXBvbmVudDogR3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlKTogdm9pZCB7XG4gICAgdGhpcy5ncmlkLnNwbGljZSh0aGlzLmdyaWQuaW5kZXhPZihpdGVtQ29tcG9uZW50KSwgMSk7XG4gICAgdGhpcy5jYWxjdWxhdGVMYXlvdXREZWJvdW5jZSgpO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuaXRlbVJlbW92ZWRDYWxsYmFjaykge1xuICAgICAgdGhpcy5vcHRpb25zLml0ZW1SZW1vdmVkQ2FsbGJhY2soaXRlbUNvbXBvbmVudC5pdGVtLCBpdGVtQ29tcG9uZW50KTtcbiAgICB9XG4gIH1cblxuICBjaGVja0NvbGxpc2lvbihpdGVtOiBHcmlkc3Rlckl0ZW0pOiBHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2UgfCBib29sZWFuIHtcbiAgICBsZXQgY29sbGlzaW9uOiBHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2UgfCBib29sZWFuID0gZmFsc2U7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5pdGVtVmFsaWRhdGVDYWxsYmFjaykge1xuICAgICAgY29sbGlzaW9uID0gIXRoaXMub3B0aW9ucy5pdGVtVmFsaWRhdGVDYWxsYmFjayhpdGVtKTtcbiAgICB9XG4gICAgaWYgKCFjb2xsaXNpb24gJiYgdGhpcy5jaGVja0dyaWRDb2xsaXNpb24oaXRlbSkpIHtcbiAgICAgIGNvbGxpc2lvbiA9IHRydWU7XG4gICAgfVxuICAgIGlmICghY29sbGlzaW9uKSB7XG4gICAgICBjb25zdCBjID0gdGhpcy5maW5kSXRlbVdpdGhJdGVtKGl0ZW0pO1xuICAgICAgaWYgKGMpIHtcbiAgICAgICAgY29sbGlzaW9uID0gYztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbGxpc2lvbjtcbiAgfVxuXG4gIGNoZWNrR3JpZENvbGxpc2lvbihpdGVtOiBHcmlkc3Rlckl0ZW0pOiBib29sZWFuIHtcbiAgICBjb25zdCBub05lZ2F0aXZlUG9zaXRpb24gPSBpdGVtLnkgPiAtMSAmJiBpdGVtLnggPiAtMTtcbiAgICBjb25zdCBtYXhHcmlkQ29scyA9IGl0ZW0uY29scyArIGl0ZW0ueCA8PSB0aGlzLiRvcHRpb25zLm1heENvbHM7XG4gICAgY29uc3QgbWF4R3JpZFJvd3MgPSBpdGVtLnJvd3MgKyBpdGVtLnkgPD0gdGhpcy4kb3B0aW9ucy5tYXhSb3dzO1xuICAgIGNvbnN0IG1heEl0ZW1Db2xzID0gaXRlbS5tYXhJdGVtQ29scyA9PT0gdW5kZWZpbmVkID8gdGhpcy4kb3B0aW9ucy5tYXhJdGVtQ29scyA6IGl0ZW0ubWF4SXRlbUNvbHM7XG4gICAgY29uc3QgbWluSXRlbUNvbHMgPSBpdGVtLm1pbkl0ZW1Db2xzID09PSB1bmRlZmluZWQgPyB0aGlzLiRvcHRpb25zLm1pbkl0ZW1Db2xzIDogaXRlbS5taW5JdGVtQ29scztcbiAgICBjb25zdCBtYXhJdGVtUm93cyA9IGl0ZW0ubWF4SXRlbVJvd3MgPT09IHVuZGVmaW5lZCA/IHRoaXMuJG9wdGlvbnMubWF4SXRlbVJvd3MgOiBpdGVtLm1heEl0ZW1Sb3dzO1xuICAgIGNvbnN0IG1pbkl0ZW1Sb3dzID0gaXRlbS5taW5JdGVtUm93cyA9PT0gdW5kZWZpbmVkID8gdGhpcy4kb3B0aW9ucy5taW5JdGVtUm93cyA6IGl0ZW0ubWluSXRlbVJvd3M7XG4gICAgY29uc3QgaW5Db2xzTGltaXRzID0gaXRlbS5jb2xzIDw9IG1heEl0ZW1Db2xzICYmIGl0ZW0uY29scyA+PSBtaW5JdGVtQ29scztcbiAgICBjb25zdCBpblJvd3NMaW1pdHMgPSBpdGVtLnJvd3MgPD0gbWF4SXRlbVJvd3MgJiYgaXRlbS5yb3dzID49IG1pbkl0ZW1Sb3dzO1xuICAgIGNvbnN0IG1pbkFyZWFMaW1pdCA9IGl0ZW0ubWluSXRlbUFyZWEgPT09IHVuZGVmaW5lZCA/IHRoaXMuJG9wdGlvbnMubWluSXRlbUFyZWEgOiBpdGVtLm1pbkl0ZW1BcmVhO1xuICAgIGNvbnN0IG1heEFyZWFMaW1pdCA9IGl0ZW0ubWF4SXRlbUFyZWEgPT09IHVuZGVmaW5lZCA/IHRoaXMuJG9wdGlvbnMubWF4SXRlbUFyZWEgOiBpdGVtLm1heEl0ZW1BcmVhO1xuICAgIGNvbnN0IGFyZWEgPSBpdGVtLmNvbHMgKiBpdGVtLnJvd3M7XG4gICAgY29uc3QgaW5NaW5BcmVhID0gbWluQXJlYUxpbWl0IDw9IGFyZWE7XG4gICAgY29uc3QgaW5NYXhBcmVhID0gbWF4QXJlYUxpbWl0ID49IGFyZWE7XG4gICAgcmV0dXJuICEobm9OZWdhdGl2ZVBvc2l0aW9uICYmIG1heEdyaWRDb2xzICYmIG1heEdyaWRSb3dzICYmIGluQ29sc0xpbWl0cyAmJiBpblJvd3NMaW1pdHMgJiYgaW5NaW5BcmVhICYmIGluTWF4QXJlYSk7XG4gIH1cblxuICBmaW5kSXRlbVdpdGhJdGVtKGl0ZW06IEdyaWRzdGVySXRlbSk6IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZSB8IGJvb2xlYW4ge1xuICAgIGxldCB3aWRnZXRzSW5kZXg6IG51bWJlciA9IHRoaXMuZ3JpZC5sZW5ndGggLSAxO1xuICAgIGxldCB3aWRnZXQ6IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZTtcbiAgICBmb3IgKDsgd2lkZ2V0c0luZGV4ID4gLTE7IHdpZGdldHNJbmRleC0tKSB7XG4gICAgICB3aWRnZXQgPSB0aGlzLmdyaWRbd2lkZ2V0c0luZGV4XTtcbiAgICAgIGlmICh3aWRnZXQuJGl0ZW0gIT09IGl0ZW0gJiYgdGhpcy5jaGVja0NvbGxpc2lvblR3b0l0ZW1zKHdpZGdldC4kaXRlbSwgaXRlbSkpIHtcbiAgICAgICAgcmV0dXJuIHdpZGdldDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZmluZEl0ZW1zV2l0aEl0ZW0oaXRlbTogR3JpZHN0ZXJJdGVtKTogQXJyYXk8R3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlPiB7XG4gICAgY29uc3QgYTogQXJyYXk8R3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlPiA9IFtdO1xuICAgIGxldCB3aWRnZXRzSW5kZXg6IG51bWJlciA9IHRoaXMuZ3JpZC5sZW5ndGggLSAxO1xuICAgIGxldCB3aWRnZXQ6IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZTtcbiAgICBmb3IgKDsgd2lkZ2V0c0luZGV4ID4gLTE7IHdpZGdldHNJbmRleC0tKSB7XG4gICAgICB3aWRnZXQgPSB0aGlzLmdyaWRbd2lkZ2V0c0luZGV4XTtcbiAgICAgIGlmICh3aWRnZXQuJGl0ZW0gIT09IGl0ZW0gJiYgdGhpcy5jaGVja0NvbGxpc2lvblR3b0l0ZW1zKHdpZGdldC4kaXRlbSwgaXRlbSkpIHtcbiAgICAgICAgYS5wdXNoKHdpZGdldCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhO1xuICB9XG5cbiAgYXV0b1Bvc2l0aW9uSXRlbShpdGVtQ29tcG9uZW50OiBHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2UpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5nZXROZXh0UG9zc2libGVQb3NpdGlvbihpdGVtQ29tcG9uZW50LiRpdGVtKSkge1xuICAgICAgaXRlbUNvbXBvbmVudC5ub3RQbGFjZWQgPSBmYWxzZTtcbiAgICAgIGl0ZW1Db21wb25lbnQuaXRlbS54ID0gaXRlbUNvbXBvbmVudC4kaXRlbS54O1xuICAgICAgaXRlbUNvbXBvbmVudC5pdGVtLnkgPSBpdGVtQ29tcG9uZW50LiRpdGVtLnk7XG4gICAgICBpdGVtQ29tcG9uZW50Lml0ZW1DaGFuZ2VkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZW1Db21wb25lbnQubm90UGxhY2VkID0gdHJ1ZTtcbiAgICAgIGlmICghdGhpcy4kb3B0aW9ucy5kaXNhYmxlV2FybmluZ3MpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdDYW5cXCd0IGJlIHBsYWNlZCBpbiB0aGUgYm91bmRzIG9mIHRoZSBkYXNoYm9hcmQhL24nICtcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeShpdGVtQ29tcG9uZW50Lml0ZW0sIFsnY29scycsICdyb3dzJywgJ3gnLCAneSddKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0TmV4dFBvc3NpYmxlUG9zaXRpb24obmV3SXRlbTogR3JpZHN0ZXJJdGVtLCBzdGFydGluZ0Zyb206IHsgeT86IG51bWJlciwgeD86IG51bWJlciB9ID0ge30pOiBib29sZWFuIHtcbiAgICBpZiAobmV3SXRlbS5jb2xzID09PSAtMSkge1xuICAgICAgbmV3SXRlbS5jb2xzID0gdGhpcy4kb3B0aW9ucy5kZWZhdWx0SXRlbUNvbHM7XG4gICAgfVxuICAgIGlmIChuZXdJdGVtLnJvd3MgPT09IC0xKSB7XG4gICAgICBuZXdJdGVtLnJvd3MgPSB0aGlzLiRvcHRpb25zLmRlZmF1bHRJdGVtUm93cztcbiAgICB9XG4gICAgdGhpcy5zZXRHcmlkRGltZW5zaW9ucygpO1xuICAgIGxldCByb3dzSW5kZXggPSBzdGFydGluZ0Zyb20ueSB8fCAwO1xuICAgIGxldCBjb2xzSW5kZXg7XG4gICAgZm9yICg7IHJvd3NJbmRleCA8IHRoaXMucm93czsgcm93c0luZGV4KyspIHtcbiAgICAgIG5ld0l0ZW0ueSA9IHJvd3NJbmRleDtcbiAgICAgIGNvbHNJbmRleCA9IHN0YXJ0aW5nRnJvbS54IHx8IDA7XG4gICAgICBmb3IgKDsgY29sc0luZGV4IDwgdGhpcy5jb2x1bW5zOyBjb2xzSW5kZXgrKykge1xuICAgICAgICBuZXdJdGVtLnggPSBjb2xzSW5kZXg7XG4gICAgICAgIGlmICghdGhpcy5jaGVja0NvbGxpc2lvbihuZXdJdGVtKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGNhbkFkZFRvUm93cyA9IHRoaXMuJG9wdGlvbnMubWF4Um93cyA+PSB0aGlzLnJvd3MgKyBuZXdJdGVtLnJvd3M7XG4gICAgY29uc3QgY2FuQWRkVG9Db2x1bW5zID0gdGhpcy4kb3B0aW9ucy5tYXhDb2xzID49IHRoaXMuY29sdW1ucyArIG5ld0l0ZW0uY29scztcbiAgICBjb25zdCBhZGRUb1Jvd3MgPSB0aGlzLnJvd3MgPD0gdGhpcy5jb2x1bW5zICYmIGNhbkFkZFRvUm93cztcbiAgICBpZiAoIWFkZFRvUm93cyAmJiBjYW5BZGRUb0NvbHVtbnMpIHtcbiAgICAgIG5ld0l0ZW0ueCA9IHRoaXMuY29sdW1ucztcbiAgICAgIG5ld0l0ZW0ueSA9IDA7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGNhbkFkZFRvUm93cykge1xuICAgICAgbmV3SXRlbS55ID0gdGhpcy5yb3dzO1xuICAgICAgbmV3SXRlbS54ID0gMDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRGaXJzdFBvc3NpYmxlUG9zaXRpb24oaXRlbTogR3JpZHN0ZXJJdGVtKTogR3JpZHN0ZXJJdGVtIHtcbiAgICBjb25zdCB0bXBJdGVtID0gT2JqZWN0LmFzc2lnbih7fSwgaXRlbSk7XG4gICAgdGhpcy5nZXROZXh0UG9zc2libGVQb3NpdGlvbih0bXBJdGVtKTtcbiAgICByZXR1cm4gdG1wSXRlbTtcbiAgfVxuXG4gIGdldExhc3RQb3NzaWJsZVBvc2l0aW9uKGl0ZW06IEdyaWRzdGVySXRlbSk6IEdyaWRzdGVySXRlbSB7XG4gICAgbGV0IGZhcnRoZXN0SXRlbTogeyB5OiBudW1iZXIsIHg6IG51bWJlciB9ID0ge3k6IDAsIHg6IDB9O1xuICAgIGZhcnRoZXN0SXRlbSA9IHRoaXMuZ3JpZC5yZWR1Y2UoKHByZXY6IGFueSwgY3VycjogR3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlKSA9PiB7XG4gICAgICBjb25zdCBjdXJyQ29vcmRzID0ge3k6IGN1cnIuJGl0ZW0ueSArIGN1cnIuJGl0ZW0ucm93cyAtIDEsIHg6IGN1cnIuJGl0ZW0ueCArIGN1cnIuJGl0ZW0uY29scyAtIDF9O1xuICAgICAgaWYgKEdyaWRzdGVyVXRpbHMuY29tcGFyZUl0ZW1zKHByZXYsIGN1cnJDb29yZHMpID09PSAxKSB7XG4gICAgICAgIHJldHVybiBjdXJyQ29vcmRzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICB9XG4gICAgfSwgZmFydGhlc3RJdGVtKTtcblxuICAgIGNvbnN0IHRtcEl0ZW0gPSBPYmplY3QuYXNzaWduKHt9LCBpdGVtKTtcbiAgICB0aGlzLmdldE5leHRQb3NzaWJsZVBvc2l0aW9uKHRtcEl0ZW0sIGZhcnRoZXN0SXRlbSk7XG4gICAgcmV0dXJuIHRtcEl0ZW07XG4gIH1cblxuICBwaXhlbHNUb1Bvc2l0aW9uWCh4OiBudW1iZXIsIHJvdW5kaW5nTWV0aG9kOiAoeDogbnVtYmVyKSA9PiBudW1iZXIsIG5vTGltaXQ/OiBib29sZWFuKTogbnVtYmVyIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHJvdW5kaW5nTWV0aG9kKHggLyB0aGlzLmN1ckNvbFdpZHRoKTtcbiAgICBpZiAobm9MaW1pdCkge1xuICAgICAgcmV0dXJuIHBvc2l0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gTWF0aC5tYXgocG9zaXRpb24sIDApO1xuICAgIH1cbiAgfVxuXG4gIHBpeGVsc1RvUG9zaXRpb25ZKHk6IG51bWJlciwgcm91bmRpbmdNZXRob2Q6ICh4OiBudW1iZXIpID0+IG51bWJlciwgbm9MaW1pdD86IGJvb2xlYW4pOiBudW1iZXIge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gcm91bmRpbmdNZXRob2QoeSAvIHRoaXMuY3VyUm93SGVpZ2h0KTtcbiAgICBpZiAobm9MaW1pdCkge1xuICAgICAgcmV0dXJuIHBvc2l0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gTWF0aC5tYXgocG9zaXRpb24sIDApO1xuICAgIH1cbiAgfVxuXG4gIHBvc2l0aW9uWFRvUGl4ZWxzKHg6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHggKiB0aGlzLmN1ckNvbFdpZHRoO1xuICB9XG5cbiAgcG9zaXRpb25ZVG9QaXhlbHMoeTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4geSAqIHRoaXMuY3VyUm93SGVpZ2h0O1xuICB9XG5cbiAgLy8gLS0tLS0tIEZ1bmN0aW9ucyBmb3Igc3dhcFdoaWxlRHJhZ2dpbmcgb3B0aW9uXG5cbiAgLy8gaWRlbnRpY2FsIHRvIGNoZWNrQ29sbGlzaW9uKCkgZXhjZXB0IHRoYXQgaGVyZSB3ZSBhZGQgYm9uZGFyaWVzLlxuICBzdGF0aWMgY2hlY2tDb2xsaXNpb25Ud29JdGVtc0ZvclN3YXBpbmcoaXRlbTogR3JpZHN0ZXJJdGVtLCBpdGVtMjogR3JpZHN0ZXJJdGVtKTogYm9vbGVhbiB7XG4gICAgLy8gaWYgdGhlIGNvbHMgb3Igcm93cyBvZiB0aGUgaXRlbXMgYXJlIDEgLCBkb2VzbnQgbWFrZSBhbnkgc2Vuc2UgdG8gc2V0IGEgYm91bmRhcnkuIE9ubHkgaWYgdGhlIGl0ZW0gaXMgYmlnZ2VyIHdlIHNldCBhIGJvdW5kYXJ5XG4gICAgY29uc3QgaG9yaXpvbnRhbEJvdW5kYXJ5SXRlbTEgPSBpdGVtLmNvbHMgPT09IDEgPyAwIDogMTtcbiAgICBjb25zdCBob3Jpem9udGFsQm91bmRhcnlJdGVtMiA9IGl0ZW0yLmNvbHMgPT09IDEgPyAwIDogMTtcbiAgICBjb25zdCB2ZXJ0aWNhbEJvdW5kYXJ5SXRlbTEgPSBpdGVtLnJvd3MgPT09IDEgPyAwIDogMTtcbiAgICBjb25zdCB2ZXJ0aWNhbEJvdW5kYXJ5SXRlbTIgPSBpdGVtMi5yb3dzID09PSAxID8gMCA6IDE7XG4gICAgcmV0dXJuIGl0ZW0ueCArIGhvcml6b250YWxCb3VuZGFyeUl0ZW0xIDwgaXRlbTIueCArIGl0ZW0yLmNvbHNcbiAgICAgICYmIGl0ZW0ueCArIGl0ZW0uY29scyA+IGl0ZW0yLnggKyBob3Jpem9udGFsQm91bmRhcnlJdGVtMlxuICAgICAgJiYgaXRlbS55ICsgdmVydGljYWxCb3VuZGFyeUl0ZW0xIDwgaXRlbTIueSArIGl0ZW0yLnJvd3NcbiAgICAgICYmIGl0ZW0ueSArIGl0ZW0ucm93cyA+IGl0ZW0yLnkgKyB2ZXJ0aWNhbEJvdW5kYXJ5SXRlbTI7XG4gIH1cblxuICAvLyBpZGVudGljYWwgdG8gY2hlY2tDb2xsaXNpb24oKSBleGNlcHQgdGhhdCB0aGlzIGZ1bmN0aW9uIGNhbGxzIGZpbmRJdGVtV2l0aEl0ZW1Gb3JTd2FwaW5nKCkgaW5zdGVhZCBvZiBmaW5kSXRlbVdpdGhJdGVtKClcbiAgY2hlY2tDb2xsaXNpb25Gb3JTd2FwaW5nKGl0ZW06IEdyaWRzdGVySXRlbSk6IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZSB8IGJvb2xlYW4ge1xuICAgIGxldCBjb2xsaXNpb246IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZSB8IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBpZiAodGhpcy5vcHRpb25zLml0ZW1WYWxpZGF0ZUNhbGxiYWNrKSB7XG4gICAgICBjb2xsaXNpb24gPSAhdGhpcy5vcHRpb25zLml0ZW1WYWxpZGF0ZUNhbGxiYWNrKGl0ZW0pO1xuICAgIH1cbiAgICBpZiAoIWNvbGxpc2lvbiAmJiB0aGlzLmNoZWNrR3JpZENvbGxpc2lvbihpdGVtKSkge1xuICAgICAgY29sbGlzaW9uID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCFjb2xsaXNpb24pIHtcbiAgICAgIGNvbnN0IGMgPSB0aGlzLmZpbmRJdGVtV2l0aEl0ZW1Gb3JTd2FwaW5nKGl0ZW0pO1xuICAgICAgaWYgKGMpIHtcbiAgICAgICAgY29sbGlzaW9uID0gYztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbGxpc2lvbjtcbiAgfVxuXG4gIC8vIGlkZW50aWNhbCB0byBmaW5kSXRlbVdpdGhJdGVtKCkgZXhjZXB0IHRoYXQgdGhpcyBmdW5jdGlvbiBjYWxscyBjaGVja0NvbGxpc2lvblR3b0l0ZW1zRm9yU3dhcGluZygpIGluc3RlYWQgb2YgY2hlY2tDb2xsaXNpb25Ud29JdGVtcygpXG4gIGZpbmRJdGVtV2l0aEl0ZW1Gb3JTd2FwaW5nKGl0ZW06IEdyaWRzdGVySXRlbSk6IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZSB8IGJvb2xlYW4ge1xuICAgIGxldCB3aWRnZXRzSW5kZXg6IG51bWJlciA9IHRoaXMuZ3JpZC5sZW5ndGggLSAxO1xuICAgIGxldCB3aWRnZXQ6IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZTtcbiAgICBmb3IgKDsgd2lkZ2V0c0luZGV4ID4gLTE7IHdpZGdldHNJbmRleC0tKSB7XG4gICAgICB3aWRnZXQgPSB0aGlzLmdyaWRbd2lkZ2V0c0luZGV4XTtcbiAgICAgIGlmICh3aWRnZXQuJGl0ZW0gIT09IGl0ZW0gJiYgR3JpZHN0ZXJDb21wb25lbnQuY2hlY2tDb2xsaXNpb25Ud29JdGVtc0ZvclN3YXBpbmcod2lkZ2V0LiRpdGVtLCBpdGVtKSkge1xuICAgICAgICByZXR1cm4gd2lkZ2V0O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyAtLS0tLS0gRW5kIG9mIGZ1bmN0aW9ucyBmb3Igc3dhcFdoaWxlRHJhZ2dpbmcgb3B0aW9uXG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1lbWJlci1vcmRlcmluZ1xuICBwcml2YXRlIHN0YXRpYyBnZXROZXdBcnJheUxlbmd0aChsZW5ndGg6IG51bWJlciwgb3ZlcmFsbFNpemU6IG51bWJlciwgc2l6ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBuZXdMZW5ndGggPSBNYXRoLm1heChsZW5ndGgsIE1hdGguZmxvb3Iob3ZlcmFsbFNpemUgLyBzaXplKSk7XG5cbiAgICBpZiAobmV3TGVuZ3RoIDwgMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShuZXdMZW5ndGgpKSB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihuZXdMZW5ndGgpO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG59XG4iXX0=