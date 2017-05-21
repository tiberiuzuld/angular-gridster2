"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scrollSensitivity;
var scrollSpeed;
var intervalDuration = 50;
var gridsterElement;
var resizeEvent;
var resizeEventType;
var intervalE;
var intervalW;
var intervalN;
var intervalS;
function scroll(gridsterItem, e, lastMouse, calculateItemPosition, resize, resizeEventScrollType) {
    scrollSensitivity = gridsterItem.gridster.$options.scrollSensitivity;
    scrollSpeed = gridsterItem.gridster.$options.scrollSpeed;
    gridsterElement = gridsterItem.gridster.el;
    resizeEvent = resize;
    resizeEventType = resizeEventScrollType;
    var offsetWidth = gridsterElement.offsetWidth;
    var offsetHeight = gridsterElement.offsetHeight;
    var offsetLeft = gridsterElement.scrollLeft;
    var offsetTop = gridsterElement.scrollTop;
    var elemTopOffset = gridsterItem.el.offsetTop - offsetTop;
    var elemBottomOffset = offsetHeight + offsetTop - gridsterItem.el.offsetTop - gridsterItem.el.offsetHeight;
    if (lastMouse.pageY < e.pageY && elemBottomOffset < scrollSensitivity) {
        cancelN();
        if ((resizeEvent && !resizeEventType.s) || intervalS) {
            return;
        }
        intervalS = startVertical(1, calculateItemPosition, lastMouse);
    }
    else if (lastMouse.pageY > e.pageY && offsetTop > 0 && elemTopOffset < scrollSensitivity) {
        cancelS();
        if ((resizeEvent && !resizeEventType.n) || intervalN) {
            return;
        }
        intervalN = startVertical(-1, calculateItemPosition, lastMouse);
    }
    else if (lastMouse.pageY !== e.pageY) {
        cancelVertical();
    }
    var elemRightOffset = offsetLeft + offsetWidth - gridsterItem.el.offsetLeft - gridsterItem.el.offsetWidth;
    var elemLeftOffset = gridsterItem.el.offsetLeft - offsetLeft;
    if (lastMouse.pageX < e.pageX && elemRightOffset <= scrollSensitivity) {
        cancelW();
        if ((resizeEvent && !resizeEventType.e) || intervalE) {
            return;
        }
        intervalE = startHorizontal(1, calculateItemPosition, lastMouse);
    }
    else if (lastMouse.pageX > e.pageX && offsetLeft > 0 && elemLeftOffset < scrollSensitivity) {
        cancelE();
        if ((resizeEvent && !resizeEventType.w) || intervalW) {
            return;
        }
        intervalW = startHorizontal(-1, calculateItemPosition, lastMouse);
    }
    else if (lastMouse.pageX !== e.pageX) {
        cancelHorizontal();
    }
}
exports.scroll = scroll;
function startVertical(sign, calculateItemPosition, lastMouse) {
    var pageY = lastMouse.pageY;
    return setInterval(function () {
        if (!gridsterElement || sign === -1 && gridsterElement.scrollTop - scrollSpeed < 0) {
            cancelVertical();
        }
        gridsterElement.scrollTop += sign * scrollSpeed;
        pageY += sign * scrollSpeed;
        calculateItemPosition({ pageX: lastMouse.pageX, pageY: pageY });
    }.bind(this), intervalDuration);
}
function startHorizontal(sign, calculateItemPosition, lastMouse) {
    var pageX = lastMouse.pageX;
    return setInterval(function () {
        if (!gridsterElement || sign === -1 && gridsterElement.scrollLeft - scrollSpeed < 0) {
            cancelHorizontal();
        }
        gridsterElement.scrollLeft += sign * scrollSpeed;
        pageX += sign * scrollSpeed;
        calculateItemPosition({ pageX: pageX, pageY: lastMouse.pageY });
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