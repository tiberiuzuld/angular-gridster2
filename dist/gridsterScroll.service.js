"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var GridsterScroll = (function () {
    function GridsterScroll() {
        this.intervalDuration = 50;
    }
    GridsterScroll.prototype.scroll = function (elemPosition, gridsterItem, e, lastMouse, calculateItemPosition, resize, resizeEventScrollType) {
        this.scrollSensitivity = gridsterItem.gridster.state.options.scrollSensitivity;
        this.scrollSpeed = gridsterItem.gridster.state.options.scrollSpeed;
        this.gridsterElement = gridsterItem.gridster.state.element;
        this.resizeEvent = resize;
        this.resizeEventType = resizeEventScrollType;
        var elemTopOffset = elemPosition[1] - this.gridsterElement.scrollTop;
        var elemBottomOffset = this.gridsterElement.offsetHeight + this.gridsterElement.scrollTop - elemPosition[1] - elemPosition[3];
        if (lastMouse.pageY < e.pageY && elemBottomOffset < this.scrollSensitivity) {
            this.cancelN();
            if ((this.resizeEvent && !this.resizeEventType.s) || this.intervalS) {
                return;
            }
            this.intervalS = this.startVertical(1, elemPosition, calculateItemPosition, lastMouse);
        }
        else if (lastMouse.pageY > e.pageY && this.gridsterElement.scrollTop > 0 && elemTopOffset < this.scrollSensitivity) {
            this.cancelS();
            if ((this.resizeEvent && !this.resizeEventType.n) || this.intervalN) {
                return;
            }
            this.intervalN = this.startVertical(-1, elemPosition, calculateItemPosition, lastMouse);
        }
        else if (lastMouse.pageY !== e.pageY) {
            this.cancelVertical();
        }
        var elemRightOffset = this.gridsterElement.offsetWidth + this.gridsterElement.scrollLeft - elemPosition[0] - elemPosition[2];
        var elemLeftOffset = elemPosition[0] - this.gridsterElement.scrollLeft;
        if (lastMouse.pageX < e.pageX && elemRightOffset < this.scrollSensitivity) {
            this.cancelW();
            if ((this.resizeEvent && !this.resizeEventType.e) || this.intervalE) {
                return;
            }
            this.intervalE = this.startHorizontal(1, elemPosition, calculateItemPosition, lastMouse);
        }
        else if (lastMouse.pageX > e.pageX && this.gridsterElement.scrollLeft > 0 && elemLeftOffset < this.scrollSensitivity) {
            this.cancelE();
            if ((this.resizeEvent && !this.resizeEventType.w) || this.intervalW) {
                return;
            }
            this.intervalW = this.startHorizontal(-1, elemPosition, calculateItemPosition, lastMouse);
        }
        else if (lastMouse.pageX !== e.pageX) {
            this.cancelHorizontal();
        }
    };
    GridsterScroll.prototype.startVertical = function (sign, elemPosition, calculateItemPosition, lastMouse) {
        return setInterval(function () {
            if (!this.gridsterElement || sign === -1 && this.gridsterElement.scrollTop - this.scrollSpeed < 0) {
                this.cancelVertical();
            }
            this.gridsterElement.scrollTop += sign * this.scrollSpeed;
            if (this.resizeEvent) {
                if (this.resizeEventType.n) {
                    elemPosition[1] += sign * this.scrollSpeed;
                    elemPosition[3] -= sign * this.scrollSpeed;
                }
                else {
                    elemPosition[3] += sign * this.scrollSpeed;
                }
            }
            else {
                elemPosition[1] += sign * this.scrollSpeed;
            }
            calculateItemPosition(lastMouse);
        }.bind(this), this.intervalDuration);
    };
    GridsterScroll.prototype.startHorizontal = function (sign, elemPosition, calculateItemPosition, lastMouse) {
        return setInterval(function () {
            if (!this.gridsterElement || sign === -1 && this.gridsterElement.scrollLeft - this.scrollSpeed < 0) {
                this.cancelHorizontal();
            }
            this.gridsterElement.scrollLeft += sign * this.scrollSpeed;
            if (this.resizeEvent) {
                if (this.resizeEventType.w) {
                    elemPosition[0] += sign * this.scrollSpeed;
                    elemPosition[2] -= sign * this.scrollSpeed;
                }
                else {
                    elemPosition[2] += sign * this.scrollSpeed;
                }
            }
            else {
                elemPosition[0] += sign * this.scrollSpeed;
            }
            calculateItemPosition(lastMouse);
        }.bind(this), this.intervalDuration);
    };
    GridsterScroll.prototype.cancelScroll = function () {
        this.cancelHorizontal();
        this.cancelVertical();
        this.scrollSensitivity = undefined;
        this.scrollSpeed = undefined;
        this.gridsterElement = undefined;
        this.resizeEventType = undefined;
    };
    GridsterScroll.prototype.cancelHorizontal = function () {
        this.cancelE();
        this.cancelW();
    };
    GridsterScroll.prototype.cancelVertical = function () {
        this.cancelN();
        this.cancelS();
    };
    GridsterScroll.prototype.cancelE = function () {
        if (this.intervalE) {
            clearInterval(this.intervalE);
            this.intervalE = undefined;
        }
    };
    GridsterScroll.prototype.cancelW = function () {
        if (this.intervalW) {
            clearInterval(this.intervalW);
            this.intervalW = undefined;
        }
    };
    GridsterScroll.prototype.cancelS = function () {
        if (this.intervalS) {
            clearInterval(this.intervalS);
            this.intervalS = undefined;
        }
    };
    GridsterScroll.prototype.cancelN = function () {
        if (this.intervalN) {
            clearInterval(this.intervalN);
            this.intervalN = undefined;
        }
    };
    return GridsterScroll;
}());
GridsterScroll = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], GridsterScroll);
exports.GridsterScroll = GridsterScroll;
//# sourceMappingURL=gridsterScroll.service.js.map