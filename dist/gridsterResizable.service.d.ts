import { GridsterItemComponent } from './gridsterItem.component';
import { GridsterItem } from './gridsterItem.interface';
import { GridsterResizeEventType } from './gridsterResizeEventType.interface';
export declare class GridsterResizable {
    element: HTMLElement;
    gridsterItem: GridsterItemComponent;
    itemCopy: GridsterItem;
    lastMouse: {
        pageX: number;
        pageY: number;
    };
    elemPosition: Array<number>;
    position: Array<number>;
    itemBackup: Array<number>;
    enabled: boolean;
    resizeEventScrollType: GridsterResizeEventType;
    directionFunction: Function;
    dragFunction: EventListenerObject;
    dragStopFunction: EventListenerObject;
    resizeEnabled: boolean;
    static touchEvent(e: any): void;
    constructor(element: HTMLElement, gridsterItem: GridsterItemComponent);
    dragStart(e: any): void;
    dragMove(e: any): void;
    dragStop(e: any): void;
    cancelResize(): void;
    makeResize(): void;
    handleN(e: any): void;
    handleW(e: any): void;
    handleS(e: any): void;
    handleE(e: any): void;
    handleNW(e: any): void;
    handleNE(e: any): void;
    handleSW(e: any): void;
    handleSE(e: any): void;
    toggle(enabled: any): void;
}
