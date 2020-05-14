import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridsterComponent } from './gridster.component';
import { GridsterItemComponent } from './gridsterItem.component';
import { GridsterPreviewComponent } from './gridsterPreview.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class GridsterModule {
}
GridsterModule.ɵmod = i0.ɵɵdefineNgModule({ type: GridsterModule });
GridsterModule.ɵinj = i0.ɵɵdefineInjector({ factory: function GridsterModule_Factory(t) { return new (t || GridsterModule)(); }, providers: [], imports: [[
            CommonModule
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(GridsterModule, { declarations: [GridsterComponent,
        GridsterItemComponent,
        GridsterPreviewComponent], imports: [CommonModule], exports: [GridsterComponent, GridsterItemComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(GridsterModule, [{
        type: NgModule,
        args: [{
                declarations: [
                    GridsterComponent,
                    GridsterItemComponent,
                    GridsterPreviewComponent
                ],
                imports: [
                    CommonModule
                ],
                exports: [GridsterComponent, GridsterItemComponent],
                providers: [],
                bootstrap: [],
                entryComponents: [GridsterComponent, GridsterItemComponent]
            }]
    }], null, null); })();
i0.ɵɵsetComponentScope(GridsterComponent, [i1.NgClass, i1.NgComponentOutlet, i1.NgForOf, i1.NgIf, i1.NgTemplateOutlet, i1.NgStyle, i1.NgSwitch, i1.NgSwitchCase, i1.NgSwitchDefault, i1.NgPlural, i1.NgPluralCase, GridsterComponent,
    GridsterItemComponent,
    GridsterPreviewComponent], [i1.AsyncPipe, i1.UpperCasePipe, i1.LowerCasePipe, i1.JsonPipe, i1.SlicePipe, i1.DecimalPipe, i1.PercentPipe, i1.TitleCasePipe, i1.CurrencyPipe, i1.DatePipe, i1.I18nPluralPipe, i1.I18nSelectPipe, i1.KeyValuePipe]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1ncmlkc3RlcjIvIiwic291cmNlcyI6WyJsaWIvZ3JpZHN0ZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXZDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQy9ELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLDZCQUE2QixDQUFDOzs7QUFnQnJFLE1BQU0sT0FBTyxjQUFjOztrREFBZCxjQUFjOzJHQUFkLGNBQWMsbUJBSmQsRUFBRSxZQUpKO1lBQ1AsWUFBWTtTQUNiO3dGQU1VLGNBQWMsbUJBWnZCLGlCQUFpQjtRQUNqQixxQkFBcUI7UUFDckIsd0JBQXdCLGFBR3hCLFlBQVksYUFFSixpQkFBaUIsRUFBRSxxQkFBcUI7a0RBS3ZDLGNBQWM7Y0FkMUIsUUFBUTtlQUFDO2dCQUNSLFlBQVksRUFBRTtvQkFDWixpQkFBaUI7b0JBQ2pCLHFCQUFxQjtvQkFDckIsd0JBQXdCO2lCQUN6QjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsWUFBWTtpQkFDYjtnQkFDRCxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxxQkFBcUIsQ0FBQztnQkFDbkQsU0FBUyxFQUFFLEVBQUU7Z0JBQ2IsU0FBUyxFQUFFLEVBQUU7Z0JBQ2IsZUFBZSxFQUFFLENBQUMsaUJBQWlCLEVBQUUscUJBQXFCLENBQUM7YUFDNUQ7O3VCQVhHLGlCQUFpQiwyS0FBakIsaUJBQWlCO0lBQ2pCLHFCQUFxQjtJQUNyQix3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0dyaWRzdGVyQ29tcG9uZW50fSBmcm9tICcuL2dyaWRzdGVyLmNvbXBvbmVudCc7XG5pbXBvcnQge0dyaWRzdGVySXRlbUNvbXBvbmVudH0gZnJvbSAnLi9ncmlkc3Rlckl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7R3JpZHN0ZXJQcmV2aWV3Q29tcG9uZW50fSBmcm9tICcuL2dyaWRzdGVyUHJldmlldy5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBHcmlkc3RlckNvbXBvbmVudCxcbiAgICBHcmlkc3Rlckl0ZW1Db21wb25lbnQsXG4gICAgR3JpZHN0ZXJQcmV2aWV3Q29tcG9uZW50XG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGVcbiAgXSxcbiAgZXhwb3J0czogW0dyaWRzdGVyQ29tcG9uZW50LCBHcmlkc3Rlckl0ZW1Db21wb25lbnRdLFxuICBwcm92aWRlcnM6IFtdLFxuICBib290c3RyYXA6IFtdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtHcmlkc3RlckNvbXBvbmVudCwgR3JpZHN0ZXJJdGVtQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBHcmlkc3Rlck1vZHVsZSB7XG59XG4iXX0=