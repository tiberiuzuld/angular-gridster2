import { GridsterItemComponentInterface } from './gridsterItemComponent.interface';
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
}
