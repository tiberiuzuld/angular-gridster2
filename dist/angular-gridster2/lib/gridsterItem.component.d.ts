import { ElementRef, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { GridsterItem } from './gridsterItem.interface';
import { GridsterDraggable } from './gridsterDraggable.service';
import { GridsterResizable } from './gridsterResizable.service';
import { GridsterItemComponentInterface } from './gridsterItemComponent.interface';
import { GridsterComponent } from './gridster.component';
import * as ɵngcc0 from '@angular/core';
export declare class GridsterItemComponent implements OnInit, OnDestroy, GridsterItemComponentInterface {
    renderer: Renderer2;
    private zone;
    item: GridsterItem;
    $item: GridsterItem;
    el: any;
    gridster: GridsterComponent;
    top: number;
    left: number;
    width: number;
    height: number;
    drag: GridsterDraggable;
    resize: GridsterResizable;
    notPlaced: boolean;
    init: boolean;
    get zIndex(): number;
    constructor(el: ElementRef, gridster: GridsterComponent, renderer: Renderer2, zone: NgZone);
    ngOnInit(): void;
    updateOptions(): void;
    ngOnDestroy(): void;
    setSize(): void;
    updateItemSize(): void;
    itemChanged(): void;
    checkItemChanges(newValue: GridsterItem, oldValue: GridsterItem): void;
    canBeDragged(): boolean;
    canBeResized(): boolean;
    bringToFront(offset: number): void;
    sendToBack(offset: number): void;
    private getLayerIndex;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<GridsterItemComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<GridsterItemComponent, "gridster-item", never, { "item": "item"; }, {}, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXJJdGVtLmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJncmlkc3Rlckl0ZW0uY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWxlbWVudFJlZiwgTmdab25lLCBPbkRlc3Ryb3ksIE9uSW5pdCwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBHcmlkc3Rlckl0ZW0gfSBmcm9tICcuL2dyaWRzdGVySXRlbS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgR3JpZHN0ZXJEcmFnZ2FibGUgfSBmcm9tICcuL2dyaWRzdGVyRHJhZ2dhYmxlLnNlcnZpY2UnO1xuaW1wb3J0IHsgR3JpZHN0ZXJSZXNpemFibGUgfSBmcm9tICcuL2dyaWRzdGVyUmVzaXphYmxlLnNlcnZpY2UnO1xuaW1wb3J0IHsgR3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlIH0gZnJvbSAnLi9ncmlkc3Rlckl0ZW1Db21wb25lbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7IEdyaWRzdGVyQ29tcG9uZW50IH0gZnJvbSAnLi9ncmlkc3Rlci5jb21wb25lbnQnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgR3JpZHN0ZXJJdGVtQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZSB7XG4gICAgcmVuZGVyZXI6IFJlbmRlcmVyMjtcbiAgICBwcml2YXRlIHpvbmU7XG4gICAgaXRlbTogR3JpZHN0ZXJJdGVtO1xuICAgICRpdGVtOiBHcmlkc3Rlckl0ZW07XG4gICAgZWw6IGFueTtcbiAgICBncmlkc3RlcjogR3JpZHN0ZXJDb21wb25lbnQ7XG4gICAgdG9wOiBudW1iZXI7XG4gICAgbGVmdDogbnVtYmVyO1xuICAgIHdpZHRoOiBudW1iZXI7XG4gICAgaGVpZ2h0OiBudW1iZXI7XG4gICAgZHJhZzogR3JpZHN0ZXJEcmFnZ2FibGU7XG4gICAgcmVzaXplOiBHcmlkc3RlclJlc2l6YWJsZTtcbiAgICBub3RQbGFjZWQ6IGJvb2xlYW47XG4gICAgaW5pdDogYm9vbGVhbjtcbiAgICBnZXQgekluZGV4KCk6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3RvcihlbDogRWxlbWVudFJlZiwgZ3JpZHN0ZXI6IEdyaWRzdGVyQ29tcG9uZW50LCByZW5kZXJlcjogUmVuZGVyZXIyLCB6b25lOiBOZ1pvbmUpO1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgdXBkYXRlT3B0aW9ucygpOiB2b2lkO1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQ7XG4gICAgc2V0U2l6ZSgpOiB2b2lkO1xuICAgIHVwZGF0ZUl0ZW1TaXplKCk6IHZvaWQ7XG4gICAgaXRlbUNoYW5nZWQoKTogdm9pZDtcbiAgICBjaGVja0l0ZW1DaGFuZ2VzKG5ld1ZhbHVlOiBHcmlkc3Rlckl0ZW0sIG9sZFZhbHVlOiBHcmlkc3Rlckl0ZW0pOiB2b2lkO1xuICAgIGNhbkJlRHJhZ2dlZCgpOiBib29sZWFuO1xuICAgIGNhbkJlUmVzaXplZCgpOiBib29sZWFuO1xuICAgIGJyaW5nVG9Gcm9udChvZmZzZXQ6IG51bWJlcik6IHZvaWQ7XG4gICAgc2VuZFRvQmFjayhvZmZzZXQ6IG51bWJlcik6IHZvaWQ7XG4gICAgcHJpdmF0ZSBnZXRMYXllckluZGV4O1xufVxuIl19