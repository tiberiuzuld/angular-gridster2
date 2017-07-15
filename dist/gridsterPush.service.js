"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridsterItem_component_1 = require("./gridsterItem.component");
var gridster_component_1 = require("./gridster.component");
var GridsterPush = (function () {
    function GridsterPush(gridsterItem, gridster) {
        this.pushedItems = [];
        this.pushedItemsPath = [];
        this.gridsterItem = gridsterItem;
        this.gridster = gridster;
        this.tryPattern = {
            fromEast: [this.tryWest, this.trySouth, this.tryNorth, this.tryEast],
            fromWest: [this.tryEast, this.trySouth, this.tryNorth, this.tryWest],
            fromNorth: [this.trySouth, this.tryEast, this.tryWest, this.tryNorth],
            fromSouth: [this.tryNorth, this.tryEast, this.tryWest, this.trySouth]
        };
        this.fromSouth = 'fromSouth';
        this.fromNorth = 'fromNorth';
        this.fromEast = 'fromEast';
        this.fromWest = 'fromWest';
    }
    GridsterPush.prototype.pushItems = function (direction) {
        if (this.gridster.$options.pushItems) {
            this.push(this.gridsterItem, direction, this.gridsterItem);
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
        this.pushedItemsPath = undefined;
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
        this.pushedItemsPath = undefined;
    };
    GridsterPush.prototype.push = function (gridsterItem, direction, pushedBy) {
        var gridsterItemCollision = this.gridster.checkCollision(gridsterItem.$item, pushedBy.$item);
        if (gridsterItemCollision && gridsterItemCollision !== true &&
            gridsterItemCollision !== this.gridsterItem && gridsterItemCollision.canBeDragged()) {
            var gridsterItemCollide = gridsterItemCollision;
            if (this.tryPattern[direction][0].call(this, gridsterItemCollide, gridsterItem, direction, pushedBy)) {
                return true;
            }
            else if (this.tryPattern[direction][1].call(this, gridsterItemCollide, gridsterItem, direction, pushedBy)) {
                return true;
            }
            else if (this.tryPattern[direction][2].call(this, gridsterItemCollide, gridsterItem, direction, pushedBy)) {
                return true;
            }
            else if (this.tryPattern[direction][3].call(this, gridsterItemCollide, gridsterItem, direction, pushedBy)) {
                return true;
            }
        }
        else if (gridsterItemCollision === undefined) {
            return true;
        }
    };
    GridsterPush.prototype.trySouth = function (gridsterItemCollide, gridsterItem, direction, pushedBy) {
        var backUpY = gridsterItemCollide.$item.y;
        gridsterItemCollide.$item.y = gridsterItem.$item.y + gridsterItem.$item.rows;
        if (!gridster_component_1.GridsterComponent.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
            && this.push(gridsterItemCollide, this.fromNorth, gridsterItem)) {
            gridsterItemCollide.setSize(true);
            this.addToPushed(gridsterItemCollide);
            this.push(gridsterItem, direction, pushedBy);
            return true;
        }
        else {
            gridsterItemCollide.$item.y = backUpY;
        }
    };
    GridsterPush.prototype.tryNorth = function (gridsterItemCollide, gridsterItem, direction, pushedBy) {
        var backUpY = gridsterItemCollide.$item.y;
        gridsterItemCollide.$item.y = gridsterItem.$item.y - gridsterItemCollide.$item.rows;
        if (!gridster_component_1.GridsterComponent.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
            && this.push(gridsterItemCollide, this.fromSouth, gridsterItem)) {
            gridsterItemCollide.setSize(true);
            this.addToPushed(gridsterItemCollide);
            this.push(gridsterItem, direction, pushedBy);
            return true;
        }
        else {
            gridsterItemCollide.$item.y = backUpY;
        }
    };
    GridsterPush.prototype.tryEast = function (gridsterItemCollide, gridsterItem, direction, pushedBy) {
        var backUpX = gridsterItemCollide.$item.x;
        gridsterItemCollide.$item.x = gridsterItem.$item.x + gridsterItem.$item.cols;
        if (!gridster_component_1.GridsterComponent.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
            && this.push(gridsterItemCollide, this.fromWest, gridsterItem)) {
            gridsterItemCollide.setSize(true);
            this.addToPushed(gridsterItemCollide);
            this.push(gridsterItem, direction, pushedBy);
            return true;
        }
        else {
            gridsterItemCollide.$item.x = backUpX;
        }
    };
    GridsterPush.prototype.tryWest = function (gridsterItemCollide, gridsterItem, direction, pushedBy) {
        var backUpX = gridsterItemCollide.$item.x;
        gridsterItemCollide.$item.x = gridsterItem.$item.x - gridsterItemCollide.$item.cols;
        if (!gridster_component_1.GridsterComponent.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
            && this.push(gridsterItemCollide, this.fromEast, gridsterItem)) {
            gridsterItemCollide.setSize(true);
            this.addToPushed(gridsterItemCollide);
            this.push(gridsterItem, direction, pushedBy);
            return true;
        }
        else {
            gridsterItemCollide.$item.x = backUpX;
        }
    };
    GridsterPush.prototype.addToPushed = function (gridsterItem) {
        if (this.pushedItems.indexOf(gridsterItem) < 0) {
            this.pushedItems.push(gridsterItem);
            this.pushedItemsPath.push([{ x: gridsterItem.item.x, y: gridsterItem.item.y }, { x: gridsterItem.$item.x, y: gridsterItem.$item.y }]);
        }
        else {
            var i = this.pushedItems.indexOf(gridsterItem);
            this.pushedItemsPath[i].push({ x: gridsterItem.$item.x, y: gridsterItem.$item.y });
        }
    };
    GridsterPush.prototype.removeFromPushed = function (i) {
        if (i > -1) {
            this.pushedItems.splice(i, 1);
            this.pushedItemsPath.splice(i, 1);
        }
    };
    GridsterPush.prototype.checkPushBack = function () {
        var i = this.pushedItems.length - 1;
        for (; i > -1; i--) {
            this.checkPushedItem(this.pushedItems[i], i);
        }
    };
    GridsterPush.prototype.checkPushedItem = function (pushedItem, i) {
        var path = this.pushedItemsPath[i];
        var j = path.length - 2;
        var lastPosition;
        for (; j > -1; j--) {
            lastPosition = path[j];
            pushedItem.$item.x = lastPosition.x;
            pushedItem.$item.y = lastPosition.y;
            if (!this.gridster.findItemWithItem(pushedItem.$item)) {
                pushedItem.setSize(true);
                path.splice(j + 1, path.length - 1 - j);
            }
            else {
                lastPosition = path[path.length - 1];
                pushedItem.$item.x = lastPosition.x;
                pushedItem.$item.y = lastPosition.y;
            }
        }
        if (path.length < 2) {
            this.removeFromPushed(i);
        }
    };
    GridsterPush.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    GridsterPush.ctorParameters = function () { return [
        { type: gridsterItem_component_1.GridsterItemComponent, },
        { type: gridster_component_1.GridsterComponent, },
    ]; };
    return GridsterPush;
}());
exports.GridsterPush = GridsterPush;
//# sourceMappingURL=gridsterPush.service.js.map