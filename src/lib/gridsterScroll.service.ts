import {GridsterResizeEventType} from './gridsterResizeEventType.interface';
import {GridsterItemComponentInterface} from './gridsterItemComponent.interface';

let scrollSensitivity: number;
let scrollSpeed: number;
const intervalDuration = 50;
let gridsterElement: any;
let resizeEvent: boolean | undefined;
let resizeEventType: GridsterResizeEventType | undefined;
let intervalE: number;
let intervalW: number;
let intervalN: number;
let intervalS: number;

export function scroll(gridsterItem: GridsterItemComponentInterface, e: MouseEvent, lastMouse: any, calculateItemPosition: Function,
                       resize?: boolean, resizeEventScrollType?: GridsterResizeEventType) {
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
  if (lastMouse.clientY < e.clientY && elemBottomOffset < scrollSensitivity) {
    cancelN();
    if ((resizeEvent && resizeEventType && !resizeEventType.s) || intervalS) {
      return;
    }
    intervalS = startVertical(1, calculateItemPosition, lastMouse);
  } else if (lastMouse.clientY > e.clientY && offsetTop > 0 && elemTopOffset < scrollSensitivity) {
    cancelS();
    if ((resizeEvent && resizeEventType && !resizeEventType.n) || intervalN) {
      return;
    }
    intervalN = startVertical(-1, calculateItemPosition, lastMouse);
  } else if (lastMouse.clientY !== e.clientY) {
    cancelVertical();
  }

  const elemRightOffset = offsetLeft + offsetWidth - gridsterItem.el.offsetLeft - gridsterItem.el.offsetWidth;
  const elemLeftOffset = gridsterItem.el.offsetLeft - offsetLeft;
  if (lastMouse.clientX < e.clientX && elemRightOffset <= scrollSensitivity) {
    cancelW();
    if ((resizeEvent && resizeEventType && !resizeEventType.e) || intervalE) {
      return;
    }
    intervalE = startHorizontal(1, calculateItemPosition, lastMouse);
  } else if (lastMouse.clientX > e.clientX && offsetLeft > 0 && elemLeftOffset < scrollSensitivity) {
    cancelE();
    if ((resizeEvent && resizeEventType && !resizeEventType.w) || intervalW) {
      return;
    }
    intervalW = startHorizontal(-1, calculateItemPosition, lastMouse);
  } else if (lastMouse.clientX !== e.clientX) {
    cancelHorizontal();
  }
}

function startVertical(sign: number, calculateItemPosition: Function, lastMouse: any): any {
  let clientY = lastMouse.clientY;
  return setInterval(() => {
    if (!gridsterElement || sign === -1 && gridsterElement.scrollTop - scrollSpeed < 0) {
      cancelVertical();
    }
    gridsterElement.scrollTop += sign * scrollSpeed;
    clientY += sign * scrollSpeed;
    calculateItemPosition({clientX: lastMouse.clientX, clientY: clientY});
  }, intervalDuration);
}

function startHorizontal(sign: number, calculateItemPosition: Function, lastMouse: any): any {
  let clientX = lastMouse.clientX;
  return setInterval(() => {
    if (!gridsterElement || sign === -1 && gridsterElement.scrollLeft - scrollSpeed < 0) {
      cancelHorizontal();
    }
    gridsterElement.scrollLeft += sign * scrollSpeed;
    clientX += sign * scrollSpeed;
    calculateItemPosition({clientX: clientX, clientY: lastMouse.clientY});
  }, intervalDuration);
}

export function cancelScroll() {
  cancelHorizontal();
  cancelVertical();
  gridsterElement = undefined;
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
    intervalE = 0;
  }
}

function cancelW() {
  if (intervalW) {
    clearInterval(intervalW);
    intervalW = 0;
  }
}

function cancelS() {
  if (intervalS) {
    clearInterval(intervalS);
    intervalS = 0;
  }
}

function cancelN() {
  if (intervalN) {
    clearInterval(intervalN);
    intervalN = 0;
  }
}
