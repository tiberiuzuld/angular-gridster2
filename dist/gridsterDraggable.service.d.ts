import { GridsterItemComponent } from './gridsterItem.component';
import { GridsterItem } from './gridsterItem.interface';
export declare class GridsterDraggable {
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
    dragStartFunction: (event: any) => void;
    dragFunction: (event: any) => void;
    dragStopFunction: (event: any) => void;
    mousemove: Function;
    mouseup: Function;
    touchmove: Function;
    touchend: Function;
    touchcancel: Function;
    mousedown: Function;
    touchstart: Function;
    static touchEvent(e: any): void;
    constructor(gridsterItem: GridsterItemComponent);
    checkContentClass(target: any, current: any, contentClass: any): any;
    dragStart(e: any): void;
    dragMove(e: any): void;
    dragStop(e: any): void;
    cancelDrag(): void;
    makeDrag(): void;
    calculateItemPosition(): void;
    toggle(enable: boolean): void;
}
