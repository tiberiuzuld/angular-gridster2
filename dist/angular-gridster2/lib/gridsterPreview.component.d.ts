import { ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { GridsterComponent } from './gridster.component';
import * as ɵngcc0 from '@angular/core';
export declare class GridsterPreviewComponent implements OnDestroy {
    renderer: Renderer2;
    el: any;
    gridster: GridsterComponent;
    constructor(el: ElementRef, gridster: GridsterComponent, renderer: Renderer2);
    ngOnDestroy(): void;
    previewStyle(drag?: boolean): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<GridsterPreviewComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<GridsterPreviewComponent, "gridster-preview", never, {}, {}, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXJQcmV2aWV3LmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJncmlkc3RlclByZXZpZXcuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmLCBPbkRlc3Ryb3ksIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgR3JpZHN0ZXJDb21wb25lbnQgfSBmcm9tICcuL2dyaWRzdGVyLmNvbXBvbmVudCc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBHcmlkc3RlclByZXZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAgIHJlbmRlcmVyOiBSZW5kZXJlcjI7XG4gICAgZWw6IGFueTtcbiAgICBncmlkc3RlcjogR3JpZHN0ZXJDb21wb25lbnQ7XG4gICAgY29uc3RydWN0b3IoZWw6IEVsZW1lbnRSZWYsIGdyaWRzdGVyOiBHcmlkc3RlckNvbXBvbmVudCwgcmVuZGVyZXI6IFJlbmRlcmVyMik7XG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZDtcbiAgICBwcmV2aWV3U3R5bGUoZHJhZz86IGJvb2xlYW4pOiB2b2lkO1xufVxuIl19