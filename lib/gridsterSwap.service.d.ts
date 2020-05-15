import { GridsterItemComponentInterface } from './gridsterItemComponent.interface';
import * as i0 from "@angular/core";
export declare class GridsterSwap {
    private swapedItem;
    private gridsterItem;
    private gridster;
    constructor(gridsterItem: GridsterItemComponentInterface);
    destroy(): void;
    swapItems(): void;
    checkSwapBack(): void;
    restoreSwapItem(): void;
    setSwapItem(): void;
    checkSwap(pushedBy: GridsterItemComponentInterface): void;
    static ɵfac: i0.ɵɵFactoryDef<GridsterSwap, never>;
    static ɵprov: i0.ɵɵInjectableDef<GridsterSwap>;
}
