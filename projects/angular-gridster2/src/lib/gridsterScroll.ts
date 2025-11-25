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
  const elemTopOffset = top - offsetTop;
  const elemBottomOffset = offsetHeight + offsetTop - top - height;

  const { clientX, clientY } = event;

  if (!gridster.$options.disableScrollVertical) {
    if (lastMouse.clientY < clientY && elemBottomOffset < scrollSensitivity) {
      cancelN();
      if ((resizeEvent && resizeEventType && !resizeEventType.south) || scrollS) {
        return;
      }
      startVertical(1, calculateItemPosition, lastMouse);
    } else if (lastMouse.clientY > clientY && offsetTop > 0 && elemTopOffset < scrollSensitivity) {
      cancelS();
      if ((resizeEvent && resizeEventType && !resizeEventType.north) || scrollN) {
        return;
      }
      startVertical(-1, calculateItemPosition, lastMouse);
    } else if (lastMouse.clientY !== clientY) {
      cancelVertical();
    }
  }

  const elemRightOffset = offsetLeft + offsetWidth - left - width;
  const elemLeftOffset = left - offsetLeft;

  if (!gridster.$options.disableScrollHorizontal) {
    const isRTL = gridster.$options.dirType === DirTypes.RTL;
    const moveRight = lastMouse.clientX < clientX;
    const moveLeft = lastMouse.clientX > clientX;
    const shouldScrollRight = isRTL ? moveLeft : moveRight;
    const shouldScrollLeft = isRTL ? moveRight : moveLeft;
    if (shouldScrollRight && elemRightOffset <= scrollSensitivity) {
      cancelW();
      if ((resizeEvent && resizeEventType && !resizeEventType.east) || scrollE) return;
      startHorizontal(1, calculateItemPosition, lastMouse, isRTL);
    } else if (shouldScrollLeft && offsetLeft > 0 && elemLeftOffset < scrollSensitivity) {
      cancelE();
      if ((resizeEvent && resizeEventType && !resizeEventType.west) || scrollW) return;
      startHorizontal(-1, calculateItemPosition, lastMouse, isRTL);
    } else if (lastMouse.clientX !== clientX) {
      cancelHorizontal();
    }
  }
}

function startVertical(sign: number, calculateItemPosition: CalculatePosition, lastMouse: Position): void {
  let clientY = lastMouse.clientY;

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

    gridsterElement!.scrollTop += sign * Math.round(scrollSpeed * delta);
    clientY += sign * scrollSpeed;
    calculateItemPosition({ clientX: lastMouse.clientX, clientY });
    animationV = requestAnimationFrame(callback);
  };
  animationV = requestAnimationFrame(callback);
}

function startHorizontal(sign: number, calculateItemPosition: CalculatePosition, lastMouse: Position, isRTL: boolean): void {
  let clientX = lastMouse.clientX;

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
    clientX += left;
    calculateItemPosition({ clientX, clientY: lastMouse.clientY });
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
    scrollE = false;
    scrollW = false;
  }
}

function cancelVertical(): void {
  if (animationV !== null) {
    cancelAnimationFrame(animationV);
    scrollN = false;
    scrollS = false;
  }
}

function cancelE(): void {
  if (scrollE !== null) {
    cancelHorizontal();
  }
}

function cancelW(): void {
  if (scrollW !== null) {
    cancelHorizontal();
  }
}

function cancelS(): void {
  if (scrollS !== null) {
    cancelVertical();
  }
}

function cancelN(): void {
  if (scrollN !== null) {
    cancelVertical();
  }
}
