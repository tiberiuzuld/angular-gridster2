import { GridsterItemComponent } from './gridsterItem.component';
import { GridsterComponent } from './gridster.component';
export declare class GridsterPush {
    private pushedItems;
    private pushedItemsPath;
    private gridsterItem;
    private gridster;
    private tryPattern;
    fromSouth: string;
    fromNorth: string;
    fromEast: string;
    fromWest: string;
    constructor(gridsterItem: GridsterItemComponent, gridster: GridsterComponent);
    pushItems(direction: any): void;
    restoreItems(): void;
    setPushedItems(): void;
    private push(gridsterItem, direction, pushedBy);
    private trySouth(gridsterItemCollide, gridsterItem, direction, pushedBy);
    private tryNorth(gridsterItemCollide, gridsterItem, direction, pushedBy);
    private tryEast(gridsterItemCollide, gridsterItem, direction, pushedBy);
    private tryWest(gridsterItemCollide, gridsterItem, direction, pushedBy);
    private addToPushed(gridsterItem);
    private removeFromPushed(i);
    checkPushBack(): void;
    private checkPushedItem(pushedItem, i);
}
