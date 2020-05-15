import { Renderer2 } from '@angular/core';
import { GridsterComponentInterface } from './gridster.interface';
import { GridsterItem } from './gridsterItem.interface';
export declare class GridsterRenderer {
    private gridster;
    constructor(gridster: GridsterComponentInterface);
    destroy(): void;
    updateItem(el: any, item: GridsterItem, renderer: Renderer2): void;
    updateGridster(): void;
    getGridColumnStyle(i: number): {
        width: string;
        height: string;
        left?: string | undefined;
        transform?: string | undefined;
    };
    getGridRowStyle(i: number): {
        width: string;
        height: string;
        top?: string | undefined;
        transform?: string | undefined;
    };
    getLeftPosition(d: number): {
        left?: string;
        transform?: string;
    };
    getTopPosition(d: number): {
        top?: string;
        transform?: string;
    };
    clearCellPosition(renderer: Renderer2, el: any): void;
    setCellPosition(renderer: Renderer2, el: any, x: number, y: number): void;
    getLeftMargin(): number;
    getTopMargin(): number;
}
