import { GridsterResizeEventType } from './gridsterResizeEventType.interface';
import { GridsterComponentInterface } from './gridster.interface';

let scrollSensitivity: number;
let scrollSpeed: number;
const intervalDuration = 50;
let gridsterElement: HTMLElement | null;
let resizeEvent: boolean | undefined;
let resizeEventType: GridsterResizeEventType | undefined;
let intervalE: number;
let intervalW: number;
let intervalN: number;
let intervalS: number;

type Position = Pick<MouseEvent, 'clientX' | 'clientY'>;

type CalculatePosition = (position: Position) => void;

export function scroll(
  gridster: GridsterComponentInterface,
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
      if (
        (resizeEvent && resizeEventType && !resizeEventType.south) ||
        intervalS
      ) {
        return;
      }
      intervalS = startVertical(1, calculateItemPosition, lastMouse);
    } else if (
      lastMouse.clientY > clientY &&
      offsetTop > 0 &&
      elemTopOffset < scrollSensitivity
    ) {
      cancelS();
      if (
        (resizeEvent && resizeEventType && !resizeEventType.north) ||
        intervalN
      ) {
        return;
      }
      intervalN = startVertical(-1, calculateItemPosition, lastMouse);
    } else if (lastMouse.clientY !== clientY) {
      cancelVertical();
    }
  }

  const elemRightOffset = offsetLeft + offsetWidth - left - width;
  const elemLeftOffset = left - offsetLeft;

  if (!gridster.$options.disableScrollHorizontal) {
    if (lastMouse.clientX < clientX && elemRightOffset <= scrollSensitivity) {
      cancelW();
      if (
        (resizeEvent && resizeEventType && !resizeEventType.east) ||
        intervalE
      ) {
        return;
      }
      intervalE = startHorizontal(1, calculateItemPosition, lastMouse);
    } else if (
      lastMouse.clientX > clientX &&
      offsetLeft > 0 &&
      elemLeftOffset < scrollSensitivity
    ) {
      cancelE();
      if (
        (resizeEvent && resizeEventType && !resizeEventType.west) ||
        intervalW
      ) {
        return;
      }
      intervalW = startHorizontal(-1, calculateItemPosition, lastMouse);
    } else if (lastMouse.clientX !== clientX) {
      cancelHorizontal();
    }
  }
}

function startVertical(
  sign: number,
  calculateItemPosition: CalculatePosition,
  lastMouse: Position
): number {
  let clientY = lastMouse.clientY;
  return window.setInterval(() => {
    if (
      !gridsterElement ||
      (sign === -1 && gridsterElement.scrollTop - scrollSpeed < 0)
    ) {
      cancelVertical();
    }
    gridsterElement!.scrollTop += sign * scrollSpeed;
    clientY += sign * scrollSpeed;
    calculateItemPosition({ clientX: lastMouse.clientX, clientY });
  }, intervalDuration);
}

function startHorizontal(
  sign: number,
  calculateItemPosition: CalculatePosition,
  lastMouse: Position
): number {
  let clientX = lastMouse.clientX;
  return window.setInterval(() => {
    if (
      !gridsterElement ||
      (sign === -1 && gridsterElement.scrollLeft - scrollSpeed < 0)
    ) {
      cancelHorizontal();
    }
    gridsterElement!.scrollLeft += sign * scrollSpeed;
    clientX += sign * scrollSpeed;
    calculateItemPosition({ clientX, clientY: lastMouse.clientY });
  }, intervalDuration);
}

export function cancelScroll(): void {
  cancelHorizontal();
  cancelVertical();
  gridsterElement = null;
}

function cancelHorizontal(): void {
  cancelE();
  cancelW();
}

function cancelVertical(): void {
  cancelN();
  cancelS();
}

function cancelE(): void {
  if (intervalE) {
    clearInterval(intervalE);
    intervalE = 0;
  }
}

function cancelW(): void {
  if (intervalW) {
    clearInterval(intervalW);
    intervalW = 0;
  }
}

function cancelS(): void {
  if (intervalS) {
    clearInterval(intervalS);
    intervalS = 0;
  }
}

function cancelN(): void {
  if (intervalN) {
    clearInterval(intervalN);
    intervalN = 0;
  }
}
