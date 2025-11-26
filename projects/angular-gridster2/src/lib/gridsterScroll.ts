import { Gridster } from './gridster';
import { GridsterResizeEventType } from './gridsterResizeEventType';
import { DirTypes } from './gridsterConfig';

let scrollSensitivity: number;
let scrollSpeed: number;
const intervalDuration = 20;
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

const mouseMoveThreshold = 15;
let mouseMoveDirectionY = 0;
let mouseMoveDirectionX = 0;

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

  updateMouseInfo(event, lastMouse);

  if (!gridster.$options.disableScrollVertical) {
    const elemTopOffset = top - offsetTop;
    const elemBottomOffset = offsetHeight + offsetTop - top - height;

    if (mouseMoveDirectionY >= 0 && elemBottomOffset < scrollSensitivity) {
      cancelN();
      if (!(resizeEvent && resizeEventType && !resizeEventType.south) && !scrollS) {
        startVertical(1, calculateItemPosition);
      }
    } else if (mouseMoveDirectionY <= 0 && offsetTop > 0 && elemTopOffset < scrollSensitivity) {
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
    const moveRight = mouseMoveDirectionX >= 0;
    const moveLeft = mouseMoveDirectionX <= 0;
    const shouldScrollRight = isRTL ? moveLeft : moveRight;
    const shouldScrollLeft = isRTL ? moveRight : moveLeft;

    if (shouldScrollRight && elemRightOffset <= scrollSensitivity) {
      cancelW();
      if (!(resizeEvent && resizeEventType && !resizeEventType.east) && !scrollE) {
        startHorizontal(1, calculateItemPosition, isRTL);
      }
    } else if (shouldScrollLeft && offsetLeft > 0 && elemLeftOffset < scrollSensitivity) {
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
      animationV = requestAnimationFrame(callback);
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
    animationV = requestAnimationFrame(callback);
  };
  animationV = requestAnimationFrame(callback);
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
      animationH = requestAnimationFrame(callback);
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
    animationH = requestAnimationFrame(callback);
  };

  animationH = requestAnimationFrame(callback);
}

export function cancelScroll(): void {
  cancelHorizontal();
  cancelVertical();
  gridsterElement = null;
}

function cancelHorizontal(): void {
  if (animationH !== null) {
    cancelAnimationFrame(animationH);
  }
  scrollE = false;
  scrollW = false;
}

function cancelVertical(): void {
  if (animationV !== null) {
    cancelAnimationFrame(animationV);
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

/**
 * Updates the mouse position and mouse move direction
 */
function updateMouseInfo(currentMouseEvent: { clientX: number; clientY: number }, lastMouseEvent: { clientX: number; clientY: number }) {
  lastMouseX = currentMouseEvent.clientX;
  lastMouseY = currentMouseEvent.clientY;

  const deltaX = currentMouseEvent.clientX - lastMouseEvent.clientX;

  if (deltaX !== 0) {
    mouseMoveDirectionX += Math.sign(deltaX);
  }

  if (mouseMoveDirectionX > 0) {
    mouseMoveDirectionX = Math.min(mouseMoveDirectionX, mouseMoveThreshold);
  } else {
    mouseMoveDirectionX = Math.max(mouseMoveDirectionX, -mouseMoveThreshold);
  }

  const deltaY = currentMouseEvent.clientX - lastMouseEvent.clientX;

  if (deltaY !== 0) {
    mouseMoveDirectionY += Math.sign(deltaY);
  }

  if (mouseMoveDirectionY > 0) {
    mouseMoveDirectionY = Math.min(mouseMoveDirectionY, mouseMoveThreshold);
  } else {
    mouseMoveDirectionY = Math.max(mouseMoveDirectionY, -mouseMoveThreshold);
  }
}
