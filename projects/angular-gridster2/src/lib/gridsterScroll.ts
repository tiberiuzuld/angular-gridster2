import { Gridster } from './gridster';
import { DirTypes } from './gridsterConfig';
import { GridsterResizeEventType } from './gridsterResizeEventType';

let scrollSensitivity: number;
let scrollSpeed: number;
const intervalDuration = 40;
let gridsterElement: HTMLElement | null;
let resizeEvent: boolean | undefined;
let resizeEventType: GridsterResizeEventType | undefined;
let scrollE = false;
let scrollW = false;
let scrollN = false;
let scrollS = false;
let animationH: number | null;
let animationV: number | null = null;
let lastMouseX = 0;
let lastMouseY = 0;
let maxScrollX = Infinity;
let maxScrollY = Infinity;

/**
 * "requestAnimation" frame is widely supported, but some server engines,
 * such as deno currently do not support it so we do a fallback to setTimeout
 */
let requestAnimation: (callback: (timestamp: number) => void) => number;
let cancelAnimation: (id: number) => void;

if (window.requestAnimationFrame && window.cancelAnimationFrame) {
  requestAnimation = window.requestAnimationFrame;
  cancelAnimation = window.cancelAnimationFrame;
} else {
  requestAnimation = callback => setTimeout(() => callback(Date.now()), 50);
  cancelAnimation = id => clearTimeout(id);
}

type Position = Pick<MouseEvent, 'clientX' | 'clientY'>;

type CalculatePosition = (position: Position) => void;

export function scroll(
  gridster: Gridster,
  left: number,
  top: number,
  width: number,
  height: number,
  event: MouseEvent,
  lastMouse: Position,
  calculateItemPosition: CalculatePosition,
  resize?: boolean,
  resizeEventScrollType?: GridsterResizeEventType
): void {
  const $options = gridster.$options();
  scrollSensitivity = $options.scrollSensitivity;
  scrollSpeed = $options.scrollSpeed;
  gridsterElement = gridster.el;
  resizeEvent = resize;
  resizeEventType = resizeEventScrollType;

  const offsetWidth = gridsterElement.offsetWidth;
  const offsetHeight = gridsterElement.offsetHeight;
  const offsetLeft = gridsterElement.scrollLeft;
  const offsetTop = gridsterElement.scrollTop;

  const { clientX, clientY } = event;

  lastMouseX = clientX;
  lastMouseY = clientY;

  if (!$options.disableScrollVertical) {
    const elemTopOffset = top - offsetTop;
    const elemBottomOffset = offsetHeight + offsetTop - top - height;

    if (elemBottomOffset < scrollSensitivity) {
      cancelN();
      if (!(resizeEvent && resizeEventType && !resizeEventType.south) && !scrollS) {
        startVerticalScroll(1, calculateItemPosition, gridster);
      }
    } else if (offsetTop > 0 && elemTopOffset < scrollSensitivity) {
      cancelS();
      if (!(resizeEvent && resizeEventType && !resizeEventType.north) && !scrollN) {
        startVerticalScroll(-1, calculateItemPosition, gridster);
      }
    } else if (lastMouse.clientY !== clientY) {
      cancelVerticalScroll();
    }
  }

  if (!$options.disableScrollHorizontal) {
    const elemRightOffset = offsetLeft + offsetWidth - left - width;
    const elemLeftOffset = left - offsetLeft;

    const isRTL = $options.dirType === DirTypes.RTL;

    if (elemRightOffset <= scrollSensitivity) {
      cancelW();
      if (!(resizeEvent && resizeEventType && !resizeEventType.east) && !scrollE) {
        startHorizontalScroll(1, calculateItemPosition, gridster, isRTL);
      }
    } else if (offsetLeft > 0 && elemLeftOffset < scrollSensitivity) {
      cancelE();
      if (!(resizeEvent && resizeEventType && !resizeEventType.west) && !scrollW) {
        startHorizontalScroll(-1, calculateItemPosition, gridster, isRTL);
      }
    } else if (lastMouse.clientX !== clientX) {
      cancelHorizontalScroll();
    }
  }
}

function startVerticalScroll(sign: number, calculateItemPosition: CalculatePosition, gridster: Gridster): void {
  if (sign > 0) {
    scrollS = true;

    const $options = gridster.$options();
    maxScrollY = $options.maxRows * gridster.curRowHeight + $options.margin - gridster.el.offsetHeight;
  } else {
    scrollN = true;
  }

  let lastUpdate: number | undefined;

  const callback = (timestamp: number) => {
    if (lastUpdate === undefined) {
      lastUpdate = timestamp;
      animationV = requestAnimation(callback);
      return;
    }

    if (!gridsterElement || (sign === -1 && gridsterElement.scrollTop - scrollSpeed < 0)) {
      cancelVerticalScroll();
      return;
    }

    const delta = (timestamp - lastUpdate) / intervalDuration;
    lastUpdate = timestamp;

    const top = sign * Math.round(scrollSpeed * delta);

    // check if maximum scroll position is reached
    if (scrollS && gridsterElement.scrollTop + top > maxScrollY) {
      cancelVerticalScroll();
      return;
    }

    gridsterElement.scrollTop += top;
    lastMouseY += top;
    calculateItemPosition({ clientX: lastMouseX, clientY: lastMouseY });
    animationV = requestAnimation(callback);
  };
  animationV = requestAnimation(callback);
}

function startHorizontalScroll(sign: number, calculateItemPosition: CalculatePosition, gridster: Gridster, isRTL: boolean): void {
  if (sign > 0) {
    scrollE = true;

    const $options = gridster.$options();
    maxScrollX = $options.maxCols * gridster.curColWidth + $options.margin - gridster.el.offsetWidth;
  } else {
    scrollW = true;
  }

  let lastUpdate: number | undefined;

  const callback = (timestamp: number) => {
    if (lastUpdate === undefined) {
      lastUpdate = timestamp;
      animationH = requestAnimation(callback);
      return;
    }

    if (!gridsterElement) {
      cancelHorizontalScroll();
      return;
    }

    const delta = (timestamp - lastUpdate) / intervalDuration;
    lastUpdate = timestamp;

    const scrollAmount = sign * Math.round(scrollSpeed * delta);
    const left = isRTL ? -scrollAmount : scrollAmount;

    // check if maximum scroll position is reached
    if (scrollE && gridsterElement.scrollLeft + left > maxScrollX) {
      cancelHorizontalScroll();
      return;
    }

    gridsterElement.scrollLeft += left;
    lastMouseX += left;
    calculateItemPosition({ clientX: lastMouseX, clientY: lastMouseY });
    animationH = requestAnimation(callback);
  };

  animationH = requestAnimation(callback);
}

export function cancelScroll(): void {
  cancelHorizontalScroll();
  cancelVerticalScroll();
  gridsterElement = null;
}

function cancelHorizontalScroll(): void {
  if (animationH !== null) {
    cancelAnimation(animationH);
  }
  scrollE = false;
  scrollW = false;
}

function cancelVerticalScroll(): void {
  if (animationV !== null) {
    cancelAnimation(animationV);
  }
  scrollN = false;
  scrollS = false;
}

function cancelE(): void {
  if (scrollE) {
    cancelHorizontalScroll();
  }
}

function cancelW(): void {
  if (scrollW) {
    cancelHorizontalScroll();
  }
}

function cancelS(): void {
  if (scrollS) {
    cancelVerticalScroll();
  }
}

function cancelN(): void {
  if (scrollN) {
    cancelVerticalScroll();
  }
}
