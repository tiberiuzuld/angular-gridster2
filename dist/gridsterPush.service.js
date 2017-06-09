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
            fromEast: [this.tryWest, this.trySouth, this.tryNorth],
            fromWest: [this.tryEast, this.trySouth, this.tryNorth],
            fromNorth: [this.trySouth, this.tryEast, this.tryWest],
            fromSouth: [this.tryNorth, this.tryEast, this.tryWest],
        };
        this.fromSouth = 'fromSouth';
        this.fromNorth = 'fromNorth';
        this.fromEast = 'fromEast';
        this.fromWest = 'fromWest';
    }
    GridsterPush.prototype.pushItems = function (direction) {
        if (this.gridster.$options.pushItems) {
            this.push(this.gridsterItem, direction, this.gridsterItem);
            this.checkPushBack();
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
        var gridsterItemCollision = this.gridster.checkCollision(gridsterItem, pushedBy);
        if (gridsterItemCollision && gridsterItemCollision !== true &&
            gridsterItemCollision !== this.gridsterItem) {
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
        }
        else if (gridsterItemCollision === undefined) {
            return true;
        }
    };
    GridsterPush.prototype.trySouth = function (gridsterItemCollide, gridsterItem, direction, pushedBy) {
        gridsterItemCollide.$item.y += 1;
        if (this.push(gridsterItemCollide, this.fromNorth, gridsterItem)) {
            gridsterItemCollide.setSize(true);
            this.push(gridsterItem, direction, pushedBy);
            this.addToPushed(gridsterItemCollide);
            return true;
        }
        else {
            gridsterItemCollide.$item.y -= 1;
        }
    };
    GridsterPush.prototype.tryNorth = function (gridsterItemCollide, gridsterItem, direction, pushedBy) {
        gridsterItemCollide.$item.y -= 1;
        if (this.push(gridsterItemCollide, this.fromSouth, gridsterItem)) {
            gridsterItemCollide.setSize(true);
            this.push(gridsterItem, direction, pushedBy);
            this.addToPushed(gridsterItemCollide);
            return true;
        }
        else {
            gridsterItemCollide.$item.y += 1;
        }
    };
    GridsterPush.prototype.tryEast = function (gridsterItemCollide, gridsterItem, direction, pushedBy) {
        gridsterItemCollide.$item.x += 1;
        if (this.push(gridsterItemCollide, this.fromWest, gridsterItem)) {
            gridsterItemCollide.setSize(true);
            this.push(gridsterItem, direction, pushedBy);
            this.addToPushed(gridsterItemCollide);
            return true;
        }
        else {
            gridsterItemCollide.$item.x -= 1;
        }
    };
    GridsterPush.prototype.tryWest = function (gridsterItemCollide, gridsterItem, direction, pushedBy) {
        gridsterItemCollide.$item.x -= 1;
        if (this.push(gridsterItemCollide, this.fromEast, gridsterItem)) {
            gridsterItemCollide.setSize(true);
            this.push(gridsterItem, direction, pushedBy);
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
        var lastPosition = path[path.length - 2];
        pushedItem.$item.x = lastPosition.x;
        pushedItem.$item.y = lastPosition.y;
        if (this.gridster.findItemWithItem(pushedItem)) {
            lastPosition = path[path.length - 1];
            pushedItem.$item.x = lastPosition.x;
            pushedItem.$item.y = lastPosition.y;
        }
        else {
            pushedItem.setSize(true);
            path.pop();
            if (path.length < 2) {
                this.removeFromPushed(i);
            }
            else {
                this.checkPushedItem(pushedItem, i);
            }
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