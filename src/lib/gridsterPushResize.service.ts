import {Injectable} from '@angular/core';
import {GridsterItemComponent} from './gridsterItem.component';
import {GridsterComponent} from './gridster.component';
import {GridsterItem} from './gridsterItem.interface';

@Injectable()
export class GridsterPushResize {
  private pushedItems: Array<GridsterItemComponent>;
  private pushedItemsPath: Array<Array<GridsterItem>>;
  private gridsterItem: GridsterItemComponent;
  private gridster: GridsterComponent;
  private tryPattern: Object;
  public fromSouth: string;
  public fromNorth: string;
  public fromEast: string;
  public fromWest: string;

  constructor(gridsterItem: GridsterItemComponent, gridster: GridsterComponent) {
    this.pushedItems = [];
    this.pushedItemsPath = [];
    this.gridsterItem = gridsterItem;
    this.gridster = gridster;
    this.tryPattern = {
      fromEast: this.tryWest,
      fromWest: this.tryEast,
      fromNorth: this.trySouth,
      fromSouth: this.tryNorth
    };
    this.fromSouth = 'fromSouth';
    this.fromNorth = 'fromNorth';
    this.fromEast = 'fromEast';
    this.fromWest = 'fromWest';
  }

  pushItems(direction): void {
    if (this.gridster.$options.pushResizeItems) {
      this.push(this.gridsterItem, direction);
    }
  }

  restoreItems(): void {
    let i = 0;
    const l: number = this.pushedItems.length;
    let pushedItem: GridsterItemComponent;
    for (; i < l; i++) {
      pushedItem = this.pushedItems[i];
      pushedItem.$item.x = pushedItem.item.x;
      pushedItem.$item.y = pushedItem.item.y;
      pushedItem.$item.cols = pushedItem.item.cols;
      pushedItem.$item.row = pushedItem.item.row;
      pushedItem.setSize(true);
    }
    this.pushedItems = undefined;
    this.pushedItemsPath = undefined;
  }

  setPushedItems() {
    let i = 0;
    const l: number = this.pushedItems.length;
    let pushedItem: GridsterItemComponent;
    for (; i < l; i++) {
      pushedItem = this.pushedItems[i];
      pushedItem.checkItemChanges(pushedItem.$item, pushedItem.item);
    }
    this.pushedItems = undefined;
    this.pushedItemsPath = undefined;
  }

  private push(gridsterItem: GridsterItemComponent, direction: string): boolean {
    const gridsterItemCollision: any = this.gridster.checkCollision(gridsterItem.$item);
    if (gridsterItemCollision && gridsterItemCollision !== true &&
      gridsterItemCollision !== this.gridsterItem && gridsterItemCollision.canBeResized()) {
      if (this.tryPattern[direction].call(this, gridsterItemCollision, gridsterItem, direction)) {
        return true;
      }
    } else if (gridsterItemCollision === undefined) {
      return true;
    }
  }

  private trySouth(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent, direction: string): boolean {
    const backUpY = gridsterItemCollide.$item.y;
    const backUpRows = gridsterItemCollide.$item.rows;
    gridsterItemCollide.$item.y = gridsterItem.$item.y + gridsterItem.$item.rows;
    gridsterItemCollide.$item.rows = backUpRows + backUpY - gridsterItemCollide.$item.y;
    if (!GridsterComponent.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
      && !this.gridster.checkGridCollision(gridsterItemCollide.$item)) {
      gridsterItemCollide.setSize(true);
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.$item.y = backUpY;
      gridsterItemCollide.$item.rows = backUpRows;
    }
  }

  private tryNorth(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent, direction: string): boolean {
    const backUpRows = gridsterItemCollide.$item.rows;
    gridsterItemCollide.$item.rows = gridsterItem.$item.y - gridsterItemCollide.$item.y;
    if (!GridsterComponent.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
      && !this.gridster.checkGridCollision(gridsterItemCollide.$item)) {
      gridsterItemCollide.setSize(true);
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.$item.rows = backUpRows;
    }
  }

  private tryEast(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent, direction: string): boolean {
    const backUpX = gridsterItemCollide.$item.x;
    const backUpCols = gridsterItemCollide.$item.cols;
    gridsterItemCollide.$item.x = gridsterItem.$item.x + gridsterItem.$item.cols;
    gridsterItemCollide.$item.cols = backUpCols + backUpX - gridsterItemCollide.$item.x;
    if (!GridsterComponent.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
      && !this.gridster.checkGridCollision(gridsterItemCollide.$item)) {
      gridsterItemCollide.setSize(true);
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.$item.x = backUpX;
      gridsterItemCollide.$item.cols = backUpCols;
    }
  }

  private tryWest(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent, direction: string): boolean {
    const backUpCols = gridsterItemCollide.$item.cols;
    gridsterItemCollide.$item.cols = gridsterItem.$item.x - gridsterItemCollide.$item.x;
    if (!GridsterComponent.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
      && !this.gridster.checkGridCollision(gridsterItemCollide.$item)) {
      gridsterItemCollide.setSize(true);
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.$item.cols = backUpCols;
    }
  }

  private addToPushed(gridsterItem: GridsterItemComponent): void {
    if (this.pushedItems.indexOf(gridsterItem) < 0) {
      this.pushedItems.push(gridsterItem);
      this.pushedItemsPath.push([
        {
          x: gridsterItem.item.x,
          y: gridsterItem.item.y,
          cols: gridsterItem.item.cols,
          rows: gridsterItem.item.rows
        },
        {
          x: gridsterItem.$item.x,
          y: gridsterItem.$item.y,
          cols: gridsterItem.$item.cols,
          rows: gridsterItem.$item.rows
        }]);
    } else {
      const i = this.pushedItems.indexOf(gridsterItem);
      this.pushedItemsPath[i].push(
        {
          x: gridsterItem.$item.x,
          y: gridsterItem.$item.y,
          cols: gridsterItem.$item.cols,
          rows: gridsterItem.$item.rows
        });
    }
  }

  private removeFromPushed(i: number): void {
    if (i > -1) {
      this.pushedItems.splice(i, 1);
      this.pushedItemsPath.splice(i, 1);
    }
  }

  public checkPushBack(): void {
    let i: number = this.pushedItems.length - 1;
    let change = false;
    for (; i > -1; i--) {
      if (this.checkPushedItem(this.pushedItems[i], i)) {
        change = true;
      }
    }
    if (change) {
      this.checkPushBack();
    }
  }

  private checkPushedItem(pushedItem: GridsterItemComponent, i: number): boolean {
    const path = this.pushedItemsPath[i];
    let j = path.length - 2;
    let lastPosition, x, y, cols, rows;
    for (; j > -1; j--) {
      lastPosition = path[j];
      x = pushedItem.$item.x;
      y = pushedItem.$item.y;
      cols = pushedItem.$item.cols;
      rows = pushedItem.$item.rows;
      pushedItem.$item.x = lastPosition.x;
      pushedItem.$item.y = lastPosition.y;
      pushedItem.$item.cols = lastPosition.cols;
      pushedItem.$item.rows = lastPosition.rows;
      if (!this.gridster.findItemWithItem(pushedItem.$item)) {
        pushedItem.setSize(true);
        path.splice(j + 1, path.length - 1 - j);
      } else {
        pushedItem.$item.x = x;
        pushedItem.$item.y = y;
        pushedItem.$item.cols = cols;
        pushedItem.$item.rows = rows;
      }
    }
    if (path.length < 2) {
      this.removeFromPushed(i);
      return true;
    }
  }
}
