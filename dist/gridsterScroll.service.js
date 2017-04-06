"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scrollSensitivity;
var scrollSpeed;
var intervalDuration = 50;
var gridsterElement;
var scrollTop;
var scrollLeft;
var resizeEvent;
var resizeEventType;
var intervalE;
var intervalW;
var intervalN;
var intervalS;
function scroll(elemPosition, gridsterItem, e, lastMouse, calculateItemPosition, resize, resizeEventScrollType) {
    scrollSensitivity = gridsterItem.gridster.state.options.scrollSensitivity;
    scrollSpeed = gridsterItem.gridster.state.options.scrollSpeed;
    gridsterElement = gridsterItem.gridster.el;
    resizeEvent = resize;
    resizeEventType = resizeEventScrollType;
    scrollTop = gridsterElement.scrollTop;
    scrollLeft = gridsterElement.scrollLeft;
    var offsetWidth = gridsterElement.offsetWidth;
    var offsetHeight = gridsterElement.offsetHeight;
    var elemTopOffset = elemPosition[1] - scrollTop;
    var elemBottomOffset = offsetHeight + scrollTop - elemPosition[1] - elemPosition[3];
    if (lastMouse.pageY < e.pageY && elemBottomOffset < scrollSensitivity) {
        cancelN();
        if ((resizeEvent && !resizeEventType.s) || intervalS) {
            return;
        }
        intervalS = startVertical(1, elemPosition, calculateItemPosition, lastMouse);
    }
    else if (lastMouse.pageY > e.pageY && scrollTop > 0 && elemTopOffset < scrollSensitivity) {
        cancelS();
        if ((resizeEvent && !resizeEventType.n) || intervalN) {
            return;
        }
        intervalN = startVertical(-1, elemPosition, calculateItemPosition, lastMouse);
    }
    else if (lastMouse.pageY !== e.pageY) {
        cancelVertical();
    }
    var elemRightOffset = offsetWidth + scrollLeft - elemPosition[0] - elemPosition[2];
    var elemLeftOffset = elemPosition[0] - scrollLeft;
    if (lastMouse.pageX < e.pageX && elemRightOffset < scrollSensitivity) {
        cancelW();
        if ((resizeEvent && !resizeEventType.e) || intervalE) {
            return;
        }
        intervalE = startHorizontal(1, elemPosition, calculateItemPosition, lastMouse);
    }
    else if (lastMouse.pageX > e.pageX && scrollLeft > 0 && elemLeftOffset < scrollSensitivity) {
        cancelE();
        if ((resizeEvent && !resizeEventType.w) || intervalW) {
            return;
        }
        intervalW = startHorizontal(-1, elemPosition, calculateItemPosition, lastMouse);
    }
    else if (lastMouse.pageX !== e.pageX) {
        cancelHorizontal();
    }
}
exports.scroll = scroll;
function startVertical(sign, elemPosition, calculateItemPosition, lastMouse) {
    return setInterval(function () {
        if (!gridsterElement || sign === -1 && scrollTop - scrollSpeed < 0) {
            cancelVertical();
        }
        gridsterElement.scrollTop += sign * scrollSpeed;
        if (resizeEvent) {
            if (resizeEventType.n) {
                elemPosition[1] += sign * scrollSpeed;
                elemPosition[3] -= sign * scrollSpeed;
            }
            else {
                elemPosition[3] += sign * scrollSpeed;
            }
        }
        else {
            elemPosition[1] += sign * scrollSpeed;
        }
        calculateItemPosition(lastMouse);
    }.bind(this), intervalDuration);
}
function startHorizontal(sign, elemPosition, calculateItemPosition, lastMouse) {
    return setInterval(function () {
        if (!gridsterElement || sign === -1 && scrollLeft - scrollSpeed < 0) {
            cancelHorizontal();
        }
        gridsterElement.scrollLeft += sign * scrollSpeed;
        if (resizeEvent) {
            if (resizeEventType.w) {
                elemPosition[0] += sign * scrollSpeed;
                elemPosition[2] -= sign * scrollSpeed;
            }
            else {
                elemPosition[2] += sign * scrollSpeed;
            }
        }
        else {
            elemPosition[0] += sign * scrollSpeed;
        }
        calculateItemPosition(lastMouse);
    }.bind(this), intervalDuration);
}
function cancelScroll() {
    cancelHorizontal();
    cancelVertical();
    scrollSensitivity = undefined;
    scrollSpeed = undefined;
    gridsterElement = undefined;
    resizeEventType = undefined;
}
exports.cancelScroll = cancelScroll;
function cancelHorizontal() {
    cancelE();
    cancelW();
}
function cancelVertical() {
    cancelN();
    cancelS();
}
function cancelE() {
    if (intervalE) {
        clearInterval(intervalE);
        intervalE = undefined;
    }
}
function cancelW() {
    if (intervalW) {
        clearInterval(intervalW);
        intervalW = undefined;
    }
}
function cancelS() {
    if (intervalS) {
        clearInterval(intervalS);
        intervalS = undefined;
    }
}
function cancelN() {
    if (intervalN) {
        clearInterval(intervalN);
        intervalN = undefined;
    }
}
//# sourceMappingURL=gridsterScroll.service.js.map