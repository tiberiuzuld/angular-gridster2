"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridsterItem_component_1 = require("./gridsterItem.component");
var gridster_component_1 = require("./gridster.component");
var GridsterSwap = (function () {
    function GridsterSwap(gridsterItem, gridster) {
        this.gridsterItem = gridsterItem;
        this.gridster = gridster;
    }
    GridsterSwap.prototype.swapItems = function () {
        if (this.gridster.$options.swap) {
            this.checkSwapBack();
            this.checkSwap(this.gridsterItem);
        }
    };
    GridsterSwap.prototype.checkSwapBack = function () {
        if (this.swapedItem) {
            var x = this.swapedItem.$item.x;
            var y = this.swapedItem.$item.y;
            this.swapedItem.$item.x = this.swapedItem.item.x;
            this.swapedItem.$item.y = this.swapedItem.item.y;
            if (this.gridster.checkCollision(this.swapedItem)) {
                this.swapedItem.$item.x = x;
                this.swapedItem.$item.y = y;
            }
            else {
                this.swapedItem.setSize(true);
                this.gridsterItem.$item.x = this.gridsterItem.item.x;
                this.gridsterItem.$item.y = this.gridsterItem.item.y;
                this.swapedItem = undefined;
            }
        }
    };
    GridsterSwap.prototype.restoreSwapItem = function () {
        if (this.swapedItem) {
            this.swapedItem.$item.x = this.swapedItem.item.x;
            this.swapedItem.$item.y = this.swapedItem.item.y;
            this.swapedItem.setSize(true);
            this.swapedItem = undefined;
        }
    };
    GridsterSwap.prototype.setSwapItem = function () {
        if (this.swapedItem) {
            this.swapedItem.checkItemChanges(this.swapedItem.$item, this.swapedItem.item);
            this.swapedItem = undefined;
        }
    };
    GridsterSwap.prototype.checkSwap = function (pushedBy) {
        var gridsterItemCollision = this.gridster.checkCollision(pushedBy);
        if (gridsterItemCollision && gridsterItemCollision !== true) {
            var gridsterItemCollide = gridsterItemCollision;
            gridsterItemCollide.$item.x = pushedBy.item.x;
            gridsterItemCollide.$item.y = pushedBy.item.y;
            pushedBy.$item.x = gridsterItemCollide.item.x;
            pushedBy.$item.y = gridsterItemCollide.item.y;
            if (this.gridster.checkCollision(gridsterItemCollide) || this.gridster.checkCollision(pushedBy)) {
                pushedBy.$item.x = gridsterItemCollide.$item.x;
                pushedBy.$item.y = gridsterItemCollide.$item.y;
                gridsterItemCollide.$item.x = gridsterItemCollide.item.x;
                gridsterItemCollide.$item.y = gridsterItemCollide.item.y;
            }
            else {
                gridsterItemCollide.setSize(true);
                this.swapedItem = gridsterItemCollide;
            }
        }
    };
    return GridsterSwap;
}());
GridsterSwap.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
GridsterSwap.ctorParameters = function () { return [
    { type: gridsterItem_component_1.GridsterItemComponent, },
    { type: gridster_component_1.GridsterComponent, },
]; };
exports.GridsterSwap = GridsterSwap;
//# sourceMappingURL=gridsterSwap.service.js.map