"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var GridsterSwap = (function () {
    function GridsterSwap() {
    }
    GridsterSwap.GridsterSwap = function (gridsterItem, elemPosition) {
        var position = gridsterItem.gridster.pixelsToPosition(elemPosition[0], elemPosition[1], Math.round);
        var x = gridsterItem.$item.x;
        var y = gridsterItem.$item.y;
        gridsterItem.$item.x = position[0];
        gridsterItem.$item.y = position[1];
        var swapItem = gridsterItem.gridster.findItemWithItem(gridsterItem);
        gridsterItem.$item.x = x;
        gridsterItem.$item.y = y;
        if (!swapItem) {
            return;
        }
        x = swapItem.$item.x;
        y = swapItem.$item.y;
        swapItem.$item.x = gridsterItem.$item.x;
        swapItem.$item.y = gridsterItem.$item.y;
        gridsterItem.$item.x = position[0];
        gridsterItem.$item.y = position[1];
        if (gridsterItem.gridster.checkCollision(swapItem) || gridsterItem.gridster.checkCollision(gridsterItem)) {
            gridsterItem.$item.x = swapItem.$item.x;
            gridsterItem.$item.y = swapItem.$item.y;
            swapItem.$item.x = x;
            swapItem.$item.y = y;
        }
        else {
            swapItem.setSize(true);
            swapItem.checkItemChanges(swapItem, { x: x, y: y, cols: swapItem.$item.cols, rows: swapItem.$item.rows });
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