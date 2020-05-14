import { Component, ElementRef, Renderer2, ViewEncapsulation, Inject } from '@angular/core';
import { GridsterComponent } from './gridster.component';
import * as i0 from "@angular/core";
import * as i1 from "./gridster.component";
var GridsterPreviewComponent = /** @class */ (function () {
    function GridsterPreviewComponent(el, gridster, renderer) {
        this.renderer = renderer;
        this.el = el.nativeElement;
        this.gridster = gridster;
        this.gridster.previewStyle = this.previewStyle.bind(this);
    }
    GridsterPreviewComponent.prototype.ngOnDestroy = function () {
        delete this.el;
        delete this.gridster.previewStyle;
        delete this.gridster;
    };
    GridsterPreviewComponent.prototype.previewStyle = function (drag) {
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
    };
    GridsterPreviewComponent.ɵfac = function GridsterPreviewComponent_Factory(t) { return new (t || GridsterPreviewComponent)(i0.ɵɵdirectiveInject(ElementRef), i0.ɵɵdirectiveInject(i1.GridsterComponent), i0.ɵɵdirectiveInject(Renderer2)); };
    GridsterPreviewComponent.ɵcmp = i0.ɵɵdefineComponent({ type: GridsterPreviewComponent, selectors: [["gridster-preview"]], decls: 0, vars: 0, template: function GridsterPreviewComponent_Template(rf, ctx) { }, styles: ["gridster-preview{position:absolute;display:none;background:rgba(0,0,0,.15)}"], encapsulation: 2 });
    return GridsterPreviewComponent;
}());
export { GridsterPreviewComponent };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(GridsterPreviewComponent, [{
        type: Component,
        args: [{
                selector: 'gridster-preview',
                template: '',
                styleUrls: ['./gridsterPreview.css'],
                encapsulation: ViewEncapsulation.None
            }]
    }], function () { return [{ type: i0.ElementRef, decorators: [{
                type: Inject,
                args: [ElementRef]
            }] }, { type: i1.GridsterComponent }, { type: i0.Renderer2, decorators: [{
                type: Inject,
                args: [Renderer2]
            }] }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXJQcmV2aWV3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZ3JpZHN0ZXIyLyIsInNvdXJjZXMiOlsibGliL2dyaWRzdGVyUHJldmlldy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQWEsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVyRyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQzs7O0FBRXZEO0lBVUUsa0NBQWlDLEVBQWMsRUFBRyxRQUEyQixFQUE0QixRQUFtQjtRQUFuQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQzFILElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsOENBQVcsR0FBWDtRQUNFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNmLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDbEMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCwrQ0FBWSxHQUFaLFVBQWEsSUFBYztRQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDaEQ7YUFBTTtZQUNMLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLElBQUksSUFBSSxFQUFFO2dCQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ2xFO1lBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3pGO0lBQ0gsQ0FBQztvR0ExQlUsd0JBQXdCLHVCQUlmLFVBQVUsb0VBQXlELFNBQVM7aUVBSnJGLHdCQUF3QjttQ0FWckM7Q0FxQ0MsQUFqQ0QsSUFpQ0M7U0EzQlksd0JBQXdCO2tEQUF4Qix3QkFBd0I7Y0FOcEMsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSxrQkFBa0I7Z0JBQzVCLFFBQVEsRUFBRSxFQUFFO2dCQUNaLFNBQVMsRUFBRSxDQUFDLHVCQUF1QixDQUFDO2dCQUNwQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTthQUN0Qzs7c0JBS2MsTUFBTTt1QkFBQyxVQUFVOztzQkFBa0QsTUFBTTt1QkFBQyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIE9uRGVzdHJveSwgUmVuZGVyZXIyLCBWaWV3RW5jYXBzdWxhdGlvbiwgSW5qZWN0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtHcmlkc3RlckNvbXBvbmVudH0gZnJvbSAnLi9ncmlkc3Rlci5jb21wb25lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdncmlkc3Rlci1wcmV2aWV3JyxcbiAgdGVtcGxhdGU6ICcnLFxuICBzdHlsZVVybHM6IFsnLi9ncmlkc3RlclByZXZpZXcuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgR3JpZHN0ZXJQcmV2aWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgZWw6IGFueTtcbiAgZ3JpZHN0ZXI6IEdyaWRzdGVyQ29tcG9uZW50O1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRWxlbWVudFJlZikgIGVsOiBFbGVtZW50UmVmLCAgZ3JpZHN0ZXI6IEdyaWRzdGVyQ29tcG9uZW50LCBASW5qZWN0KFJlbmRlcmVyMikgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgICB0aGlzLmVsID0gZWwubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLmdyaWRzdGVyID0gZ3JpZHN0ZXI7XG4gICAgdGhpcy5ncmlkc3Rlci5wcmV2aWV3U3R5bGUgPSB0aGlzLnByZXZpZXdTdHlsZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgZGVsZXRlIHRoaXMuZWw7XG4gICAgZGVsZXRlIHRoaXMuZ3JpZHN0ZXIucHJldmlld1N0eWxlO1xuICAgIGRlbGV0ZSB0aGlzLmdyaWRzdGVyO1xuICB9XG5cbiAgcHJldmlld1N0eWxlKGRyYWc/OiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmdyaWRzdGVyLm1vdmluZ0l0ZW0pIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbCwgJ2Rpc3BsYXknLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmdyaWRzdGVyLmNvbXBhY3QgJiYgZHJhZykge1xuICAgICAgICB0aGlzLmdyaWRzdGVyLmNvbXBhY3QuY2hlY2tDb21wYWN0SXRlbSh0aGlzLmdyaWRzdGVyLm1vdmluZ0l0ZW0pO1xuICAgICAgfVxuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgdGhpcy5ncmlkc3Rlci5ncmlkUmVuZGVyZXIudXBkYXRlSXRlbSh0aGlzLmVsLCB0aGlzLmdyaWRzdGVyLm1vdmluZ0l0ZW0sIHRoaXMucmVuZGVyZXIpO1xuICAgIH1cbiAgfVxufVxuIl19