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

interface Position {
    clientX: number;
    clientY: number;
}

type CalculatePosition = (position: Position) => void;

export function scroll(
    gridster: GridsterComponentInterface,
    left: number,
    top: number,
    width: number,
    height: number,
    e: MouseEvent,
    lastMouse: Position,
    calculateItemPosition: CalculatePosition,
    resize?: boolean,
    resizeEventScrollType?: GridsterResizeEventType,
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

    if (!gridster.$options.disableScrollVertical) {
        if (lastMouse.clientY < e.clientY && elemBottomOffset < scrollSensitivity) {
            cancelN();
            if ((resizeEvent && resizeEventType && !resizeEventType.s) || intervalS) {
                return;
            }
            intervalS = startVertical(1, calculateItemPosition, lastMouse);
        } else if (
            lastMouse.clientY > e.clientY &&
            offsetTop > 0 &&
            elemTopOffset < scrollSensitivity
        ) {
            cancelS();
            if ((resizeEvent && resizeEventType && !resizeEventType.n) || intervalN) {
                return;
            }
            intervalN = startVertical(-1, calculateItemPosition, lastMouse);
        } else if (lastMouse.clientY !== e.clientY) {
            cancelVertical();
        }
    }

    const elemRightOffset = offsetLeft + offsetWidth - left - width;
    const elemLeftOffset = left - offsetLeft;

    if (!gridster.$options.disableScrollHorizontal) {
        if (lastMouse.clientX < e.clientX && elemRightOffset <= scrollSensitivity) {
            cancelW();
            if ((resizeEvent && resizeEventType && !resizeEventType.e) || intervalE) {
                return;
            }
            intervalE = startHorizontal(1, calculateItemPosition, lastMouse);
        } else if (
            lastMouse.clientX > e.clientX &&
            offsetLeft > 0 &&
            elemLeftOffset < scrollSensitivity
        ) {
            cancelE();
            if ((resizeEvent && resizeEventType && !resizeEventType.w) || intervalW) {
                return;
            }
            intervalW = startHorizontal(-1, calculateItemPosition, lastMouse);
        } else if (lastMouse.clientX !== e.clientX) {
            cancelHorizontal();
        }
    }
}

function startVertical(
    sign: number,
    calculateItemPosition: CalculatePosition,
    lastMouse: Position,
): number {
    let clientY = lastMouse.clientY;
    return setInterval(() => {
        if (!gridsterElement || (sign === -1 && gridsterElement.scrollTop - scrollSpeed < 0)) {
            cancelVertical();
        }
        // @ts-ignore
        gridsterElement.scrollTop += sign * scrollSpeed;
        clientY += sign * scrollSpeed;
        calculateItemPosition({ clientX: lastMouse.clientX, clientY });
    }, intervalDuration);
}

function startHorizontal(
    sign: number,
    calculateItemPosition: CalculatePosition,
    lastMouse: Position,
): number {
    let clientX = lastMouse.clientX;
    return setInterval(() => {
        if (!gridsterElement || (sign === -1 && gridsterElement.scrollLeft - scrollSpeed < 0)) {
            cancelHorizontal();
        }
        // @ts-ignore
        gridsterElement.scrollLeft += sign * scrollSpeed;
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
