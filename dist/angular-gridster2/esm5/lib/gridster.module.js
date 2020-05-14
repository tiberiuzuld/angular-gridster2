import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridsterComponent } from './gridster.component';
import { GridsterItemComponent } from './gridsterItem.component';
import { GridsterPreviewComponent } from './gridsterPreview.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
var GridsterModule = /** @class */ (function () {
    function GridsterModule() {
    }
    GridsterModule.ɵmod = i0.ɵɵdefineNgModule({ type: GridsterModule });
    GridsterModule.ɵinj = i0.ɵɵdefineInjector({ factory: function GridsterModule_Factory(t) { return new (t || GridsterModule)(); }, providers: [], imports: [[
                CommonModule
            ]] });
    return GridsterModule;
}());
export { GridsterModule };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1ncmlkc3RlcjIvIiwic291cmNlcyI6WyJsaWIvZ3JpZHN0ZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXZDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQy9ELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLDZCQUE2QixDQUFDOzs7QUFFckU7SUFBQTtLQWVDO3NEQURZLGNBQWM7K0dBQWQsY0FBYyxtQkFKZCxFQUFFLFlBSko7Z0JBQ1AsWUFBWTthQUNiO3lCQWZIO0NBc0JDLEFBZkQsSUFlQztTQURZLGNBQWM7d0ZBQWQsY0FBYyxtQkFadkIsaUJBQWlCO1FBQ2pCLHFCQUFxQjtRQUNyQix3QkFBd0IsYUFHeEIsWUFBWSxhQUVKLGlCQUFpQixFQUFFLHFCQUFxQjtrREFLdkMsY0FBYztjQWQxQixRQUFRO2VBQUM7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLGlCQUFpQjtvQkFDakIscUJBQXFCO29CQUNyQix3QkFBd0I7aUJBQ3pCO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxZQUFZO2lCQUNiO2dCQUNELE9BQU8sRUFBRSxDQUFDLGlCQUFpQixFQUFFLHFCQUFxQixDQUFDO2dCQUNuRCxTQUFTLEVBQUUsRUFBRTtnQkFDYixTQUFTLEVBQUUsRUFBRTtnQkFDYixlQUFlLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxxQkFBcUIsQ0FBQzthQUM1RDs7dUJBWEcsaUJBQWlCLDJLQUFqQixpQkFBaUI7SUFDakIscUJBQXFCO0lBQ3JCLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7R3JpZHN0ZXJDb21wb25lbnR9IGZyb20gJy4vZ3JpZHN0ZXIuY29tcG9uZW50JztcbmltcG9ydCB7R3JpZHN0ZXJJdGVtQ29tcG9uZW50fSBmcm9tICcuL2dyaWRzdGVySXRlbS5jb21wb25lbnQnO1xuaW1wb3J0IHtHcmlkc3RlclByZXZpZXdDb21wb25lbnR9IGZyb20gJy4vZ3JpZHN0ZXJQcmV2aWV3LmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEdyaWRzdGVyQ29tcG9uZW50LFxuICAgIEdyaWRzdGVySXRlbUNvbXBvbmVudCxcbiAgICBHcmlkc3RlclByZXZpZXdDb21wb25lbnRcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbR3JpZHN0ZXJDb21wb25lbnQsIEdyaWRzdGVySXRlbUNvbXBvbmVudF0sXG4gIHByb3ZpZGVyczogW10sXG4gIGJvb3RzdHJhcDogW10sXG4gIGVudHJ5Q29tcG9uZW50czogW0dyaWRzdGVyQ29tcG9uZW50LCBHcmlkc3Rlckl0ZW1Db21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIEdyaWRzdGVyTW9kdWxlIHtcbn1cbiJdfQ==