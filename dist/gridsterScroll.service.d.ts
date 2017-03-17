import { GridsterItemComponent } from './gridsterItem.component';
import { GridsterResizeEventType } from './gridsterResizeEventType.interface';
export declare class GridsterScroll {
    scrollSensitivity: number;
    scrollSpeed: number;
    intervalDuration: number;
    gridsterElement: HTMLElement;
    resizeEvent: boolean;
    resizeEventType: GridsterResizeEventType;
    intervalE: number;
    intervalW: number;
    intervalN: number;
    intervalS: number;
    constructor();
    scroll(elemPosition: Array<number>, gridsterItem: GridsterItemComponent, e: MouseEvent, lastMouse: any, calculateItemPosition: Function, resize?: boolean, resizeEventScrollType?: GridsterResizeEventType): void;
    startVertical(sign: number, elemPosition: Array<number>, calculateItemPosition: Function, lastMouse: any): number;
    startHorizontal(sign: number, elemPosition: Array<number>, calculateItemPosition: Function, lastMouse: any): number;
    cancelScroll(): void;
    cancelHorizontal(): void;
    cancelVertical(): void;
    cancelE(): void;
    cancelW(): void;
    cancelS(): void;
    cancelN(): void;
}
