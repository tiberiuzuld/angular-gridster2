"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var GridsterSwap = (function () {
    function GridsterSwap() {
    }
    GridsterSwap.GridsterSwap = function (gridsterItem, elemPosition) {
        var position = gridsterItem.gridster.pixelsToPosition(elemPosition[0], elemPosition[1], Math.round);
        var x = gridsterItem.state.item.x;
        var y = gridsterItem.state.item.y;
        gridsterItem.state.item.x = position[0];
        gridsterItem.state.item.y = position[1];
        var swapItem = gridsterItem.gridster.findItemWithItem(gridsterItem.state.item);
        gridsterItem.state.item.x = x;
        gridsterItem.state.item.y = y;
        if (!swapItem) {
            return;
        }
        x = swapItem.x;
        y = swapItem.y;
        swapItem.x = gridsterItem.state.item.x;
        swapItem.y = gridsterItem.state.item.y;
        gridsterItem.state.item.x = position[0];
        gridsterItem.state.item.y = position[1];
        if (gridsterItem.gridster.checkCollision(swapItem) || gridsterItem.gridster.checkCollision(gridsterItem.state.item)) {
            gridsterItem.state.item.x = swapItem.x;
            gridsterItem.state.item.y = swapItem.y;
            swapItem.x = x;
            swapItem.y = y;
        }
        else {
            swapItem.setSize(true);
            swapItem.checkItemChanges(swapItem, { x: x, y: y, cols: swapItem.cols, rows: swapItem.rows });
        }
    };
    return GridsterSwap;
}());
GridsterSwap.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
GridsterSwap.ctorParameters = function () { return []; };
exports.GridsterSwap = GridsterSwap;
//# sourceMappingURL=gridsterSwap.service.js.map