import { GridsterItemComponent } from './gridsterItem.component';
import { GridsterComponent } from './gridster.component';
export declare class GridsterPush {
    private pushedItems;
    private gridsterItem;
    private gridster;
    constructor(gridsterItem: GridsterItemComponent, gridster: GridsterComponent);
    pushItems(): void;
    restoreItems(): void;
    setPushedItems(): void;
    private push(gridsterItem, pushedBy);
    private trySouth(gridsterItemCollide, gridsterItem, pushedBy);
    private tryNorth(gridsterItemCollide, gridsterItem, pushedBy);
    private tryEast(gridsterItemCollide, gridsterItem, pushedBy);
    private tryWest(gridsterItemCollide, gridsterItem, pushedBy);
    private addToPushed(gridsterItem);
    private removeFromPushed(gridsterItem);
    private checkPushBack();
    private checkPushedItem(pushedItem);
}
