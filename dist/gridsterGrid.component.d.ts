import { ElementRef, Renderer2 } from '@angular/core';
import { GridsterComponent } from './gridster.component';
export declare class GridsterGridComponent {
    renderer: Renderer2;
    el: any;
    gridster: GridsterComponent;
    columns: Array<any>;
    rows: Array<any>;
    height: number;
    width: number;
    margin: number;
    columnsHeight: number;
    rowsWidth: number;
    constructor(el: ElementRef, gridster: GridsterComponent, renderer: Renderer2);
    updateGrid(dragOn?: boolean): void;
}
