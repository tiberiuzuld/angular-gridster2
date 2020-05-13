import { GridsterItemComponentInterface } from './gridsterItemComponent.interface';
import * as ɵngcc0 from '@angular/core';
export declare class GridsterPushResize {
    fromSouth: string;
    fromNorth: string;
    fromEast: string;
    fromWest: string;
    private pushedItems;
    private pushedItemsPath;
    private gridsterItem;
    private gridster;
    private tryPattern;
    constructor(gridsterItem: GridsterItemComponentInterface);
    destroy(): void;
    pushItems(direction: string): boolean;
    restoreItems(): void;
    setPushedItems(): void;
    checkPushBack(): void;
    private push;
    private trySouth;
    private tryNorth;
    private tryEast;
    private tryWest;
    private addToPushed;
    private removeFromPushed;
    private checkPushedItem;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<GridsterPushResize, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<GridsterPushResize>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXJQdXNoUmVzaXplLnNlcnZpY2UuZC50cyIsInNvdXJjZXMiOlsiZ3JpZHN0ZXJQdXNoUmVzaXplLnNlcnZpY2UuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlIH0gZnJvbSAnLi9ncmlkc3Rlckl0ZW1Db21wb25lbnQuaW50ZXJmYWNlJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIEdyaWRzdGVyUHVzaFJlc2l6ZSB7XG4gICAgZnJvbVNvdXRoOiBzdHJpbmc7XG4gICAgZnJvbU5vcnRoOiBzdHJpbmc7XG4gICAgZnJvbUVhc3Q6IHN0cmluZztcbiAgICBmcm9tV2VzdDogc3RyaW5nO1xuICAgIHByaXZhdGUgcHVzaGVkSXRlbXM7XG4gICAgcHJpdmF0ZSBwdXNoZWRJdGVtc1BhdGg7XG4gICAgcHJpdmF0ZSBncmlkc3Rlckl0ZW07XG4gICAgcHJpdmF0ZSBncmlkc3RlcjtcbiAgICBwcml2YXRlIHRyeVBhdHRlcm47XG4gICAgY29uc3RydWN0b3IoZ3JpZHN0ZXJJdGVtOiBHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2UpO1xuICAgIGRlc3Ryb3koKTogdm9pZDtcbiAgICBwdXNoSXRlbXMoZGlyZWN0aW9uOiBzdHJpbmcpOiBib29sZWFuO1xuICAgIHJlc3RvcmVJdGVtcygpOiB2b2lkO1xuICAgIHNldFB1c2hlZEl0ZW1zKCk6IHZvaWQ7XG4gICAgY2hlY2tQdXNoQmFjaygpOiB2b2lkO1xuICAgIHByaXZhdGUgcHVzaDtcbiAgICBwcml2YXRlIHRyeVNvdXRoO1xuICAgIHByaXZhdGUgdHJ5Tm9ydGg7XG4gICAgcHJpdmF0ZSB0cnlFYXN0O1xuICAgIHByaXZhdGUgdHJ5V2VzdDtcbiAgICBwcml2YXRlIGFkZFRvUHVzaGVkO1xuICAgIHByaXZhdGUgcmVtb3ZlRnJvbVB1c2hlZDtcbiAgICBwcml2YXRlIGNoZWNrUHVzaGVkSXRlbTtcbn1cbiJdfQ==