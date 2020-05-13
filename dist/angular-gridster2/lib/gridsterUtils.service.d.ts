import { GridsterComponentInterface } from './gridster.interface';
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
}
