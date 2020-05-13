import { __decorate, __metadata, __param } from "tslib";
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
GridsterPreviewComponent = __decorate([
    Component({
        selector: 'gridster-preview',
        template: '',
        encapsulation: ViewEncapsulation.None,
        styles: ["gridster-preview{position:absolute;display:none;background:rgba(0,0,0,.15)}"]
    }),
    __param(0, Inject(ElementRef)), __param(2, Inject(Renderer2)),
    __metadata("design:paramtypes", [ElementRef, GridsterComponent, Renderer2])
], GridsterPreviewComponent);
export { GridsterPreviewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXJQcmV2aWV3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZ3JpZHN0ZXIyLyIsInNvdXJjZXMiOlsibGliL2dyaWRzdGVyUHJldmlldy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXJHLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBUXZELElBQWEsd0JBQXdCLEdBQXJDLE1BQWEsd0JBQXdCO0lBSW5DLFlBQWlDLEVBQWMsRUFBRyxRQUEyQixFQUE0QixRQUFtQjtRQUFuQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQzFILElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsV0FBVztRQUNULE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNmLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDbEMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxZQUFZLENBQUMsSUFBYztRQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDaEQ7YUFBTTtZQUNMLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLElBQUksSUFBSSxFQUFFO2dCQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ2xFO1lBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3pGO0lBQ0gsQ0FBQztDQUNGLENBQUE7O1lBdkJzQyxVQUFVLHVCQUFsQyxNQUFNLFNBQUMsVUFBVTtZQUE4QixpQkFBaUI7WUFBc0MsU0FBUyx1QkFBNUMsTUFBTSxTQUFDLFNBQVM7O0FBSnJGLHdCQUF3QjtJQU5wQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsa0JBQWtCO1FBQzVCLFFBQVEsRUFBRSxFQUFFO1FBRVosYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O0tBQ3RDLENBQUM7SUFLYSxXQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQSxFQUFpRCxXQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQTtxQ0FBNUQsVUFBVSxFQUFhLGlCQUFpQixFQUFzQyxTQUFTO0dBSmpILHdCQUF3QixDQTJCcEM7U0EzQlksd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIE9uRGVzdHJveSwgUmVuZGVyZXIyLCBWaWV3RW5jYXBzdWxhdGlvbiwgSW5qZWN0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtHcmlkc3RlckNvbXBvbmVudH0gZnJvbSAnLi9ncmlkc3Rlci5jb21wb25lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdncmlkc3Rlci1wcmV2aWV3JyxcbiAgdGVtcGxhdGU6ICcnLFxuICBzdHlsZVVybHM6IFsnLi9ncmlkc3RlclByZXZpZXcuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgR3JpZHN0ZXJQcmV2aWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgZWw6IGFueTtcbiAgZ3JpZHN0ZXI6IEdyaWRzdGVyQ29tcG9uZW50O1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRWxlbWVudFJlZikgIGVsOiBFbGVtZW50UmVmLCAgZ3JpZHN0ZXI6IEdyaWRzdGVyQ29tcG9uZW50LCBASW5qZWN0KFJlbmRlcmVyMikgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgICB0aGlzLmVsID0gZWwubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLmdyaWRzdGVyID0gZ3JpZHN0ZXI7XG4gICAgdGhpcy5ncmlkc3Rlci5wcmV2aWV3U3R5bGUgPSB0aGlzLnByZXZpZXdTdHlsZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgZGVsZXRlIHRoaXMuZWw7XG4gICAgZGVsZXRlIHRoaXMuZ3JpZHN0ZXIucHJldmlld1N0eWxlO1xuICAgIGRlbGV0ZSB0aGlzLmdyaWRzdGVyO1xuICB9XG5cbiAgcHJldmlld1N0eWxlKGRyYWc/OiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmdyaWRzdGVyLm1vdmluZ0l0ZW0pIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbCwgJ2Rpc3BsYXknLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmdyaWRzdGVyLmNvbXBhY3QgJiYgZHJhZykge1xuICAgICAgICB0aGlzLmdyaWRzdGVyLmNvbXBhY3QuY2hlY2tDb21wYWN0SXRlbSh0aGlzLmdyaWRzdGVyLm1vdmluZ0l0ZW0pO1xuICAgICAgfVxuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgdGhpcy5ncmlkc3Rlci5ncmlkUmVuZGVyZXIudXBkYXRlSXRlbSh0aGlzLmVsLCB0aGlzLmdyaWRzdGVyLm1vdmluZ0l0ZW0sIHRoaXMucmVuZGVyZXIpO1xuICAgIH1cbiAgfVxufVxuIl19