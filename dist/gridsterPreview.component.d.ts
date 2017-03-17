import { ElementRef } from '@angular/core';
import { GridsterComponent } from './gridster.component';
export declare class GridsterPreviewComponent {
    element: HTMLElement;
    gridster: GridsterComponent;
    constructor(el: ElementRef, gridster: GridsterComponent);
    previewStyle(): void;
}
