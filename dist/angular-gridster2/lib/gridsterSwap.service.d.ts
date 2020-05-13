import { GridsterItemComponentInterface } from './gridsterItemComponent.interface';
import * as ɵngcc0 from '@angular/core';
export declare class GridsterSwap {
    private swapedItem;
    private gridsterItem;
    private gridster;
    constructor(gridsterItem: GridsterItemComponentInterface);
    destroy(): void;
    swapItems(): void;
    checkSwapBack(): void;
    restoreSwapItem(): void;
    setSwapItem(): void;
    checkSwap(pushedBy: GridsterItemComponentInterface): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<GridsterSwap, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<GridsterSwap>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXJTd2FwLnNlcnZpY2UuZC50cyIsInNvdXJjZXMiOlsiZ3JpZHN0ZXJTd2FwLnNlcnZpY2UuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZSB9IGZyb20gJy4vZ3JpZHN0ZXJJdGVtQ29tcG9uZW50LmludGVyZmFjZSc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBHcmlkc3RlclN3YXAge1xuICAgIHByaXZhdGUgc3dhcGVkSXRlbTtcbiAgICBwcml2YXRlIGdyaWRzdGVySXRlbTtcbiAgICBwcml2YXRlIGdyaWRzdGVyO1xuICAgIGNvbnN0cnVjdG9yKGdyaWRzdGVySXRlbTogR3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlKTtcbiAgICBkZXN0cm95KCk6IHZvaWQ7XG4gICAgc3dhcEl0ZW1zKCk6IHZvaWQ7XG4gICAgY2hlY2tTd2FwQmFjaygpOiB2b2lkO1xuICAgIHJlc3RvcmVTd2FwSXRlbSgpOiB2b2lkO1xuICAgIHNldFN3YXBJdGVtKCk6IHZvaWQ7XG4gICAgY2hlY2tTd2FwKHB1c2hlZEJ5OiBHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2UpOiB2b2lkO1xufVxuIl19