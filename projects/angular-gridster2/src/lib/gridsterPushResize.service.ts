import {
  GridsterItem,
  GridsterItemComponentInterface
} from './gridsterItem.interface';
import { GridsterComponentInterface } from './gridster.interface';

export class GridsterPushResize {
  public fromSouth: string;
  public fromNorth: string;
  public fromEast: string;
  public fromWest: string;
  private pushedItems: Array<GridsterItemComponentInterface>;
  private pushedItemsPath: Array<Array<GridsterItem>>;
  private gridsterItem: GridsterItemComponentInterface;
  private gridster: GridsterComponentInterface;
  private tryPattern: {
    fromEast: (
      gridsterItemCollide: GridsterItemComponentInterface,
      gridsterItem: GridsterItemComponentInterface,
      direction: string
    ) => boolean;
    fromWest: (
      gridsterItemCollide: GridsterItemComponentInterface,
      gridsterItem: GridsterItemComponentInterface,
      direction: string
    ) => boolean;
    fromNorth: (
      gridsterItemCollide: GridsterItemComponentInterface,
      gridsterItem: GridsterItemComponentInterface,
      direction: string
    ) => boolean;
    fromSouth: (
      gridsterItemCollide: GridsterItemComponentInterface,
      gridsterItem: GridsterItemComponentInterface,
      direction: string
    ) => boolean;
  };

  constructor(gridsterItem: GridsterItemComponentInterface) {
    this.pushedItems = [];
    this.pushedItemsPath = [];
    this.gridsterItem = gridsterItem;
    this.gridster = gridsterItem.gridster;
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

  destroy(): void {
    this.gridster = this.gridsterItem = null!;
  }

  pushItems(direction: string): boolean {
    if (this.gridster.$options.pushResizeItems) {
      return this.push(this.gridsterItem, direction);
    } else {
      return false;
    }
  }

  restoreItems(): void {
    let i = 0;
    const l: number = this.pushedItems.length;
    let pushedItem: GridsterItemComponentInterface;
    for (; i < l; i++) {
      pushedItem = this.pushedItems[i];
      pushedItem.$item.x = pushedItem.item.x || 0;
      pushedItem.$item.y = pushedItem.item.y || 0;
      pushedItem.$item.cols = pushedItem.item.cols || 1;
      pushedItem.$item.row = pushedItem.item.row || 1;
      pushedItem.setSize();
    }
    this.pushedItems = [];
    this.pushedItemsPath = [];
  }

  setPushedItems(): void {
    let i = 0;
    const l: number = this.pushedItems.length;
    let pushedItem: GridsterItemComponentInterface;
    for (; i < l; i++) {
      pushedItem = this.pushedItems[i];
      pushedItem.checkItemChanges(pushedItem.$item, pushedItem.item);
    }
    this.pushedItems = [];
    this.pushedItemsPath = [];
  }

  checkPushBack(): void {
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

  private push(
    gridsterItem: GridsterItemComponentInterface,
    direction: string
  ): boolean {
    const gridsterItemCollision: GridsterItemComponentInterface | boolean =
      this.gridster.checkCollision(gridsterItem.$item);
    if (
      gridsterItemCollision &&
      gridsterItemCollision !== true &&
      gridsterItemCollision !== this.gridsterItem &&
      gridsterItemCollision.canBeResized()
    ) {
      if (
        this.tryPattern[direction].call(
          this,
          gridsterItemCollision,
          gridsterItem,
          direction
        )
      ) {
        return true;
      }
    } else if (gridsterItemCollision === false) {
      return true;
    }
    return false;
  }

  private trySouth(
    gridsterItemCollide: GridsterItemComponentInterface,
    gridsterItem: GridsterItemComponentInterface,
    direction: string
  ): boolean {
    const backUpY = gridsterItemCollide.$item.y;
    const backUpRows = gridsterItemCollide.$item.rows;
    gridsterItemCollide.$item.y =
      gridsterItem.$item.y + gridsterItem.$item.rows;
    gridsterItemCollide.$item.rows =
      backUpRows + backUpY - gridsterItemCollide.$item.y;
    if (
      !this.gridster.checkCollisionTwoItems(
        gridsterItemCollide.$item,
        gridsterItem.$item
      ) &&
      !this.gridster.checkGridCollision(gridsterItemCollide.$item)
    ) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.$item.y = backUpY;
      gridsterItemCollide.$item.rows = backUpRows;
    }
    return false;
  }

  private tryNorth(
    gridsterItemCollide: GridsterItemComponentInterface,
    gridsterItem: GridsterItemComponentInterface,
    direction: string
  ): boolean {
    const backUpRows = gridsterItemCollide.$item.rows;
    gridsterItemCollide.$item.rows =
      gridsterItem.$item.y - gridsterItemCollide.$item.y;
    if (
      !this.gridster.checkCollisionTwoItems(
        gridsterItemCollide.$item,
        gridsterItem.$item
      ) &&
      !this.gridster.checkGridCollision(gridsterItemCollide.$item)
    ) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.$item.rows = backUpRows;
    }
    return false;
  }

