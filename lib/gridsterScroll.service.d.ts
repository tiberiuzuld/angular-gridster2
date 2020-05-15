import { GridsterResizeEventType } from './gridsterResizeEventType.interface';
import { GridsterComponentInterface } from './gridster.interface';
export declare function scroll(gridster: GridsterComponentInterface, left: number, top: number, width: number, height: number, e: MouseEvent, lastMouse: any, calculateItemPosition: Function, resize?: boolean, resizeEventScrollType?: GridsterResizeEventType): void;
export declare function cancelScroll(): void;
