import * as tslib_1 from "tslib";
import { Component, ElementRef, OnDestroy, Renderer2, ViewEncapsulation, Inject } from '@angular/core';
import { GridsterComponent } from './gridster.component';
let GridsterPreviewComponent = class GridsterPreviewComponent {
    constructor(el, gridster, renderer) {
        this.renderer = renderer;
        this.el = el.nativeElement;
        this.gridster = gridster;
        this.gridster.previewStyle = this.previewStyle.bind(this);
    }
    ngOnDestroy() {
        delete this.el;
        delete this.gridster.previewStyle;
        delete this.gridster;
    }
    previewStyle(drag) {
        if (!this.gridster.movingItem) {
            this.renderer.setStyle(this.el, 'display', '');
        }
        else {
            if (this.gridster.compact && drag) {
                this.gridster.compact.checkCompactItem(this.gridster.movingItem);
            }
            this.renderer.setStyle(this.el, 'display', 'block');
            this.gridster.gridRenderer.updateItem(this.el, this.gridster.movingItem, this.renderer);
        }
    }
};
GridsterPreviewComponent.ctorParameters = () => [
    { type: ElementRef, decorators: [{ type: Inject, args: [ElementRef,] }] },
    { type: GridsterComponent },
    { type: Renderer2, decorators: [{ type: Inject, args: [Renderer2,] }] }
];
GridsterPreviewComponent = tslib_1.__decorate([
    Component({
        selector: 'gridster-preview',
        template: '',
        encapsulation: ViewEncapsulation.None,
        styles: ["gridster-preview{position:absolute;display:none;background:rgba(0,0,0,.15)}"]
    }),
    tslib_1.__param(0, Inject(ElementRef)), tslib_1.__param(2, Inject(Renderer2)),
    tslib_1.__metadata("design:paramtypes", [ElementRef, GridsterComponent, Renderer2])
], GridsterPreviewComponent);
export { GridsterPreviewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXJQcmV2aWV3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZ3JpZHN0ZXIyLyIsInNvdXJjZXMiOlsibGliL2dyaWRzdGVyUHJldmlldy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXJHLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBUXZELElBQWEsd0JBQXdCLEdBQXJDLE1BQWEsd0JBQXdCO0lBSW5DLFlBQWlDLEVBQWMsRUFBRyxRQUEyQixFQUE0QixRQUFtQjtRQUFuQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQzFILElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsV0FBVztRQUNULE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNmLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDbEMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxZQUFZLENBQUMsSUFBYztRQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDaEQ7YUFBTTtZQUNMLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLElBQUksSUFBSSxFQUFFO2dCQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ2xFO1lBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3pGO0lBQ0gsQ0FBQztDQUNGLENBQUE7O1lBdkJzQyxVQUFVLHVCQUFsQyxNQUFNLFNBQUMsVUFBVTtZQUE4QixpQkFBaUI7WUFBc0MsU0FBUyx1QkFBNUMsTUFBTSxTQUFDLFNBQVM7O0FBSnJGLHdCQUF3QjtJQU5wQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsa0JBQWtCO1FBQzVCLFFBQVEsRUFBRSxFQUFFO1FBRVosYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O0tBQ3RDLENBQUM7SUFLYSxtQkFBQSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUEsRUFBaUQsbUJBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBOzZDQUE1RCxVQUFVLEVBQWEsaUJBQWlCLEVBQXNDLFNBQVM7R0FKakgsd0JBQXdCLENBMkJwQztTQTNCWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgT25EZXN0cm95LCBSZW5kZXJlcjIsIFZpZXdFbmNhcHN1bGF0aW9uLCBJbmplY3R9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0dyaWRzdGVyQ29tcG9uZW50fSBmcm9tICcuL2dyaWRzdGVyLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2dyaWRzdGVyLXByZXZpZXcnLFxuICB0ZW1wbGF0ZTogJycsXG4gIHN0eWxlVXJsczogWycuL2dyaWRzdGVyUHJldmlldy5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBHcmlkc3RlclByZXZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBlbDogYW55O1xuICBncmlkc3RlcjogR3JpZHN0ZXJDb21wb25lbnQ7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChFbGVtZW50UmVmKSAgZWw6IEVsZW1lbnRSZWYsICBncmlkc3RlcjogR3JpZHN0ZXJDb21wb25lbnQsIEBJbmplY3QoUmVuZGVyZXIyKSBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuICAgIHRoaXMuZWwgPSBlbC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuZ3JpZHN0ZXIgPSBncmlkc3RlcjtcbiAgICB0aGlzLmdyaWRzdGVyLnByZXZpZXdTdHlsZSA9IHRoaXMucHJldmlld1N0eWxlLmJpbmQodGhpcyk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBkZWxldGUgdGhpcy5lbDtcbiAgICBkZWxldGUgdGhpcy5ncmlkc3Rlci5wcmV2aWV3U3R5bGU7XG4gICAgZGVsZXRlIHRoaXMuZ3JpZHN0ZXI7XG4gIH1cblxuICBwcmV2aWV3U3R5bGUoZHJhZz86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZ3JpZHN0ZXIubW92aW5nSXRlbSkge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAnZGlzcGxheScsICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuZ3JpZHN0ZXIuY29tcGFjdCAmJiBkcmFnKSB7XG4gICAgICAgIHRoaXMuZ3JpZHN0ZXIuY29tcGFjdC5jaGVja0NvbXBhY3RJdGVtKHRoaXMuZ3JpZHN0ZXIubW92aW5nSXRlbSk7XG4gICAgICB9XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwsICdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgICB0aGlzLmdyaWRzdGVyLmdyaWRSZW5kZXJlci51cGRhdGVJdGVtKHRoaXMuZWwsIHRoaXMuZ3JpZHN0ZXIubW92aW5nSXRlbSwgdGhpcy5yZW5kZXJlcik7XG4gICAgfVxuICB9XG59XG4iXX0=