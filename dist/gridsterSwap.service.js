"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var GridsterSwap = (function () {
    function GridsterSwap() {
    }
    GridsterSwap.GridsterSwap = function (gridsterItem, elemPosition) {
        var position = gridsterItem.gridster.pixelsToPosition(elemPosition[0], elemPosition[1]);
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
GridsterSwap = __decorate([
    core_1.Injectable()
], GridsterSwap);
exports.GridsterSwap = GridsterSwap;
//# sourceMappingURL=gridsterSwap.service.js.map