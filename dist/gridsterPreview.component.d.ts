import { ElementRef, Renderer } from '@angular/core';
import { GridsterComponent } from './gridster.component';
export declare class GridsterPreviewComponent {
    renderer: Renderer;
    el: any;
    gridster: GridsterComponent;
    constructor(el: ElementRef, gridster: GridsterComponent, renderer: Renderer);
    previewStyle(): void;
}
