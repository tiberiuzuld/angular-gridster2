import { GridsterItemComponent } from './gridsterItem.component';
import { GridsterComponent } from './gridster.component';
export declare class GridsterSwap {
    private swapedItem;
    private gridsterItem;
    private gridster;
    constructor(gridsterItem: GridsterItemComponent, gridster: GridsterComponent);
    swapItems(): void;
    checkSwapBack(): void;
    restoreSwapItem(): void;
    setSwapItem(): void;
    checkSwap(pushedBy: GridsterItemComponent): void;
}
