import {GridsterItemComponent} from './gridsterItem.component';
import {GridsterResizeEventType} from './gridsterResizeEventType.interface';

let scrollSensitivity: number;
let scrollSpeed: number;
const intervalDuration = 50;
let gridsterElement: any;
let resizeEvent: boolean;
let resizeEventType: GridsterResizeEventType;
let intervalE: number;
let intervalW: number;
let intervalN: number;
let intervalS: number;
export function scroll(gridsterItem: GridsterItemComponent, e: MouseEvent, lastMouse, calculateItemPosition: Function, resize?: boolean,
                       resizeEventScrollType?: GridsterResizeEventType) {
  scrollSensitivity = gridsterItem.gridster.$options.scrollSensitivity;
  scrollSpeed = gridsterItem.gridster.$options.scrollSpeed;
  gridsterElement = gridsterItem.gridster.el;
  resizeEvent = resize;
  resizeEventType = resizeEventScrollType;

  const offsetWidth = gridsterElement.offsetWidth;
  const offsetHeight = gridsterElement.offsetHeight;
  const offsetLeft = gridsterElement.scrollLeft;
  const offsetTop = gridsterElement.scrollTop;
  const elemTopOffset = gridsterItem.el.offsetTop - offsetTop;
  const elemBottomOffset = offsetHeight + offsetTop - gridsterItem.el.offsetTop - gridsterItem.el.offsetHeight;
  if (lastMouse.pageY < e.pageY && elemBottomOffset < scrollSensitivity) {
    cancelN();
    if ((resizeEvent && !resizeEventType.s) || intervalS) {
      return;
    }
    intervalS = startVertical(1, calculateItemPosition, lastMouse);
  } else if (lastMouse.pageY > e.pageY && offsetTop > 0 && elemTopOffset < scrollSensitivity) {
    cancelS();
    if ((resizeEvent && !resizeEventType.n) || intervalN) {
      return;
    }
    intervalN = startVertical(-1, calculateItemPosition, lastMouse);
  } else if (lastMouse.pageY !== e.pageY) {
    cancelVertical();
  }

  const elemRightOffset = offsetLeft + offsetWidth - gridsterItem.el.offsetLeft - gridsterItem.el.offsetWidth;
  const elemLeftOffset = gridsterItem.el.offsetLeft - offsetLeft;
  if (lastMouse.pageX < e.pageX && elemRightOffset <= scrollSensitivity) {
    cancelW();
    if ((resizeEvent && !resizeEventType.e) || intervalE) {
      return;
    }
    intervalE = startHorizontal(1, calculateItemPosition, lastMouse);
  } else if (lastMouse.pageX > e.pageX && offsetLeft > 0 && elemLeftOffset < scrollSensitivity) {
    cancelE();
    if ((resizeEvent && !resizeEventType.w) || intervalW) {
      return;
    }
    intervalW = startHorizontal(-1, calculateItemPosition, lastMouse);
  } else if (lastMouse.pageX !== e.pageX) {
    cancelHorizontal();
  }
}

function startVertical(sign: number, calculateItemPosition: Function, lastMouse): any {
  let pageY = lastMouse.pageY;
  return setInterval(function () {
    if (!gridsterElement || sign === -1 && gridsterElement.scrollTop - scrollSpeed < 0) {
      cancelVertical();
    }
    gridsterElement.scrollTop += sign * scrollSpeed;
    pageY += sign * scrollSpeed;
    calculateItemPosition({pageX: lastMouse.pageX, pageY: pageY});
  }.bind(this), intervalDuration);
}

function startHorizontal(sign: number, calculateItemPosition: Function, lastMouse): any {
  let pageX = lastMouse.pageX;
  return setInterval(function () {
    if (!gridsterElement || sign === -1 && gridsterElement.scrollLeft - scrollSpeed < 0) {
      cancelHorizontal();
    }
    gridsterElement.scrollLeft += sign * scrollSpeed;
    pageX += sign * scrollSpeed;
    calculateItemPosition({pageX: pageX, pageY: lastMouse.pageY});
  }.bind(this), intervalDuration);
}

export function cancelScroll() {
  cancelHorizontal();
  cancelVertical();
  scrollSensitivity = undefined;
  scrollSpeed = undefined;
  gridsterElement = undefined;
  resizeEventType = undefined;
}

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
