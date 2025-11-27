import { Gridster } from './gridster';
import { GridsterResizeEventType } from './gridsterResizeEventType';
import { DirTypes } from './gridsterConfig';

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
  scrollSensitivity = gridster.$options.scrollSensitivity;
  scrollSpeed = gridster.$options.scrollSpeed;
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

  if (!gridster.$options.disableScrollVertical) {
    const elemTopOffset = top - offsetTop;
    const elemBottomOffset = offsetHeight + offsetTop - top - height;

    if (elemBottomOffset < scrollSensitivity) {
      cancelN();
      if (!(resizeEvent && resizeEventType && !resizeEventType.south) && !scrollS) {
        startVertical(1, calculateItemPosition);
      }
    } else if (offsetTop > 0 && elemTopOffset < scrollSensitivity) {
      cancelS();
      if (!(resizeEvent && resizeEventType && !resizeEventType.north) && !scrollN) {
        startVertical(-1, calculateItemPosition);
      }
    } else if (lastMouse.clientY !== clientY) {
      cancelVertical();
    }
  }

  if (!gridster.$options.disableScrollHorizontal) {
    const elemRightOffset = offsetLeft + offsetWidth - left - width;
    const elemLeftOffset = left - offsetLeft;

    const isRTL = gridster.$options.dirType === DirTypes.RTL;

    if (elemRightOffset <= scrollSensitivity) {
      cancelW();
      if (!(resizeEvent && resizeEventType && !resizeEventType.east) && !scrollE) {
        startHorizontal(1, calculateItemPosition, isRTL);
      }
    } else if (offsetLeft > 0 && elemLeftOffset < scrollSensitivity) {
      cancelE();
      if (!(resizeEvent && resizeEventType && !resizeEventType.west) && !scrollW) {
        startHorizontal(-1, calculateItemPosition, isRTL);
      }
    } else if (lastMouse.clientX !== clientX) {
      cancelHorizontal();
    }
  }
}

function startVertical(sign: number, calculateItemPosition: CalculatePosition): void {
  if (sign > 0) {
    scrollS = true;
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
      cancelVertical();
      return;
    }

    const delta = (timestamp - lastUpdate) / intervalDuration;
    lastUpdate = timestamp;

    const top = sign * Math.round(scrollSpeed * delta);
    gridsterElement.scrollTop += top;
    lastMouseY += top;
    calculateItemPosition({ clientX: lastMouseX, clientY: lastMouseY });
    animationV = requestAnimation(callback);
  };
  animationV = requestAnimation(callback);
}

function startHorizontal(sign: number, calculateItemPosition: CalculatePosition, isRTL: boolean): void {
  if (sign > 0) {
    scrollE = true;
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
      cancelHorizontal();
      return;
    }

    const delta = (timestamp - lastUpdate) / intervalDuration;
    lastUpdate = timestamp;

    const scrollAmount = sign * Math.round(scrollSpeed * delta);
    const left = isRTL ? -scrollAmount : scrollAmount;

    gridsterElement.scrollLeft += left;
    lastMouseX += left;
    calculateItemPosition({ clientX: lastMouseX, clientY: lastMouseY });
    animationH = requestAnimation(callback);
  };

  animationH = requestAnimation(callback);
}

export function cancelScroll(): void {
  cancelHorizontal();
  cancelVertical();
  gridsterElement = null;
}

function cancelHorizontal(): void {
  if (animationH !== null) {
    cancelAnimation(animationH);
  }
  scrollE = false;
  scrollW = false;
}

function cancelVertical(): void {
  if (animationV !== null) {
    cancelAnimation(animationV);
  }
  scrollN = false;
  scrollS = false;
}

function cancelE(): void {
  if (scrollE) {
    cancelHorizontal();
  }
}

function cancelW(): void {
  if (scrollW) {
    cancelHorizontal();
  }
}

function cancelS(): void {
  if (scrollS) {
    cancelVertical();
  }
}

function cancelN(): void {
  if (scrollN) {
    cancelVertical();
  }
}
