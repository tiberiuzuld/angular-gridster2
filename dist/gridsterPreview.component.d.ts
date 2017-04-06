import { ElementRef, Renderer2 } from '@angular/core';
import { GridsterComponent } from './gridster.component';
export declare class GridsterPreviewComponent {
    renderer: Renderer2;
    el: any;
    gridster: GridsterComponent;
    constructor(el: ElementRef, gridster: GridsterComponent, renderer: Renderer2);
    previewStyle(): void;
}
