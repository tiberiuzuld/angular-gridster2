"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridsterItem_component_1 = require("./gridsterItem.component");
var gridster_component_1 = require("./gridster.component");
var GridsterPush = (function () {
    function GridsterPush(gridsterItem, gridster) {
        this.pushedItems = [];
        this.gridsterItem = gridsterItem;
        this.gridster = gridster;
    }
    GridsterPush.prototype.pushItems = function () {
        if (this.gridster.$options.pushItems) {
            this.checkPushBack();
            this.push(this.gridsterItem, this.gridsterItem);
        }
    };
    GridsterPush.prototype.restoreItems = function () {
        var i = 0;
        var l = this.pushedItems.length;
        var pushedItem;
        for (; i < l; i++) {
            pushedItem = this.pushedItems[i];
            pushedItem.$item.x = pushedItem.item.x;
            pushedItem.$item.y = pushedItem.item.y;
            pushedItem.setSize(true);
        }
        this.pushedItems = undefined;
    };
    GridsterPush.prototype.setPushedItems = function () {
        var i = 0;
        var l = this.pushedItems.length;
        var pushedItem;
        for (; i < l; i++) {
            pushedItem = this.pushedItems[i];
            pushedItem.checkItemChanges(pushedItem.$item, pushedItem.item);
        }
        this.pushedItems = undefined;
    };
    GridsterPush.prototype.push = function (gridsterItem, pushedBy) {
        var gridsterItemCollision = this.gridster.checkCollision(gridsterItem, pushedBy);
        if (gridsterItemCollision && gridsterItemCollision !== true) {
            var gridsterItemCollide = gridsterItemCollision;
            if (gridsterItem.item.y < gridsterItem.$item.y ||
                (gridsterItem.item.y === gridsterItem.$item.y && gridsterItem.item.rows < gridsterItem.$item.rows)) {
                if (this.trySouth(gridsterItemCollide, gridsterItem, pushedBy)) {
                    return true;
                }
                else if (this.tryEast(gridsterItemCollide, gridsterItem, pushedBy)) {
                    return true;
                }
            }
            else if (gridsterItem.item.y > gridsterItem.$item.y) {
                if (this.tryNorth(gridsterItemCollide, gridsterItem, pushedBy)) {
                    return true;
                }
                else if (this.tryEast(gridsterItemCollide, gridsterItem, pushedBy)) {
                    return true;
                }
            }
            if (gridsterItem.item.x < gridsterItem.$item.x ||
                (gridsterItem.item.x === gridsterItem.$item.x && gridsterItem.item.cols < gridsterItem.$item.cols)) {
                if (this.tryEast(gridsterItemCollide, gridsterItem, pushedBy)) {
                    return true;
                }
                else if (this.trySouth(gridsterItemCollide, gridsterItem, pushedBy)) {
                    return true;
                }
            }
            else if (gridsterItem.item.x > gridsterItem.$item.x) {
                if (this.tryWest(gridsterItemCollide, gridsterItem, pushedBy)) {
                    return true;
                }
                else if (this.trySouth(gridsterItemCollide, gridsterItem, pushedBy)) {
                    return true;
                }
            }
        }
        else if (gridsterItemCollision === undefined) {
            return true;
        }
    };
    GridsterPush.prototype.trySouth = function (gridsterItemCollide, gridsterItem, pushedBy) {
        gridsterItemCollide.$item.y += 1;
        if (this.push(gridsterItemCollide, gridsterItem)) {
            gridsterItemCollide.setSize(true);
            this.push(gridsterItem, pushedBy);
            this.addToPushed(gridsterItemCollide);
            return true;
        }
        else {
            gridsterItemCollide.$item.y -= 1;
        }
    };
    GridsterPush.prototype.tryNorth = function (gridsterItemCollide, gridsterItem, pushedBy) {
        gridsterItemCollide.$item.y -= 1;
        if (this.push(gridsterItemCollide, gridsterItem)) {
            gridsterItemCollide.setSize(true);
            this.push(gridsterItem, pushedBy);
            this.addToPushed(gridsterItemCollide);
            return true;
        }
        else {
            gridsterItemCollide.$item.y += 1;
        }
    };
    GridsterPush.prototype.tryEast = function (gridsterItemCollide, gridsterItem, pushedBy) {
        gridsterItemCollide.$item.x += 1;
        if (this.push(gridsterItemCollide, gridsterItem)) {
            gridsterItemCollide.setSize(true);
            this.push(gridsterItem, pushedBy);
            this.addToPushed(gridsterItemCollide);
            return true;
        }
        else {
            gridsterItemCollide.$item.x -= 1;
        }
    };
    GridsterPush.prototype.tryWest = function (gridsterItemCollide, gridsterItem, pushedBy) {
        gridsterItemCollide.$item.x -= 1;
        if (this.push(gridsterItemCollide, gridsterItem)) {
            gridsterItemCollide.setSize(true);
            this.push(gridsterItem, pushedBy);
            this.addToPushed(gridsterItemCollide);
            return true;
        }
        else {
            gridsterItemCollide.$item.x += 1;
        }
    };
    GridsterPush.prototype.addToPushed = function (gridsterItem) {
        if (this.pushedItems.indexOf(gridsterItem) < 0) {
            this.pushedItems.push(gridsterItem);
        }
    };
    GridsterPush.prototype.removeFromPushed = function (gridsterItem) {
        var i = this.pushedItems.indexOf(gridsterItem);
        if (i > -1) {
            this.pushedItems.splice(i, 1);
        }
    };
    GridsterPush.prototype.checkPushBack = function () {
        var i = this.pushedItems.length - 1;
        for (; i > -1; i--) {
            this.checkPushedItem(this.pushedItems[i]);
        }
    };
    GridsterPush.prototype.checkPushedItem = function (pushedItem) {
        if (pushedItem.$item.y > pushedItem.item.y) {
            pushedItem.$item.y -= 1;
            if (this.gridster.findItemWithItem(pushedItem)) {
                pushedItem.$item.y += 1;
            }
            else {
                pushedItem.setSize(true);
                this.checkPushedItem(pushedItem);
            }
        }
        else if (pushedItem.$item.y < pushedItem.item.y) {
            pushedItem.$item.y += 1;
            if (this.gridster.findItemWithItem(pushedItem)) {
                pushedItem.$item.y -= 1;
            }
            else {
                pushedItem.setSize(true);
                this.checkPushedItem(pushedItem);
            }
        }
        if (pushedItem.$item.x > pushedItem.item.x) {
            pushedItem.$item.x -= 1;
            if (this.gridster.findItemWithItem(pushedItem)) {
                pushedItem.$item.x += 1;
            }
            else {
                pushedItem.setSize(true);
                this.checkPushedItem(pushedItem);
            }
        }
        else if (pushedItem.$item.x < pushedItem.item.x) {
            pushedItem.$item.x += 1;
            if (this.gridster.findItemWithItem(pushedItem)) {
                pushedItem.$item.x -= 1;
            }
            else {
                pushedItem.setSize(true);
                this.checkPushedItem(pushedItem);
            }
        }
        if (pushedItem.$item.x === pushedItem.item.x && pushedItem.$item.y === pushedItem.item.y) {
            this.removeFromPushed(pushedItem);
        }
    };
    return GridsterPush;
}());
GridsterPush.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
GridsterPush.ctorParameters = function () { return [
    { type: gridsterItem_component_1.GridsterItemComponent, },
    { type: gridster_component_1.GridsterComponent, },
]; };
exports.GridsterPush = GridsterPush;
//# sourceMappingURL=gridsterPush.service.js.map