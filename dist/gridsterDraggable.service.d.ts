import { GridsterItemComponent } from './gridsterItem.component';
import { GridsterItem } from './gridsterItem.interface';
export declare class GridsterDraggable {
    element: HTMLElement;
    gridsterItem: GridsterItemComponent;
    itemCopy: GridsterItem;
    lastMouse: {
        pageX: number;
        pageY: number;
    };
    elemPosition: Array<number>;
    position: Array<number>;
    positionBackup: Array<number>;
    enabled: boolean;
    dragStartFunction: EventListenerObject;
    dragFunction: EventListenerObject;
    dragStopFunction: EventListenerObject;
    static touchEvent(e: any): void;
    constructor(element: HTMLElement, gridsterItem: GridsterItemComponent);
    dragStart(e: any): void;
    dragMove(e: any): void;
    dragStop(e: any): void;
    calculateItemPosition(): void;
    toggle(enable: boolean): void;
}
