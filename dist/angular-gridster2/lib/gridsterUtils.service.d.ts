import { GridsterComponentInterface } from './gridster.interface';
import * as i0 from "@angular/core";
export declare class GridsterUtils {
    static merge(obj1: any, obj2: any, properties: any): any;
    static debounce(func: Function, wait: number): () => void;
    static checkTouchEvent(e: any): void;
    static checkContentClassForEvent(gridster: GridsterComponentInterface, e: any): boolean;
    static checkContentClassForEmptyCellClickEvent(gridster: GridsterComponentInterface, e: any): boolean;
    static checkDragHandleClass(target: any, current: any, dragHandleClass: string, ignoreContentClass: any): boolean;
    static checkContentClass(target: any, current: any, contentClass: string): boolean;
    static compareItems(a: {
        x: number;
        y: number;
    }, b: {
        x: number;
        y: number;
    }): number;
    static ɵfac: i0.ɵɵFactoryDef<GridsterUtils, never>;
    static ɵprov: i0.ɵɵInjectableDef<GridsterUtils>;
}
