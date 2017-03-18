import {GridsterItemComponent} from './gridsterItem.component';
import {GridsterResizeEventType} from './gridsterResizeEventType.interface';

let scrollSensitivity: number;
let scrollSpeed: number;
let intervalDuration: number = 50;
let gridsterElement: HTMLElement;
let resizeEvent: boolean;
let resizeEventType: GridsterResizeEventType;
let intervalE: number;
let intervalW: number;
let intervalN: number;
let intervalS: number;

export function scroll(elemPosition: Array<number>, gridsterItem: GridsterItemComponent, e: MouseEvent, lastMouse,
                       calculateItemPosition: Function, resize?: boolean, resizeEventScrollType?: GridsterResizeEventType) {
  scrollSensitivity = gridsterItem.gridster.state.options.scrollSensitivity;
  scrollSpeed = gridsterItem.gridster.state.options.scrollSpeed;
  gridsterElement = gridsterItem.gridster.state.element;
  resizeEvent = resize;
  resizeEventType = resizeEventScrollType;

  const elemTopOffset = elemPosition[1] - gridsterElement.scrollTop;
  const elemBottomOffset = gridsterElement.offsetHeight + gridsterElement.scrollTop - elemPosition[1] - elemPosition[3];
  if (lastMouse.pageY < e.pageY && elemBottomOffset < scrollSensitivity) {
    cancelN();
    if ((resizeEvent && !resizeEventType.s) || intervalS) {
      return;
    }
    intervalS = startVertical(1, elemPosition, calculateItemPosition, lastMouse);
  } else if (lastMouse.pageY > e.pageY && gridsterElement.scrollTop > 0 && elemTopOffset < scrollSensitivity) {
    cancelS();
    if ((resizeEvent && !resizeEventType.n) || intervalN) {
      return;
    }
    intervalN = startVertical(-1, elemPosition, calculateItemPosition, lastMouse);
  } else if (lastMouse.pageY !== e.pageY) {
    cancelVertical();
  }

  const elemRightOffset = gridsterElement.offsetWidth + gridsterElement.scrollLeft - elemPosition[0] - elemPosition[2];
  const elemLeftOffset = elemPosition[0] - gridsterElement.scrollLeft;
  if (lastMouse.pageX < e.pageX && elemRightOffset < scrollSensitivity) {
    cancelW();
    if ((resizeEvent && !resizeEventType.e) || intervalE) {
      return;
    }
    intervalE = startHorizontal(1, elemPosition, calculateItemPosition, lastMouse);
  } else if (lastMouse.pageX > e.pageX && gridsterElement.scrollLeft > 0 && elemLeftOffset < scrollSensitivity) {
    cancelE();
    if ((resizeEvent && !resizeEventType.w) || intervalW) {
      return;
    }
    intervalW = startHorizontal(-1, elemPosition, calculateItemPosition, lastMouse);
  } else if (lastMouse.pageX !== e.pageX) {
    cancelHorizontal();
  }
}

function startVertical(sign: number, elemPosition: Array < number >, calculateItemPosition: Function, lastMouse): number {
  return setInterval(function () {
    if (!gridsterElement || sign === -1 && gridsterElement.scrollTop - scrollSpeed < 0) {
      cancelVertical();
    }
    gridsterElement.scrollTop += sign * scrollSpeed;
    if (resizeEvent) {
      if (resizeEventType.n) {
        elemPosition[1] += sign * scrollSpeed;
        elemPosition[3] -= sign * scrollSpeed;
      } else {
        elemPosition[3] += sign * scrollSpeed;
      }
    } else {
      elemPosition[1] += sign * scrollSpeed;
    }

    calculateItemPosition(lastMouse);
  }.bind(this), intervalDuration);
}

function startHorizontal(sign: number, elemPosition: Array < number >, calculateItemPosition: Function, lastMouse): number {
  return setInterval(function () {
    if (!gridsterElement || sign === -1 && gridsterElement.scrollLeft - scrollSpeed < 0) {
      cancelHorizontal();
    }
    gridsterElement.scrollLeft += sign * scrollSpeed;
    if (resizeEvent) {
      if (resizeEventType.w) {
        elemPosition[0] += sign * scrollSpeed;
        elemPosition[2] -= sign * scrollSpeed;
      } else {
        elemPosition[2] += sign * scrollSpeed;
      }
    } else {
      elemPosition[0] += sign * scrollSpeed;
    }
    calculateItemPosition(lastMouse);
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