  private tryEast(
    gridsterItemCollide: GridsterItemComponentInterface,
    gridsterItem: GridsterItemComponentInterface,
    direction: string
  ): boolean {
    const backUpX = gridsterItemCollide.$item.x;
    const backUpCols = gridsterItemCollide.$item.cols;
    gridsterItemCollide.$item.x =
      gridsterItem.$item.x + gridsterItem.$item.cols;
    gridsterItemCollide.$item.cols =
      backUpCols + backUpX - gridsterItemCollide.$item.x;
    if (
      !this.gridster.checkCollisionTwoItems(
        gridsterItemCollide.$item,
        gridsterItem.$item
      ) &&
      !this.gridster.checkGridCollision(gridsterItemCollide.$item)
    ) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.$item.x = backUpX;
      gridsterItemCollide.$item.cols = backUpCols;
    }
    return false;
  }

  private tryWest(
    gridsterItemCollide: GridsterItemComponentInterface,
    gridsterItem: GridsterItemComponentInterface,
    direction: string
  ): boolean {
    const backUpCols = gridsterItemCollide.$item.cols;
    gridsterItemCollide.$item.cols =
      gridsterItem.$item.x - gridsterItemCollide.$item.x;
    if (
      !this.gridster.checkCollisionTwoItems(
        gridsterItemCollide.$item,
        gridsterItem.$item
      ) &&
      !this.gridster.checkGridCollision(gridsterItemCollide.$item)
    ) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.$item.cols = backUpCols;
    }
    return false;
  }

  private addToPushed(gridsterItem: GridsterItemComponentInterface): void {
    if (this.pushedItems.indexOf(gridsterItem) < 0) {
      this.pushedItems.push(gridsterItem);
      this.pushedItemsPath.push([
        {
          x: gridsterItem.item.x || 0,
          y: gridsterItem.item.y || 0,
          cols: gridsterItem.item.cols || 0,
          rows: gridsterItem.item.rows || 0
        },
        {
          x: gridsterItem.$item.x,
          y: gridsterItem.$item.y,
          cols: gridsterItem.$item.cols,
          rows: gridsterItem.$item.rows
        }
      ]);
    } else {
      const i = this.pushedItems.indexOf(gridsterItem);
      this.pushedItemsPath[i].push({
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

  private checkPushedItem(
    pushedItem: GridsterItemComponentInterface,
    i: number
  ): boolean {
    const path = this.pushedItemsPath[i];
    let j = path.length - 2;
    let lastPosition: { x: number; y: number; cols: number; rows: number };
    let x;
    let y;
    let cols;
    let rows;
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
        pushedItem.setSize();
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
    return false;
  }
}
