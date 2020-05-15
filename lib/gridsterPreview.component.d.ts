import { ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { GridsterComponent } from './gridster.component';
import * as i0 from "@angular/core";
export declare class GridsterPreviewComponent implements OnDestroy {
    renderer: Renderer2;
    el: any;
    gridster: GridsterComponent;
    constructor(el: ElementRef, gridster: GridsterComponent, renderer: Renderer2);
    ngOnDestroy(): void;
    previewStyle(drag?: boolean): void;
    static ɵfac: i0.ɵɵFactoryDef<GridsterPreviewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<GridsterPreviewComponent, "gridster-preview", never, {}, {}, never, never>;
}
