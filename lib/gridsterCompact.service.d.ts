import { GridsterComponentInterface } from './gridster.interface';
import { GridsterItem } from './gridsterItem.interface';
import * as i0 from "@angular/core";
export declare class GridsterCompact {
    private gridster;
    constructor(gridster: GridsterComponentInterface);
    destroy(): void;
    checkCompact(): void;
    checkCompactItem(item: GridsterItem): void;
    checkCompactUp(): void;
    moveUpTillCollision(item: GridsterItem): boolean;
    checkCompactLeft(): void;
    checkCompactRight(): void;
    moveLeftTillCollision(item: GridsterItem): boolean;
    moveRightTillCollision(item: any): boolean;
    static ɵfac: i0.ɵɵFactoryDef<GridsterCompact, never>;
    static ɵprov: i0.ɵɵInjectableDef<GridsterCompact>;
}
