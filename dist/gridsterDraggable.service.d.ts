import { GridsterItemComponent } from './gridsterItem.component';
import { GridsterItem } from './gridsterItem.interface';
import { GridsterComponent } from './gridster.component';
import { GridsterPush } from './gridsterPush.service';
export declare class GridsterDraggable {
    gridsterItem: GridsterItemComponent;
    gridster: GridsterComponent;
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
    push: GridsterPush;
    static touchEvent(e: any): void;
    constructor(gridsterItem: GridsterItemComponent, gridster: GridsterComponent);
    checkContentClass(target: any, current: any, contentClass: any): boolean;
    dragStart(e: any): void;
    dragMove(e: any): void;
    dragStop(e: any): void;
    cancelDrag(): void;
    makeDrag(): void;
    calculateItemPosition(): void;
    toggle(enable: boolean): void;
}
