import { Component, ElementRef, Renderer2, ViewEncapsulation, Inject } from '@angular/core';
import { GridsterComponent } from './gridster.component';
import * as i0 from "@angular/core";
import * as i1 from "./gridster.component";
export class GridsterPreviewComponent {
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
}
GridsterPreviewComponent.ɵfac = function GridsterPreviewComponent_Factory(t) { return new (t || GridsterPreviewComponent)(i0.ɵɵdirectiveInject(ElementRef), i0.ɵɵdirectiveInject(i1.GridsterComponent), i0.ɵɵdirectiveInject(Renderer2)); };
GridsterPreviewComponent.ɵcmp = i0.ɵɵdefineComponent({ type: GridsterPreviewComponent, selectors: [["gridster-preview"]], decls: 0, vars: 0, template: function GridsterPreviewComponent_Template(rf, ctx) { }, styles: ["gridster-preview{position:absolute;display:none;background:rgba(0,0,0,.15)}"], encapsulation: 2 });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXJQcmV2aWV3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZ3JpZHN0ZXIyLyIsInNvdXJjZXMiOlsibGliL2dyaWRzdGVyUHJldmlldy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQWEsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVyRyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQzs7O0FBUXZELE1BQU0sT0FBTyx3QkFBd0I7SUFJbkMsWUFBaUMsRUFBYyxFQUFHLFFBQTJCLEVBQTRCLFFBQW1CO1FBQW5CLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDMUgsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDO1FBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCxXQUFXO1FBQ1QsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQztRQUNsQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFjO1FBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRTtZQUM3QixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUNoRDthQUFNO1lBQ0wsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUU7Z0JBQ2pDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDbEU7WUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDekY7SUFDSCxDQUFDOztnR0ExQlUsd0JBQXdCLHVCQUlmLFVBQVUsb0VBQXlELFNBQVM7NkRBSnJGLHdCQUF3QjtrREFBeEIsd0JBQXdCO2NBTnBDLFNBQVM7ZUFBQztnQkFDVCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixRQUFRLEVBQUUsRUFBRTtnQkFDWixTQUFTLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztnQkFDcEMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7YUFDdEM7O3NCQUtjLE1BQU07dUJBQUMsVUFBVTs7c0JBQWtELE1BQU07dUJBQUMsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBPbkRlc3Ryb3ksIFJlbmRlcmVyMiwgVmlld0VuY2Fwc3VsYXRpb24sIEluamVjdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7R3JpZHN0ZXJDb21wb25lbnR9IGZyb20gJy4vZ3JpZHN0ZXIuY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZ3JpZHN0ZXItcHJldmlldycsXG4gIHRlbXBsYXRlOiAnJyxcbiAgc3R5bGVVcmxzOiBbJy4vZ3JpZHN0ZXJQcmV2aWV3LmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIEdyaWRzdGVyUHJldmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIGVsOiBhbnk7XG4gIGdyaWRzdGVyOiBHcmlkc3RlckNvbXBvbmVudDtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KEVsZW1lbnRSZWYpICBlbDogRWxlbWVudFJlZiwgIGdyaWRzdGVyOiBHcmlkc3RlckNvbXBvbmVudCwgQEluamVjdChSZW5kZXJlcjIpIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gICAgdGhpcy5lbCA9IGVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5ncmlkc3RlciA9IGdyaWRzdGVyO1xuICAgIHRoaXMuZ3JpZHN0ZXIucHJldmlld1N0eWxlID0gdGhpcy5wcmV2aWV3U3R5bGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGRlbGV0ZSB0aGlzLmVsO1xuICAgIGRlbGV0ZSB0aGlzLmdyaWRzdGVyLnByZXZpZXdTdHlsZTtcbiAgICBkZWxldGUgdGhpcy5ncmlkc3RlcjtcbiAgfVxuXG4gIHByZXZpZXdTdHlsZShkcmFnPzogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICghdGhpcy5ncmlkc3Rlci5tb3ZpbmdJdGVtKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwsICdkaXNwbGF5JywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5ncmlkc3Rlci5jb21wYWN0ICYmIGRyYWcpIHtcbiAgICAgICAgdGhpcy5ncmlkc3Rlci5jb21wYWN0LmNoZWNrQ29tcGFjdEl0ZW0odGhpcy5ncmlkc3Rlci5tb3ZpbmdJdGVtKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbCwgJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICAgIHRoaXMuZ3JpZHN0ZXIuZ3JpZFJlbmRlcmVyLnVwZGF0ZUl0ZW0odGhpcy5lbCwgdGhpcy5ncmlkc3Rlci5tb3ZpbmdJdGVtLCB0aGlzLnJlbmRlcmVyKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==