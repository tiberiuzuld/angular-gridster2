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
    private push(gridsterItem);
    private trySouth(gridsterItemCollide, gridsterItem);
    private tryNorth(gridsterItemCollide, gridsterItem);
    private tryEast(gridsterItemCollide, gridsterItem);
    private tryWest(gridsterItemCollide, gridsterItem);
    private addToPushed(gridsterItem);
    private removeFromPushed(gridsterItem);
    private checkPushBack();
    private checkPushedItem(pushedItem);
}
