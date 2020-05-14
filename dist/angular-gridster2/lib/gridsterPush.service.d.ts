import { GridsterItemComponentInterface } from './gridsterItemComponent.interface';
import * as ɵngcc0 from '@angular/core';
export declare class GridsterPush {
    fromSouth: string;
    fromNorth: string;
    fromEast: string;
    fromWest: string;
    private pushedItems;
    private pushedItemsTemp;
    private pushedItemsTempPath;
    private pushedItemsPath;
    private gridsterItem;
    private gridster;
    private pushedItemsOrder;
    private tryPattern;
    constructor(gridsterItem: GridsterItemComponentInterface);
    destroy(): void;
    pushItems(direction: string, disable?: boolean): boolean;
    restoreTempItems(): void;
    restoreItems(): void;
    setPushedItems(): void;
    checkPushBack(): void;
    private generateTempRandomId;
    private cleanTempIds;
    private push;
    private trySouth;
    private tryNorth;
    private tryEast;
    private tryWest;
    private addToTempPushed;
    private removeFromTempPushed;
    private addToPushed;
    private removeFromPushed;
    private removeFromPushedItem;
    private checkPushedItem;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<GridsterPush, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<GridsterPush>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXJQdXNoLnNlcnZpY2UuZC50cyIsInNvdXJjZXMiOlsiZ3JpZHN0ZXJQdXNoLnNlcnZpY2UuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlIH0gZnJvbSAnLi9ncmlkc3Rlckl0ZW1Db21wb25lbnQuaW50ZXJmYWNlJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIEdyaWRzdGVyUHVzaCB7XG4gICAgZnJvbVNvdXRoOiBzdHJpbmc7XG4gICAgZnJvbU5vcnRoOiBzdHJpbmc7XG4gICAgZnJvbUVhc3Q6IHN0cmluZztcbiAgICBmcm9tV2VzdDogc3RyaW5nO1xuICAgIHByaXZhdGUgcHVzaGVkSXRlbXM7XG4gICAgcHJpdmF0ZSBwdXNoZWRJdGVtc1RlbXA7XG4gICAgcHJpdmF0ZSBwdXNoZWRJdGVtc1RlbXBQYXRoO1xuICAgIHByaXZhdGUgcHVzaGVkSXRlbXNQYXRoO1xuICAgIHByaXZhdGUgZ3JpZHN0ZXJJdGVtO1xuICAgIHByaXZhdGUgZ3JpZHN0ZXI7XG4gICAgcHJpdmF0ZSBwdXNoZWRJdGVtc09yZGVyO1xuICAgIHByaXZhdGUgdHJ5UGF0dGVybjtcbiAgICBjb25zdHJ1Y3Rvcihncmlkc3Rlckl0ZW06IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZSk7XG4gICAgZGVzdHJveSgpOiB2b2lkO1xuICAgIHB1c2hJdGVtcyhkaXJlY3Rpb246IHN0cmluZywgZGlzYWJsZT86IGJvb2xlYW4pOiBib29sZWFuO1xuICAgIHJlc3RvcmVUZW1wSXRlbXMoKTogdm9pZDtcbiAgICByZXN0b3JlSXRlbXMoKTogdm9pZDtcbiAgICBzZXRQdXNoZWRJdGVtcygpOiB2b2lkO1xuICAgIGNoZWNrUHVzaEJhY2soKTogdm9pZDtcbiAgICBwcml2YXRlIGdlbmVyYXRlVGVtcFJhbmRvbUlkO1xuICAgIHByaXZhdGUgY2xlYW5UZW1wSWRzO1xuICAgIHByaXZhdGUgcHVzaDtcbiAgICBwcml2YXRlIHRyeVNvdXRoO1xuICAgIHByaXZhdGUgdHJ5Tm9ydGg7XG4gICAgcHJpdmF0ZSB0cnlFYXN0O1xuICAgIHByaXZhdGUgdHJ5V2VzdDtcbiAgICBwcml2YXRlIGFkZFRvVGVtcFB1c2hlZDtcbiAgICBwcml2YXRlIHJlbW92ZUZyb21UZW1wUHVzaGVkO1xuICAgIHByaXZhdGUgYWRkVG9QdXNoZWQ7XG4gICAgcHJpdmF0ZSByZW1vdmVGcm9tUHVzaGVkO1xuICAgIHByaXZhdGUgcmVtb3ZlRnJvbVB1c2hlZEl0ZW07XG4gICAgcHJpdmF0ZSBjaGVja1B1c2hlZEl0ZW07XG59XG4iXX0=